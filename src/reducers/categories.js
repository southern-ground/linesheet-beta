/**
 * Created by fst on 2/14/17.
 */
import {
    API,
    ADD_CATEGORY,
    ADD_CATEGORY_RESPONSE,
    DELETE_CATEGORY,
    EDIT_CATEGORY,
    GET_CATEGORIES_RESPONSE,
    GET_INVENTORY_RESPONSE
} from '../constants';
import request from 'superagent';
import store from '../store';
import {
    sanitizeProductName
} from '../constants';
export default function categories(state = [], action) {
    switch (action.type) {
        case ADD_CATEGORY:
            request
                .get(API)
                .query({
                    action: ADD_CATEGORY,
                    category: sanitizeProductName(action.category)
                })
                .end((err, res) => {
                    if (err) {
                        console.warn('ADD_CATEGORY Error:', err);
                    } else {
                        var data = JSON.parse(res.text);
                        if (data.response === 200) {
                            // No error:
                            store.dispatch({
                                type: ADD_CATEGORY_RESPONSE,
                                data: data.categories
                            });
                        } else {
                            // Error?
                        }
                    }
                });
            return state;
        case DELETE_CATEGORY:
            request
                .get(API)
                .query({
                    action: DELETE_CATEGORY,
                    categoryId: action.categoryId
                })
                .end((err, res) => {
                    if (err) {
                        console.warn('DELETE_CATEGORY Error:', err);
                    } else {
                        var data = JSON.parse(res.text),
                            category;
                        if (data.response === 200) {
                            // No error:
                            store.dispatch({type: GET_CATEGORIES_RESPONSE, data: data.categories});
                        } else {
                            category = store.getState().categories.filter(cat=>{
                                if(cat.id === data.removedCategoryId){
                                    return cat.name;
                                }
                            }).pop().name;

                            store.dispatch(
                                {
                                    type: GET_CATEGORIES_RESPONSE,
                                    data: data.categories,
                                    error: "The category \"" + category + "\" is in use by a product. Please un-assign the category from all products before deleting it."
                                });
                        }
                    }
                });
            return state;
        case ADD_CATEGORY_RESPONSE:
        case GET_CATEGORIES_RESPONSE:
            return action.data;
        case EDIT_CATEGORY:
            request(API)
                .query({
                    action: EDIT_CATEGORY,
                    categoryId: action.categoryId,
                    categoryName: action.categoryName
                })
                .end(function (err, res) {
                    if (err) {
                        console.warn('EDIT_CATEGORY Error:', err);
                    } else {
                        var data = JSON.parse(res.text);
                        if (data.response === 200) {
                            store.dispatch({
                                type: GET_CATEGORIES_RESPONSE,
                                data: data.categories
                            });
                        } else {
                            console.warn('EDIT_CATEGORY Error', data.response);
                        }
                    }
                });
            return state;
        case GET_INVENTORY_RESPONSE:
            return action.categories;
        default:
            return state;
    }
}