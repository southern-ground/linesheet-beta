/**
 * Created by fst on 2/20/17.
 */
import React, {PropTypes} from 'react';
import s from './ArrangableItem.css';
import {
    ITEM_IMAGE_PATH
} from '../../../src/constants';

export default class ArrangableItem extends React.Component {
    constructor(props) {
        super(props);
    }

    format(currency) {

        currency = typeof currency === "string" ? parseFloat(currency) : currency;

        return currency.toFixed(2).replace(/./g, function (c, i, a) {
            return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
        });
    }

    render() {

        return <div className={s.item}
                    data-sku={this.props.state.sku}
                    onDragStart={(e) => {
                        e.target.classList.add(s.dragging);
                    }}
                    onDragEnd={(e) => {
                        e.target.classList.remove(s.dragging);
                    }}
                    onDragOver={(e) => {
                        e.target.classList.add(s.dragOver);
                    }}
                    onDragLeave={(e) => {
                        e.target.classList.remove(s.dragOver);
                    }}
                    draggable>

            <img
                className={
                    s.image
                }
                src={ITEM_IMAGE_PATH + this.props.state.image}/>


            <ul className={s.attributes}>
                <li className={s.sku}>Item # {this.props.state.sku}</li>
                <li className={s.name}>{this.props.state.name}</li>

                {this.props.fields.filter(item => {
                    if (item.field === "material") return item.selected
                }).length !== 0 &&
                this.props.state.material &&
                this.props.state.material.length > 0
                    ?
                    <li>{this.props.state.material}</li>
                    :
                    ""
                }

                {this.props.state.swarovski && this.props.state.swarovski.length > 0
                    ?
                    <li>Swarovski stones: {this.props.state.swarovski}</li>
                    :
                    ""
                }

                {this.props.state.natural && this.props.state.natural.length > 0
                    ?
                    <li>Natural stones: {this.props.state.natural}</li>
                    :
                    ""
                }

                {
                    this.props.fields.filter(item => {
                        if (item.field === "wholesale") return item.selected
                    }).length !== 0
                        ?
                        <li>Wholesale: ${this.format(this.props.state.wholesale)}</li>
                        :
                        ""
                }

                {this.props.fields.filter(item => {
                    if (item.field === "msrp") return item.selected
                }).length !== 0
                    ?
                    < li > MSRP: ${this.format(this.props.state.msrp)}</li>
                    :
                    ""
                }


            </ul>

        </div>
    }
}