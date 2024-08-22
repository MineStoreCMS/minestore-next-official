import { setCookie, getCookie, deleteCookie } from 'cookies-next';

const key = 'lang';

export const langStorage = {
    get() {
        return getCookie(key);
    },
    save(value: string) {
        setCookie(key, value);
    },
    clear() {
        deleteCookie(key);
    }
};
