/**
 * Created by fst on 2/16/17.
 */

import React, {PropTypes} from 'react';
import s from './InventoryItems.css';
import {
    DELETE_ITEM,
    SORT_HOME_INVENTORY_ON,
    SORT_SKU,
    SORT_NAME,
    SORT_WHOLESALE,
    SORT_MSRP
} from '../../../src/constants';
import store from '../../../src/store';
import InventorySort from './InventorySort';
import InventorySearch from './InventorySearch';
import InventoryItem from './InventoryItem';
import InventoryItemCategories from './InventoryItemCategories';

class InventoryItems extends React.Component {

    constructor(props) {

        super(props);

        this.renderInventory = this.renderInventory.bind(this);
        this.renderPrompt = this.renderPrompt.bind(this);
        this.onDeleteItem = this.onDeleteItem.bind(this);
        this.sortOn = this.sortOn.bind(this);
        this.getSortedInventory = this.getSortedInventory.bind(this);
        this.filterInventory = this.filterInventory.bind(this);

        this.state = {
            loading: true,
            selectAll: false,
            filterText: '',
            filterOnSelected: false,
            itemToDelete: ''
        };

    }

    filterInventory(arr) {

        var name, sku, s = this.state.filterText.toLowerCase();

        if (s === '') {
            return arr;
        } else {
            if(this.state.filterOnSelected){
                return arr.filter(item=>{
                    return item.selected;
                });
            }
            return arr.filter(item => {
                name = item.name.toLowerCase();
                sku = item.sku.toLowerCase();
                return (name.indexOf(s) > -1 || sku.indexOf(s) > -1);
            });
        }
    }

    getSortedInventory() {
        var inventory = this.filterInventory(this.props.inventory.slice(0)),
            sortOn = this.props.sortOn;

        switch (sortOn) {
            case SORT_SKU:
                return inventory.sort((a, b) => {
                    return a.sku.toUpperCase() > b.sku.toUpperCase() ? 1 : -1;
                });
                break;
            case SORT_NAME:
                return inventory.sort((a, b) => {
                    return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
                });
                break;
            case SORT_WHOLESALE:
                return inventory.sort((a, b) => {
                    return parseFloat(a.wholesale) > parseFloat(b.wholesale) ? 1 : -1;
                });
                break;
            case SORT_MSRP:
                return inventory.sort((a, b) => {
                    return parseFloat(a.msrp) > parseFloat(b.msrp) ? 1 : -1;
                });
                break;
            default:
                return inventory;
        }
    }

    onDeleteItem(id) {
        this.setState({itemToDelete: id});
        this.refs.deleteModal.classList.toggle(s.hidden);
    }

    renderInventory() {

        return (

            <div>

                <div className={s.inventoryControls}>
                    <InventorySort/>
                    <InventorySearch
                        filterFunc={s => {
                            this.setState({
                                filterText: s
                            });
                        }}
                        filterOnSelectedFunc={s=>{
                            this.setState({
                                filterOnSelected: s
                            });
                        }}
                    />
                </div>

                <InventoryItemCategories
                    cateogories={this.props.categories}/>

                {this.getSortedInventory().map((item, index) => {
                    return (<InventoryItem
                        selected={item.selected || false}
                        itemProps={item}
                        allCategories={store.getState().categories}
                        key={"inventory-" + index}
                        flexy={true}
                        onDelete={(id) => {
                            this.onDeleteItem(id);
                        }}/>)
                })}
            </div>);
    }

    renderPrompt() {
        return (<div className={s.inventoryPrompt}>
            <p>
                <span className={s.genericError}>Error:</span> There doesn't appear to be any inventory in the system.
            </p>
            <p>
                You can add some by clicking "Add Item" above.
            </p>
        </div>);
    }

    sortOn(which) {
        store.dispatch({
            type: SORT_HOME_INVENTORY_ON,
            sortOn: which
        });
    }

    render() {
        return (
            <section>
                {
                    this.props.inventory && this.props.inventory.length === 0
                        ?
                        this.renderPrompt()
                        :
                        this.renderInventory()
                }

                <div
                    className={s.overlay + " " + s.hidden}
                    ref="deleteModal">
                    <div
                        className={s.modal}>
                        <span>Are you sure you want to delete item <strong>#{this.state.itemToDelete}</strong></span>
                        <div>
                            <button
                                className={s.button + " " + s.buttonDelete}
                                onClick={e => {
                                    store.dispatch({
                                        type: DELETE_ITEM,
                                        sku: this.state.itemToDelete
                                    });
                                    this.refs.deleteModal.classList.toggle(s.hidden);
                                    this.setState({
                                        itemToDelete: ""
                                    });
                                }}>
                                Yes
                            </button>
                            <button
                                className={s.button + " " + s.buttonCancel}
                                onClick={e => {
                                    this.refs.deleteModal.classList.toggle(s.hidden);
                                }}>
                                No
                            </button>
                        </div>
                    </div>
                </div>
            </section>

        );
    }

}

export default InventoryItems;