/**
 * Created by fst on 2/14/17.
 */
import {
    TOGGLE_ADD_ITEM_FORM,
    SORT_HOME_INVENTORY_ON
} from '../constants';

export default function openInventoryFile(state=false,action){
    switch(action.type){
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
}