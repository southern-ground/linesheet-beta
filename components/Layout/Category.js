import React, {PropTypes} from 'react';
import s from './Category.css';

class Category extends React.Component {

    static propTypes = {
        id: PropTypes.string.isRequired,
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
        this.props.onEdit(this.props.id, this.refs.categoryNameInput.value);
    }

    editCancel() {
        this.setState({editActive: false});
    }

    render() {
        return (
            <div data-id={this.props.id} className={s.category + (this.props.className === "even" ? " " + s.even : "")}>

                <span
                    ref="categoryName"
                    className={(this.state.editActive ? "hidden" : "")}>
                    {this.props.name}
                    </span>
                <input
                    ref="categoryNameInput"
                    className={(this.state.editActive ? "" : " hidden")}
                    defaultValue={this.props.name}
                />
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
                    onClick={(event) => this.props.onDelete(this.props.id)}>Delete
                </button>
                </div>
            </div>
        );
    }

}

export default Category;
