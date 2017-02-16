/**
 * Created by fst on 2/16/17.
 */
import {
    GET_IMAGES_RESPONSE
} from '../constants';

export default function imagesInitialized(state = false, action) {
    switch (action.type) {
        case GET_IMAGES_RESPONSE:
            return true;
        default:
            return state;
    }
};