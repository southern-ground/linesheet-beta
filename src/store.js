/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {createStore} from 'redux';
import {
    API,
    API_GATEWAYS,
    COOKIE_NAME,
    GET_INVENTORY,
    GET_INVENTORY_RESPONSE,
    LOAD_COOKIE,
    LOAD_COOKIE_RESPONSE
} from './constants';
import request from 'superagent';
import Cookies from 'js-cookie';

// Centralized application state
// For more information visit http://redux.js.org/
const initialState = {inventory: [], categories: [], cookieLoaded: false};

const getBlankCookie = () => {
    // Generates a cookie from a known template.
    return {
        date: new Date().getTime(),
        inventory: [],
        categories: []
    };
};

const getCookie = ((data) => {
    return Object.assign({}, getBlankCookie(), data);
});

const loadCookie = () => {
    return Cookies.get(COOKIE_NAME) ? JSON.parse(Cookies.get(COOKIE_NAME)) : getBlankCookie();
};

const writeCookie = (data) => {
    Cookies.set(COOKIE_NAME, getCookie(...data, {date: new Date().getTime()}), {expires: 7});
};

const store = createStore((state = initialState, action) => {

    switch (action.type) {
        case GET_INVENTORY:

            console.log('store::action GET_INVENTORY');

            var inventoryRefresh = action.refresh || false;

            if (!state.cookieLoaded) {
                var cookie = loadCookie();
                state = {...state, inventoryLoaded: cookie.date, cookieLoaded: true};
                inventoryRefresh = true; // Force a refresh of items.
            }

            if (inventoryRefresh) {
                console.log('\tCookie just loaded or refresh called');
                request
                    .get(API + API_GATEWAYS[GET_INVENTORY])
                    .end((err, res) => {
                        if (err) {
                            console.warn('GET_INVENTORY Error:', err);
                        } else {
                            console.log('GET_INVENTORY response:');
                            var data = JSON.parse(res.text);
                            if (data.response === 200) {
                                // No error:
                                writeCookie({inventory: data.inventory});
                                store.dispatch({type: GET_INVENTORY_RESPONSE, data: data.inventory});
                            } else {
                                // Error?
                            }
                        }
                    });
            }
            return state;
        case GET_INVENTORY_RESPONSE:
            console.log('store::action GET_INVENTORY_RESPONSE');
            return {...state, inventory: action.data};
        default:
            return state;
    }
});

export default store;
