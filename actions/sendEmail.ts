"use server";

import React from "react";
import { Resend } from "resend";
import { vaildateString, getErrorMessage } from "@/lib/utils";
import ContactFormEmail from "@/email/contact-form-email";

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async (formData: FormData) => {
    const senderEmail = formData.get("senderEmail");
    const message = formData.get("message");

    if(!vaildateString(senderEmail,500)){
return {
    error:"Invailid sender email"
}
    }
    if(!vaildateString(message,5000)){
        return {
            error:"Invailid message"
        }

    }

let data;
    try {
        await resend.emails.send({
            from: 'Contact Form <onboarding@resend.dev>',
            to:'maikoyorino.07@gmail.com',
            subject:'Message from contact form',
            reply_to: senderEmail as string,
            // text: message as string,
            react: React.createElement (ContactFormEmail, {
                message: message as string,
                senderEmail: senderEmail as string
            })
        });

    } catch(error:unknown) {
        if (error instanceof Error){
            return{
                error: error.message,
            };
        } else if( error && typeof error === 'object' && 'message' in error) {
    return {
     error: error.message,
    }
        }
    return {
        error: getErrorMessage(error)
    }
    }

    return {
        data,
    };
};