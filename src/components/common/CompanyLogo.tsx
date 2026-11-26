import { useEffect, useMemo, useState } from "react";

interface CompanyLogoProps {
  senderName?: string;
  senderEmail?: string;
  companyName?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const brandMap: Record<string, { slug: string; color: string }> = {
  "github.com": { slug:"github", color:"181717" },
  "google.com": { slug:"google", color:"4285F4" },
  "linkedin.com": { slug:"linkedin", color:"0A66C2" },
  "amazon.com": { slug:"amazon", color:"FF9900" },
  "microsoft.com": { slug:"microsoft", color:"5E5E5E" },
  "netflix.com": { slug:"netflix", color:"E50914" },
  "notion.so": { slug:"notion", color:"111111" },
  "figma.com": { slug:"figma", color:"F24E1E" },
  "adobe.com": { slug:"adobe", color:"FF0000" },
  "spotify.com": { slug:"spotify", color:"1DB954" },
  "slack.com": { slug:"slack", color:"4A154B" },
  "stripe.com": { slug:"stripe", color:"635BFF" },
  "instagram.com": { slug:"instagram", color:"E4405F" },
  "facebook.com": { slug:"facebook", color:"1877F2" },
  "youtube.com": { slug:"youtube", color:"FF0000" },
  "discord.com": { slug:"discord", color:"5865F2" },
  "openai.com": { slug:"openai", color:"412991" },
};

const nameMap: Record<string, { slug: string; color: string }> = {
  github:{ slug:"github", color:"181717" },
  google:{ slug:"google", color:"4285F4" },
  linkedin:{ slug:"linkedin", color:"0A66C2" },
  amazon:{ slug:"amazon", color:"FF9900" },
  microsoft:{ slug:"microsoft", color:"5E5E5E" },
  netflix:{ slug:"netflix", color:"E50914" },
  notion:{ slug:"notion", color:"111111" },
  figma:{ slug:"figma", color:"F24E1E" },
  adobe:{ slug:"adobe", color:"FF0000" },
  spotify:{ slug:"spotify", color:"1DB954" },
  slack:{ slug:"slack", color:"4A154B" },
  stripe:{ slug:"stripe", color:"635BFF" },
};

const fallbackColors = ["#2563EB", "#7C3AED", "#0891B2", "#059669", "#DB2777", "#EA580C"];

function getDomain(senderEmail?: string) {
  const domain = senderEmail?.trim().split("@")[1]?.toLowerCase();
  return domain ? domain.replace(/^www\./, "") : "";
}

function findBrand(senderEmail?: string, companyName?: string) {
  const domain = getDomain(senderEmail);
  if (domain) {
    const exact = brandMap[domain];
    if (exact) return exact;
    const registeredDomain = Object.keys(brandMap).find((key) => domain === key || domain.endsWith(`.${key}`));
    if (registeredDomain) return brandMap[registeredDomain];
  }
  const normalizedName = companyName?.trim().toLowerCase();
  if (normalizedName) return nameMap[normalizedName];
  return undefined;
}

export function CompanyLogo({
  senderName,
  senderEmail,
  companyName,
  size = "sm",
  className = "",
}: CompanyLogoProps) {
  const [failed, setFailed] = useState(false);
  const brand = useMemo(() => findBrand(senderEmail, companyName), [senderEmail, companyName]);

  useEffect(() => setFailed(false), [brand?.slug, senderEmail]);

  const sizeClass = {
    xs:"h-8 w-8",
    sm:"h-10 w-10",
    md:"h-11 w-11",
    lg:"h-12 w-12",
  }[size];

  const displayName = companyName?.trim() || senderName?.trim() || senderEmail?.split("@")[0] || "Unknown sender";
  const initial = displayName.charAt(0).toUpperCase() || "U";
  const hash = Array.from(displayName).reduce((total, character) => total + character.charCodeAt(0), 0);

  if (!brand || failed) {
    return (
      <div
        className={`${sizeClass} grid shrink-0 place-items-center rounded-full text-sm font-bold text-white ${className}`}
        style={{ backgroundColor:fallbackColors[hash % fallbackColors.length] }}
        aria-label={`${displayName} avatar`}
      >
        {initial}
      </div>
    );
  }

  return (
    <div className={`${sizeClass} grid shrink-0 place-items-center overflow-hidden rounded-[12px] bg-white p-1.5 shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700 ${className}`} aria-label={`${displayName} logo`}>
      <img
        src={`https://cdn.simpleicons.org/${brand.slug}/${brand.color}`}
        alt=""
        className="h-full w-full object-contain"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
