import React, {PropTypes} from 'react';
import s from './Inventory.css';

class Inventory extends React.Component {

    static propTypes = {
        sku: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        onDelete: PropTypes.func.isRequired,
        onEdit: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.editStart = this.editStart.bind(this);
        this.editSave = this.editSave.bind(this);
        this.editCancel = this.editCancel.bind(this);

        this.state = {
            editActive: false
        }
    }

    editStart() {
        this.setState({editActive: true});
    }

    editSave() {
        this.setState({editActive: false});
        this.props.onEdit(this.props.id, this.refs.itemNameInput.value);
    }

    editCancel() {
        this.setState({editActive: false});
    }

    render() {
        return (
            <div className={s.inventoryItem + (this.props.className === "even" ? " " + s.even : "")}>

                <div>
                    {this.props.sku}
                </div>
                <div>
                    {this.props.name}
                </div>
                <div>
                    {this.props.wholesale}
                </div>
                <div>
                    {this.props.msrp}
                </div>
                <div>
                    <ul className={s.categoriesList}>
                    {this.props.categories.map((category, index)=>{
                        return (<li key={"cat-" + index}>{category})}</li>);
                    })}
                    </ul>
                </div>

                <div>
                    <button
                        className={s.button + " " + s.button__save + (this.state.editActive ? "" : " hidden")}
                        onClick={this.editSave}>Save
                    </button>
                    <button
                        className={s.button + " " + s.button__cancel + (this.state.editActive ? "" : " hidden")}
                        onClick={this.editCancel}>Cancel
                    </button>
                    <button
                        className={s.button + " " + s.button__edit + (this.state.editActive ? " hidden" : "")}
                        onClick={this.editStart}>Edit
                    </button>
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
