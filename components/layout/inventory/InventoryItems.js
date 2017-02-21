import React, {PropTypes} from 'react';
import s from './InventoryItems.css';
import i from './InventoryItems.css';
import {
    DELETE_ITEM,
    GET_INVENTORY,
    ITEM_IMAGE_PATH,
    SELECT_ALL_INVENTORY_ITEMS,
    SORT_HOME_INVENTORY_ON,
    SORT_SKU,
    SORT_NAME,
    SORT_WHOLESALE,
    SORT_MSRP
} from '../../../src/constants';
import store from '../../../src/store';
import InventorySort from './InventorySort';
import InventoryItem from './InventoryItem';
import InventoryItemCategories from './InventoryItemCategories';

class InventoryItems extends React.Component {

    static propTypes = {
        // articles: PropTypes.array.isRequired,
    };

    constructor(props) {

        super(props);

        // TODO: Weed this list ... seems long.
        this.refreshInventory = this.refreshInventory.bind(this);
        this.renderLoading = this.renderLoading.bind(this);
        this.renderInventory = this.renderInventory.bind(this);
        this.renderPrompt = this.renderPrompt.bind(this);
        this.onDeleteItem = this.onDeleteItem.bind(this);
        this.sortOn = this.sortOn.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
        this.getSortedInventory = this.getSortedInventory.bind(this);

        this.state = {
            loading: true,
            selectAll: false
        };

    }

    getSortedInventory() {
        var inventory = this.props.inventory,
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
        store.dispatch({
            type: DELETE_ITEM,
            sku: id
        });
    }

    refreshInventory() {
        store.dispatch({type: GET_INVENTORY, refresh: true});
        this.setState({...this.state, loading: true});
    }

    renderInventory() {

        return (

            <div>

                <InventorySort/>
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

    renderLoading() {
        return (<span>Loading &#133;</span>);
    }

    renderPrompt() {
        return (<div className={s.inventoryPrompt}>
            <p>
                <span className={s.generic__error}>Error:</span> There doesn't appear to be any inventory in the system.
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

    toggleForm(e) {
        e.preventDefault();
        e.stopPropagation();
        store.dispatch({
            type: TOGGLE_ADD_ITEM_FORM,
            value: true
        })
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
            </section>
        );
    }

}

export default InventoryItems;