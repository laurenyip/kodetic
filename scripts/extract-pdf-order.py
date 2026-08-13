import fitz
import json
import os

pdf = r"c:\Users\Lauren Yip\Downloads\Website Changes, Revisions, & Organization.pdf"
out = r"c:\Users\Lauren Yip\Downloads\kodetic\.tmp-pdf-extract"
os.makedirs(out, exist_ok=True)
doc = fitz.open(pdf)
manifest = []


def reading_order(blocks, row_tol=28):
    """Group into rows by top edge, then left-to-right within each row."""
    items = sorted(blocks, key=lambda b: (b["bbox"][1], b["bbox"][0]))
    rows = []
    for b in items:
        if not rows or b["bbox"][1] - rows[-1][0]["bbox"][1] > row_tol:
            rows.append([b])
        else:
            rows[-1].append(b)
    ordered = []
    for row in rows:
        row.sort(key=lambda b: b["bbox"][0])
        ordered.extend(row)
    return ordered


for pi, page in enumerate(doc):
    page_dir = os.path.join(out, f"page-{pi + 1:02d}")
    os.makedirs(page_dir, exist_ok=True)
    for old in os.listdir(page_dir):
        os.remove(os.path.join(page_dir, old))

    blocks = [b for b in page.get_text("dict")["blocks"] if b.get("type") == 1]
    blocks = reading_order(blocks)
    print(f"page {pi + 1}: {len(blocks)} image blocks")
    for ii, b in enumerate(blocks):
        clip = fitz.Rect(b["bbox"])
        pix = page.get_pixmap(matrix=fitz.Matrix(2.5, 2.5), clip=clip)
        fname = f"{ii + 1:02d}.png"
        path = os.path.join(page_dir, fname)
        pix.save(path)
        entry = {
            "page": pi + 1,
            "index": ii + 1,
            "bbox": [round(x, 1) for x in b["bbox"]],
            "w": pix.width,
            "h": pix.height,
            "path": path,
        }
        manifest.append(entry)
        print(f"  {fname} x={entry['bbox'][0]:6.1f} y={entry['bbox'][1]:6.1f}")

with open(os.path.join(out, "manifest.json"), "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2)
print("done", len(manifest))
