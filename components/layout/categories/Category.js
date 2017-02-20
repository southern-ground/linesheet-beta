import React, {PropTypes} from 'react';
import s from './Category.css';
import store from '../../../src/store';
import {
    DELETE_CATEGORY,
    EDIT_CATEGORY
} from '../../../src/constants';

class Category extends React.Component {

    static propTypes = {
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.deleteCategoryById = this.deleteCategoryById.bind(this);
        this.editStart = this.editStart.bind(this);
        this.editSave = this.editSave.bind(this);
        this.editCancel = this.editCancel.bind(this);

        this.state = {
            editActive: false
        }
    }

    deleteCategoryById(){
        store.dispatch({
            type: DELETE_CATEGORY,
            categoryId: this.props.id
        });
    }

    editStart() {
        this.setState({editActive: true});
        this.refs.categoryNameInput.value = this.props.name;
        this.refs.categoryNameInput.focus();
    }

    editSave() {
        this.setState({editActive: false});
        if(this.props.name !== this.refs.categoryNameInput.value){
            store.dispatch({
                type: EDIT_CATEGORY,
                categoryId: this.props.id,
                categoryName: this.refs.categoryNameInput.value
            });
        }else{
            // Nothing's changed so don't dispatch the change
        }
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
                    onClick={this.deleteCategoryById}>Delete
                </button>
                </div>
            </div>
        );
    }

}

export default Category;
