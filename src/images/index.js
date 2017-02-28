/**
 * Created by fst on 2/28/17.
 */
import React, {PropTypes} from 'react';
import s from './styles.css';
import {
    title,
    html
} from './index.md';
import {
    DELETE_IMAGE,
    GET_IMAGES,
    ITEM_IMAGE_PATH
} from '../constants';
import Layout from '../../components/Layout';
import ItemImage from '../../components/layout/images/ItemImage';
import Link from '../../components/Link';
import store from '../store';

class ImagePage extends React.Component {

    constructor(props) {

        super(props);
        this.updateProps = this.updateProps.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
        this.state = {
            images: []
        };

    }

    componentWillMount() {
        this.unsubscribeFunciton = store.subscribe(this.updateProps);
    }

    componentDidMount() {
        document.title = title;
        var imageStore = store.getState().imageStore;
        if (!imageStore.initialized) {
            store.dispatch({
                type: GET_IMAGES
            })
        } else {
            this.setState({
                images: imageStore.images
            })
        }
    }

    componentWillUnmount() {
        this.unsubscribeFunciton();
    }

    deleteImage(id) {
        console.log('ImagePage::deleteImage', id);
        store.dispatch({
            type: DELETE_IMAGE,
            imageName: id
        });
    }

    updateProps() {
        this.setState({
            ...this.state,
            images: store.getState().imageStore.images
        });
    }

    render() {

        return (
            <Layout className={s.content}>

                <section>
                    <div dangerouslySetInnerHTML={{__html: html}}/>
                </section>

                <section>
                    <ul className={s.imagesList}>
                        {this.state.images.map((image, index) => {
                            return <ItemImage
                                key={"image_" + index}
                                imageName={image}
                                imagePath={ITEM_IMAGE_PATH}
                                deleteFunc={this.deleteImage}
                            />
                        })}
                    </ul>
                </section>

            </Layout>
        );
    }

}

export default ImagePage;
