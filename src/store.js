import {
    combineReducers,
    createStore
} from 'redux';
import {
    API,
    API_GATEWAYS,
    OK,
    ADD_CATEGORY,
    ADD_CATEGORY_RESPONSE,
    DELETE_CATEGORY,
    EDIT_CATEGORY,
    ADD_ITEM,
    ADD_ITEM_RESPONSE,
    DELETE_ITEM,
    GET_CATEGORIES,
    GET_CATEGORIES_RESPONSE,
    GET_INVENTORY,
    GET_INVENTORY_RESPONSE,
    SELECT_CATEGORY,
    SELECT_ITEM,
    SELECT_ALL_INVENTORY_ITEMS,
    SORT_HOME_INVENTORY_ON,
    TOGGLE_ADD_ITEM_FORM,
    UPDATE_ITEM,
    UPDATE_ITEM_RESPONSE,
    SORT_SKU
} from './constants';
import request from 'superagent';
import {
    loadCookie,
    writeCookie
} from './cookies';

const initialState = {
    busy: false,
    busyMsg: "",
    openInventoryForm: false,
    homeIndustrySort: SORT_SKU,
    allSelected: false
};

const store = createStore((state = initialState, action) => {

    // Default re-sets:
    state = {
        ...state,
        busy: false,
        busyMsg: "",
        openInventoryForm: false
    };

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
                                type: ADD_ITEM_RESPONSE,
                                inventory: data.inventory
                            });
                        } else {
                            // Error?
                        }
                    }
                });
            return {...state, busy: true, busyMsg: "Adding Inventory Item"};
        case ADD_ITEM_RESPONSE:
            return {
                ...state,
                inventory: action.inventory
            };
            break;
        case UPDATE_ITEM:
            var updateUrl = API + API_GATEWAYS[UPDATE_ITEM] +
                "&sku=" + action.item.sku +
                "&name=" + action.item.name +
                "&categories=" + action.item.categories +
                "&wholesale=" + action.item.wholesale +
                "&msrp=" + action.item.msrp;
            request
                .get(updateUrl)
                .end((err, res) => {
                    if (err) {
                        console.warn('UPDATE_ITEM Error:', err);
                    } else {

                        var data = JSON.parse(res.text),
                            inventory = data.inventory,
                            categories = store.getState().categories;

                        if (data.response === 200) {
                            store.dispatch({
                                type: UPDATE_ITEM_RESPONSE,
                                inventory: data.inventory
                            });
                        } else {
                            console.warn('UPDATE_ITEM response:', data.response);
                        }
                    }
                });
            return {...state, busy: true, busyMsg: "Updating Item"};
        case UPDATE_ITEM_RESPONSE:
            return {
                ...state,
                inventory: action.inventory
            };
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
                initialized: true,
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
                        if (data.response === 200) {
                            store.dispatch({
                                type: GET_INVENTORY_RESPONSE,
                                inventory: data.inventory,
                                categories: data.categories
                            });
                        } else {
                            console.warn('Error on deleting item', data.response);
                            store.dispatch({
                                type: OK
                            });
                        }

                    }
                });
            return {...state, busy: true, busyMsg: "Deleting Item"};
        case ADD_CATEGORY:
            request
                .get(API + API_GATEWAYS[ADD_CATEGORY] + "&category=" + encodeURI(action.category))
                .end((err, res) => {
                    if (err) {
                        console.warn('ADD_CATEGORY Error:', err);
                    } else {
                        var data = JSON.parse(res.text);
                        if (data.response === 200) {
                            // No error:
                            writeCookie({categories: data.categories});
                            store.dispatch({type: ADD_CATEGORY_RESPONSE, data: data.categories});
                        } else {
                            // Error?
                        }
                    }
                });
            return {...state, busy: true, busyMsg: "Adding Category"};
        case DELETE_CATEGORY:
            request
                .get(API + API_GATEWAYS[DELETE_CATEGORY] + "&categoryId=" + action.categoryId)
                .end((err, res) => {
                    if (err) {
                        console.warn('DELETE_CATEGORY Error:', err);
                    } else {
                        var data = JSON.parse(res.text);
                        if (data.response === 200) {
                            // No error:
                            writeCookie({categories: data.categories});
                            store.dispatch({type: GET_CATEGORIES_RESPONSE, data: data.categories});
                        } else {
                            store.dispatch(
                                {
                                    type: GET_CATEGORIES_RESPONSE,
                                    data: data.categories,
                                    error: "That category is in use by a product. Please un-assign the category from all products before deleting it."
                                });
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
        case ADD_CATEGORY_RESPONSE:
            return {
                ...state,
                categories: action.data,
                error: action.error || "",
                initialized: true
            };
            break;
        case TOGGLE_ADD_ITEM_FORM:
            return {
                ...state,
                openInventoryForm: action.value
            };
        case SORT_HOME_INVENTORY_ON:
            return {
                ...state,
                homeInventorySort: action.sortOn
            };
        default:
            return state;
    }

});

export default store;
