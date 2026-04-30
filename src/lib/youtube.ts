/**
 * Extract YouTube video ID from various URL formats.
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/,
 * youtube.com/shorts/, and URLs with extra query params (e.g. ?si=...&v=...).
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, '');

    // youtube.com/watch?v=ID or youtube.com/watch?si=abc&v=ID
    if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      const v = parsed.searchParams.get('v');
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

      // youtube.com/embed/ID or youtube.com/shorts/ID
      const pathMatch = parsed.pathname.match(/^\/(?:embed|shorts)\/([a-zA-Z0-9_-]{11})/);
      if (pathMatch) return pathMatch[1];
    }

    // youtu.be/ID
    if (hostname === 'youtu.be') {
      const id = parsed.pathname.slice(1).split('/')[0];
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }
  } catch {
    // Not a valid URL -- try regex fallback for edge cases
    const fallback = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (fallback) return fallback[1];
  }

  return null;
}

/**
 * Validate that a string is a recognizable YouTube URL.
 * Returns true only if a valid video ID can be extracted.
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}
