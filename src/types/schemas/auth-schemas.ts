import { t } from "i18next"
import { z } from "zod"

export const loginSchema = z
    .object({
        email: z.string().email(t("please-enter-a-valid-email-address", { ns: "auth" })).optional(),
        password: z.string().min(1, t("password-is-required", { ns: "auth" })),
    })


export const signUpSchema = z
    .object({
        email: z.email(t("please-enter-a-valid-email-address", { ns: "auth" })).optional(),
        password: z.string(),

        // STOP SECURE PASSWORDS ERA, LET THE USER CHOOSE 

        // .min(8, t("password-must-be-at-least-8-characters"))
        // .regex(
        //     /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        //     t("password-must-contain-at-least-one-uppercase-letter-one-lowercase-letter-and-one-number"),
        // ),
        confirmPassword: z.string(),
        acceptTerms: z.boolean().refine((val) => val === true, t("you-must-accept-the-terms-and-conditions", { ns: "auth" })),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: t("passwords-do-not-match", { ns: "auth" }),
        path: ["confirmPassword"],
    })
export type LoginFormData = z.infer<typeof loginSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
