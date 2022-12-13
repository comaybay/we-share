export default function generateLoginPath(returnToPath: string) {
	return `/dang-nhap?returnto=${encodeURIComponent(returnToPath)}`;
}
