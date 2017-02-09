import React, {PropTypes} from 'react';
import s from './CategorySelect.css';

class CategorySelect extends React.Component {

    static propTypes = {
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        selected: PropTypes.string.isSelected
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
        <div>
            <input type="checkbox"
                   data-id={this.props.id}
                   checked={this.props.selected}
                   key={"cat-" + this.props.index}
                   ref="checkbox"
            />
            <span>{this.props.name}</span>
        </div>
        );
    }

}

export default CategorySelect;
