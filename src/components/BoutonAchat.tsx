"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./ui";
import type { ComponentProps } from "react";
export function BoutonAchat(props:ComponentProps<typeof Button>){
 const {pending}=useFormStatus();
 return <Button {...props} disabled={pending||props.disabled}>{pending?"Confirmation en cours…":props.children}</Button>;
}
