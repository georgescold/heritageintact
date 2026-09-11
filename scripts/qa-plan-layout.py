from pathlib import Path
import pdfplumber
from PIL import Image, ImageOps, ImageDraw

root = Path('tmp/pdfs')
for file in [root/'exemple-plan-personnalise.pdf', *root.glob('qa-*.pdf')]:
    with pdfplumber.open(file) as pdf:
        for index, page in enumerate(pdf.pages):
            chars = [c for c in page.chars if c['text'].strip()]
            assert all(40 <= c['x0'] and c['x1'] <= page.width-35 for c in chars), (file, index, 'horizontal overflow')
            assert all(20 <= c['top'] and c['bottom'] <= page.height-18 for c in chars), (file, index, 'vertical overflow')
        assert 'conseil en investissement' in ' '.join(pdf.pages[-1].extract_text().split()), file
        print(file.name, len(pdf.pages), 'pages - margins and final disclaimer OK')

pages = sorted(root.glob('plan-revu-*.png'))
for start in range(0, len(pages), 4):
    sheet = Image.new('RGB', (1200, 1740), '#d5dbe1')
    for pos, file in enumerate(pages[start:start+4]):
        im = Image.open(file).convert('RGB')
        im.thumbnail((580, 820))
        x, y = (pos%2)*600+10, (pos//2)*870+25
        sheet.paste(im, (x,y))
        ImageDraw.Draw(sheet).text((x,y-18), file.stem, fill='black')
    sheet.save(root/f'contact-{start//4+1}.png')
