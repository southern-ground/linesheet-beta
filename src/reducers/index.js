/**
 * Created by fst on 2/14/17.
 */

import { combineReducers } from 'redux'
import inventory from './inventory';
import categories from './categories';
import imageStore from './images';
import inventoryInitialized from './inventoryInitialized';
import selectedCategories from './selectedCategories';
import savedFileStore from './savedFiles';
import error from './error';
import busy from './busy';
import busyMsg from './busyMsg';
import openInventoryFile from './openInventoryFile';
import homeInventorySort from './homeInventorySort';
import xlsx from './xlsx';

export default combineReducers({
    savedFileStore,
    selectedCategories,
    inventory,
    inventoryInitialized,
    categories,
    imageStore,
    error,
    busy,
    busyMsg,
    openInventoryFile,
    homeInventorySort,
    xlsx
})