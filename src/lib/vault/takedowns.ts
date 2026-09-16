/** Baked denylist. Ids here never enter the vault. */
export const TAKEDOWNS: { id: string; reason: string }[] = [];

export function isTakenDown(id: string): string | null {
  const hit = TAKEDOWNS.find((row) => row.id.toLowerCase() === id.toLowerCase());
  return hit ? hit.reason : null;
}
