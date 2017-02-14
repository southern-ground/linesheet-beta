import {
    createStore
} from 'redux';

/*
 * TODO: Add image support
 * TODO: Get selections working
 * TODO: Hook up saving
 * TODO: Save send to PDF
 */

import reducer from './reducers/index';

const store = createStore(reducer);

export default store;
