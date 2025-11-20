export function convertToMb(bits: number): string {
    return (bits / (8 * 1024 * 1024)).toFixed(4);
}
