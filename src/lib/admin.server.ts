// Server-only. Never import this from client code.
// The repo is public, so only a SHA-256 hash of the /admin/leads1340 passcode is stored here.
// To change the passcode, replace the hash with: printf 'new-passcode' | sha256sum
const ADMIN_PASSCODE_SHA256 = "9f0bfc382c442ff6aa586e8fdcb20a269be129d7861ba629cbe3f83d2725dfde";

export async function assertAdmin(passcode: string) {
  const bytes = new TextEncoder().encode(String(passcode ?? ""));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const hash = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
  if (hash !== ADMIN_PASSCODE_SHA256) throw new Error("Wrong passcode");
}
