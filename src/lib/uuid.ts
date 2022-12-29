//copied from TinyMCE Editor internal uuid function
export function uuid(prefix: string): string {
	return prefix + '_' + Math.floor(Math.random() * 1000000000) + String(Date.now());
}
