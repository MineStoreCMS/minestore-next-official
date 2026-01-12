import { useCurrencyStore } from "@/stores/currency"
import { useSettingsStore } from "@/stores/settings"

export const convertToLocalCurrency = (value: number) => {

   const { currency } = useCurrencyStore.getState()
   const { settings } = useSettingsStore.getState()

   if (!currency) {
      console.debug("⚠️ Currency is empty")
      return value
   }

   if (!settings) {
      console.debug("⚠️ Settings is empty")
      return value
   }

   if (currency?.name == settings.system_currency.name) {
      return value
   }

   return ((value * currency.value) / settings.system_currency.value)
}
