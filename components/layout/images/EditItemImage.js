/**
 * Created by fst on 2/16/17.
 */

import React, {PropTypes} from 'react';
import s from './EditItemImage.css';

export default class EditItemImage extends React.Component {

    static propTypes = {
        imageName: PropTypes.string.isRequired,
        imagePath: PropTypes.string.isRequired,
        selectImage: PropTypes.func.isRequired
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
                 onClick={(e) => {
                     this.props.selectImage(this.props.imageName)
                 }}
            />
            <img className={
                (this.props.selectedImage === this.props.imageName ? s.selectedImageMarker : s.hidden)
            }
                 src="../images/selected.svg" />
        </li>
    }

}