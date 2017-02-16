import React, {PropTypes} from 'react';
import s from './InventoryItem.css';
import store from '../../../src/store';
import Link from '../../Link';
import {
    ITEM_IMAGE_PATH,
    ITEM_IMAGE_THUMBNAIL_PLACEHOLDER,
    SELECT_CATEGORY,
    SELECT_ITEM
} from '../../../src/constants';
import history from '../../../src/history';

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
            <div
                className={
                    this.props.flexy ?
                        s.flexItem + " " + s.inventoryItem + (this.props.className === "even" ? " " + s.even : "")
                        :
                        s.table_row + " " + s.inventoryItem +
                    (this.props.className === "even" ? " " + s.even : "")
                }>
                <div className={
                    this.props.flexy ?
                        s.flexItem + " " + s.inventoryProperty
                        :
                        s.table_cell + " " + s.inventoryProperty}>
                    <input
                        type="checkbox"
                        checked={this.props.selected}
                        onChange={(e) => {
                            store.dispatch({
                                type: SELECT_ITEM,
                                sku: this.props.itemProps.sku,
                                value: !this.props.selected
                            })
                        }}/>
                </div>
                <div className={s.table_cell + " " + s.inventoryProperty}>
                    {this.props.itemProps.sku}
                </div>
                <div className={s.table_cell + " " + s.inventoryProperty}>
                    {this.props.itemProps.name}
                </div>

                <div className={s.table_cell + " " + s.inventoryProperty}>
                    <img
                        className={s.inventoryItemImage}
                        src={(this.props.itemProps.image || "").length === 0
                            ?
                            ITEM_IMAGE_THUMBNAIL_PLACEHOLDER
                            :
                            ITEM_IMAGE_PATH + this.props.itemProps.image
                            }/>
                </div>

                <div className={s.table_cell + " " + s.inventoryProperty}>
                    {this.props.itemProps.material}
                </div>
                <div className={s.table_cell + " " + s.inventoryProperty}>
                    {this.props.itemProps.swarovskiStones}
                </div>
                <div className={s.table_cell + " " + s.inventoryProperty}>
                    {this.props.itemProps.naturalStones}
                </div>
                <div className={s.table_cell + " " + s.inventoryProperty}>
                    ${this.props.itemProps.wholesale}
                </div>
                <div className={s.table_cell + " " + s.inventoryProperty}>
                    ${this.props.itemProps.msrp}
                </div>
                <div className={s.table_cell + " " + s.inventoryProperty}>
                    <ul className={s.categoriesList}>
                        {itemCategories.map((category, index) => {
                            return (<li
                                className={s.category}
                                data-id={category.id}
                                key={'cat-' + index}>
                                {category.name}
                                {/*<button
                                    className={s.button__category}
                                    onClick={(e) => {
                                        store.dispatch({
                                            type: SELECT_CATEGORY,
                                            categoryId: category.id,
                                            value: !e.shiftKey
                                        });
                                    }}>

                                    {category.name}
                                </button>*/}
                            </li>)
                        })}
                    </ul>
                </div>
                <div className={s.table_cell}>
                    <button
                        className={
                            s.button + " " +
                            s.button__edit + " " +
                            s.inventoryItemControlButton
                        }
                        onClick={()=>{
                            history.push('/edit/' + this.props.itemProps.sku);
                        }}>
                        Edit
                    </button>
                    <button
                        className={
                            s.button + " " +
                            s.button__delete + " " +
                            s.inventoryItemControlButton
                        }
                        onClick={()=>{
                            this.props.onDelete(this.props.itemProps.sku);
                        }}>
                        Delete
                    </button>
                </div>
            </div>
        );
    }

}

export default InventoryItem;
