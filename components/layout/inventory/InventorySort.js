/**
 * Created by fst on 2/21/17.
 */
import React, {PropTypes} from 'react';
import {
    SORT_SKU,
    SORT_NAME,
    SORT_HOME_INVENTORY_ON
} from '../../../src/constants';
import s from './InventorySort.css';
import store from '../../../src/store';
import Link from '../../Link';
export default class InventorySort extends React.Component {

    render() {

        var sortFields = [{name: "SKU", value: SORT_SKU}, {name: "Name", value: SORT_NAME}],
            currentSort = store.getState().homeInventorySort;

        return <div className={s.sortGroup}>
            <span className={s.sortLabel}>Sort On:</span>
            {
                sortFields.map((item, index) => {
                    return <Link
                        className={
                            s.sortField + " " +
                            (item.value === currentSort ? s.active : "")
                        }
                        to="#"
                        key={"field_" + index}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            store.dispatch({
                                type: SORT_HOME_INVENTORY_ON,
                                sortOn: item.value
                            });
                        }}
                    >
                        {item.name}
                    </Link>
                })
            }
        </div>
    }
}