/**
 * Created by fst on 2/14/17.
 */
import {
    ADD_CATEGORY_RESPONSE,
    GET_INVENTORY_RESPONSE
} from '../constants';

export default function initialized(state = false,action){
    switch(action.type){
        case ADD_CATEGORY_RESPONSE:
        case GET_INVENTORY_RESPONSE:
            return true;
        default:
            return state;
    }
}