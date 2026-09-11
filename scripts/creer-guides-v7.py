"""Guides A4 lisibles et imprimables, depuis le même contenu que l'espace membre."""
import json,re,html,sys
from pathlib import Path
sys.path.insert(0,str(Path("tmp/pdfs/deps").resolve()))
from bs4 import BeautifulSoup, NavigableString
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, KeepTogether, HRFlowable
from reportlab.platypus.tableofcontents import TableOfContents
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
 return [KeepTogether([t])]
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
 def beforeDocument(self):self.marks=0
 def afterFlowable(self,f):
  if isinstance(f,Paragraph) and f.style.name=="h1":
   key="s"+str(self.page)+"-"+str(getattr(self,"marks",0)); self.marks=getattr(self,"marks",0)+1
   self.canv.bookmarkPage(key);self.canv.addOutlineEntry(f.getPlainText(),key,0,False)
   if getattr(self,"toc_titles",None) and f.getPlainText() in self.toc_titles:self.notify("TOCEntry",(0,f.getPlainText(),self.page,key))
def furniture(c,d):
 c.saveState();c.setFillColor(BLUE);c.setFont("HI-Bold",9);c.drawString(M,H-26,"HÉRITAGE INTACT")
 c.setFont("HI",8);c.setFillColor(colors.HexColor("#526171"));c.drawRightString(W-M,H-26,"GUIDE PRATIQUE")
 c.setStrokeColor(LINE);c.line(M,37,W-M,37)
 c.setFont("HI",7.4);c.drawString(M,25,"Repères pratiques pour organiser vos informations et préparer vos échanges professionnels.")
 c.drawRightString(W-M,25,str(d.page));c.restoreState()
def head(label,title):
 return [P(label,"label"),P(title,"h1")]
def html_flows(node):
 if isinstance(node,NavigableString):
  return [P(str(node))] if clean(str(node)) else []
 if node.name in ("header","footer"):return []
 if "no-print" in node.get("class",[]):return []
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
  result=[P(("- " if node.name=="li" else "")+text,"check" if node.name=="li" else "body")] if text else []
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
 P("Ces repères vous aident à préparer un échange précis. Les dates, la propriété, les donations passées et les dispositions familiales se lisent ensemble. Consultez toujours les sources officielles dans leur version en vigueur."),
 rich('<b>Donations : abattements et calcul</b><br/><link href="https://www.impots.gouv.fr/particulier/calcul-et-paiement-des-droits" color="#12365E">impots.gouv.fr - Calcul et paiement des droits</link>'),
 rich('<b>Usufruit et nue-propriété</b><br/><link href="https://www.service-public.gouv.fr/particuliers/vosdroits/F934" color="#12365E">Service Public - En quoi consiste l’usufruit ?</link>'),
 rich('<b>Assurance-vie : fiscalité au décès</b><br/><link href="https://www.impots.gouv.fr/particulier/questions/je-suis-beneficiaire-dune-assurance-vie-comment-la-declarer" color="#12365E">impots.gouv.fr - Bénéficiaire d’une assurance-vie</link>'),
 rich('<b>Succession et famille</b><br/><link href="https://www.service-public.gouv.fr/particuliers/vosdroits/F2529" color="#12365E">Service Public - Règles de succession</link>'),
 rich('<b>Réserve héréditaire et quotité disponible</b><br/><link href="https://www.service-public.gouv.fr/particuliers/vosdroits/F36739/1_0?idFicheParent=F2529" color="#12365E">Service Public - Parts protégées et testament</link>'),
 rich('<b>Forme du testament olographe</b><br/><link href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006434066/" color="#12365E">Légifrance - Code civil, article 970</link>'),
 rich('<b>Retrouver l’existence et le lieu de dépôt d’un testament</b><br/><link href="https://www.service-public.fr/particuliers/vosdroits/F15009" color="#12365E">Service Public - FCDDV</link>'),
 rich('<b>Don d’argent et présent d’usage</b><br/><link href="https://www.service-public.fr/particuliers/vosdroits/F36656" color="#12365E">Service Public - Don d’une somme d’argent</link>'),
 rich('<b>Anticiper une éventuelle incapacité</b><br/><link href="https://www.service-public.fr/particuliers/vosdroits/F16670" color="#12365E">Service Public - Mandat de protection future</link>'),
 rich('<b>Maison transmise à plusieurs</b><br/><link href="https://www.service-public.fr/particuliers/vosdroits/F1296" color="#12365E">Service Public - Indivision entre les héritiers</link>'),
 rich('<b>Tarification des notaires</b><br/><link href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000049060695" color="#12365E">Légifrance - Émoluments réglementés et honoraires des prestations non tarifées</link>'),
 P("Gardez vos documents personnels chez vous et utilisez les canaux sécurisés de vos interlocuteurs. N’envoyez pas de relevés, données de santé ou pièces de vos proches à la formation."),
 P("Une succession déjà ouverte, un conflit, une entreprise, un élément international ou une échéance proche nécessitent un professionnel. Ne retardez pas sa consultation pour finir ce guide."),
 P("Retrouvez vos fiches dans Mon dossier et réimprimez seulement celles dont vous avez besoin.")]
