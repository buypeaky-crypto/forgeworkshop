export function webseedUrl(id: string, revision: string, path: string): string {
  const encoded = path
    .split("/")
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `https://huggingface.co/${id}/resolve/${encodeURIComponent(revision)}/${encoded}`;
}

export function hubTreeUrl(id: string, revision: string): string {
  return `https://huggingface.co/${id}/tree/${encodeURIComponent(revision)}`;
}

export function hubCardUrl(id: string): string {
  return `https://huggingface.co/${id}`;
}
