/**
 * Prefix public assets when the static site is served from a project path,
 * while keeping local development on the root path.
 */
export const assetPath = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath.replace(/\/$/, "")}${normalizedPath}`;
};
