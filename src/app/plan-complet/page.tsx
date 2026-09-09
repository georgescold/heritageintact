import {OffrePreparation} from "@/components/OffrePreparation";
export default async function Page({searchParams}:{searchParams:Promise<{o?:string}>}){const {o}=await searchParams;return <OffrePreparation id={o} sku="upsell1" ecran="plan"/>;}
