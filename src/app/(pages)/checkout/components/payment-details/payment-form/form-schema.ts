import { z } from 'zod';

const detailsSchema = z.object({
    fullname: z.string().min(2, {
        message: 'Full name must be at least 2 characters.'
    }),
    email: z.string().email({
        message: 'Please enter a valid email.'
    }),
    address1: z.string().min(2, {
        message: 'Address must be at least 2 characters.'
    }),
    address2: z.string().optional(),
    city: z.string().min(2, {
        message: 'City must be at least 2 characters.'
    }),
    region: z.string().min(1, {
        message: 'Region must be at least 2 characters.'
    }),
    country: z.string().min(1, {
        message: 'Select a country.'
    }),
    zipcode: z.string().min(1, {
        message: 'Zipcode code must be at least 2 characters.'
    })
});

export const paymentFormSchema = z.object({
    details: z.optional(detailsSchema),
    termsAndConditions: z.literal(true, {
        errorMap: () => ({ message: 'You must accept Terms and Conditions' })
    }),
    privacyPolicy: z.literal(true, {
        errorMap: () => ({ message: 'You must accept Privacy Policy' })
    }),
    paymentMethod: z.string().min(1, {
        message: 'Select a payment method.'
    })
});

export type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export const defaultValues: Partial<PaymentFormValues> = {
    paymentMethod: ''
};
