/**
 * Created by fst on 2/1/17.
 */

import {
    createStore
} from 'redux';

import reducer from './reducers/index';

const store = createStore(reducer);

export default store;
