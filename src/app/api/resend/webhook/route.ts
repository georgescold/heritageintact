import { signatureResendValide } from "@/lib/resend-signature";
import { supprimerDestinataire } from "@/lib/mail-journal";
export async function POST(req: Request) {
  const secret=process.env.RESEND_WEBHOOK_SECRET;
  if(!secret)return Response.json({error:"non configuré"},{status:503});
  if(Number(req.headers.get("content-length") ?? 0)>65536)return new Response(null,{status:413});
  const body=await req.text();
  if(Buffer.byteLength(body)>65536)return new Response(null,{status:413});
  if(!signatureResendValide(body,req.headers,secret))return new Response(null,{status:401});
  try {
    const e=JSON.parse(body);
    if(!["email.bounced","email.complained","email.suppressed"].includes(e.type))return Response.json({ok:true});
    if(!Array.isArray(e.data?.to) || e.data.to.length>50)return new Response(null,{status:400});
    for(const dest of e.data.to) {
      if(typeof dest!=="string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dest))return new Response(null,{status:400});
      await supprimerDestinataire(dest,e.type);
    }
    // L’insertion est idempotente ; un replay valide n’envoie rien et ne réactive personne.
    return Response.json({ok:true});
  } catch { return Response.json({error:"traitement non confirmé"},{status:503}); }
}
