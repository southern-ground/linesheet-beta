/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, {PropTypes} from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';
import {title, html} from './index.md';
import {
    DELETE_ITEM,
    GET_INVENTORY
} from '../constants';
import store from '../store';
import Link from '../../components/Link';
import Inventory from '../../components/Layout/Inventory';

const SORT_SKU = "sort-sku";
const SORT_NAME = "sort-name";
const SORT_WHOLESALE = "sort-wholesale";
const SORT_MSRP = "sort-msrp";

class HomePage extends React.Component {

    static propTypes = {
        // articles: PropTypes.array.isRequired,
    };

    constructor(props) {

        super(props);

        this.refreshInventory = this.refreshInventory.bind(this);

        this.renderLoading = this.renderLoading.bind(this);
        this.renderInventory = this.renderInventory.bind(this);
        this.renderPrompt = this.renderPrompt.bind(this);

        this.onEditItem = this.onEditItem.bind(this);
        this.onDeleteItem = this.onDeleteItem.bind(this);

        this.updateProps = this.updateProps.bind(this);

        this.sortOn = this.sortOn.bind(this);

        var appState = store.getState(),
            localState = {inventory: [], loading: true};

        this.state = {
            ...localState,
            inventory: appState.inventory,
            loading: !appState.cookieLoaded,
            categories: appState.categories
        };

    }

    componentWillMount() {

        this.unsubscribeFunciton = store.subscribe(this.updateProps);

        document.title = title;

    }

    componentDidMount() {

        document.title = title;

        var appState = store.getState(),
            localState = {inventory: [], loading: true};

        if (!appState.cookieLoaded) {
            store.dispatch({type: GET_INVENTORY});
        }

    }

    componentWillUnmount() {

        this.unsubscribeFunciton();

    }

    onEditItem(id) {
        console.log('HomePage::onEditItem', id);
    }

    onDeleteItem(id) {
        console.log('HomePage::onDeleteItem', id);
        store.dispatch({
            type: DELETE_ITEM,
            sku: id
        });
    }

    sortOn(which){
        switch(which){
            case SORT_SKU:
                this.setState({inventory:this.state.inventory.sort((a,b)=>{
                    return a.sku.toUpperCase() > b.sku.toUpperCase() ? 1 : -1;
                })});
                break;
            case SORT_NAME:
                this.setState({inventory:this.state.inventory.sort((a,b)=>{
                    return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
                })});
                break;
            case SORT_WHOLESALE:
                this.setState({inventory:this.state.inventory.sort((a,b)=>{
                    return parseFloat(a.wholeSale) > parseFloat(b.wholeSale) ? 1 : -1;
                })});
                break;
            case SORT_MSRP:
                this.setState({inventory:this.state.inventory.sort((a,b)=>{
                    return parseFloat(a.msrp) > parseFloat(b.msrp) ? 1 : -1;
                })});
                break;
        }
    }

    updateProps() {

        console.log('Home::updateProps');

        var appState = store.getState(),
            categories = appState.categories.sort((a, b) => {
                return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
            });

        this.setState({
            ...this.state,
            loading: false,
            inventory: appState.inventory,
            categories: categories
        });

    }

    refreshInventory() {
        console.log('Home::refreshInventory');
        store.dispatch({type: GET_INVENTORY, refresh: true})
        this.setState({...this.state, loading: true});
    }

    renderInventory() {

        return (<div className={s.table}>

            <div className={s.table_row}>
                <div className={s.table_cell + " " + s.table_header}>
                    <a href="#"
                       onClick={(e)=>{
                        e.preventDefault();
                        e.stopPropagation();
                        this.sortOn(SORT_SKU);
                    }}>SKU</a>
                </div>
                <div className={s.table_cell + " " + s.table_header}>
                    <a href="#"
                       onClick={(e)=>{
                        e.preventDefault();
                        e.stopPropagation();
                        this.sortOn(SORT_NAME)
                    }}>Name</a>
                </div>
                <div className={s.table_cell + " " + s.table_header}>
                    <a href="#"
                       onClick={(e)=>{
                        e.preventDefault();
                        e.stopPropagation();
                        this.sortOn(SORT_WHOLESALE);
                    }}>Wholesame</a>
                </div>
                <div className={s.table_cell + " " + s.table_header}>
                    <a href="#"
                       onClick={(e)=>{
                        e.preventDefault();
                        e.stopPropagation();
                        this.sortOn(SORT_MSRP);
                    }}>MSRP</a>
                </div>
                <div className={s.table_cell + " " + s.table_header}>
                    Categories
                </div>
                <div className={s.table_cell + " " + s.table_header}>
                    Edit/Delete
                </div>
            </div>

            {this.state.inventory.length === 0
                ?
                this.renderPrompt()
                :
                this.state.inventory.map((item, index) => {
                    return (<Inventory
                        sku={item.sku}
                        name={item.name}
                        wholesale={item.wholeSale}
                        msrp={item.msrp}
                        categories={(item.categories || "").split(",")}
                        allCategories={store.getState().categories}
                        key={"inventory-" + index}
                        onDelete={(id) => {
                            this.onDeleteItem(id);
                        }}
                        onEdit={(id) => {
                            this.onEditItem(id);
                        }}/>)
                })
            }
        </div>);
    }

    renderLoading() {
        return (<span>Loading &#133;</span>);
    }

    renderPrompt() {
        return (<div>
            <p>
                <span className={s.generic__error}>Error:</span> There doesn't appear to be any inventory in the system.
            </p>
            <p>
                You can add some by clicking "ADD" at the top of the page, or clicking <Link to="add">here</Link>.
            </p>
        </div>);
    }

    render() {
        return (
            <Layout className={s.content}>

                <section>
                    <div dangerouslySetInnerHTML={{__html: html}}/>
                </section>

                <section>
                    <div className={s.align__right}>
                        <button onClick={this.refreshInventory} disabled={this.state.loading}>Refresh Inventory</button>
                    </div>
                    <div className={s.inventory_list} ref="inventory">
                        { this.state.loading ?
                            this.renderLoading()
                            :
                            this.state.inventory.length === 0 ?
                                this.renderPrompt()
                                :
                                this.renderInventory() }
                    </div>
                </section>

            </Layout>
        );
    }

}

export default HomePage;
