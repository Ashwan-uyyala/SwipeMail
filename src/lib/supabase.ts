import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

const GOOGLE_PROVIDER_TOKEN_KEY = "swipemail-google-provider-token";
let googleProviderToken: string | null = null;

function readStoredGoogleToken() {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(GOOGLE_PROVIDER_TOKEN_KEY);
  } catch (error) {
    console.error("Could not read the Google access token from session storage.", error);
    return null;
  }
}

function clearStoredGoogleToken() {
  googleProviderToken = null;
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(GOOGLE_PROVIDER_TOKEN_KEY);
  } catch (error) {
    console.error("Could not clear the Google access token from session storage.", error);
  }
}

googleProviderToken = readStoredGoogleToken();

supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_OUT" || (event === "SIGNED_IN" && !session?.provider_token)) {
    clearStoredGoogleToken();
    return;
  }

  if (!session?.provider_token) return;
  googleProviderToken = session.provider_token;
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(GOOGLE_PROVIDER_TOKEN_KEY, googleProviderToken);
  } catch (error) {
    console.error("Could not save the Google access token to session storage.", error);
  }
});

export function getGoogleProviderToken() {
  return googleProviderToken ?? readStoredGoogleToken();
}
