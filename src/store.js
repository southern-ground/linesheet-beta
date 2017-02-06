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
    ADD_CATEGORY,
    ADD_CATEGORY_RESPONSE,
    DELETE_CATEGORY,
    GET_CATEGORIES,
    GET_CATEGORIES_RESPONSE,
    GET_INVENTORY,
    GET_INVENTORY_RESPONSE,
    LOAD_COOKIE,
    LOAD_COOKIE_RESPONSE
} from './constants';
import request from 'superagent';
import Cookies from 'js-cookie';

// Centralized application state
// For more information visit http://redux.js.org/
const initialState = {inventory: [], categories: [], cookieLoaded: false, busy: false, busyMsg: ""};

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

    console.log('store::createStore', action.type);
    console.log(action);

    switch (action.type) {

        case ADD_CATEGORY:

            request
                .get(API + API_GATEWAYS[ADD_CATEGORY] + "&category=" + encodeURI(action.category))
                .end((err, res) => {
                    if (err) {
                        console.warn('ADD_CATEGORY Error:', err);
                    } else {
                        console.log('ADD_CATEGORY response:');
                        var data = JSON.parse(res.text);
                        if (data.response === 200) {
                            // No error:
                            writeCookie({categories: data.categories});
                            store.dispatch({type: GET_CATEGORIES_RESPONSE, data: data.categories});
                        } else {
                            // Error?
                        }
                    }
                });

            return {...state, busy: true, busyMsg: "Adding Category"};

        case DELETE_CATEGORY:

            request
                .get(API + API_GATEWAYS[DELETE_CATEGORY] + "&categoryId=" + action.categoryID)
                .end((err, res) => {
                    if (err) {
                        console.warn('DELETE_CATEGORY Error:', err);
                    } else {
                        console.log('DELETE_CATEGORY response:');

                        var data = JSON.parse(res.text);

                        console.log(data);

                        if (data.response === 200) {
                            // No error:
                            writeCookie({categories: data.categories});
                            store.dispatch({type: GET_CATEGORIES_RESPONSE, data: data.categories});
                        } else {
                            // Error?
                        }
                    }
                });

            return {...state, busy: true, busyMsg: "Deleting Category"};

        case GET_CATEGORIES:

            var url = API + API_GATEWAYS[GET_CATEGORIES];

            console.log('GET_CATEGORIES:', url);

            request
                .get(url)
                .end((err, res) => {
                    if (err) {
                        console.warn('GET_INVENTORY Error:', err);
                    } else {
                        var data = JSON.parse(res.text);
                        if (data.response === 200) {
                            // No error:
                            writeCookie({categories: data.categories});
                            store.dispatch({type: GET_CATEGORIES_RESPONSE, data: data.categories});
                        }
                    }
                });

            return {...state, busy: true, busyMsg: "Getting Categories"};

        case GET_CATEGORIES_RESPONSE:

            return {...state, categories: action.data, busy: false, busyMsg: ""};

            break;
        case GET_INVENTORY:

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

            return {...state, busy: true, busyMsg: "Getting Inventory"};

        case GET_INVENTORY_RESPONSE:

            return {...state, inventory: action.data, busy: false, busyMsg: ""};

        default:
            return state;
    }

});

export default store;
