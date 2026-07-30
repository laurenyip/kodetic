import CustomCursor from "@/components/CustomCursor";
import YellowLightTrails from "@/components/YellowLightTrails";
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
      <div
        aria-hidden
        className="black-canvas-world pointer-events-none fixed inset-0 z-0"
      >
        <div className="canvas-weave" />
        <div className="canvas-flow" />
        <div className="canvas-sand" />
        <YellowLightTrails />
      </div>
      <div
        aria-hidden
        className="grain-overlay pointer-events-none fixed inset-0 z-[9998]"
      />
      <CustomCursor />
    </>
  );
}
