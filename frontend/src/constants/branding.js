export const BRAND_NAME = "Tether Note";
export const BRAND_LOGO_PATH = "/assets/images/tether-note-logo.svg";

export function getFaviconTypeFromPath(path) {
  if (!path || typeof path !== "string") {
    return "image/x-icon";
  }

  const cleanPath = path.split("?")[0].split("#")[0].toLowerCase();

  if (cleanPath.endsWith(".png")) return "image/png";
  if (cleanPath.endsWith(".svg")) return "image/svg+xml";
  if (cleanPath.endsWith(".ico")) return "image/x-icon";

  return "image/x-icon";
}
