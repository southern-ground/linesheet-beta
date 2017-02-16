/**
 * Created by fst on 2/14/17.
 */

import {
    ADD_CATEGORY,
    ADD_CATEGORY_RESPONSE,
    ADD_ITEM,
    ADD_ITEM_RESPONSE,
    DELETE_CATEGORY,
    EDIT_CATEGORY,
    DELETE_ITEM,
    GET_CATEGORIES,
    GET_CATEGORIES_RESPONSE,
    GET_IMAGES,
    GET_INVENTORY,
    SAVE_SELECTION,
    UPDATE_ITEM,
    UPDATE_ITEM_RESPONSE
} from '../constants';

export default function busyMsg(state = '', action) {
    switch (action.type) {
        case ADD_CATEGORY:
            return "Adding Category";
            break;
        case ADD_ITEM:
            return "Adding Inventory Item";
            break;
        case DELETE_CATEGORY:
            return "Deleting Category";
            break;
        case DELETE_ITEM:
            return "Deleting Item";
            break;
        case EDIT_CATEGORY:
            return "Saving Category";
            break;
        case GET_CATEGORIES:
            return "Getting Categories";
            break;
        case GET_IMAGES:
            return "Getting Images";
            break;
        case GET_INVENTORY:
            return "Getting Inventory";
            break;
        case SAVE_SELECTION:
            return "Saving file " + action.fileName;
            break;
        case UPDATE_ITEM:
            return "Updating Item";
            break;
        case ADD_CATEGORY_RESPONSE:
        case ADD_ITEM_RESPONSE:
        case GET_CATEGORIES_RESPONSE:
        case UPDATE_ITEM_RESPONSE:
        default:
            return "";
    }
};
