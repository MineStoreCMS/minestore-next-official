import { TCurrency } from "@/types/currency";
import { create } from "zustand";

type CurrencyStore = {
   currency?: TCurrency
   setCurrency(currency: TCurrency): void
}

export const useCurrencyStore = create<CurrencyStore>((set) => ({
   currency: undefined,
   setCurrency: (currency) => {
      localStorage.currency = currency.name
      set({ currency })
   }
}))
