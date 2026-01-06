export function formatFileSize(bytes: number): string {
    const KB = 1024;
    const MB = 1024 * 1024;

    if (bytes < MB) {
        return `${(bytes / KB).toFixed(2)} KB`;
    }

    return `${(bytes / MB).toFixed(4)} MB`;
}
