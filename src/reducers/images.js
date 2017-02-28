/**
 * Created by fst on 2/16/17.
 */
import {
    API,
    CLOSE_IMAGE_OVERLAY,
    DELETE_IMAGE,
    GET_IMAGES,
    GET_IMAGES_RESPONSE,
    OK,
    OPEN_IMAGE_OVERLAY,
    UPLOAD_IMAGES
} from '../constants';
import request from 'superagent';
import store from '../store';

const imagesDefault = {
    initialized: false,
    images: [],
    msg: "",
    openOverlay: false,
    uploadStatus: ""
};

export default function imageStore(state = imagesDefault, action) {
    switch (action.type) {
        case CLOSE_IMAGE_OVERLAY:
            return {
                ...state,
                openOverlay: false
            };
        case DELETE_IMAGE:
            request
                .get(API)
                .query({
                    action: DELETE_IMAGE
                })
                .end((err, res) => {
                    if (err) {
                        console.warn("DELETE_IMAGE error: " + err);
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
        case OPEN_IMAGE_OVERLAY:
            return {
                ...state,
                openOverlay: true
            };
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
            return {
                ...state,
                images: action.images.sort((a, b) => {
                    return a.toUpperCase() > b.toUpperCase() ? 1 : -1;
                }),
                initialized: true,
                uploadStatus: (action.msg ? ((() => {
                        var uploadCount = 0;
                        action.msg.forEach(result => {
                            switch (parseInt(result.error)) {
                                case 0:
                                    uploadCount++;
                                    break;
                                case 1:
                                    console.warn('Skipped because it already exists: ' + result.fileName);
                                    break;
                                case 2:
                                    console.warn('Skipped because it isn\'t an image: ' + result.fileName);
                                    break;
                            }
                        });
                        return uploadCount + " file" + ( uploadCount === 1 ? "" : "s") + " uploaded successfully."
                    })()) : "")
            };
        case UPLOAD_IMAGES:
            var i, file, req = request.post(API + 'upload.php');
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