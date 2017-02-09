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

import CategorySelect from '../../components/Layout/CategorySelect';

import Link from '../../components/Link';

const SKU_FIELD_REF = "itemSKU";
const NAME_FIELD_REF = "itemName";
const CATEGORIES_FIELD_REF = "itemCategories";
const WHOLESALE_FIELD_REF = "itemWholesale";
const MSRP_FIELD_REF = "itemMSRP";

class EditPage extends React.Component {

    constructor(props) {

        super(props);

        this.updateItem = this.updateItem.bind(this);
        this.updateProps = this.updateProps.bind(this);

        var appState = store.getState();

        this.state = {
            initialized: false,
            item: {
                sku: this.props.route.params.id,
                name: "",
                categories: [],
                wholesale: "",
                msrp: ""
            },
            error: "",
            errorText: "",
            inventory: appState.inventory || [],
            categories: appState.categories || []
        };

    }

    componentWillMount() {
        this.unsubscribeFunciton = store.subscribe(this.updateProps);
    }

    componentDidMount() {
        document.title = title;
        if (this.state.inventory.length == 0) {
            store.dispatch({type: GET_INVENTORY});
            this.setState({busy: true, busyMsg: "Refreshing Inventory"});
        } else {
            this.updateProps();
        }
    }

    componentWillUnmount() {
        this.unsubscribeFunciton();
    }

    getCategories() {
        var checkboxes = this.refs[CATEGORIES_FIELD_REF].getElementsByTagName('input'),
            itemCategories = new Array();

        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == 'checkbox') {
                if (checkboxes[i].checked) {
                    itemCategories.push(checkboxes[i].getAttribute('data-id'));
                }
            }
        }

        return itemCategories;
    }

    updateField(ref) {

        var item = this.state.item;

        switch (ref) {
            case SKU_FIELD_REF:
                item.sku = this.refs[ref].value;
                break;
            case NAME_FIELD_REF:
                item.name = this.refs[ref].value;
                break;
            case WHOLESALE_FIELD_REF:
                item.wholesale = this.refs[ref].value;
                break;
            case MSRP_FIELD_REF:
                item.msrp = this.refs[ref].value;
                break;
        }

        item.categories = this.getCategories();

        this.setState({
            item: item
        });

    }

    updateItem(e) {

        e.preventDefault();

        var item = {
                sku: this.state.item.sku,
                name: this.refs[NAME_FIELD_REF].value || '',
                categories: this.getCategories().join(','),
                wholesale: this.refs[WHOLESALE_FIELD_REF].value || 0,
                msrp: this.refs[MSRP_FIELD_REF].value || 0
            },
            newState = {
                error: '',
                itemErrorText: ''
            };

        if (item.sku.length === 0) {
            newState.error = ERROR_SKU;
            newState.itemErrorText = "Please enter a valid sku";
        } else if (item.name.length === 0) {
            newState.error = ERROR_NAME;
            newState.itemErrorText = "Please enter a valid name";
        }

        if (newState.error.length) {
            this.setState(newState);
        } else {

            console.log(item);
            return;
            store.dispatch({
                type: UPDATE_ITEM,
                item: item
            });
        }

    }

    toggleCategory(id){
        var item = this.state.item,
            categories = this.state.item.categories,
            index = categories.indexOf(id);

        if(index == -1){
            categories.push(id);
        }else{
            categories.splice(index, 1)
        }
        item.categories = categories;
        this.setState({
            item: item
        });

    }

    updateProps() {
        var appState = store.getState(),
            filteredInventory = (appState.inventory || []).filter((inventoryItem) => {
                return inventoryItem.sku === this.state.item.sku
            }),
            currentItem;
        if (filteredInventory.length > 0) {
            currentItem = filteredInventory.pop();
            this.setState({
                ...this.state,
                item: {
                    ...currentItem,
                    categories: currentItem.categories.split(',') || []
                },
                categories: appState.categories || [],
                inventory: appState.inventory || [],
                busy: false
            });
        } else {
            this.setState({
                ...this.state,
                categories: appState.categories || [],
                inventory: appState.inventory || []
            });
        }
    }

    render() {

        return (
            <Layout className={s.content}>
                <section>
                    <div dangerouslySetInnerHTML={{__html: html}}/>
                </section>
                <section>
                    <form onSubmit={this.updateItem}>
                        <ul className={s.formItems}>
                            <li>
                                <label htmlFor="Item_SKU">SKU</label>
                                <input
                                    type="text"
                                    id="Item_SKU"
                                    name="item_sku"
                                    placeholder="SKU"
                                    ref={SKU_FIELD_REF}
                                    className={this.state.error === ERROR_SKU ? s.error__input : ""}
                                    value={this.state.item.sku}
                                    disabled
                                    onChange={(e) => {
                                        this.updateField(SKU_FIELD_REF);
                                    }}
                                />
                            </li>
                            <li>
                                <label htmlFor="Item_Name">Item Name</label>
                                <input
                                    type="text"
                                    id="Item_Name"
                                    name="item_name"
                                    placeholder="Item Name"
                                    ref={NAME_FIELD_REF}
                                    className={this.state.error === ERROR_NAME ? s.error__input : ""}
                                    value={this.state.item.name}
                                    onChange={(e) => {
                                        this.updateField(NAME_FIELD_REF);
                                    }}
                                />
                            </li>
                            <li>
                                <label htmlFor="Category_Name">Product Category</label>
                                <div ref={CATEGORIES_FIELD_REF}>
                                    {
                                        (this.state.categories || []).map((category, index) => {
                                            return <CategorySelect
                                                id={category.id}
                                                name={category.name}
                                                index={index}
                                                key={"category-" + index}
                                                checked={(this.state.item.categories || [])
                                                    .filter(catId => {
                                                        return catId === category.id
                                                    })
                                                    .length > 0}
                                                change={(e, id) => {
                                                    this.toggleCategory(id);
                                                }}
                                            />
                                        })
                                    }
                                </div>
                            </li>
                            <li>
                                <label htmlFor="Item_Wholesale">Wholesale Price </label>
                                <input type="text"
                                       id="Item_Wholesale"
                                       name="item_wholesale"
                                       placeholder="$0.00"
                                       ref={WHOLESALE_FIELD_REF}
                                       value={this.state.item.wholesale}
                                       onChange={(e) => {
                                           this.updateField(WHOLESALE_FIELD_REF);
                                       }}
                                />
                            </li>
                            <li>
                                <label htmlFor="Item_MSRP">MSRP</label>
                                <input
                                    type="text"
                                    id="Item_MSRP"
                                    name="item_msrp"
                                    placeholder="$0.00"
                                    ref={MSRP_FIELD_REF}
                                    value={this.state.item.msrp}
                                    onChange={(e) => {
                                        this.updateField(MSRP_FIELD_REF);
                                    }}
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
                                      onClick={this.updateItem}>Update Item</Link>
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
            </Layout>
        );
    }

}

export default EditPage;
