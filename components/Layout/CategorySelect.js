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
        <div>
            <input type="checkbox"
                   data-id={this.props.id}
                   key={"cat-" + this.props.index}
                   ref="checkbox"
                   checked={this.props.checked}
                   onChange={(e)=>{
                       this.props.change(e, this.props.id);
                   }}
            />
            <span>{this.props.name}</span>
        </div>
        );
    }

}

export default CategorySelect;
