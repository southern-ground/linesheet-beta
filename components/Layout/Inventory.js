import React, {PropTypes} from 'react';
import s from './Inventory.css';
import store from '../../src/store';
import Link from '../Link';
import {
    SELECT_CATEGORY,
    SELECT_ITEM
} from '../../src/constants';

class Inventory extends React.Component {

    static propTypes = {
        sku: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        categories: PropTypes.array.isRequired,
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

        var itemCategories = this.getCategoryList(this.props.categories, this.props.allCategories);

        return (
            <div
                className={
                    s.table_row + " " +
                    s.inventoryItem +
                    (this.props.className === "even" ? " " + s.even : "")
                }>
                <div className={s.table_cell + " " + s.inventoryProperty}>
                    <input
                        type="checkbox"
                        checked={this.props.selected}
                        onChange={(e) => {
                            store.dispatch({
                                type: SELECT_ITEM,
                                sku: this.props.sku,
                                value: !this.props.selected
                            })
                        }}/>
                </div>
                <div className={s.table_cell + " " + s.inventoryProperty}>
                    {this.props.sku}
                </div>
                <div className={s.table_cell + " " + s.inventoryProperty}>
                    {this.props.name}
                </div>
                <div className={s.table_cell + " " + s.inventoryProperty}>
                    <img src={this.props.image || "http://placehold.it/50x50"} className={s.inventoryItemImage}/>
                </div>
                <div className={s.table_cell + " " + s.inventoryProperty}>
                    ${this.props.wholesale}
                </div>
                <div className={s.table_cell + " " + s.inventoryProperty}>
                    ${this.props.msrp}
                </div>
                <div className={s.table_cell + " " + s.inventoryProperty}>
                    <ul className={s.categoriesList}>
                        {itemCategories.map((category, index) => {
                            return (<li
                                className={s.category }
                                data-id={category.id}
                                key={'cat-' + index}>
                                <button
                                    className={s.button__category}
                                    onClick={(e)=>{
                                        store.dispatch({
                                            type: SELECT_CATEGORY,
                                            categoryId: category.id,
                                            value: !e.shiftKey
                                        });
                                    }}>

                                    {category.name}
                                </button>
                            </li>)
                        })}
                    </ul>
                </div>
                <div className={s.table_cell}>
                    <button
                        className={s.button + " " + s.button__edit}
                        onClick={(e)=>{
                            window.location = "./edit/" + this.props.sku;
                        }}>
                        Edit
                    </button>
                    <button
                        className={
                            s.button + " " +
                            s.button__delete +
                            (this.state.editActive ? s.hidden : "")
                        }
                        onClick={(event) => this.props.onDelete(this.props.sku)}>Delete
                    </button>
                </div>
            </div>
        );
    }

}

export default Inventory;
