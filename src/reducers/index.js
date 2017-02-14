/**
 * Created by fst on 2/14/17.
 */
import { combineReducers } from 'redux'
import inventory from './inventory';
import categories from './categories';
import initialized from './initialized';
import error from './error';
import busy from './busy';
import busyMsg from './busyMsg';
import openInventoryFile from './openInventoryFile';

export default combineReducers({
    inventory,
    categories,
    initialized,
    error,
    busy,
    busyMsg,
    openInventoryFile
})