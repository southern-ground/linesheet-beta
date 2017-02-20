import React, {PropTypes} from 'react';
import s from './CategorySelect.css';

class CategorySelect extends React.Component {

    static propTypes = {
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        checked: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
        <li>
            <input type="checkbox"
                   data-id={this.props.id}
                   id={'cat-' + this.props.index}
                   key={"cat-" + this.props.index}
                   ref="checkbox"
                   checked={this.props.checked}
                   onChange={(e)=>{
                       this.props.change(e, this.props.id);
                   }}
            />
            <label htmlFor={'cat-' + this.props.index}>{this.props.name}</label>
        </li>
        );
    }

}

export default CategorySelect;
