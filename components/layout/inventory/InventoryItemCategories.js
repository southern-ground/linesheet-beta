/**
 * Created by fst on 2/15/17.
 */

import React, {PropTypes} from 'react';
import {
    SELECT_CATEGORY
} from '../../../src/constants';
import s from './InventoryItemCategories.css';
import store from '../../../src/store';
import InventoryItemCategory from './InventoryItemCategory';

export default class InventoryItemCategories extends React.Component {

    static propTypes = {
        cateogories: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        return <div className={s.categorySelection}>
            <span className={s.categoriesLabel}>Select Items By Category:</span>
            <ul className={s.categoriesList}>
                {
                    this.props.cateogories.map((category, index) => {
                        return <InventoryItemCategory
                            elementId={'category-' + index}
                            categoryId={category.id}
                            categoryName={ category.name }
                            key={'category-' + index}
                            onChange={(id) => {
                                store.dispatch({
                                    type: SELECT_CATEGORY,
                                    categoryId: id,
                                    value: document.getElementById('category-' + index).checked
                                });
                            }}/>
                    })
                }

            </ul>
        </div>
    }
}