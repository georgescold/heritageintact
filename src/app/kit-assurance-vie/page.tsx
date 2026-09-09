import {OffrePreparation} from "@/components/OffrePreparation";
export default async function Page({searchParams}:{searchParams:Promise<{o?:string;alternative?:string}>}){const {o,alternative}=await searchParams;return <OffrePreparation id={o} sku="upsell2" ecran="assurance-vie" alternative={alternative === "1"}/>;}
