import { createHmac, timingSafeEqual } from "node:crypto";
/** Vérification HMAC du corps brut, protocole Svix v1 ; aucune donnée traitée avant signature. */
export function signatureResendValide(body: string, headers: Headers, secret: string, now = Date.now()): boolean {
  const id=headers.get("svix-id"), stamp=headers.get("svix-timestamp"), signatures=headers.get("svix-signature");
  if (!id || !stamp || !signatures || !secret.startsWith("whsec_") || !/^\d+$/.test(stamp)) return false;
  if (Math.abs(now/1000-Number(stamp)) > 300) return false;
  const key=Buffer.from(secret.slice(6),"base64");
  if (!key.length) return false;
  const expected=createHmac("sha256",key).update(id+"."+stamp+"."+body).digest();
  return signatures.split(" ").some(s=>{
    const [v,b64]=s.split(","); if(v!=="v1"||!b64)return false;
    const got=Buffer.from(b64,"base64");
    return got.length===expected.length && timingSafeEqual(expected,got);
  });
}
