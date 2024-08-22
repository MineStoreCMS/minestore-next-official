export type TCheckoutRequest = {
    currency: string;
    paymentMethod: string;
    details?: {
        fullname: string;
        email: string;
        address1: string;
        address2?: string;
        city: string;
        country: string;
        region: string;
        zipcode: string;
    };
    termsAndConditions: boolean;
    privacyPolicy: boolean;
};
