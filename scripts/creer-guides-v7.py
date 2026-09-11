"""Guides A4 lisibles et imprimables, depuis le même contenu que l'espace membre."""
import json,re,html,sys
from pathlib import Path
sys.path.insert(0,str(Path("tmp/pdfs/deps").resolve()))
from bs4 import BeautifulSoup, NavigableString
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, KeepTogether, HRFlowable
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader
DATA=json.loads(Path("tmp/pdfs/contenu-v7.json").read_text(encoding="utf8"))
OUT=Path("output/pdf"); OUT.mkdir(parents=True,exist_ok=True)
FONT=Path("C:/Windows/Fonts")
pdfmetrics.registerFont(TTFont("HI",str(FONT/"arial.ttf")))
pdfmetrics.registerFont(TTFont("HI-Bold",str(FONT/"arialbd.ttf")))
pdfmetrics.registerFontFamily("HI",normal="HI",bold="HI-Bold",italic="HI",boldItalic="HI-Bold")
BLUE=colors.HexColor("#12365E"); ORANGE=colors.HexColor("#B74716"); GREY=colors.HexColor("#F2F4F6"); LINE=colors.HexColor("#D4DCE4")
W,H=A4; M=44; CW=W-2*M
S={
 "body":ParagraphStyle("body",fontName="HI",fontSize=11.5,leading=16,spaceAfter=9,textColor=colors.HexColor("#222222")),
 "h1":ParagraphStyle("h1",fontName="HI-Bold",fontSize=24,leading=29,spaceAfter=16,textColor=BLUE,keepWithNext=True),
 "h2":ParagraphStyle("h2",fontName="HI-Bold",fontSize=15,leading=19,spaceBefore=12,spaceAfter=8,textColor=BLUE,keepWithNext=True),
 "h3":ParagraphStyle("h3",fontName="HI-Bold",fontSize=12.5,leading=17,spaceBefore=8,spaceAfter=6,textColor=BLUE,keepWithNext=True),
 "small":ParagraphStyle("small",fontName="HI",fontSize=9,leading=12,spaceAfter=7,textColor=colors.HexColor("#526171")),
 "check":ParagraphStyle("check",fontName="HI",fontSize=10.5,leading=14,spaceAfter=7,textColor=colors.HexColor("#222222")),
 "label":ParagraphStyle("label",fontName="HI-Bold",fontSize=10,leading=13,spaceAfter=8,textColor=ORANGE,keepWithNext=True),
 "cell":ParagraphStyle("cell",fontName="HI",fontSize=9,leading=12,spaceAfter=2),
 "field":ParagraphStyle("field",fontName="HI-Bold",fontSize=11,leading=14,spaceBefore=6,spaceAfter=3,textColor=BLUE,keepWithNext=True),
}
def clean(t):
 return re.sub(r"\s+"," ",str(t)).strip().replace("\u00a0"," ").replace("\u202f"," ").replace("—","-").replace("–","-").replace("\u2011","-").replace("\u2212","-")
def P(t,style="body"):
 return Paragraph(html.escape(clean(t)),S[style])
def rich(t,style="body"):
 return Paragraph(t,S[style])
def box(title,body):
 t=Table([[P(title,"h3")],[P(body)]],colWidths=[CW-22])
 t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),GREY),("BOX",(0,0),(-1,-1),.6,LINE),("LEFTPADDING",(0,0),(-1,-1),11),("RIGHTPADDING",(0,0),(-1,-1),11),("TOPPADDING",(0,0),(-1,0),4),("BOTTOMPADDING",(0,-1),(-1,-1),8)]))
 return [KeepTogether([t]),Spacer(1,10)]
