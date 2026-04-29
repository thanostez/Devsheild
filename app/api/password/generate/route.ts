import { NextResponse } from "next/server";
import { fetchWithTimeout, isAbortError } from "@/lib/apiHelpers";

interface PasswordinatorResponse {
  data?: string;
}

const profiles = [
  { len: 16, caps: true, sym: true },
  { len: 20, caps: true, sym: true },
  { len: 18, caps: true, sym: false },
  { len: 14, caps: true, sym: true },
  { len: 24, caps: true, sym: true },
];

async function generatePassword(profile: { len: number; caps: boolean; sym: boolean }) {
  const query = new URLSearchParams({
    num: "1",
    caps: String(profile.caps),
    sym: String(profile.sym),
    len: String(profile.len),
  });

  const response = await fetchWithTimeout(`https://passwordinator.onrender.com?${query.toString()}`);

  if (!response.ok) {
    throw new Error("Passwordinator request failed.");
  }

  const data = (await response.json()) as PasswordinatorResponse;
  return data.data || "";
}

function fallbackPassword(length: number, includeSymbols: boolean): string {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const symbols = "!@#$%^&*";
  const chars = includeSymbols ? letters + symbols : letters;
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  return Array.from(array)
    .map((value) => chars[value % chars.length])
    .join("");
}

function sanitizeLen(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  const len = Math.floor(parsed);
  if (len < 8 || len > 64) return null;
  return len;
}

function sanitizeNum(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  const num = Math.floor(parsed);
  if (num < 1 || num > 10) return null;
  return num;
}

async function handleGenerate(url: URL) {
  try {
    const len = sanitizeLen(url.searchParams.get("len"));
    const num = sanitizeNum(url.searchParams.get("num")) || 5;
    const symParam = url.searchParams.get("sym");
    const forceSymbols = symParam === null ? null : symParam === "true";

    const dynamicProfiles =
      len && forceSymbols !== null
        ? Array.from({ length: num }, () => ({ len, caps: true, sym: forceSymbols }))
        : profiles;

    const passwords: string[] = [];

    for (const profile of dynamicProfiles) {
      let created = "";
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          created = await generatePassword(profile);
          if (created) break;
        } catch {
          created = "";
        }
      }

      passwords.push(created || fallbackPassword(profile.len, profile.sym));
    }

    return NextResponse.json(passwords.slice(0, num));
  } catch (error) {
    if (isAbortError(error)) {
      return NextResponse.json({ error: "Upstream request timed out." }, { status: 504 });
    }

    return NextResponse.json({ error: "Failed to generate passwords." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return handleGenerate(new URL(request.url));
}
