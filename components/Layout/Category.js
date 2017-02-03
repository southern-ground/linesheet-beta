import React, {PropTypes} from 'react';
import s from './Category.css';

class Category extends React.Component {

    static propTypes = {
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        onDelete: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.deleteCategory = this.deleteCategory.bind(this);
    }

    deleteCategory(e) {
        console.log('Category::deleteCategory');
        this.props.onDelete(this.props.id);
    }

    render() {
        return (
            <div data-id={this.props.id} className={s.category + (this.props.className === "even" ? " " + s.even : "")}>
                {this.props.name}
                <button className={s.button__delete} onClick={(event) => this.props.onDelete(this.props.id)}>Delete
                </button>
            </div>
        );
    }

}

export default Category;
