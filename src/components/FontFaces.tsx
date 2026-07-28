import { withBasePath } from "@/lib/base-path";

/** Injects Ufficio trial @font-face with correct GitHub Pages basePath. */
export default function FontFaces() {
  const weights = [
    { file: "Ufficio-300.ttf", weight: 300 },
    { file: "Ufficio-400.ttf", weight: 400 },
    { file: "Ufficio-500.ttf", weight: 500 },
    { file: "Ufficio-600.ttf", weight: 600 },
    { file: "Ufficio-700.ttf", weight: 700 },
    { file: "Ufficio-800.ttf", weight: 800 },
    { file: "Ufficio-900.ttf", weight: 900 },
  ] as const;

  const css = weights
    .map(
      ({ file, weight }) => `
@font-face {
  font-family: "Ufficio Display";
  src: url("${withBasePath(`/fonts/${file}`)}") format("truetype");
  font-weight: ${weight};
  font-style: normal;
  font-display: swap;
}`,
    )
    .join("\n");

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
