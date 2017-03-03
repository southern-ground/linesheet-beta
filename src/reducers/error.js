/**
 * Created by fst on 2/14/17.
 */

import {
    ADD_CATEGORY_RESPONSE,
    GET_CATEGORIES_RESPONSE
} from '../constants';

export default function error(state = "", action) {
    switch (action.type) {
        case ADD_CATEGORY_RESPONSE:
            return action.error || "";
            break;
        case GET_CATEGORIES_RESPONSE:
            return action.error || "";
            break;
        default:
            return state;
    }
}