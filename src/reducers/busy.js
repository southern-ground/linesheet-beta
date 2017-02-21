/**
 * Created by fst on 2/14/17.
 */
import {
    ADD_CATEGORY,
    ADD_ITEM,
    DELETE_CATEGORY,
    EDIT_CATEGORY,
    DELETE_ITEM,
    GET_CATEGORIES,
    GET_IMAGES,
    GET_INVENTORY,
    UPDATE_ITEM
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
        case UPDATE_ITEM:
            return true;
            break;
        default:
            return false;
    }
}