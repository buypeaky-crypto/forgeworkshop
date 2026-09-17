//#region node_modules/.nitro/vite/services/ssr/assets/webseed-CX85z8gt.js
var WEIGHT_RE = /\.(safetensors|bin|gguf|ggml|onnx|pt|pth|ckpt|npz|h5|tflite|pb|ot|msgpack|pkl|pickle)$/i;
function isWeightPath(path) {
	return WEIGHT_RE.test(path);
}
function parseSha256(raw) {
	if (!raw) return null;
	const hex = raw.replace(/^sha256:/i, "").trim().toLowerCase();
	return /^[a-f0-9]{64}$/.test(hex) ? hex : null;
}
function fileSha256(entry) {
	return parseSha256(entry.lfs?.oid);
}
function hashedFilesFromTree(tree) {
	const files = [];
	for (const entry of tree) {
		if (entry.type && entry.type !== "file") continue;
		const path = entry.path?.trim();
		if (!path) continue;
		const sha256 = fileSha256(entry);
		if (!sha256) continue;
		files.push({
			path,
			size: entry.lfs?.size ?? entry.size ?? 0,
			sha256
		});
	}
	return files.slice(0, 48);
}
function webseedUrl(id, revision, path) {
	const encoded = path.split("/").filter(Boolean).map((part) => encodeURIComponent(part)).join("/");
	return `https://huggingface.co/${id}/resolve/${encodeURIComponent(revision)}/${encoded}`;
}
function hubTreeUrl(id, revision) {
	return `https://huggingface.co/${id}/tree/${encodeURIComponent(revision)}`;
}
function hubCardUrl(id) {
	return `https://huggingface.co/${id}`;
}
//#endregion
export { isWeightPath as a, hubTreeUrl as i, hashedFilesFromTree as n, webseedUrl as o, hubCardUrl as r, fileSha256 as t };
