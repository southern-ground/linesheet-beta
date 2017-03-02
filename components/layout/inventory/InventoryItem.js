import React, {PropTypes} from 'react';
import s from './InventoryItem.css';
import store from '../../../src/store';
import {
    ITEM_IMAGE_PATH,
    ITEM_IMAGE_THUMBNAIL_PLACEHOLDER,
    SELECT_ITEM
} from '../../../src/constants';
import history from '../../../src/history';
import Link from '../../../components/Link';

class InventoryItem extends React.Component {

    static propTypes = {
        itemProps: PropTypes.object.isRequired,
        allCategories: PropTypes.array.isRequired,
        onDelete: PropTypes.func.isRequired/**/
    };

    constructor(props) {
        super(props);
        this.getCategoryList = this.getCategoryList.bind(this);
        this.state = {
            editActive: false
        }
    }

    getCategoryList(itemCategories, allCategories) {
        return allCategories.filter(category => {
            if (itemCategories.filter(categoryId => {
                    return category.id === categoryId;
                }).length > 0) {
                return category.name;
            }
        });
    }

    render() {

        var itemCategories = this.getCategoryList(this.props.itemProps.categories.split(','), this.props.allCategories);

        return (
            <div>
                <div
                    className={
                        s.flexBox + " " +
                        s.flexBoxTop + " "
                    }>

                    <div>
                        <input
                            type="checkbox"
                            id={this.props.itemProps.sku.replace(/-/gi, "_")}
                            checked={this.props.selected}
                            className={
                                s.inventoryItemSelect
                            }
                            onChange={(e) => {
                                store.dispatch({
                                    type: SELECT_ITEM,
                                    sku: this.props.itemProps.sku,
                                    value: !this.props.selected
                                })
                            }}/>
                        <label
                            htmlFor={this.props.itemProps.sku.replace(/-/gi, "_")}
                            className={
                                s.inventoryItemSku + " " +
                                s.uppercase
                            }>
                            {this.props.itemProps.sku}
                        </label>

                        <span
                            className={
                                s.inventoryItemName + " " +
                                s.uppercase
                            }>
                        {this.props.itemProps.name}
                    </span>
                    </div>

                    <div className={s.inventoryItemControls}>
                        <button
                            className={
                                s.button + " " +
                                s.buttonEdit + " " +
                                s.inventoryItemControlButton
                            }
                            onClick={() => {
                                history.push('/edit/' + this.props.itemProps.sku);
                            }}>
                            Edit
                        </button>

                        <a
                            className={s.inventoryItemDelete}
                            onClick={() => {
                                this.props.onDelete(this.props.itemProps.sku);
                            }}>
                            <img
                                className={s.deleteIcon}
                                src="images/delete.svg"/>
                        </a>
                    </div>
                </div>
                <div
                    className={
                        s.flexBox + " " +
                        s.inventoryItem
                    }>

                    {/* PRODUCT IMAGE */}

                    <div>
                        <img
                            className={s.inventoryItemImage}
                            src={(this.props.itemProps.image || "").length === 0
                                ?
                                ITEM_IMAGE_THUMBNAIL_PLACEHOLDER
                                :
                                ITEM_IMAGE_PATH + this.props.itemProps.image
                            }/>
                    </div>

                    < div>
                        <span className={s.inventoryItemProperty}>Categories:</span>
                        <
                            ul
                            className={s.categoriesList
                            }>
                            {
                                itemCategories.map((category, index) => {
                                    return (<li
                                        className={s.category}
                                        data-id={category.id}
                                        key={'cat-' + index}>
                                        {category.name}
                                    </li>)
                                })
                            }
                        </ul>
                    </div>

                    <div>
                        {/* MATERIAL */}
                        <span className={s.inventoryItemProperty}>Material:</span>
                        <div>
                            {this.props.itemProps.material || "n/a"}
                        </div>
                        {/* STONES */}
                        <div>
                        <span
                            className={s.inventoryItemProperty}>Swarovski Stones:</span>
                            <div>
                                {this.props.itemProps.swarovski || "n/a"}
                            </div>
                        </div>
                        <div>
                        <span
                            className={s.inventoryItemProperty}>Natural Stones:</span>
                            <div>
                                {this.props.itemProps.natural || "n/a"}
                            </div>
                        </div>
                    </div>

                    {/* PRICES */}

                    <div>
                        <div>
                            <span className={s.inventoryItemProperty}>Wholesale:</span>
                            ${this.props.itemProps.wholesale}
                        </div>
                        <div>
                            <span className={s.inventoryItemProperty}>MSRP:</span> ${this.props.itemProps.msrp}
                        </div>
                    </div>

                </div>
            </div>
        );
    }

}

export default InventoryItem;
