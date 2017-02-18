/**
 * Created by fst on 2/16/17.
 */
import {
    API,
    GET_IMAGES,
    GET_IMAGES_RESPONSE,
    OK,
    OPEN_IMAGE_OVERLAY
} from '../constants';
import request from 'superagent';
import store from '../store';

export default function images(state = [], action) {
    switch (action.type) {
        case OPEN_IMAGE_OVERLAY:
            console.log('images::OPEN_IMAGE_OVERLAY', store.getState().imagesInitialized);
            if(store.getState().imagesInitialized){
                return state;
                break;
            }
        case GET_IMAGES:
            request
                .get(API)
                .query({
                    action: GET_IMAGES
                })
                .end((err, res) => {
                    if (err) {
                        console.warn("GET_IMAGES error: " + err);
                        store.dispatch({action: OK})
                    } else {
                        var data = JSON.parse(res.text);
                        if (data.response === 200) {
                            store.dispatch({
                                type: GET_IMAGES_RESPONSE,
                                images: data.images
                            });
                        } else {
                            console.warn('Error on getting images', data.response);
                            store.dispatch({
                                type: OK
                            });
                        }

                    }
                });
            return state;
        case GET_IMAGES_RESPONSE:
            return action.images.sort((a, b) => {
                return a.toUpperCase() > b.toUpperCase() ? 1 : -1;
            });
        default:
            return state;
    }
};