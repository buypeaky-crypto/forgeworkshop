const WEIGHT_RE =
  /\.(safetensors|bin|gguf|ggml|onnx|pt|pth|ckpt|npz|h5|tflite|pb|ot|msgpack|pkl|pickle)$/i;

export function isWeightPath(path: string): boolean {
  return WEIGHT_RE.test(path);
}

export function parseSha256(raw?: string | null): string | null {
  if (!raw) return null;
  const hex = raw.replace(/^sha256:/i, "").trim().toLowerCase();
  return /^[a-f0-9]{64}$/.test(hex) ? hex : null;
}

export type HubTreeEntry = {
  type?: string;
  path?: string;
  size?: number;
  oid?: string;
  lfs?: { oid?: string; size?: number; pointerSize?: number };
};

export function fileSha256(entry: HubTreeEntry): string | null {
  return parseSha256(entry.lfs?.oid);
}
