export type TPatrons = {
   success: boolean;
   error?: string;
   currency_code?: string;
   description?: string;
   top_patrons?: {
      username: string;
      amount: number;
   }[];
   patrons?: {
      [key: string]: string[];
   };
};
