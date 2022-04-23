export function base64_encode(data: string): string {
  return btoa(unescape(encodeURIComponent(data)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}
