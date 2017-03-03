/**
 * Created by fst on 2/20/17.
 */

import React, {PropTypes} from 'react';

class CategorySelect extends React.Component {

    static propTypes = {
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        isChecked: PropTypes.bool.isRequired,
        changeCallback: PropTypes.func.isRequired
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
                   checked={this.props.isChecked}
                   onChange={(e)=>{
                       this.props.changeCallback(e, this.props.id);
                   }}
            />
            <label htmlFor={'cat-' + this.props.index}>{this.props.name}</label>
        </li>
        );
    }

}

export default CategorySelect;