def lexicon_box(entry):
 rows=[
  [rich("<b>"+html.escape(clean(entry["terme"]))+"</b>","h3")],
  [rich("<b>En clair :</b> "+html.escape(clean(entry["definition"])),"check")],
  [rich("<b>Ce que cela change :</b> "+html.escape(clean(entry["impact"])),"check")],
  [rich("<b>Premier réflexe :</b> "+html.escape(clean(entry["verifier"])),"small")],
 ]
 t=Table(rows,colWidths=[CW-22])
 t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),GREY),("BOX",(0,0),(-1,-1),.6,LINE),("LINEBEFORE",(0,0),(0,-1),3,ORANGE),("LEFTPADDING",(0,0),(-1,-1),11),("RIGHTPADDING",(0,0),(-1,-1),11),("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5)]))
 return [KeepTogether([t]),Spacer(1,10)]
def lines(label,n=2):
 return [KeepTogether([P(label,"field")]+sum(([Spacer(1,13),HRFlowable(width="100%",thickness=.45,color=LINE)] for _ in range(n)),[]))]
class Doc(SimpleDocTemplate):
 def afterFlowable(self,f):
  if isinstance(f,Paragraph) and f.style.name=="h1":
   key="s"+str(self.page)+"-"+str(getattr(self,"marks",0)); self.marks=getattr(self,"marks",0)+1
   self.canv.bookmarkPage(key);self.canv.addOutlineEntry(f.getPlainText(),key,0,False)
def furniture(c,d):
 c.saveState();c.setFillColor(BLUE);c.setFont("HI-Bold",9);c.drawString(M,H-26,"HÉRITAGE INTACT")
 c.setFont("HI",8);c.setFillColor(colors.HexColor("#526171"));c.drawRightString(W-M,H-26,"GUIDE PRATIQUE" if getattr(d,"sans_date",False) else "GUIDE PRATIQUE / SEPTEMBRE 2026")
 c.setStrokeColor(LINE);c.line(M,37,W-M,37)
 c.setFont("HI",7.4);c.drawString(M,25,"Information pédagogique générale - exemples fictifs - décisions à faire vérifier.")
 c.drawRightString(W-M,25,str(d.page));c.restoreState()
def head(label,title):
 return [P(label,"label"),P(title,"h1")]
def html_flows(node):
 if isinstance(node,NavigableString):
  return [P(str(node))] if clean(str(node)) else []
 if node.name in ("header","footer"):return []
 if node.name=="table":
  rows=[]
  for tr in node.find_all("tr"):
   cells=tr.find_all(["th","td"],recursive=False)
   if cells:rows.append([P(c.get_text(" ",strip=True) or " ","cell") for c in cells])
  if not rows:return []
  cols=max(map(len,rows));rows=[r+[P(" ","cell")]*(cols-len(r)) for r in rows]
  t=Table(rows,colWidths=[CW/cols]*cols,repeatRows=1,hAlign="LEFT",minRowHeights=[25]+[25]*(len(rows)-1))
  t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),GREY),("GRID",(0,0),(-1,-1),.45,LINE),("VALIGN",(0,0),(-1,-1),"TOP"),("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5),("LEFTPADDING",(0,0),(-1,-1),6),("RIGHTPADDING",(0,0),(-1,-1),6)]))
  return [t,Spacer(1,12)]
 if node.name in ("h2","h3","h4"):
  title=node.get_text(" ",strip=True)
  if title=="Trois questions à rendre plus précises":
   return [PageBreak()]+head("PRÉPARER LE RENDEZ-VOUS / SUITE",title)
  return [P(title,"h2" if node.name=="h2" else "h3")]
 if node.name in ("p","li","summary"):
  text=node.get_text(" ",strip=True)
  result=[P(("[ ] " if node.name=="li" else "")+text,"check" if node.name=="li" else "body")] if text else []
  if node.name=="li" and node.select("div.border-b"):result.extend([Spacer(1,13),HRFlowable(width="100%",thickness=.45,color=LINE)])
  return result
 classes=node.get("class",[])
 if node.name=="div" and "border-2" in classes and "border-black" in classes:
  flows=sum((html_flows(ch) for ch in node.children),[])
  # A nested KeepTogether reports an artificial height and needlessly moves a small box.
  flat=sum((list(f._content) if isinstance(f,KeepTogether) else [f] for f in flows),[])
  return [KeepTogether(flat)]
 if "min-h-[44px]" in classes and "border-b" in classes:return lines(node.get_text(" ",strip=True),1)
 return sum((html_flows(ch) for ch in node.children),[])
def sources():
 return [PageBreak()]+head("REPÈRES ET LIMITES","Pour vérifier une règle")+[
 P("Les exemples ne déterminent pas vos droits. Les dates, la propriété, les donations passées et les dispositions familiales doivent être examinées ensemble. Les repères ci-dessous ont été consultés le 10 septembre 2026."),
 rich('<b>Donations : abattements et calcul</b><br/><link href="https://www.impots.gouv.fr/particulier/calcul-et-paiement-des-droits" color="#12365E">impots.gouv.fr - Calcul et paiement des droits</link>'),
 rich('<b>Usufruit et nue-propriété</b><br/><link href="https://www.service-public.gouv.fr/particuliers/vosdroits/F934" color="#12365E">Service Public - En quoi consiste l’usufruit ?</link>'),
 rich('<b>Assurance-vie : fiscalité au décès</b><br/><link href="https://www.impots.gouv.fr/particulier/questions/je-suis-beneficiaire-dune-assurance-vie-comment-la-declarer" color="#12365E">impots.gouv.fr - Bénéficiaire d’une assurance-vie</link>'),
 rich('<b>Succession et famille</b><br/><link href="https://www.service-public.gouv.fr/particuliers/vosdroits/F2529" color="#12365E">Service Public - Règles de succession</link>'),
 rich('<b>Réserve héréditaire et quotité disponible</b><br/><link href="https://www.service-public.gouv.fr/particuliers/vosdroits/F36739/1_0?idFicheParent=F2529" color="#12365E">Service Public - Parts protégées et testament</link>'),
 rich('<b>Don d’argent et présent d’usage</b><br/><link href="https://www.service-public.fr/particuliers/vosdroits/F36656" color="#12365E">Service Public - Don d’une somme d’argent</link>'),
 rich('<b>Anticiper une éventuelle incapacité</b><br/><link href="https://www.service-public.fr/particuliers/vosdroits/F16670" color="#12365E">Service Public - Mandat de protection future</link>'),
 rich('<b>Maison transmise à plusieurs</b><br/><link href="https://www.service-public.fr/particuliers/vosdroits/F1296" color="#12365E">Service Public - Indivision entre les héritiers</link>'),
 P("Gardez vos documents personnels chez vous et utilisez les canaux sécurisés de vos interlocuteurs. N’envoyez pas de relevés, données de santé ou pièces de vos proches à la formation."),
 P("Une succession déjà ouverte, un conflit, une entreprise, un élément international ou une échéance proche nécessitent un professionnel. Ne retardez pas sa consultation pour finir ce guide."),
 P("Dans votre espace : les fiches séparées peuvent être réimprimées à l’unité. En cas de nouvelle version, privilégiez l’édition la plus récente. Les PDF ne se mettent pas à jour une fois téléchargés.")]
CAT=[
 ("front","les-7-erreurs","Les 7 erreurs qui offrent votre héritage à l’État","Les 3 dates qui avancent. Les 4 pièges qui restent invisibles. Les actions à mener."),
 ("bump","dossier-notaire","Dossier Notaire","Partir de l’exemple. Rassembler les pièces utiles. Conserver les réponses."),
 ("upsell1","preparation-familiale","Mon simulateur + mon plan adapté","Choisir votre fiche. Relier les faits. Comparer les hypothèses. Suivre les démarches."),
 ("upsell2","assurance-vie","Mon guide assurance-vie","Retrouver la clause. Demander les informations. Suivre les vérifications."),
]
ONLY=set(sys.argv[1:])
manifest=[]
for sku,slug,title,subtitle in CAT:
 if ONLY and slug not in ONLY:continue
 guide=next(g for g in DATA["guides"] if g["sku"]==sku)
 docs=[d for d in DATA["documents"] if d["sku"]==sku]
 if sku=="front":docs=[]
 ed=DATA["editorial"][sku]
 cover_label={"front":"VOTRE GUIDE / PRODUIT DE BASE","bump":"VOTRE DOSSIER PRATIQUE","upsell1":"VOTRE SIMULATEUR + VOTRE PLAN","upsell2":"VOTRE GUIDE ASSURANCE-VIE"}[sku]
 story=head(cover_label,title)
 story+=[P(ed["ouverture"],"h2")]+[P(p) for p in ed["histoire"]]
 story+=[P(ed.get("apprendreTitre","Ce que vous allez apprendre"),"h2")]
 for appris in ed["apprendre"]:story+=[P("- "+appris)]
 story+=[P(ed.get("adresseTitre","À qui ce guide s’adresse"),"h2")]
 for personne in ed.get("adresse",[]):story+=[P("- "+personne)]
 story+=[P(ed.get("essentielTitre","Pour aller à l’essentiel"),"h3"),P(ed["essentiel"])]
 if sku!="front":story+=[P("Édition du 10 septembre 2026. Les scènes imaginées et exemples fictifs ne sont pas des témoignages. Supports à conserver chez vous.","small")]
 if sku=="front":
  story+=[PageBreak()]+head("AVANT LES 7 ERREURS","Les mots qui changent le sens d’une décision")
  story+=[
   P("Vous êtes assis face au notaire. En quelques minutes, vous entendez « réserve », « abattement », « usufruit », « bénéficiaire ». Tous ces mots paraissent familiers. Pourtant, chacun répond à une question différente : qui possède, qui reçoit, quelle valeur est transmise et quel calcul s’applique."),
   P("Vous n’avez pas à mémoriser le Code civil. Votre objectif est plus simple : reconnaître le mot, comprendre ce qu’il ne prouve pas et savoir quelle pièce ou quelle question permettra de vérifier votre situation."),
  ]
  story+=box("Votre boussole en quatre questions","1. Qui possède le bien aujourd’hui ? 2. Qui peut le recevoir et par quel dispositif ? 3. Quelle valeur sera réellement transmise ? 4. Quel abattement et quel barème s’appliqueront à cette personne ?")
  story+=[P("Lisez ce lexique une première fois, puis revenez-y au fil des erreurs. Chaque définition se termine par un premier réflexe concret : retrouver une preuve vaut mieux que compléter un souvenir.","small")]
  for theme in DATA["lexique"]:
   story+=[PageBreak()]+head("LEXIQUE PRATIQUE",theme["titre"])+[P(theme["question"])]
   for entry in theme["entrees"]:story+=lexicon_box(entry)
 story+=[PageBreak()]+head("VOTRE PARCOURS",ed.get("parcoursTitre","Ce que les sept erreurs vont vous révéler" if sku=="front" else "Le fil de votre préparation"))
 if sku=="front":
  for l in DATA["lecons"]:
   if l["numero"]:story+=[P(l["titre"],"h3"),P(l["resume"],"small")]
 else:
  for d in docs:story+=[P(d["titre"],"h3")]
 story+=[P("Utilisez les signets du PDF pour rejoindre directement la question qui vous concerne. Ce n’est pas un cours à mémoriser : une information manquante devient une demande précise à faire.")]
 if sku=="front":
  for l in DATA["lecons"]:
   if not l["numero"]:continue
   story+=[PageBreak()]+head("DÉPART" if not l["numero"] else "LES 7 ERREURS / "+str(l["numero"]),l["titre"])+[P(DATA["ouvertures"][l["cle"]]),P("Ce que vous allez comprendre","h3")]+[P("- "+a) for a in l["acquis"]]
   for t,b in l["blocs"]:story+=[P(t,"h2"),P(b)]
   if l.get("siNonConcerne"):story+=[P(l["siNonConcerne"],"small")]
 if sku=="front":
  ex=DATA["headline"]
  story+=[PageBreak()]+head("L’EXEMPLE DE LA PRÉSENTATION","68 206 € d’écart : les hypothèses")+[P(ex["hypotheses"]),P(ex["scenarioA"]),P(ex["scenarioB"]),P("Droits calculés avant frais et arrondis fiscaux : 82 194,70 € contre 13 988,70 €, soit 68 206 € pour les deux enfants réunis."),P(ex["limites"]),P("Ce scénario fictif a été choisi pour illustrer l’accroche. Il ne représente pas une famille moyenne. Les sources du barème et de l’assurance-vie figurent en fin de guide.","small")]
 if sku=="upsell2":
  story+=[PageBreak()]+head("COMPRENDRE AVANT D’ÉCRIRE","Votre contrat : les six repères")
  for t,b in DATA["assurance"]:story+=[P(t,"h2"),P(b)]
  story+=[P("Exemple fictif : Marc dispose d’un relevé annuel mais seulement d’une ancienne photocopie de clause. Il note « clause en vigueur à demander », pas « clause incorrecte ». Contrat ouvert à 45 ans et versement effectué à 73 ans : l’âge à l’ouverture ne suffit pas à déterminer le régime du versement.")]
 if sku=="upsell1":
  story+=[PageBreak()]+head("L’ATELIER INCLUS","Comparer sans confondre résultat et décision")+[
   P("Retrouvez ce dossier dans Mon dossier. Lisez le périmètre de la simulation avant toute saisie. Une succession déjà ouverte, un conflit, une entreprise, un élément international ou des donations anciennes non vérifiées ne se résument pas à ce modèle."),
   P("Pour apprendre, commencez par un cas fictif : un parent seul, un enfant, 480 000 € de bien, donation de nue-propriété, puis comparez 70 et 71 ans. Gardez toutes les autres hypothèses identiques. L’écart de droits du modèle est de 9 600 €, hors frais d’acte."),
   P("Notez ce que vous avez changé, ce qui reste constant et ce que le modèle ne prend pas en compte. Ne mélangez pas deux parents dans un scénario et un seul dans l’autre. Un écart entre scénarios n’est pas une économie déjà acquise.")]
  story+=lines("Hypothèse A / hypothèse B / limite du modèle",4)
 for d in docs:
  normalBody=S["body"]
  if d["cle"]=="trois-poches":S["body"]=ParagraphStyle("bodycompact",parent=normalBody,leading=15,spaceAfter=6)
  soup=BeautifulSoup(d["html"],"html.parser")
  for blank in soup.select("span.border-b"):
   if not clean(blank.get_text()):blank.string="____________"
  story+=[PageBreak()]+head("FICHE PRATIQUE",d["titre"])
  subtitle_node=soup.select_one("article > header > p:last-child")
  intro=DATA["fichesEditorial"].get(d["cle"])
  if intro:story+=[P(intro[0]),P("Ce que vous allez comprendre : "+intro[1],"small")]
  elif subtitle_node:story+=[P(subtitle_node.get_text(" ",strip=True),"small")]
  story+=html_flows(soup)
  S["body"]=normalBody
 story+=[PageBreak()]+head(ed.get("sortieLabel","VOTRE PROCHAINE ÉTAPE"),ed.get("sortieTitre","Ne laissez pas vos réponses retourner dans le tiroir."))
 story+=[P(ed["acquis"]),P(ed["limite"])]
 story+=box(ed["suiteLabel"],ed["suite"])
 story+=[P(ed["suiteResultat"]),rich('<link href="https://www.heritageintact.fr/espace" color="#12365E"><b>'+html.escape(clean(ed["suiteCta"]))+'</b></link>')]
 story+=[P("Votre espace vérifie vos achats avant d’afficher une offre. Un produit déjà acquis n’est jamais proposé une seconde fois ; le lien ne déclenche aucun paiement.","small")]
 story+=sources()
 file=OUT/(slug+".pdf")
 doc=Doc(str(file),pagesize=A4,rightMargin=M,leftMargin=M,topMargin=53,bottomMargin=52,title=title,author="Héritage Intact")
 doc.sans_date=sku=="front"
 doc.build(story,onFirstPage=furniture,onLaterPages=furniture)
 reader=PdfReader(str(file))
 for i,page in enumerate(reader.pages,1):
  text=page.extract_text()
  if not text or "\ufffd" in text:raise ValueError(f"Page invalide {slug} {i}")
 manifest.append({"sku":sku,"slug":slug,"pages":len(reader.pages),"fiches":len(docs),"octets":file.stat().st_size})
 print(slug+": "+str(len(reader.pages))+" pages / "+str(len(docs))+" fiches")
Path("tmp/pdfs/manifest-v7.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding="utf8")
