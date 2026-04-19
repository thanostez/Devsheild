export async function sha1(text: string): Promise<string> {
  const encoded = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-1", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export function getKAnonPrefix(hash: string): string {
  return hash.slice(0, 5).toUpperCase();
}

export function checkHashInList(fullHash: string, responseText: string): number {
  const suffix = fullHash.slice(5).toUpperCase();
  const lines = responseText.split(/\r?\n/);

  for (const line of lines) {
    const [candidateSuffix, count] = line.split(":");
    if (!candidateSuffix || !count) continue;
    if (candidateSuffix.trim().toUpperCase() === suffix) {
      const parsed = Number(count.trim());
      return Number.isFinite(parsed) ? parsed : 0;
    }
  }

  return 0;
}

