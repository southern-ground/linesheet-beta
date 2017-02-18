/**
 * Created by fst on 2/17/17.
 */
import {
    CLOSE_IMAGE_OVERLAY,
    OPEN_IMAGE_OVERLAY
} from '../constants';

export default function openImageOverlay(state = false,action){
    switch(action.type){
        case OPEN_IMAGE_OVERLAY:
            return true;
            break;
        case CLOSE_IMAGE_OVERLAY:
            return false;
            break;
        default:
            return state;
    }
}