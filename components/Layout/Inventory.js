import React, {PropTypes} from 'react';
import s from './Inventory.css';
import history from 'history';
import Link from '../Link';

class Inventory extends React.Component {

    static propTypes = {
        sku: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        categories: PropTypes.array.isRequired,
        allCategories: PropTypes.array.isRequired,
        onDelete: PropTypes.func.isRequired,
        onEdit: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.editStart = this.editStart.bind(this);
        this.editSave = this.editSave.bind(this);
        this.editCancel = this.editCancel.bind(this);

        this.getCategoryList = this.getCategoryList.bind(this);

        this.state = {
            editActive: false
        }

    }

    editStart() {
        // this.setState({editActive: true});
        console.log(history);
        history.push('./edit/' + this.props.sku);
    }

    editSave() {
        this.setState({editActive: false});
        this.props.onEdit(this.props.id, this.refs.itemNameInput.value);
    }

    editCancel() {
        this.setState({editActive: false});
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
            <div className={s.table_row + " " + s.inventoryItem + (this.props.className === "even" ? " " + s.even : "")}>

                <div className={s.table_cell + " " + s.inventoryProperty}>
                    {this.props.sku}
                </div>
                <div className={s.table_cell + " " + s.inventoryProperty}>
                    {this.props.name}
                </div>
                <div className={s.table_cell + " " + s.inventoryProperty}>
                    <img src={this.props.image || "http://placehold.it/50x50"} className={s.inventoryItemImage} />
                </div>
                <div className={s.table_cell + " " + s.inventoryProperty}>
                    ${this.props.wholesale}
                </div>
                <div className={s.table_cell + " " + s.inventoryProperty}>
                    ${this.props.msrp}
                </div>
                <div className={s.table_cell + " " + s.inventoryProperty}>
                    <ul className={s.categoriesList}>
                        {itemCategories.map((category, index)=>{
                            return (<li
                                className={s.category}
                                data-id={category.id}
                                key={'cat-' + index}>
                                {category.name}
                                </li>)
                        })}
                    </ul>
                </div>

                <div className={s.table_cell}>
                    <Link
                        className={s.button + " " + s.button__edit}
                        to={"./edit/" + this.props.sku}>
                        Edit
                    </Link>

                    <button
                        className={s.button + " " + s.button__delete + (this.state.editActive ? " hidden" : "")}
                        onClick={(event) => this.props.onDelete(this.props.sku)}>Delete
                    </button>
                </div>
            </div>
        );
    }

}

export default Inventory;
