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

class AddPage extends React.Component {

    constructor(props) {
        super(props);
        this.addItem = this.addItem.bind(this);
        this.addCategory = this.addCategory.bind(this);
    }

    addItem(e) {
        e.preventDefault();
        console.log('AddPage::addItem');
    }

    addCategory(e) {
        e.preventDefault();
        console.log('AddPage::addCategory');
    }

    componentDidMount() {
        document.title = title;
    }

    render() {
        return (
            <Layout className={s.content}>
                <section>
                    <div dangerouslySetInnerHTML={{__html: html}}/>
                </section>
                <section>
                    <h2>Items</h2>
                    <form onSubmit={this.addItem}>
                        <ul className={s.formItems}>
                            <li>
                                <label htmlFor="Item_SKU">SKU</label> <input type="text" id="Item_SKU" name="item_sku"
                                                                             placeholder="SKU"/>
                            </li>
                            <li>
                                <label htmlFor="Item_Name">Item Name</label> <input type="text" id="Item_Name"
                                                                                    name="item_name"
                                                                                    placeholder="Item Name"/>
                            </li>
                            <li>
                                <label htmlFor="Item_Wholesale">Wholesale Price </label> <input type="text"
                                                                                                id="Item_Wholesale"
                                                                                                name="item_wholesale"
                                                                                                placeholder="$0.00"/>
                            </li>
                            <li>
                                <label htmlFor="Item_MSRP">MSRP</label> <input type="text" id="Item_MSRP"
                                                                               name="item_msrp" placeholder="$0.00"/>
                            </li>
                            <li>
                                <input className={s.formSubmit} type="submit" value="Add Item" onClick={this.addItem}/>
                            </li>
                        </ul>
                    </form>
                </section>
                <section>
                    <h2>Categories</h2>
                    <form onSubmit={this.addCategory}>
                        <ul className={s.formItems}>
                            <li>
                                <label htmlFor="Category_Name">Category Name</label> <input type="text"
                                                                                            id="Category_Name"
                                                                                            name="category_name"
                                                                                            placeholder="Category"/>
                            </li>
                            <li>
                                <input className={s.formSubmit} type="submit" value="Add Category"
                                       onClick={this.addCategory}/>
                            </li>
                        </ul>
                    </form>
                </section>
            </Layout >
        );
    }

}

export default AddPage;
