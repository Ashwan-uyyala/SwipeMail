import type { Email } from "../types/email";

const GMAIL_API = "https://gmail.googleapis.com/gmail/v1/users/me";
const INITIAL_MESSAGE_LIMIT = 100;
const MESSAGE_FETCH_BATCH_SIZE = 10;

interface GmailMessageList {
  messages?: Array<{ id: string }>;
}

interface GmailLabel {
  id: string;
  name: string;
}

interface GmailLabelList {
  labels?: GmailLabel[];
}

interface GmailHeader {
  name: string;
  value: string;
}

interface GmailPart {
  mimeType?: string;
  body?: { data?: string };
  parts?: GmailPart[];
}

interface GmailMessage {
  id: string;
  snippet?: string;
  internalDate?: string;
  labelIds?: string[];
  payload?: {
    headers?: GmailHeader[];
    body?: { data?: string };
    mimeType?: string;
    parts?: GmailPart[];
  };
}

interface GmailApiError {
  error?: { message?: string };
}

async function gmailRequest<T>(path: string, accessToken: string): Promise<T> {
  const response = await fetch(`${GMAIL_API}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    let message = `Gmail request failed (${response.status})`;
    try {
      const payload = await response.json() as GmailApiError;
      if (payload.error?.message) message = payload.error.message;
    } catch {
      // Keep the HTTP status message when the API response is not JSON.
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = window.atob(base64);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function collectTextParts(part: GmailPart, mimeType: string): string[] {
  const ownBody = part.mimeType === mimeType ? part.body?.data : undefined;
  const ownText = ownBody ? decodeBase64Url(ownBody) : "";
  return [
    ...(ownText ? [ownText] : []),
    ...(part.parts ?? []).flatMap((child) => collectTextParts(child, mimeType)),
  ];
}

function textFromHtml(html: string) {
  const document = new DOMParser().parseFromString(html, "text/html");
  document.querySelectorAll("script, style, head").forEach((element) => element.remove());
  return (document.body.textContent ?? "").replace(/\s+/g, " ").trim();
}

function headerValue(headers: GmailHeader[] | undefined, name: string) {
  return headers?.find((header) => header.name.toLowerCase() === name.toLowerCase())?.value ?? "";
}

function decodeMimeHeader(value: string) {
  return value.replace(/=\?UTF-8\?([BQ])\?([^?]+)\?=/gi, (_match, encoding: string, data: string) => {
    if (encoding.toUpperCase() === "B") return decodeBase64Url(data);
    return decodeURIComponent(data.replace(/_/g, " ").replace(/=([A-F\d]{2})/gi, "%$1"));
  });
}

function parseSender(from: string) {
  const match = from.match(/^(.*?)\s*<([^<>]+)>$/);
  const email = (match?.[2] ?? from).trim();
  const displayName = (match?.[1] ?? "").replace(/^["']|["']$/g, "").trim();
  const localPart = email.split("@")[0] ?? email;
  const senderName = displayName || localPart || "Unknown sender";
  const companyInitial = senderName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return { senderName, senderEmail: email, companyName: senderName, companyInitial };
}

function mapMessage(message: GmailMessage, labelNames: Map<string, string>): Email {
  const payload = message.payload;
  const parts = payload?.parts ?? [];
  const plainText = parts.flatMap((part) => collectTextParts(part, "text/plain"));
  const htmlText = parts.flatMap((part) => collectTextParts(part, "text/html"));
  const rootBody = payload?.body?.data ? decodeBase64Url(payload.body.data) : "";
  const body = plainText[0]
    || (htmlText[0] ? textFromHtml(htmlText[0]) : "")
    || (payload?.mimeType === "text/plain" ? rootBody : "")
    || (payload?.mimeType === "text/html" ? textFromHtml(rootBody) : "")
    || message.snippet
    || "";
  const labelIds = message.labelIds ?? [];
  const categoryLabel = labelIds.find((label) => label.startsWith("CATEGORY_"));
  const labels = labelIds
    .filter((label) => !["INBOX", "UNREAD", "IMPORTANT", "STARRED", "SENT", "DRAFT"].includes(label) && !label.startsWith("CATEGORY_"))
    .map((label) => labelNames.get(label) ?? label.replace(/_/g, " ").toLowerCase());
  if (categoryLabel) labels.push(categoryLabel.replace("CATEGORY_", "").toLowerCase());
  const from = parseSender(decodeMimeHeader(headerValue(payload?.headers, "From")));
  const date = message.internalDate
    ? new Date(Number(message.internalDate)).toISOString()
    : headerValue(payload?.headers, "Date");

  return {
    id: message.id,
    ...from,
    subject: decodeMimeHeader(headerValue(payload?.headers, "Subject")) || "(no subject)",
    summary: message.snippet || body.slice(0, 180),
    body,
    receivedAt: date,
    isUnread: labelIds.includes("UNREAD"),
    isImportant: labelIds.includes("IMPORTANT"),
    category: categoryLabel?.replace("CATEGORY_", "").toLowerCase(),
    labels: labels.slice(0, 3),
  };
}

export const gmailService = {
  async fetchMessages(accessToken: string): Promise<Email[]> {
    const [list, labelList] = await Promise.all([
      gmailRequest<GmailMessageList>(`/messages?maxResults=${INITIAL_MESSAGE_LIMIT}`, accessToken),
      gmailRequest<GmailLabelList>("/labels", accessToken),
    ]);
    const labelNames = new Map<string, string>();
    for (const label of labelList.labels ?? []) labelNames.set(label.id, label.name);
    const messages = list.messages ?? [];
    const fullMessages: GmailMessage[] = [];
    for (let offset = 0; offset < messages.length; offset += MESSAGE_FETCH_BATCH_SIZE) {
      const batch = messages.slice(offset, offset + MESSAGE_FETCH_BATCH_SIZE);
      const loaded = await Promise.all(batch.map(({ id }) =>
        gmailRequest<GmailMessage>(`/messages/${encodeURIComponent(id)}?format=full`, accessToken),
      ));
      fullMessages.push(...loaded);
    }
    return fullMessages.map((message) => mapMessage(message, labelNames));
  },
};
