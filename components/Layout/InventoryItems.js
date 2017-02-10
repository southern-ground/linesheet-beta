import React, {PropTypes} from 'react';
import s from './InventoryItems.css';
import {
    DELETE_ITEM,
    GET_INVENTORY,
    OPEN_FORM,
    SORT_HOME_INVENTORY_ON,
    SORT_SKU,
    SORT_NAME,
    SORT_WHOLESALE,
    SORT_MSRP
} from '../../src/constants';
import store from '../../src/store';
import Inventory from './Inventory';

class InventoryItems extends React.Component {

    static propTypes = {
        // articles: PropTypes.array.isRequired,
    };

    constructor(props) {

        super(props);

        this.refreshInventory = this.refreshInventory.bind(this);
        this.renderLoading = this.renderLoading.bind(this);
        this.renderInventory = this.renderInventory.bind(this);
        this.renderPrompt = this.renderPrompt.bind(this);
        this.onDeleteItem = this.onDeleteItem.bind(this);
        this.sortOn = this.sortOn.bind(this);
        this.toggleForm = this.toggleForm.bind(this);

        this.state = {
            loading: true
        };

    }

    onDeleteItem(id) {
        store.dispatch({
            type: DELETE_ITEM,
            sku: id
        });
    }

    refreshInventory() {
        console.log('InventoryItems::refreshInventory');
        store.dispatch({type: GET_INVENTORY, refresh: true});
        this.setState({...this.state, loading: true});
    }

    renderInventory() {

        return (<div className={s.table + " " + s.itemTable}>

            <div className={s.table_row}>
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

            {this.props.inventory.map((item, index) => {
                return (<Inventory
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
        return (<div>
            <p>
                <span className={s.generic__error}>Error:</span> There doesn't appear to be any inventory in the system.
            </p>
            <p>
                You can add some by clicking "Add an Item" above, or clicking <a href="#" onClick={this.toggleForm}>here</a>.
            </p>
        </div>);
    }

    sortOn(which) {
        switch (which) {
            case SORT_SKU:
                this.setState({
                    inventory: this.props.inventory.sort((a, b) => {
                        return a.sku.toUpperCase() > b.sku.toUpperCase() ? 1 : -1;
                    })
                });
                break;
            case SORT_NAME:
                this.setState({
                    inventory: this.props.inventory.sort((a, b) => {
                        return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
                    })
                });
                break;
            case SORT_WHOLESALE:
                this.setState({
                    inventory: this.props.inventory.sort((a, b) => {
                        return parseFloat(a.wholesale) > parseFloat(b.wholesale) ? 1 : -1;
                    })
                });
                break;
            case SORT_MSRP:
                this.setState({
                    inventory: this.props.inventory.sort((a, b) => {
                        return parseFloat(a.msrp) > parseFloat(b.msrp) ? 1 : -1;
                    })
                });
                break;
        }
    }

    toggleForm(e){
        e.preventDefault();
        e.stopPropagation();
        store.dispatch({
            type: OPEN_FORM
        })
    }

    render() {
        return (
            <section>
                <h3>Current Items</h3>
                <div className={s.inventoryNav} >
                    <button onClick={this.refreshInventory} className={s.button + " " + s.button__cancel}>Reload Inventory</button>
                </div>
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