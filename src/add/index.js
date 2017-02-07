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
import store from '../store';
import {
    ADD_CATEGORY,
    DELETE_CATEGORY,
    EDIT_CATEGORY,
    GET_CATEGORIES,
    ADD_ITEM,
    ERROR_CATEGORY,
    ERROR_NAME,
    ERROR_SKU
} from '../constants';
import Category from '../../components/Layout/Category';

class AddPage extends React.Component {

    constructor(props) {

        super(props);

        this.addItem = this.addItem.bind(this);
        this.addCategory = this.addCategory.bind(this);
        this.editCategory = this.editCategory.bind(this);
        this.updateProps = this.updateProps.bind(this);

        var appState = store.getState(),
            localState = {categories: [], busy: false, loaded: false, error: '', errorText: ''};

        this.state = {...localState, categories: appState.categories || []};

    }

    selectedCategories() {
        var categories = [];
        var options = this.refs.itemCategories.options;
        for (var i = 0; i < options.length; i++) {
            if (options[i].selected) {
                categories.push(options[i].value);
            }
        }
        return categories;
    }

    addItem(e) {

        e.preventDefault();

        console.log('AddPage::addItem');

        var newItem = {
                sku: this.refs.itemSKU.value || '',
                name: this.refs.itemName.value || '',
                wholeSale: this.refs.itemWholesalePrice.value || 0,
                categories: this.selectedCategories(),
                msrp: this.refs.itemMSRP.value || 0
            },
            newState = {
                error: '',
                itemErrorText: ''
            };

        if (newItem.sku.length === 0) {
            // Error.
            newState.error = ERROR_SKU;
            newState.itemErrorText = "Please enter a valid sku";
        } else if (newItem.name.length === 0) {
            newState.error = ERROR_NAME;
            newState.itemErrorText = "Please enter a valid name";
        }

        if (newState.error.length) {
            this.setState(newState);
        } else {
            store.dispatch({
                type: ADD_ITEM,
                item: newItem
            });

            this.refs.itemSKU.value = '';
            this.refs.itemName.value = '';
            this.refs.itemWholesalePrice.value = '';
            this.refs.itemMSRP.value = '';
            for(var i = 0; i < this.refs.itemCategories.options.length; i++){
                this.refs.itemCategories.options[i].selected = false;
            }
            this.setState(newState);
        }

    }

    addCategory(e) {

        e.preventDefault();

        console.log('AddPage::addCategory');

        var newCategory = this.refs.category.value || '';

        if (newCategory.length === 0) {
            this.setState({
                error: ERROR_CATEGORY,
                categoryErrorText: "Please enter a valid category name"
            });
        } else {
            this.setState({
                error: '',
                categoryErrorText: '',
                busy: true
            });
            store.dispatch({
                type: ADD_CATEGORY,
                category: newCategory
            });
        }

        this.refs.category.value = '';
    }

    editCategory(categoryId, categoryName) {
        store.dispatch({type: EDIT_CATEGORY, categoryId: categoryId, categoryName: categoryName});
    }

    removeCategory(categoryID) {
        store.dispatch({type: DELETE_CATEGORY, categoryID: categoryID});
    }

    componentWillMount() {
        document.title = title;
        this.unsubscribeFunciton = store.subscribe(this.updateProps);
    }

    componentDidMount() {
        if (this.state.categories.length === 0 && this.state.loaded === false) {
            store.dispatch({type: GET_CATEGORIES});
            this.setState({busy: true});
        }
    }

    componentWillUnmount() {

        this.unsubscribeFunciton();

    }

    updateProps() {
        var appState = store.getState();
        console.log(appState);
        this.setState({
            ...this.state, categories: appState.categories.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            }), busy: false, loaded: true
        });
    }

    render() {

        return (
            <Layout className={s.content}>

                <section>
                    <div dangerouslySetInnerHTML={{__html: html}}/>
                </section>
                <section>
                    <h2>Items</h2>
                    <h3>Add an Item</h3>
                    <form onSubmit={this.addItem}>
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
                                />
                            </li>
                            <li>
                                <input className={s.formSubmit} type="submit" value="Add Item"
                                       disabled={this.state.busy ? 'disabled' : ''} onClick={this.addItem}/>

                            </li>
                            <li>
                                <p className={s.error__message}>{this.state.itemErrorText}</p>
                            </li>
                        </ul>
                    </form>
                </section>
                <section>
                    <h2>Categories</h2>
                    <h3>Add A Category</h3>
                    <form onSubmit={this.addCategory}>
                        <ul className={s.formItems}>
                            <li>
                                <label htmlFor="Category_Name">Category Name</label>
                                <input type="text"
                                       id="Category_Name"
                                       name="category_name"
                                       placeholder="Category"
                                       ref="category"
                                       className={this.state.error === ERROR_CATEGORY ? s.error__input : ''}
                                />
                            </li>
                            <li>
                                <input className={s.formSubmit} type="submit" value="Add Category"
                                       disabled={this.state.busy ? 'disabled' : ''}
                                       onClick={this.addCategory}/>
                            </li>
                            <li>
                                <p className={s.error__message}>
                                    {this.state.categoryErrorText}
                                </p>
                            </li>
                        </ul>
                    </form>
                    <div>
                        <h3>Current Categories</h3>
                        <div className={s.category__list}>
                            {this.state.categories.map((category, index) => {
                                return <Category
                                    id={category.id}
                                    name={category.name}
                                    onDelete={(id) => {
                                        this.removeCategory(id)
                                    }}
                                    onEdit={(id, categoryName) => {
                                        this.editCategory(id, categoryName);
                                    }}
                                    key={'cat-' + index}
                                    className={index % 2 ? "even" : ""}/>
                            })}
                        </div>
                    </div>
                </section>
            </Layout >
        );
    }

}

export default AddPage;
