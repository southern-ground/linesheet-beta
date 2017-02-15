import React, {PropTypes} from 'react';
import s from './InventoryItems.css';
import {
    DELETE_ITEM,
    GET_INVENTORY,
    SELECT_ALL_INVENTORY_ITEMS,
    SORT_HOME_INVENTORY_ON,
    SORT_SKU,
    SORT_NAME,
    SORT_WHOLESALE,
    SORT_MSRP
} from '../../src/constants';
import store from '../../src/store';
import InventoryItem from './InventoryItem';

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
            selectAll:false
        };

    }

    getSortedInventory(){
        console.log('getSortedInventory', this.props);
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

        return (<div className={s.table + " " + s.itemTable}>
            <div className={s.table_row}>
                <div className={s.table_cell + " " + s.table_header}>
                    <input
                        type="checkbox"
                        onChange={(e)=>{
                            store.dispatch({
                                type: SELECT_ALL_INVENTORY_ITEMS,
                                value: !this.state.selectAll
                            });
                            this.setState({
                                selectAll: !this.state.selectAll
                            });
                        }}
                        checked={
                            this.state.selectAll
                        }
                    />
                </div>
                <div className={s.table_cell + " " + s.table_header}>
                    <a href="#"
                       onClick={(e) => {
                           e.preventDefault();
                           e.stopPropagation();
                           this.sortOn(SORT_SKU);
                       }}>SKU</a>
                </div>
                <div className={s.table_cell + " " + s.table_header}>
                    <a href="#"
                       onClick={(e) => {
                           e.preventDefault();
                           e.stopPropagation();
                           this.sortOn(SORT_NAME)
                       }}>Name</a>
                </div>
                <div className={s.table_cell + " " + s.table_header}>
                    Image
                </div>
                <div className={s.table_cell + " " + s.table_header}>
                    <a href="#"
                       onClick={(e) => {
                           e.preventDefault();
                           e.stopPropagation();
                           this.sortOn(SORT_WHOLESALE);
                       }}>Wholesame</a>
                </div>
                <div className={s.table_cell + " " + s.table_header}>
                    <a href="#"
                       onClick={(e) => {
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
            {this.getSortedInventory().map((item, index) => {
                return (<InventoryItem
                    selected={item.selected || false}
                    sku={item.sku}
                    name={item.name}
                    wholesale={item.wholesale}
                    msrp={item.msrp}
                    categories={(item.categories || "").split(",")}
                    allCategories={store.getState().categories}
                    key={"inventory-" + index}
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

    toggleForm(e){
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