def article_box(reference,comprendre,attention,url):
 rows=[
  [rich("<b>"+html.escape(clean(reference))+"</b>","h3")],
  [rich("<b>Ce qu’il faut y chercher :</b> "+html.escape(clean(comprendre)),"check")],
  [rich("<b>Attention :</b> "+html.escape(clean(attention)),"small")],
  [rich('<link href="'+url+'" color="#12365E"><b>Consulter la source officielle à jour</b></link>',"small")],
 ]
 t=Table(rows,colWidths=[CW-22])
 t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),GREY),("BOX",(0,0),(-1,-1),.6,LINE),("LINEBEFORE",(0,0),(0,-1),3,BLUE),("LEFTPADDING",(0,0),(-1,-1),11),("RIGHTPADDING",(0,0),(-1,-1),11),("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5)]))
 return [KeepTogether([t]),Spacer(1,10)]
def product_bridge(title,body,cta):
 rows=[
  [P(title,"h3")],
  [P(body)],
  [rich('<link href="https://www.heritageintact.fr/espace" color="#B74716"><b>'+html.escape(clean(cta))+'</b></link>',"check")],
  [P("Le lien ouvre la page d’accès. Indiquez l’adresse email de votre commande pour recevoir votre lien personnel, puis ouvrez Mon parcours. Aucun paiement n’est déclenché par ce lien.","small")],
 ]
 t=Table(rows,colWidths=[CW-22])
 t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),GREY),("BOX",(0,0),(-1,-1),.8,ORANGE),("LINEBEFORE",(0,0),(0,-1),3,ORANGE),("LEFTPADDING",(0,0),(-1,-1),11),("RIGHTPADDING",(0,0),(-1,-1),11),("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5)]))
 return [KeepTogether([t]),Spacer(1,10)]
def creer_lexique_offert():
 slug="lexique-succession";title="Lexique détaillé de la succession"
 story=head("BONUS OFFERT AVEC VOTRE GUIDE",title)+[
  P("Comprendre les mots qui changent une transmission - et retrouver les textes officiels qui les encadrent.","h2"),
  P("Un mot juridique ne sert pas à impressionner. Il sert à distinguer deux situations qui peuvent produire des effets très différents. Ce document vous aide à suivre une conversation, relire un acte et transformer une expression inconnue en question précise."),
  P("Pour chaque notion, vous trouverez quatre niveaux : une définition en langage courant, ce que le mot change concrètement, le risque de confusion et le premier document à retrouver. La seconde partie vous oriente vers les articles de loi essentiels sans prétendre remplacer leur lecture ni l’analyse d’un professionnel."),
 ]
 story+=box("La règle d’utilisation","Ne choisissez jamais une solution à partir d’un seul mot ou d’un seul article. Reliez toujours la situation familiale, la propriété des biens, les donations passées, les contrats et les dates. Si une succession est ouverte, qu’un délai court ou qu’un conflit existe, contactez directement un notaire ou un avocat.")
 story+=box("Commencez par un seul mot", "Cherchez le mot qui vous bloque avec la fonction de recherche de votre lecteur PDF. Lisez sa définition, puis revenez au passage de votre guide ou de votre document. Vous n’avez pas à lire tout le lexique : ce bonus explique le vocabulaire, sans remplacer les fiches pratiques propres à chaque produit.")
 story+=[P("Votre boussole avant tout calcul","h2"),P("1. Qui possède quoi aujourd’hui ? 2. Qui recevrait selon la loi, un testament ou un contrat ? 3. Quelle valeur serait réellement transmise ? 4. Quels abattements, barèmes et donations antérieures doivent être pris en compte ?")]
 for theme in DATA["lexique"]:
  story+=[PageBreak()]+head("LEXIQUE DÉTAILLÉ",theme["titre"])+[P(theme["question"])]
  for entry in theme["entrees"]:story+=lexicon_box(entry)
 lois=[
  ("PROTÉGER LES PARTS ET COMPRENDRE LES DONATIONS",[
   ("Code civil, articles 912 et 913 - réserve héréditaire et quotité disponible","La définition des parts protégées et la fraction dont une personne peut disposer librement selon le nombre d’enfants.","Un testament ou une donation exprime une volonté, mais ne fait pas disparaître les droits réservataires.","https://www.legifrance.gouv.fr/codes/id/LEGISCTA000006150544"),
   ("Code civil, article 894 - donation entre vifs","Le caractère actuel et, en principe, irrévocable de la donation acceptée.","Une donation n’est pas une simple intention que l’on annule librement plus tard.","https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006433497"),
   ("Code civil, articles 1075 à 1080 - donation-partage","Le cadre permettant d’organiser de son vivant la distribution et le partage de biens entre héritiers présomptifs.","Les effets sur les valeurs et l’équilibre familial dépendent de la rédaction et des conditions de l’acte.","https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006070721/LEGISCTA000006136339/"),
   ("Code civil, articles 843 à 863 - rapport des libéralités","Quand une libéralité reçue par un héritier doit être prise en compte au partage et selon quelles règles de valeur.","Le rapport civil et le rappel fiscal de quinze ans sont deux mécanismes différents.","https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006070721/LEGISCTA000006150166/"),
  ]),
  ("TESTAMENT : FORME, LIMITES ET CONSERVATION",[
   ("Code civil, article 970 - testament olographe","Les conditions de forme : le testament olographe doit être écrit en entier, daté et signé de la main du testateur.","Apportez vos notes au notaire afin qu’il vous indique la forme et la rédaction adaptées à vos volontés.","https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006434066/"),
   ("Code civil, articles 971 à 975 - testament authentique","Les règles de réception et de formalisation du testament authentique par le notaire.","La forme adaptée dépend de la situation ; ce lexique ne permet pas de choisir ni rédiger l’acte à votre place.","https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006070721/LEGISCTA000006150244/"),
   ("Code civil, articles 912 et 913 - réserve et quotité disponible","Les limites que les parts protégées de certains héritiers peuvent imposer aux volontés testamentaires.","Nommer une personne ou un bien ne suffit pas à garantir que la disposition pourra être exécutée telle qu’imaginée.","https://www.legifrance.gouv.fr/codes/id/LEGISCTA000006150544"),
   ("Fichier central des dispositions de dernières volontés - FCDDV","Ce que permet la recherche : savoir qu’un testament existe et auprès de quel notaire il est déposé, sans accéder à son contenu.","Un testament introuvable ou une version mal identifiée peut créer une fausse sécurité. Demandez comment l’existence et l’original seront conservés.","https://www.service-public.fr/particuliers/vosdroits/F15009"),
  ]),
  ("PROPRIÉTÉ, DÉMEMBREMENT ET INDIVISION",[
   ("Code civil, articles 578 à 624 - usufruit","Les droits et obligations attachés à la jouissance d’un bien dont une autre personne détient la propriété.","Usufruit ne signifie ni pleine propriété ni liberté de vendre seul le bien entier.","https://www.legifrance.gouv.fr/codes/id/LEGISCTA000006136246"),
   ("Code général des impôts, article 669 - valeur fiscale de l’usufruit et de la nue-propriété","Le barème fiscal fondé sur l’âge de l’usufruitier pour certaines liquidations de droits.","Ce barème fiscal ne répond pas, à lui seul, aux questions de pouvoir, de financement ou d’opportunité familiale.","https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006310173/"),
   ("Code civil, articles 815 à 815-18 - indivision","Le droit de provoquer le partage et les règles applicables aux actes portant sur un bien indivis.","Détenir une quote-part ne revient pas à posséder une pièce déterminée de la maison.","https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006070721/LEGISCTA000006136538/"),
  ]),
  ("ABATTEMENTS, BARÈME ET DÉLAI DE QUINZE ANS",[
   ("Code général des impôts, article 777 - tarifs des droits","Les barèmes applicables à la part nette taxable selon le lien entre le défunt ou donateur et le bénéficiaire.","Le taux le plus élevé d’un barème ne s’applique pas nécessairement à toute la part transmise.","https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069577/LEGISCTA000006197326/"),
   ("Code général des impôts, article 779 - principaux abattements","Les abattements applicables selon le lien de parenté et certaines situations particulières.","Un montant affiché dans un article peut avoir été utilisé lors d’une donation antérieure ou dépendre de conditions précises.","https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000026292566/"),
   ("Code général des impôts, article 784 - donations antérieures","La déclaration des donations antérieures et leur prise en compte pour les abattements et le tarif, notamment dans la période de quinze ans.","Une donation ancienne peut rester importante civilement même lorsqu’elle n’entre plus dans le rappel fiscal.","https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033809289/"),
  ]),
  ("ASSURANCE-VIE : LE CONTRAT, LA CLAUSE ET LA FISCALITÉ",[
   ("Code des assurances, article L132-8 - désignation du bénéficiaire","Les manières de désigner un bénéficiaire suffisamment identifiable et l’obligation de recherche après le décès.","La personne que vous avez en tête n’est pas forcément celle que le texte enregistré permet d’identifier.","https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000018154217/"),
   ("Code des assurances, article L132-9 - acceptation du bénéficiaire","Les conditions et les conséquences de l’acceptation du bénéfice du contrat.","Une acceptation peut limiter certaines possibilités : vérifiez la situation avant toute modification ou rachat.","https://www.legifrance.gouv.fr/codes/id/LEGISCTA000006157304/"),
   ("Code des assurances, articles L132-12 et L132-13 - capital et primes","Le principe selon lequel le capital versé à un bénéficiaire déterminé ne fait pas partie de la succession, ainsi que la limite liée aux primes manifestement exagérées.","La formule « hors succession » n’autorise pas à ignorer la clause, les primes, l’âge et le contexte patrimonial.","https://www.legifrance.gouv.fr/codes/id/LEGISCTA000006157304/"),
   ("Code général des impôts, article 757 B - primes versées après 70 ans","Le traitement successoral de certaines primes versées après soixante-dix ans et l’abattement global prévu par le texte.","La date d’ouverture du contrat ne remplace jamais l’historique daté des versements.","https://www.legifrance.gouv.fr/codes/id/LEGISCTA000006197321"),
   ("Code général des impôts, article 990 I - prélèvement sur certains capitaux décès","Le prélèvement applicable à certains capitaux selon la date des primes et la part revenant à chaque bénéficiaire.","Les régimes des articles 757 B et 990 I ne se résument pas à « avant ou après 70 ans » sans examiner les dates et conditions du contrat.","https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000047288653"),
  ]),
 ]
 for index,(label,articles) in enumerate(lois):
  if index in (0,3,4):story+=[PageBreak()]
  story+=head("ARTICLES DE LOI À LIRE",label)
  for article in articles:story+=article_box(*article)
  if label=="PROTÉGER LES PARTS ET COMPRENDRE LES DONATIONS":
   story+=product_bridge("Lire seul les règles - ou les relier à votre propre situation","Vous pouvez rechercher chaque article, réunir vos actes et construire vous-même l’ordre des vérifications. Si vous voulez que vos réponses soient reliées dans un parcours unique, Mon plan adapté à ma situation produit une estimation expliquée et un ordre de préparation.","Découvrir Mon plan adapté à ma situation")
  elif label=="TESTAMENT : FORME, LIMITES ET CONSERVATION":
   story+=product_bridge("Lire les formes - ou préparer un rendez-vous qui part de vos volontés","Vous pouvez lire les textes officiels, inventorier seul vos souhaits et préparer vos questions. Le Dossier Testament vous donne le diagnostic, la carte des personnes et des biens, le contrôle des contradictions avec donations et assurance-vie, le brief à remettre au notaire, les questions de validité et le registre de conservation. Vous savez ainsi ce que vous voulez protéger, ce qui manque encore et ce que le professionnel doit transformer en solution valable.","Découvrir le Dossier Testament")
  elif label=="ASSURANCE-VIE : LE CONTRAT, LA CLAUSE ET LA FISCALITÉ":
   story+=product_bridge("Lire les articles - ou obtenir les preuves détenues par l’assureur","Les textes expliquent le cadre, mais ils ne révèlent ni votre clause enregistrée ni l’historique de vos versements. Le guide assurance-vie fournit la grille et le courrier pour demander les informations puis préparer leur vérification.","Découvrir le guide assurance-vie")
 story += [P("Les liens conduisent aux sources officielles. La loi et votre situation peuvent évoluer : consultez toujours la version en vigueur et faites valider toute décision individuelle.","small")]
 file=OUT/(slug+".pdf")
 doc=Doc(str(file),pagesize=A4,rightMargin=M,leftMargin=M,topMargin=53,bottomMargin=52,title=title,author="Héritage Intact")
 doc.sans_date=True
 doc.build(story,onFirstPage=furniture,onLaterPages=furniture)
 reader=PdfReader(str(file))
 for i,page in enumerate(reader.pages,1):
  text=page.extract_text()
  if not text or "\ufffd" in text:raise ValueError(f"Page invalide {slug} {i}")
 return {"sku":"front","slug":slug,"pages":len(reader.pages),"fiches":0,"octets":file.stat().st_size}
CAT=[
 ("front","les-7-erreurs","Les 7 erreurs qui offrent votre héritage à l’État","Les 3 dates qui avancent. Les 4 pièges qui restent invisibles. Les actions à mener."),
 ("bump","dossier-notaire","Dossier Notaire","Partir de l’exemple. Rassembler les pièces utiles. Conserver les réponses."),
 ("upsell1","bibliotheque-12-situations-familiales","Bibliothèque des 12 situations familiales","Le complément pratique de votre résultat personnalisé : choisissez les fiches qui correspondent à votre famille."),
 ("upsell2","assurance-vie","Mon guide assurance-vie","Retrouver la clause. Demander les informations. Suivre les vérifications."),
 ("backend4","dossier-testament","Dossier Testament","Clarifier vos volontés. Détecter les contradictions. Préparer leur formalisation."),
]
USAGE={
 "front":("Lisez une seule erreur pour commencer", "Ouvrez la première erreur. Sur une feuille, notez ce qui vous concerne, ce que vous savez déjà et ce qui reste à retrouver. Passez à l’erreur suivante quand vous pouvez expliquer la première avec vos propres mots.", "Vous avez repéré les erreurs qui vous concernent et noté une prochaine vérification. Votre lecture a produit une liste utile : gardez-la avec ce guide."),
 "bump":("Préparez d’abord votre fiche famille", "Lisez l’exemple rempli, puis complétez Ma fiche famille et Mon inventaire patrimonial. Inscrivez « à retrouver » au lieu d’inventer une réponse. Préparez ensuite les pièces et le message de rendez-vous. Après l’échange, notez dans le compte-rendu qui fait quoi et pour quand.", "Votre rendez-vous est préparé lorsque votre objectif, vos questions et les pièces disponibles sont réunis. Après le rendez-vous, conservez le compte-rendu et la prochaine action convenue."),
 "upsell1":("Commencez par votre résultat personnel", "Cette bibliothèque accompagne le PDF Mon plan personnalisé : elle ne remplace pas vos réponses et ne demande pas de lire douze situations. Ouvrez d’abord votre plan dans Mon dossier. Choisissez ensuite la fiche dont le titre correspond à votre famille ; plusieurs peuvent se compléter. Ignorez celles qui ne vous concernent pas.", "Vous avez votre plan personnel et les seules fiches utiles à votre situation. Votre prochaine étape est identifiée ; vous n’avez pas à compléter toute la bibliothèque."),
 "upsell2":("Prenez un seul contrat pour commencer", "Retrouvez son dernier relevé et complétez une grille de lecture pour ce contrat. Si la clause ou les dates manquent, utilisez le courrier de demande d’informations. À réception de la réponse, complétez la grille et notez les questions restantes. Recommencez séparément pour chaque autre contrat.", "Votre revue est préparée lorsque les informations de chaque contrat sont identifiées, les demandes manquantes envoyées et les réponses conservées. Faites confirmer la suite avant toute modification."),
 "backend4":("Commencez par le diagnostic", "Complétez le diagnostic, puis la carte de vos volontés. Comparez ces intentions aux dispositions déjà prises avec le contrôle de cohérence. Reportez les points importants dans le brief pour le notaire. Conservez les questions de validation pour le rendez-vous, puis renseignez le suivi après la formalisation.", "Vos volontés, les personnes concernées et les questions de cohérence sont réunies dans votre brief. Vous avez préparé un échange concret avec le notaire pour leur formalisation."),
}
ONLY=set(sys.argv[1:])
manifest=[]
if not ONLY or "lexique-succession" in ONLY:
 item=creer_lexique_offert();manifest.append(item);print(item["slug"]+": "+str(item["pages"])+" pages / bonus offert")
for sku,slug,title,subtitle in CAT:
 if ONLY and slug not in ONLY:continue
 guide=next(g for g in DATA["guides"] if g["sku"]==sku)
 docs=[d for d in DATA["documents"] if d["sku"]==sku]
 if sku=="front":docs=[]
 ed=DATA["editorial"][sku]
 if sku=="backend4":
  S["body"]=ParagraphStyle("bodytestament",parent=S["body"],fontSize=10.8,leading=14.2,spaceAfter=7)
  S["check"]=ParagraphStyle("checktestament",parent=S["check"],fontSize=9.8,leading=12.5,spaceAfter=5)
  S["small"]=ParagraphStyle("smalltestament",parent=S["small"],fontSize=8.4,leading=10.5,spaceAfter=5)
 cover_label={"front":"VOTRE GUIDE / PRODUIT DE BASE","bump":"VOTRE DOSSIER PRATIQUE","upsell1":"VOTRE PLAN ADAPTÉ À VOTRE SITUATION","upsell2":"VOTRE GUIDE ASSURANCE-VIE","backend4":"VOTRE DOSSIER TESTAMENT"}[sku]
 story=head(cover_label,title)
 story+=[P(ed["ouverture"],"h2")]+[P(p) for p in ed["histoire"]]
 story+=[P(ed.get("apprendreTitre","Ce que vous allez apprendre"),"h2")]
 for appris in ed["apprendre"]:story+=[P("- "+appris)]
 story+=[P(ed.get("adresseTitre","À qui ce guide s’adresse"),"h2")]
 for personne in ed.get("adresse",[]):story+=[P("- "+personne)]
 story+=[P(ed.get("essentielTitre","Pour aller à l’essentiel"),"h3"),P(ed["essentiel"])]
 if sku!="front":story+=[P("Les cas illustratifs montrent comment utiliser les supports. Adaptez uniquement les champs correspondant à votre situation et conservez-les chez vous.","small")]
 story+=[PageBreak()]+head("VOTRE PARCOURS",ed.get("parcoursTitre","Ce que les sept erreurs vont vous révéler" if sku=="front" else "Le fil de votre préparation"))
 toc=TableOfContents();toc.levelStyles=[ParagraphStyle("toc",fontName="HI",fontSize=10.5,leading=14,spaceBefore=5,textColor=BLUE)]
 story+=[toc]
 story+=[P("Utilisez les signets du PDF pour rejoindre directement la question qui vous concerne. Ce n’est pas un cours à mémoriser : une information manquante devient une demande précise à faire.")]
 story+=[PageBreak()]+head("UNE ACTION, UN DOCUMENT, UN RÉSULTAT",USAGE[sku][0])+[P(USAGE[sku][1])]
 story+=box("À votre rythme", "Vous pouvez vous arrêter après cette première action. Notez la page à reprendre. Les blancs sont des zones pour vos réponses : ne recopiez pas l’exemple comme s’il décrivait votre situation.")
 if sku!="front":story+=[P("Pour remplir en ligne : ouvrez Mon dossier, retrouvez ce produit puis « Remplir mes fiches en ligne ». Écrivez dans la fiche et cliquez sur « Enregistrer ma fiche ». Pour une copie locale, choisissez « Imprimer / PDF ». Vous pouvez aussi imprimer ce dossier et écrire à la main.")]
 if sku=="front":
  for l in DATA["lecons"]:
   if not l["numero"]:continue
   story+=[PageBreak()]+head("DÉPART" if not l["numero"] else "LES 7 ERREURS / "+str(l["numero"]),l["titre"])+[P(DATA["ouvertures"][l["cle"]]),P("Ce que vous allez comprendre","h3")]+[P("- "+a) for a in l["acquis"]]
   for t,b in l["blocs"]:story+=[P(t,"h2"),P(b)]
   if l.get("siNonConcerne"):story+=[P(l["siNonConcerne"],"small")]
 if sku=="front":
  ex=DATA["headline"]
  story+=[PageBreak()]+head("L’EXEMPLE DE LA PRÉSENTATION","68 206 € d’écart : les hypothèses")+[P(ex["hypotheses"]),P(ex["scenarioA"]),P(ex["scenarioB"]),P("Droits calculés avant frais et arrondis fiscaux : 82 194,70 € contre 13 988,70 €, soit 68 206 € pour les deux enfants réunis."),P(ex["limites"]),P("Ce cas chiffré illustre les mécanismes de l’accroche à partir d’hypothèses visibles. Les sources du barème et de l’assurance-vie figurent en fin de guide.","small")]
 if sku=="upsell2":
  story+=[PageBreak()]+head("COMPRENDRE AVANT D’ÉCRIRE","Votre contrat : les six repères")
  for t,b in DATA["assurance"]:story+=[P(t,"h2"),P(b)]
  story+=[P("Cas guidé : Marc dispose d’un relevé annuel mais seulement d’une ancienne photocopie de clause. Il note « clause en vigueur à demander », pas « clause incorrecte ». Contrat ouvert à 45 ans et versement effectué à 73 ans : l’âge à l’ouverture ne suffit pas à déterminer le régime du versement.")]
 if sku=="upsell1":
  story+=[PageBreak()]+head("L’ATELIER INCLUS","Comparer sans confondre résultat et décision")+[
   P("Retrouvez ce dossier dans Mon dossier. Lisez le périmètre de la simulation avant toute saisie. Une succession déjà ouverte, un conflit, une entreprise, un élément international ou des donations anciennes non vérifiées ne se résument pas à ce modèle."),
   P("Pour apprendre, commencez par ce cas d’entraînement : un parent seul, un enfant, 480 000 € de bien, donation de nue-propriété, puis comparez 70 et 71 ans. Gardez toutes les autres hypothèses identiques. L’écart de droits du modèle est de 9 600 €, hors frais d’acte."),
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
 story+=[PageBreak()]+head("VOTRE PRÉPARATION A AVANCÉ","Ce que vous avez maintenant")+[P(USAGE[sku][2])]
 story+=box("Gardez votre point de reprise", "Notez la prochaine action choisie, la pièce ou la réponse attendue et la personne à contacter. Vous pourrez reprendre sans tout recommencer.")
 story+=[PageBreak()]+head(ed.get("sortieLabel","VOTRE PROCHAINE ÉTAPE"),ed.get("sortieTitre","Ne laissez pas vos réponses retourner dans le tiroir."))
 story+=[P(ed["acquis"]),P(ed["limite"])]
 story+=box(ed["suiteLabel"],ed["suite"])
 story+=[P(ed["suiteResultat"]),rich('<link href="https://www.heritageintact.fr/espace" color="#12365E"><b>'+html.escape(clean(ed["suiteCta"]))+'</b></link>')]
 story+=[P("Le lien ouvre la page d’accès : indiquez votre email de commande pour recevoir votre lien personnel, puis ouvrez Mon parcours. L’espace distingue vos produits acquis des propositions. Ce clic ne déclenche aucun paiement.","small")]
 story+=sources()
 file=OUT/(slug+".pdf")
 doc=Doc(str(file),pagesize=A4,rightMargin=M,leftMargin=M,topMargin=53,bottomMargin=52,title=title,author="Héritage Intact")
 doc.sans_date=sku=="front"
 doc.toc_titles=set(clean(l["titre"]) for l in DATA["lecons"] if l["numero"]) if sku=="front" else set(clean(d["titre"]) for d in docs)
 doc.multiBuild(story,onFirstPage=furniture,onLaterPages=furniture)
 reader=PdfReader(str(file))
 for i,page in enumerate(reader.pages,1):
  text=page.extract_text()
  if not text or "\ufffd" in text:raise ValueError(f"Page invalide {slug} {i}")
 manifest.append({"sku":sku,"slug":slug,"pages":len(reader.pages),"fiches":len(docs),"octets":file.stat().st_size})
 print(slug+": "+str(len(reader.pages))+" pages / "+str(len(docs))+" fiches")
Path("tmp/pdfs/manifest-v7.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding="utf8")
