import React, {PropTypes} from 'react';
import s from './CategorySelect.css';

class CategorySelect extends React.Component {

    static propTypes = {
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.onToggle = this.onToggle.bind(this);
    }

    onToggle(){
        this.props.onToggle(this.props.id, this.refs.checkbox.checked);
    }

    render() {
        return (
        <div>
            <input type="checkbox"
                   data-id={this.props.id}
                   checked={this.props.selected}
                   key={"cat-" + this.props.index}
                   ref="checkbox"
                   onChange={(e)=>{
                       this.onToggle();
                   }}
            />
            <span>{this.props.name}</span>
        </div>
        );
    }

}

export default CategorySelect;
