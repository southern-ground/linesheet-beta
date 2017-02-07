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
    OK,
    ADD_CATEGORY,
    DELETE_CATEGORY,
    EDIT_CATEGORY,
    ADD_ITEM,
    ADD_ITEM_RESPONSE,
    DELETE_ITEM,
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

    switch (action.type) {

        case OK:

            return {...state, busy: false, busyMsg: ''}

        case ADD_ITEM:

            var addItemUrl = API + API_GATEWAYS[ADD_ITEM];

            Object.keys(action.item).map((key) => {
                addItemUrl += "&" + key + "=" + action.item[key];
            });

            request
                .get(addItemUrl)
                .end((err, res) => {
                    if (err) {
                        console.warn('ADD_ITEM Error:', err);
                    } else {
                        var data = JSON.parse(res.text);
                        if (data.response === 200) {
                            // No error:
                            // writeCookie({categories: data.categories});
                            store.dispatch({
                                type: GET_INVENTORY_RESPONSE,
                                inventory: data.inventory,
                                categories: data.categories
                            });
                        } else {
                            // Error?
                        }
                    }
                });

            return {...state, busy: true, busyMsg: "Adding Category"};

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

        case EDIT_CATEGORY:

            request
                .get(API + API_GATEWAYS[EDIT_CATEGORY]
                    + "&categoryId=" + action.categoryId
                    + "&categoryName=" + action.categoryName)
                .end((err, res) => {
                    if (err) {
                        console.warn('EDIT_CATEGORY Error:', err);
                    } else {

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

            return {...state, busy: true, busyMsg: "Saving Category"};

        case GET_CATEGORIES:

            var url = API + API_GATEWAYS[GET_CATEGORIES];

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

                request
                    .get(API + API_GATEWAYS[GET_INVENTORY])
                    .end((err, res) => {
                        if (err) {
                            console.warn('GET_INVENTORY Error:', err);
                        } else {
                            var data = JSON.parse(res.text);
                            if (data.response === 200) {
                                // No error:
                                writeCookie({
                                    inventory: data.inventory,
                                    categories: data.categories
                                });
                                store.dispatch({
                                    type: GET_INVENTORY_RESPONSE,
                                    inventory: data.inventory,
                                    categories: data.categories
                                });
                            } else {
                                // Error?
                            }
                        }
                    });
            }

            return {...state, busy: true, busyMsg: "Getting Inventory"};

        case GET_INVENTORY_RESPONSE:

            return {
                ...state,
                inventory: action.inventory,
                categories: action.categories,
                busy: false,
                busyMsg: ""
            };

        case DELETE_ITEM:

            var url = API + API_GATEWAYS[DELETE_ITEM] + "&sku=" + action.sku;

            request
                .get(url)
                .end((err, res) => {
                    if (err) {
                        console.warn("DELETE_ITEM error: " + err);
                        store.dispatch({action: OK})
                    } else {
                        var data = JSON.parse(res.text);
                        if(data.response === 200){
                            store.dispatch({
                                type: GET_INVENTORY_RESPONSE,
                                inventory: data.inventory,
                                categories: data.categories
                            });
                        }else{
                            console.warn('Error on deleting item', data.response);
                            store.dispatch({
                                type: OK
                            });
                        }

                    }
                });

            return {...state, busy: true, busyMsg: "Deleting Item"};

        default:
            return state;
    }

});

export default store;
