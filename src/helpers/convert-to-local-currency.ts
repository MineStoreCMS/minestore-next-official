import { useCurrencyStore } from "@/stores/currency"
import { useSettingsStore } from "@/stores/settings"
import { TCurrency } from "@/types/currency"

export const convertToLocalCurrency = (value: number, currencyOverride?: TCurrency) => {

   const { currency: storeCurrency } = useCurrencyStore.getState()
   const { settings } = useSettingsStore.getState()

   // Use override if provided (for SSR), otherwise use store
   const currency = currencyOverride || storeCurrency

   if (!currency) {
      // For SSR or initial render, return value as-is
      return value
   }

   if (!settings) {
      // For SSR or initial render, return value as-is
      return value
   }

   if (currency?.name == settings.system_currency.name) {
      return value
   }

   return ((value * currency.value) / settings.system_currency.value)
}
