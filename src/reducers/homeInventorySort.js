/**
 * Created by fst on 2/14/17.
 */

import {
    SORT_HOME_INVENTORY_ON,
    SORT_SKU
} from '../constants';

export default function homeInventorySort(state = SORT_SKU, action) {
    switch (action.type) {
        case SORT_HOME_INVENTORY_ON:
            return action.sortOn;
        default:
            return state;
    }
}