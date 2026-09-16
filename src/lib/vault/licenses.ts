/** Permissive OSI-style licenses only. Not Llama, Gemma, OpenRAIL, or NC. */
const CANON: Record<string, string> = {
  mit: "MIT",
  "mit-0": "MIT-0",
  "apache-2.0": "Apache-2.0",
  "apache 2.0": "Apache-2.0",
  apache2: "Apache-2.0",
  "apache-2": "Apache-2.0",
  "bsd-2-clause": "BSD-2-Clause",
  "bsd-3-clause": "BSD-3-Clause",
  "bsd-3-clause-clear": "BSD-3-Clause-Clear",
  bsd: "BSD-3-Clause",
  isc: "ISC",
  unlicense: "Unlicense",
  "cc0-1.0": "CC0-1.0",
  cc0: "CC0-1.0",
  "0bsd": "0BSD",
  zlib: "Zlib",
  "bsl-1.0": "BSL-1.0",
  "boost-1.0": "BSL-1.0",
  postgresql: "PostgreSQL",
  "python-2.0": "Python-2.0",
  ncsa: "NCSA",
  "osl-3.0": "OSL-3.0",
  "mpl-2.0": "MPL-2.0",
};

export const PERMISSIVE_LICENSES = [...new Set(Object.values(CANON))];

export function normalizeLicense(raw?: string | null): string | null {
  if (!raw) return null;
  const first = raw.split(/[,;/]/)[0]?.trim().toLowerCase() ?? "";
  if (!first) return null;
  return CANON[first] ?? null;
}

export function isPermissiveLicense(raw?: string | null): boolean {
  return normalizeLicense(raw) !== null;
}

export function licenseFromTags(tags?: string[]): string | null {
  for (const tag of tags ?? []) {
    const m = /^license:([^\s]+)/i.exec(tag);
    if (m?.[1]) {
      const hit = normalizeLicense(m[1]);
      if (hit) return hit;
    }
  }
  return null;
}
