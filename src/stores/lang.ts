import { langStorage } from '@helpers/lang-storage';
import { create } from 'zustand';

type LangStore = {
    lang: string | undefined;
    setLang(lang: string): void;
};

export const useLangStore = create<LangStore>((set) => ({
    lang: langStorage.get() || undefined,
    setLang: (lang) => {
        langStorage.save(lang);
        set({ lang });
    }
}));
