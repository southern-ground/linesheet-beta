/**
 * Created by fst on 3/10/17.
 */

import request from 'superagent';
import {
    API,
    IMPORT_XLSX,
    UPDATE_AFTER_IMPORT,
    UPLOAD_XLSX,
    XLSX_LIST,
    OK
} from '../constants';
import store from '../store';

var defaultState = {
    files: [],
    status: 'n/a',
    target: '',
    imported: 0,
    skipped: 0,
    complete: false
};

export default function xlsx(state = defaultState, action) {
    switch (action.type) {
        case IMPORT_XLSX:
            request
                .get(API)
                .query({
                    action: IMPORT_XLSX,
                    file: action.file
                })
                .end((err, res) => {
                    if (err) {
                        console.warn("IMPORT_XLSX error: " + err);
                        store.dispatch({action: OK})
                    } else {
                        var data = JSON.parse(res.text);

                        console.log('IMPORT_XLSX response');
                        console.log(data);
                        store.dispatch({
                            type: OK
                        });
                        if (data.response === 200) {
                            store.dispatch({
                                type: UPDATE_AFTER_IMPORT,
                                inventory: data.inventory,
                                categories: data.categories,
                                skipped: data.skipped,
                                imported: data.imported
                            });
                        } else {
                            console.warn('Error on deleting item', data.response);
                            store.dispatch({
                                type: OK
                            });
                        }
                    }
                });
            return state;
        case UPLOAD_XLSX:
            var i, file, req = request.post(API + 'xlsxUpload.php');
            for (i = 0; i < action.files.length; i++) {
                file = action.files[i];
                req.attach("files_" + i, file);
            }
            req.end((err, res) => {
                if (err) {
                    console.warn("UPLOAD_xlsx error: " + err);
                    store.dispatch({type: OK})
                } else {
                    var data = JSON.parse(res.text);
                    if (data.response === 200) {
                        store.dispatch({
                            type: XLSX_LIST,
                            files: data.XLSX,
                            status: data.uploadResult[0].error,
                            target: data.uploadResult[0].fileName,
                            complete: false
                        });
                    } else {
                        console.warn('Error on xlsx files', data.response);
                        store.dispatch({
                            type: OK
                        });
                    }
                }
            });
            return state;
        case XLSX_LIST:
            return {
                ...state,
                files: action.files,
                status: action.status,
                target: action.target,
                complete: false
            };
        case UPDATE_AFTER_IMPORT:
            return {
                ...state,
                imported: action.imported,
                skipped: action.skipped,
                complete: true
            };
        default:
            return state;
    }
};