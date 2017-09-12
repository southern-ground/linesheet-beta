/**
 * Created by fst on 2/14/17.
 */

import request from 'superagent';
import {
    API,
    OK,
    ADD_ITEM,
    ADD_ITEM_RESPONSE,
    DELETE_ITEM,
    GET_CATEGORIES,
    GET_INVENTORY,
    GET_INVENTORY_RESPONSE,
    SELECT_CATEGORY,
    SELECT_ITEM,
    SELECT_ALL_INVENTORY_ITEMS,
    UPDATE_AFTER_IMPORT,
    UPDATE_ITEM,
    UPDATE_ITEM_RESPONSE
} from '../constants';
import store from '../store';

export default function inventory(state = [], action) {
    switch (action.type) {
        /*
         ITEMS
         */
        case ADD_ITEM:
            var args = {action: ADD_ITEM};
            Object.keys(action.item).map((key) => {
                args[key] = action.item[key];
            });
            request
                .get(API)
                .query(args)
                .end(function (err, res) {
                    if (err) {
                        console.warn('ADD_ITEM Error:', err);
                    } else {
                        var data = JSON.parse(res.text);
                        if (data.response === 200) {
                            store.dispatch({
                                type: ADD_ITEM_RESPONSE,
                                inventory: data.inventory
                            });
                        } else {
                            console.warn('ADD_ITEM Error', data.response);
                        }
                    }
                });
            return state;
        case ADD_ITEM_RESPONSE:
            return action.inventory;
        /*
         INVENTORY
         */
        case DELETE_ITEM:
            request
                .get(API)
                .query({
                    action: DELETE_ITEM,
                    sku: action.sku
                })
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
            return state;
        case GET_CATEGORIES:
        case GET_INVENTORY:
            request
                .get(API)
                .query({
                    action: GET_INVENTORY
                })
                .end((err, res) => {
                    if (err) {
                        console.warn('GET_INVENTORY Error:', err);
                    } else {
                        var data = JSON.parse(res.text);
                        store.dispatch({
                            type: GET_INVENTORY_RESPONSE,
                            inventory: data.inventory,
                            categories: data.categories
                        });
                    }
                });
            return state;
        case GET_INVENTORY_RESPONSE:
            return action.inventory;
        case SELECT_ALL_INVENTORY_ITEMS:
            return state.map((item) => {
                return {
                    ...item,
                    selected: action.value
                }
            });
        case UPDATE_ITEM:
            var updateUrl = API,
                query = {
                    action: UPDATE_ITEM
                };
            Object.keys(action.item).map(key => {
                query[key] = action.item[key];
            });

            request
                .get(updateUrl)
                .query(query)
                .end((err, res) => {
                    if (err) {
                        console.warn('UPDATE_ITEM Error:', err);
                    } else {

                        var data = JSON.parse(res.text);

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
            return state;
        case UPDATE_AFTER_IMPORT:
        case UPDATE_ITEM_RESPONSE:
            return action.inventory;
        case SELECT_ITEM:
            return state.map((item) => {
                if (item.sku === action.sku) {
                    return {
                        ...item,
                        selected: action.value
                    }
                }
                return item;
            });
        /*
         CATEGORIES
         */
        case SELECT_CATEGORY:
            var selectedCategories = store.getState().selectedCategories || [];
            return state.map((item) => {
                var catCount = 0;
                item.categories.split(',').forEach(cat => {
                    catCount += (selectedCategories.indexOf(cat) > -1) ? 1 : 0;
                });
                return {
                    ...item,
                    selected: catCount > 0
                }
            });
        default:
            return state;
    }
}