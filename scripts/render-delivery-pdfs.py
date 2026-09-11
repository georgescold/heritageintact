"""Rendu de contrôle local des six produits, sans données clients."""
from pathlib import Path
import json
import pypdfium2 as pdfium

out = Path("tmp/pdfs/rendu-v9-final")
out.mkdir(parents=True, exist_ok=True)
manifest = json.loads(Path("tmp/pdfs/manifest-v7.json").read_text(encoding="utf8"))
for item in manifest:
    pdf = pdfium.PdfDocument(f'output/pdf/{item["slug"]}.pdf')
    for i in range(len(pdf)):
        page = pdf[i]
        bitmap = page.render(scale=1.3)
        bitmap.to_pil().save(out / f'{item["slug"]}-{i+1:02}.png')
        bitmap.close()
        page.close()
    pdf.close()
    print(item["slug"])
