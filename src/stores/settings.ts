import { TSettings } from "@/types/settings";
import { create } from "zustand";

type SettingsStore = {
   settings?: TSettings
   setSettings(currency: TSettings): void
}

export const useSettingsStore = create<SettingsStore>((set) => ({
   settings: undefined,
   setSettings: (settings) => set({ settings })
}))
