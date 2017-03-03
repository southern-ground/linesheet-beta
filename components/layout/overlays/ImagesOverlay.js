/**
 * Created by fst on 2/16/17.
 */

import React, {PropTypes} from 'react';
import s from './ImagesOverlay.css';
import {
    ITEM_IMAGE_PATH
} from '../../../src/constants';
import EditItemImage from '../images/EditItemImage';
import UploadImage from '../UploadImage';

class ImagesOverlay extends React.Component {

    static propTypes = {
        selectImage: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.toggleOpen = this.toggleOpen.bind(this);
        this.state = {
            uploadFormOpen: false,
            files: []
        }
    }

    componentDidMount() {

    }

    toggleOpen(open) {
        open ? this.refs.imagesList.classList.add(s.imagesListOpen) : this.refs.imagesList.classList.remove(s.imagesListOpen);
    }

    render() {

        return (
            <div className={s.imageOverlay}
                 onDragEnd={e => {
                     e.preventDefault();
                     e.stopPropagation();
                     return false;
                 }}
                 onDrop={e => {
                     e.preventDefault();
                     e.stopPropagation();
                     return false;
                 }}>


                <h2 className={s.addItemFormHeading}>
                    Images
                </h2>

                <UploadImage
                    openListeners={[this.toggleOpen]}/>

                <ul className={s.imagesList}
                    ref="imagesList">
                    {this.props.images.map((image, index) => {
                        return (<EditItemImage
                            imagePath={ITEM_IMAGE_PATH}
                            imageName={image}
                            key={' product-image-' + index}
                            selectImage={this.props.selectImage}
                            selectedImage={this.props.selectedImage}
                        />);
                    })}
                </ul>

            </div>
        );
    }

}

export default ImagesOverlay;
