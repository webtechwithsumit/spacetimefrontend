import { getMediaUrl } from "@/lib/media";

type BlogImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

/** Use native img for API-hosted uploads (avoids Next/Image remote loader issues). */
export function BlogImage({ src, alt, className = "", priority }: BlogImageProps) {
  const url = getMediaUrl(src);
  if (!url) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

export function processBlogHtml(html: string) {
  if (!html) return "";

  return html.replace(
    /src=(["'])(\/uploads\/[^"']+)\1/gi,
    (_match, quote, path) => `src=${quote}${getMediaUrl(path)}${quote}`,
  );
}
