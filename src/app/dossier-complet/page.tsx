import {OffrePreparation} from "@/components/OffrePreparation";
import { redirect } from "next/navigation";
export default async function Page({searchParams}:{searchParams:Promise<{o?:string}>}){const {o}=await searchParams;redirect(o?`/plan-complet?o=${encodeURIComponent(o)}`:"/methode");}
