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
    GET_INVENTORY_RESPONSE,
    SAVE_SELECTION,
    UPDATE_ITEM,
    UPDATE_ITEM_RESPONSE
} from '../constants';

export default function busy(state = false, action) {
    switch (action.type) {
        case ADD_CATEGORY:
        case ADD_ITEM:
        case DELETE_CATEGORY:
        case DELETE_ITEM:
        case EDIT_CATEGORY:
        case GET_CATEGORIES:
        case GET_IMAGES:
        case GET_INVENTORY:
        case SAVE_SELECTION:
        case UPDATE_ITEM:
            return true;
            break;
        default:
            return false;
    }
}