import React from 'react';
import s from './AddForm.css';
import store from '../../src/store';
import {
    ADD_ITEM,
    ERROR_NAME,
    ERROR_SKU,
    TOGGLE_ADD_ITEM_FORM,
    sanitizeProductName
} from '../../src/constants';
import CategorySelect from './CategorySelect';

class AddForm extends React.Component {

    constructor(props) {

        super(props);

        this.addItem = this.addItem.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
        this.toggleCategory = this.toggleCategory.bind(this);

        this.state = {
            categories: this.props.categories,
            itemCategories: [],
            busy: false,
            loaded: false,
            error: '',
            errorText: ''
        };

    }

    getCategories(){
        var checkboxes = this.refs.itemCategories.getElementsByTagName('input'),
            itemCategories = new Array();

        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == 'checkbox') {
                if(checkboxes[i].checked){
                    itemCategories.push(checkboxes[i].getAttribute('data-id'));
                }
            }
        }

        return itemCategories;
    }

    addItem(e) {

        e.preventDefault();

        var newItem = {
                sku: this.refs.itemSKU.value || '',
                name: sanitizeProductName(this.refs.itemName.value || ''),
                categories: this.getCategories(),
                wholesale: this.refs.itemWholesalePrice.value || 0,
                msrp: this.refs.itemMSRP.value || 0
            },
            newState = {
                error: '',
                itemErrorText: ''
            };

        if (newItem.sku.length === 0) {
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

            var checkboxes = this.refs.itemCategories.getElementsByTagName('input');

            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].type == 'checkbox') {
                    checkboxes[i].checked = false;
                }
            }

            this.setState(newState);
        }

        var checkboxes = this.refs.itemCategories.getElementsByTagName('input');

        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == 'checkbox') {
                if(checkboxes[i].checked){
                    itemCategories.push(checkboxes[i].getAttribute('data-id'));
                }
            }
        }

    }

    toggleCategory(id, checked){

        console.log(id,checked);

        var itemCategories = this.state.itemCategories;

        if(checked){
            if(itemCategories.indexOf(id) === -1){
                itemCategories.push(id);
            }else{
                console.warn('ID was already present in the item categories when trying to add');
            }
        }else{
            itemCategories.splice(itemCategories.indexOf(id), 1);
        }

        this.setState({
            itemCategories: itemCategories
        });

    }

    toggleForm(e) {
        try {
            e.preventDefault();
            e.stopPropagation();
        } catch (error) {
            // Nothing/
        }
        store.dispatch(
            {
                type: TOGGLE_ADD_ITEM_FORM,
                value: !store.getState().openInventoryForm
            }
        );
        // this.refs.headingIcon.classList.toggle(s.formHeadingIcon__open);
        // this.refs.form.classList.toggle(s.form__open);
    }

    componentWillReceiveProps(props) {
        if (props.openForm) {
            this.toggleForm();
        }
    }

    render() {

        return (
            <section>
                <h3
                    className={s.addItemFormHeading}
                    onClick={this.toggleForm}>
                    Add an Item
                    <img
                        className={s.formHeadingIcon + (this.props.formOpen ? " " + s.formHeadingIcon__open : "" )}
                        src="./images/triangle.svg"
                        ref="headingIcon"
                        onClick={this.toggleForm}/>
                </h3>
                <form className={s.form  + (this.props.formOpen ? " " + s.form__open : "" )} ref="form" onSubmit={this.addItem}>
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
                            <div ref="itemCategories">
                                {this.props.categories.map((category, index) => {
                                    return (
                                        <CategorySelect
                                            id={category.id}
                                            name={category.name}
                                            key={'cat-' + index}
                                            checked={this.state.itemCategories.indexOf(category.id) >= 0}
                                            change={(e)=>{this.toggleCategory(category.id, e.target.checked)}}
                                        />
                                    );
                                })}
                            </div>
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
                            <input className={
                                s.formSubmit + " " +
                                s.button + " " +
                                s.button__save + " " +
                                s.align__right
                            } type="submit" value="Add Item"
                                   disabled={this.state.busy ? 'disabled' : ''} onClick={this.addItem}/>

                        </li>
                        <li>
                            <p className={s.error__message}>{this.state.itemErrorText}</p>
                        </li>
                    </ul>
                </form>
            </section>
        );
    }

}

export default AddForm;
