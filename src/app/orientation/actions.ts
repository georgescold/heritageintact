"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { objectifValide } from "@/lib/positionnement";
export async function orienter(form: FormData) {
  const objectif = objectifValide(form.get("objectif"));
  const jar = await cookies();
  if (objectif) jar.set("hi_objectif", objectif, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 86400 * 7 });
  else jar.delete("hi_objectif");
  redirect("/methode");
}
