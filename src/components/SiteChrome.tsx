import CustomCursor from "@/components/CustomCursor";

export default function SiteChrome() {
  return (
    <>
      <div
        aria-hidden
        className="grain-overlay pointer-events-none fixed inset-0 z-[9998]"
      />
      <CustomCursor />
    </>
  );
}
