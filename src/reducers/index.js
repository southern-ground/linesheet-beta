/**
 * Created by fst on 2/14/17.
 */
import { combineReducers } from 'redux'
import inventory from './inventory';
import categories from './categories';
import imagesInitialized from './imagesInitialized';
import images from './images';
import openImageOverlay from './OpenImageOverlay';
import inventoryInitialized from './inventoryInitialized';
import error from './error';
import busy from './busy';
import busyMsg from './busyMsg';
import openInventoryFile from './openInventoryFile';
import homeInventorySort from './homeInventorySort';

export default combineReducers({
    inventory,
    inventoryInitialized,
    categories,
    images,
    openImageOverlay,
    imagesInitialized,
    error,
    busy,
    busyMsg,
    openInventoryFile,
    homeInventorySort
})