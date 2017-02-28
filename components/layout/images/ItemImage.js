/**
 * Created by fst on 2/28/17.
 */

import React, {PropTypes} from 'react';
import s from './ItemImage.css';

export default class ItemImage extends React.Component {

    static propTypes = {
        imageName: PropTypes.string.isRequired,
        imagePath: PropTypes.string.isRequired,
        deleteFunc: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    render() {
        return <li className={s.itemImageWrapper}>
            <img className={
                s.itemImage +
                (this.props.selectedImage === this.props.imageName ? " selected " + s.selectedImage : "") +
                " productImage"
            }
                 src={this.props.imagePath + this.props.imageName}
                 data-id={this.props.imageName}
            />
            <img className={s.deleteImage}
                 src="../images/delete.svg"
                 data-id={this.props.imageName}
                 onClick={e => {
                     e.preventDefault();
                     e.stopPropagation();
                     if(this.props.deleteFunc){
                         this.props.deleteFunc(e.target.getAttribute('data-id'));
                     }
                 }}
            />
        </li>
    }

}