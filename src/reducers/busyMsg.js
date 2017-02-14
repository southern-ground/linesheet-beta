/**
 * Created by fst on 2/14/17.
 */

import {
    ADD_CATEGORY,
    ADD_CATEGORY_RESPONSE,
    DELETE_CATEGORY,
    EDIT_CATEGORY,
    ADD_ITEM,
    DELETE_ITEM,
    GET_CATEGORIES,
    GET_CATEGORIES_RESPONSE,
    GET_INVENTORY,
    SAVE_SELECTION,
    UPDATE_ITEM
} from '../constants';

export default function busyMsg(state = '', action) {
    switch (action.type) {
        case ADD_CATEGORY:
            return "Adding Category";
        case ADD_ITEM:
            return "Adding Inventory Item";
        case DELETE_CATEGORY:
            return "Deleting Category";
        case DELETE_ITEM:
            return "Deleting Item";
        case EDIT_CATEGORY:
            return "Saving Category";
        case GET_CATEGORIES:
            return "Getting Categories";
        case GET_INVENTORY:
            return "Getting Inventory";
        case SAVE_SELECTION:
            return "Saving file " + action.fileName;
        case UPDATE_ITEM:
            return "Updating Item";
        case ADD_CATEGORY_RESPONSE:
        case GET_CATEGORIES_RESPONSE:
        default:
            return state;
    }
};
