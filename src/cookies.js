/**
 * Created by fst on 2/9/17.
 */
import Cookies from 'js-cookie';
import {
    COOKIE_NAME,
    LOAD_COOKIE,
    LOAD_COOKIE_RESPONSE
} from './constants';

export const getBlankCookie = () => {
    // Generates a cookie from a known template.
    return {
        date: new Date().getTime(),
        inventory: [],
        categories: []
    };
};
export const getCookie = ((data) => {
    return Object.assign({}, getBlankCookie(), data);
});
export const loadCookie = () => {
    return Cookies.get(COOKIE_NAME) ? JSON.parse(Cookies.get(COOKIE_NAME)) : getBlankCookie();
};
export const writeCookie = (data) => {
    Cookies.set(COOKIE_NAME, getCookie(...data, {date: new Date().getTime()}), {expires: 7});
};