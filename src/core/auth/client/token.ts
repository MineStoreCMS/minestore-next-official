import { setCookie, getCookie, deleteCookie } from 'cookies-next';
const key = 'token';

export const tokenHelper = {
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
