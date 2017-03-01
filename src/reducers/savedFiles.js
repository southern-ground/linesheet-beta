/**
 * Created by fst on 2/22/17.
 */
import {
    API,
    GET_FILE_LIST,
    GET_FILE_LIST_RESPONSE,
    SAVE_FILE,
    SAVE_FILE_RESPONSE,
    sanitizeString
} from '../constants';
import store from '../../src/store';
import request from 'superagent';

var defaultState = {
    files: [],
    fileExists: 0,
    initialized: false,
    lastSavedFile: "",
    msg: ""
};

const getFileList = (action) => {
    console.log('getFileList');
    request
        .get(API)
        .query({
            action: GET_FILE_LIST
        })
        .end((err, res) => {
            if (err) {
                console.warn('GET_FILE_LIST error', err);
            } else {
                var data = JSON.parse(res.text);
                if (data.response === 200) {
                    store.dispatch({
                        type: GET_FILE_LIST_RESPONSE,
                        files: data.allFiles || []
                    });
                } else {
                    console.warn();
                }
            }
        });
};

const saveFile = (action) => {
    request
        .get(API)
        .query({
            action: SAVE_FILE,
            data: {
                ...action.data,
                fileName: sanitizeString(action.data.fileName).toLowerCase(),
                items: (arr => {
                    var str = '';
                    arr.forEach(item => {
                        str += item + "|"
                    });
                    return str.substr(0, str.length - 1)
                })(action.data.items)
            }
        })
        .end((err, res) => {
            if (err) {
                console.warn('SAVE_FILE Error:', err);
            } else {
                var data = JSON.parse(res.text);
                if (data.response === 200) {
                    store.dispatch({
                        ...data,
                        type: SAVE_FILE_RESPONSE
                    });
                } else {
                    console.warn('SAVE_FILE error:', data.response.data.errorMsg || "");
                    store.dispatch({
                        type: SAVE_FILE_RESPONSE,
                        savedFile: "UNKNOWN"
                    });
                }
            }
        });

};

export default function savedFileStore(state = defaultState, action) {
    switch (action.type) {
        case GET_FILE_LIST:
            getFileList(action);
            return state;
        case GET_FILE_LIST_RESPONSE:
            console.log('GET_FILE_LIST_RESPONSE', action);
            return {
                ...state,
                files: action.files,
                initialized: true,
                msg: action.files.length === 0 ? "There are no saved sheets." : ""
            };
            break;
        case SAVE_FILE:
            saveFile(action);
            return state;
        case SAVE_FILE_RESPONSE:
            return {
                ...state,
                fileExists: action.fileExists,
                files: action.files,
                lastSavedFile: action.savedFile
            };
        default:
            return state;
    }
}