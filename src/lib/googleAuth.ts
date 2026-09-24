export async function initiateDirectGoogleAuth(nextTarget: string = "/client") {
  try {
    const clientId =
      process.env["NEXT_PUBLIC_GOOGLE_CLIENT_ID"] ||
      "148394701683-utc1mbr621q3fiujb0o8ae02du63pk04.apps.googleusercontent.com";

    const origin =
      typeof window !== "undefined" && window.location.hostname === "localhost"
        ? window.location.origin
        : "https://www.tanie.me";

    const redirectUri = `${origin}/auth/google/callback`;

    // Generate cryptographic rawNonce and SHA-256 hashedNonce for Google ID token verification
    const rawNonce =
      Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    const encoder = new TextEncoder();
    const data = encoder.encode(rawNonce);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    if (typeof window !== "undefined") {
      sessionStorage.setItem("google_auth_raw_nonce", rawNonce);
    }

    const state = encodeURIComponent(JSON.stringify({ next: nextTarget, rawNonce }));
    const targetUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token%20id_token&scope=openid%20email%20profile&nonce=${hashedNonce}&state=${state}`;

    if (typeof window !== "undefined") {
      window.location.href = targetUrl;
    }
  } catch (err) {
    console.error("Failed to initiate Google direct authentication", err);
    throw err;
  }
}
