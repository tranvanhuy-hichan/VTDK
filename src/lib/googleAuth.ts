export interface GoogleTokenPayload {
  email: string;
  name: string;
  picture?: string;
  sub: string; // Google User ID
}

export async function verifyGoogleToken(idToken: string): Promise<GoogleTokenPayload | null> {
  try {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    if (!data.email) return null;

    return {
      email: data.email,
      name: data.name || data.email.split("@")[0],
      picture: data.picture,
      sub: data.sub,
    };
  } catch (err) {
    console.error("Failed to verify google id token:", err);
    return null;
  }
}
