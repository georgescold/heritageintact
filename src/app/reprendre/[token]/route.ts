import { NextResponse } from "next/server";
import { promotionParId } from "@/lib/db";
export const dynamic="force-dynamic";
export async function GET(request:Request,{params}:{params:Promise<{token:string}>}){
 const {token}=await params;
 const p=await promotionParId(token);
 const destination=new URL(request.url).searchParams.get("destination")==="commande"?"/commande":"/methode";
 const response=NextResponse.redirect(new URL(destination,request.url));
 response.headers.set("Cache-Control","private, no-store");
 response.headers.set("Referrer-Policy","no-referrer");
 response.headers.set("X-Robots-Tag","noindex, nofollow");
 if(p?.gamme==="front")response.cookies.set("hi_offre",p.id,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:30*86400});
 return response;
}
