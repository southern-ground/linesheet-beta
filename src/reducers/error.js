/**
 * Created by fst on 2/14/17.
 */
import {
    ADD_CATEGORY_RESPONSE
} from '../constants';
export default function error(state = "", action) {
    switch (action.type) {
        case ADD_CATEGORY_RESPONSE:
            return action.error || "";
        default:
            return state;
    }
}