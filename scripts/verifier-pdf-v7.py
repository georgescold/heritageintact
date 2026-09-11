from pathlib import Path
import math,json
import pdfplumber
from PIL import Image,ImageDraw
manifest=json.loads(Path("tmp/pdfs/manifest-v7.json").read_text(encoding="utf8"))
issues=[];sheets=[];pages=0
for item in manifest:
 slug=item["slug"]
 with pdfplumber.open("output/pdf/"+slug+".pdf") as pdf:
  for number,page in enumerate(pdf.pages,1):
   pages+=1
   words=page.extract_words()
   if not [w for w in words if 48 < w["top"] < page.height-48]:issues.append([slug,number,"page sans contenu"])
   for w in words:
    if w["x0"]<39 or w["x1"]>page.width-39:issues.append([slug,number,"hors marge",w["text"]])
    if w["top"]<14 or w["bottom"]>page.height-15:issues.append([slug,number,"hors page",w["text"]])
 imgs=[Path("tmp/pdfs/rendu-v9-final")/(slug+f"-{i:02}.png") for i in range(1,item["pages"]+1)]
 for k in range(0,len(imgs),6):
  sheet=Image.new("RGB",(1320,1260),"#dce2e8");draw=ImageDraw.Draw(sheet)
  for i,file in enumerate(imgs[k:k+6]):
   im=Image.open(file);im.thumbnail((414,590))
   x=13+(i%3)*440;y=32+(i//3)*630
   # Six pages, assez grandes pour examiner la hiérarchie et les tableaux.
   im=im.resize((414,586))
   sheet.paste(im,(x,y));draw.text((x,y-18),file.stem,fill="black")
  name=Path("tmp/pdfs")/(slug+"-contact-"+str(k//6+1)+".jpg");sheet.save(name,quality=90);sheets.append(str(name))
Path("tmp/pdfs/qa-v7.json").write_text(json.dumps({"pages":pages,"issues":issues,"sheets":sheets},ensure_ascii=False,indent=2),encoding="utf8")
print(str(pages)+" pages contrôlées. "+str(len(issues))+" défauts de marges / caractères. "+str(len(sheets))+" planches de contrôle.")
if issues:print(issues[:25]);raise SystemExit(1)
