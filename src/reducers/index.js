/**
 * Created by fst on 2/14/17.
 */
import { combineReducers } from 'redux'
import inventory from './inventory';
import categories from './categories';
import imagesInitialized from './imagesInitialized';
import images from './images';
import imageUploadStatus from './imageUploadStatus';
import openImageOverlay from './OpenImageOverlay';
import inventoryInitialized from './inventoryInitialized';
import selectedCategories from './selectedCategories';
import savedFiles from './savedFiles';
import error from './error';
import busy from './busy';
import busyMsg from './busyMsg';
import openInventoryFile from './openInventoryFile';
import homeInventorySort from './homeInventorySort';

export default combineReducers({
    savedFiles,
    selectedCategories,
    inventory,
    inventoryInitialized,
    categories,
    images,
    imageUploadStatus,
    openImageOverlay,
    imagesInitialized,
    error,
    busy,
    busyMsg,
    openInventoryFile,
    homeInventorySort
})