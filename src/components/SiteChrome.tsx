import CustomCursor from "@/components/CustomCursor";
import { withBasePath } from "@/lib/base-path";

export default function SiteChrome() {
  const blackCanvas = withBasePath("/textures/black-canvas.png");
  const whiteCanvas = withBasePath("/textures/white-canvas.png");

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
:root {
  --texture-black-canvas: url("${blackCanvas}");
  --texture-white-canvas: url("${whiteCanvas}");
}
`,
        }}
      />
      {/* Black canvas — native size, tiled (no stretch) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-black"
        style={{
          backgroundImage: `var(--texture-black-canvas)`,
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
          backgroundPosition: "top left",
        }}
      />
      <div
        aria-hidden
        className="grain-overlay pointer-events-none fixed inset-0 z-[9998]"
      />
      <CustomCursor />
    </>
  );
}
