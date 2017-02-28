/**
 * Created by fst on 2/27/17.
 */
import {
    GET_IMAGES_RESPONSE
} from '../constants';

export default function imageUploadStatus(state = "", action) {
    switch (action.type) {
        case GET_IMAGES_RESPONSE:
            console.log(action);
            if(action.msg){
                var uploadCount = 0;
                action.msg.forEach(result=>{
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

                return uploadCount + " file" + ( uploadCount === 1 ? "" : "s") + " uploaded successfully.";
            }
            return "";
        default:
            return "";
    }
};