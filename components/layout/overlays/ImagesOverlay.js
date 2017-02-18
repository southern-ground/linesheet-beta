/**
 * Created by fst on 2/16/17.
 */
import React, {PropTypes} from 'react';
import s from './ImagesOverlay.css';
import store from '../../../src/store';
import EditItemImage from '../../../components/layout/images/EditItemImage';
import {
    ITEM_IMAGE_PATH
} from '../../../src/constants';

import {} from '../../../src/constants';

class ImagesOverlay extends React.Component {

    static propTypes = {
        selectImage: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return (
            <section>
                <h3 className={s.addItemFormHeading}>
                    Images
                </h3>
                <ul className={s.imagesList}>
                    {this.props.images.map((image, index) => {
                        return (<EditItemImage
                            imagePath={ITEM_IMAGE_PATH}
                            imageName={image}
                            key={'product-image-'+index}
                            selectImage={this.props.selectImage}
                            selectedImage={this.props.selectedImage}
                        />);
                    })}
                </ul>
            </section>
        );
    }

}

export default ImagesOverlay;
