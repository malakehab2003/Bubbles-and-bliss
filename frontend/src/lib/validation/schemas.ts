import { z } from "zod"

export const signInSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = z.object({
    name: z.string()
        .min(1, "Name is required")
        .min(2, "Name must be at least 2 characters"),
    
    email: z.string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    
    password: z.string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters"),
    
    phone: z.string()
        .optional()
        .refine(
            (val) => !val || /^(\+20|0)?1[0-9]{9}$/.test(val),
            "Please enter a valid Egyptian phone number"
        ),
    
    dob: z.coerce.date()
        .refine(
            (value) => {
                const today = new Date();
                const birthDate = new Date(value);
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age >= 10;
            },
            "Age must be at least 10 years old"
        ),
})

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;