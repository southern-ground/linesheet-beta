/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';
import {title, html} from './index.md';
import store from '../../src/store';
import {
    ERROR_SKU,
    ERROR_NAME,
    ERROR_CATEGORY,
    GET_INVENTORY,
    UPDATE_ITEM
} from '../constants';
import Link from '../../components/Link';

class EditPage extends React.Component {

    constructor(props) {

        super(props);

        this.updateItem = this.updateItem.bind(this);
        this.updateProps = this.updateProps.bind(this);

        var appState = store.getState();

        this.state = {
            sku: this.props.route.params.id,
            inventory: appState.inventory,
            categories: appState.categories
        };

    }

    componentWillMount() {
        document.title = title;
        this.unsubscribeFunciton = store.subscribe(this.updateProps);
    }

    componentDidMount() {
        if (this.state.categories.length === 0 || this.state.inventory.length === 0) {
            store.dispatch({type: GET_INVENTORY});
            this.setState({busy: true});
        }
    }

    componentWillUnmount() {
        this.unsubscribeFunciton();
    }

    updateItem() {
        console.log('EditPage::updateItem');

    }

    updateProps() {
        console.log('EditPage::updateProps');
        this.setState({
            ...this.state,
            inventory: store.getState().inventory,
            categories: store.getState().categories
        });
    }

    render() {

        var sku = this.state.sku,
            item = this.state.inventory.filter((item) => {
                    return item.sku === sku;
                }).pop() || {
                    "sku": "",
                    "name": "",
                    "wholesale": "",
                    "msrp": ""
                };

        return (
            <Layout className={s.content}>
                <section>

                    <div dangerouslySetInnerHTML={{__html: html}}/>

                    <form onSubmit={this.updateItem}>
                        <ul className={s.formItems}>
                            <li>
                                <label htmlFor="Item_SKU">SKU</label>
                                <input
                                    type="text"
                                    id="Item_SKU"
                                    name="item_sku"
                                    placeholder="SKU"
                                    ref="itemSKU"
                                    className={this.state.error === ERROR_SKU ? s.error__input : ""}
                                    defaultValue={item.sku}
                                />
                            </li>
                            <li>
                                <label htmlFor="Item_Name">Item Name</label>
                                <input
                                    type="text"
                                    id="Item_Name"
                                    name="item_name"
                                    placeholder="Item Name"
                                    ref="itemName"
                                    className={this.state.error === ERROR_NAME ? s.error__input : ""}
                                    defaultValue={item.name}
                                />
                            </li>
                            <li>
                                <label htmlFor="Category_Name">Product Category</label>
                                <select id="Category_Name"
                                        name="category_name"
                                        ref="itemCategories"
                                        multiple>{
                                    this.state.categories.map((category, index) => {
                                        return (
                                            <option
                                                value={category.id}
                                                key={'cat-' + index}>{category.name}
                                            </option>);
                                    })}
                                </select>
                            </li>
                            <li>
                                <label htmlFor="Item_Wholesale">Wholesale Price </label>
                                <input type="text"
                                       id="Item_Wholesale"
                                       name="item_wholesale"
                                       placeholder="$0.00"
                                       ref="itemWholesalePrice"
                                       defaultValue={item.wholesale}
                                />
                            </li>
                            <li>
                                <label htmlFor="Item_MSRP">MSRP</label>
                                <input
                                    type="text"
                                    id="Item_MSRP"
                                    name="item_msrp"
                                    placeholder="$0.00"
                                    ref="itemMSRP"
                                    defaultValue={item.msrp}
                                />
                            </li>
                            <li className={s.as__row + " " + s.align__right}>

                                <Link to="#"
                                      className={
                                          s.button + " " +
                                          s.button__save + " " +
                                          s.formSubmit + " " +
                                          s.button__group
                                      }
                                      onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          this.updateItem();
                                      }}>Update Item</Link>

                                <Link to={'/'}
                                      className={
                                          s.button + " " +
                                          s.button__cancel + " " +
                                          s.button__group}>
                                    Cancel
                                </Link>
                            </li>
                            <li>
                                <p className={s.error__message}>{this.state.itemErrorText}</p>
                            </li>
                        </ul>
                    </form>

                </section>
            </Layout >
        );
    }

}

export default EditPage;
