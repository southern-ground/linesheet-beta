/**
 * Created by fst on 2/16/17.
 */
import {
    API,
    GET_IMAGES,
    GET_IMAGES_RESPONSE,
    OK,
    OPEN_IMAGE_OVERLAY,
    UPLOAD_IMAGES
} from '../constants';
import request from 'superagent';
import store from '../store';

export default function images(state = [], action) {
    switch (action.type) {
        case OPEN_IMAGE_OVERLAY:
            if (store.getState().imagesInitialized) {
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
        case UPLOAD_IMAGES:

            var req, i, file;

            req = request.post(API + 'upload.php');

            for (i = 0; i < action.files.length; i++) {
                file = action.files[i];
                req.attach("image_" + i, file);
            }

            req.end((err, res) => {
                if (err) {
                    console.warn("UPLOAD_IMAGES error: " + err);
                    store.dispatch({type: OK})
                } else {
                    var data = JSON.parse(res.text);
                    if (data.response === 200) {
                        store.dispatch({
                            type: GET_IMAGES_RESPONSE,
                            images: data.images,
                            msg: data.uploadResult
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
        default:
            return state;
    }
};