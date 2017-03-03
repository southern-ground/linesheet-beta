/**
 * Created by fst on 2/15/17.
 */

import React, { PropTypes } from 'react';

export default class InventoryItemCategory extends React.Component{

    static propTypes = {
        elementId: PropTypes.string.isRequired,
        categoryId: PropTypes.string.isRequired,
        categoryName: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired
    };

    constructor(props){
        super(props);
    }

    render(){
        return <li>
            <input
                type="checkbox"
                id={this.props.elementId}
                onChange={(e)=>{
                    this.props.onChange(this.props.categoryId);
                }} />
            <label htmlFor={this.props.elementId}>{this.props.categoryName}</label>
        </li>
    }
}