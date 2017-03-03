/**
 * Created by fst on 2/17/17.
 */

import {
    SELECT_CATEGORY
} from '../constants';

export default function selectedCategories(state = [], action) {
    switch (action.type) {
        case SELECT_CATEGORY:
            if(action.value){
                state.push(action.categoryId);
            }else{
                while(state.indexOf(action.categoryId) > -1){
                    state.splice(state.indexOf(action.categoryId), 1);
                }
            }
            return state;
        default:
            return state;
    }
}