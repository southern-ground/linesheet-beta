import React from 'react';
import s from './AddItemForm.css';
import store from '../../../src/store';
import {
    ADD_ITEM,
    ERROR_NAME,
    ERROR_SKU,
    ITEM_IMAGE_PATH,
    ITEM_IMAGE_PLACEHOLDER,
    MATERIAL_FIELD_REF,
    MSRP_FIELD_REF,
    NAME_FIELD_REF,
    NAT_FIELD_REF,
    OPEN_IMAGE_OVERLAY,
    SKU_FIELD_REF,
    SWAROVSKI_FIELD_REF,
    TOGGLE_ADD_ITEM_FORM,
    WHOLESALE_FIELD_REF,
    sanitizeProductName
} from '../../../src/constants';
import CategorySelect from '../CategorySelect';

class AddItemOverlay extends React.Component {

    constructor(props) {

        super(props);

        this.addItem = this.addItem.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
        this.toggleCategory = this.toggleCategory.bind(this);
        this.updateSaveEnabled = this.updateSaveEnabled.bind(this);

        this.state = {
            itemCategories: [],
            busy: false,
            loaded: false,
            error: '',
            errorText: '',
            saveEnabled: false
        };

    }

    getCategories() {
        var checkboxes = this.refs.itemCategories.getElementsByTagName('input'),
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

    addItem(e) {

        e.preventDefault();

        var newItem = {
                sku: this.refs[SKU_FIELD_REF].value || '',
                name: sanitizeProductName(this.refs[NAME_FIELD_REF].value || ''),
                image: this.props.selectedImage || "",
                material: sanitizeProductName(this.refs[MATERIAL_FIELD_REF].value || ''),
                swarovski: sanitizeProductName(this.refs[SWAROVSKI_FIELD_REF].value || ''),
                natural: sanitizeProductName(this.refs[NAT_FIELD_REF].value || ''),
                categories: this.getCategories().join(','),
                wholesale: this.refs[WHOLESALE_FIELD_REF].value || 0,
                msrp: this.refs[MSRP_FIELD_REF].value || 0
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

            [SKU_FIELD_REF,
                NAME_FIELD_REF,
                MATERIAL_FIELD_REF,
                SWAROVSKI_FIELD_REF,
                NAT_FIELD_REF,
                WHOLESALE_FIELD_REF,
                MSRP_FIELD_REF].map((ref) => {
                    this.refs[ref].value = '';
                }
            )
            ;

            var checkboxes = this.refs.itemCategories.getElementsByTagName('input');

            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].type == 'checkbox') {
                    checkboxes[i].checked = false;
                }
            }

            newState["itemCategories"] = "";

            this.setState(newState);
        }

        var checkboxes = this.refs.itemCategories.getElementsByTagName('input');

        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == 'checkbox') {
                if (checkboxes[i].checked) {
                    itemCategories.push(checkboxes[i].getAttribute('data-id'));
                }
            }
        }

    }

    toggleCategory(id, checked) {

        console.log(id, checked);

        var itemCategories = this.state.itemCategories;

        if (checked) {
            if (itemCategories.indexOf(id) === -1) {
                itemCategories.push(id);
            } else {
                console.warn('ID was already present in the item categories when trying to add');
            }
        } else {
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
    }

    componentWillReceiveProps(props) {
        if (props.openForm) {
            this.toggleForm();
        }
    }

    updateSaveEnabled() {
        this.setState({
            saveEnabled: ((this.refs.itemSKU.value || '').length > 0)
            &&
            (sanitizeProductName(this.refs.itemName.value || '').length > 0)
        });
    }

    render() {
        return (
            <section>
                <h3 className={s.addItemFormHeading}>
                    Add an Item
                </h3>
                <form className={s.form} ref="form" onSubmit={this.addItem}>
                    <ul className={s.formItems}>
                        <li>
                            <label htmlFor="Item_SKU">SKU</label>
                            <input
                                type="text"
                                id="Item_SKU"
                                name="item_sku"
                                placeholder="SKU"
                                ref={SKU_FIELD_REF}
                                onChange={this.updateSaveEnabled}
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
                                ref={NAME_FIELD_REF}
                                onChange={this.updateSaveEnabled}
                                className={this.state.error === ERROR_NAME ? s.error__input : ""}
                            />
                        </li>
                        <li>
                            <label htmlFor="Item_Image">Image</label>
                            <div className={
                                s.categoriesList + " " +
                                s.inputGroup
                            }>
                                <img
                                    className={s.itemImage}
                                    src={
                                        this.props.selectedImage.length === 0
                                            ?
                                            ITEM_IMAGE_PLACEHOLDER
                                            :
                                            ITEM_IMAGE_PATH + this.props.selectedImage
                                    } />
                                <button
                                    className={
                                        s.halfWidth + " " +
                                        s.button

                                    }
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();

                                        store.dispatch({
                                            type: OPEN_IMAGE_OVERLAY
                                        });
                                    }}>
                                    Choose
                                </button>
                            </div>
                        </li>
                        <li>
                            <label htmlFor="Item_Material">Material</label>
                            <input
                                type="text"
                                id="Item_Material"
                                name="item_material"
                                placeholder="Material"
                                ref={MATERIAL_FIELD_REF}
                            />
                        </li>
                        <li>
                            <label htmlFor="Item_Swarovski_Stones">Swarovski Stones</label>
                            <input
                                type="text"
                                id="Item_Swarovski_Stones"
                                name="item_swarovski"
                                placeholder="Swarovski Stones"
                                ref={SWAROVSKI_FIELD_REF}
                            />
                        </li>
                        <li>
                            <label htmlFor="Item_Natural_Stones">Natural Stones</label>
                            <input
                                type="text"
                                id="Item_Natural_Stones"
                                name="item_natural"
                                placeholder="Natural Stones"
                                ref={NAT_FIELD_REF}
                            />
                        </li>
                        <li>
                            <label htmlFor="Category_Name">Product Category</label>
                            <ul ref="itemCategories" className={s.categoriesList}>
                                {this.props.categories.map((category, index) => {
                                    return (
                                        <CategorySelect
                                            id={category.id}
                                            name={category.name}
                                            index={index}
                                            key={'cat-' + index}
                                            checked={this.state.itemCategories.indexOf(category.id) >= 0}
                                            change={(e) => {
                                                this.toggleCategory(category.id, e.target.checked)
                                            }}
                                        />
                                    );
                                })}
                            </ul>
                        </li>
                        <li>
                            <label htmlFor="Item_Wholesale">Wholesale Price </label>
                            <input type="text"
                                   id="Item_Wholesale"
                                   name="item_wholesale"
                                   placeholder="$0.00"
                                   ref={WHOLESALE_FIELD_REF}
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
                            />
                        </li>
                        <li>
                            <input className={
                                s.formSubmit + " " +
                                s.button + " " +
                                s.button__save + " " +
                                s.align__right +
                                (this.state.saveEnabled ? "" : " " + s.button__disabled)
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

export default AddItemOverlay;
