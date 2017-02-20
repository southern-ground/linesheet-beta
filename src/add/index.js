/**
 * Created by fst on 2/20/17.
 */
import React from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';
import {title, html} from './index.md';
import store from '../../src/store';
import {
    CLOSE_IMAGE_OVERLAY,
    GET_INVENTORY
} from '../constants';
import AddItemForm from '../../components/layout/AddItemForm';
import ImagesOverlay from '../../components/layout/overlays/ImagesOverlay';

class AddPage extends React.Component {

    constructor(props) {

        super(props);

        this.selectImage = this.selectImage.bind(this);
        this.updateProps = this.updateProps.bind(this);

        this.state = {
            edited: false,
            error: "",
            errorText: "",
            selectedImage: "",
            imagesOverlayOpen: false
        };

    }

    componentWillMount() {
        this.unsubscribeFunciton = store.subscribe(this.updateProps);
    }

    componentDidMount() {

        document.title = title;

        if (!store.getState().inventoryInitialized) {
            store.dispatch({
                type: GET_INVENTORY
            });
        } else {
            this.updateProps();
        }
    }

    componentWillUnmount() {
        this.unsubscribeFunciton();
    }

    selectImage(img) {
        this.setState({
            ...this.state,
            item: {
                ... this.state.item,
                selectedImage: img
            },
            edited: true
        })
    }

    updateProps() {
        this.setState(
            {
                ...this.state,
                openImages: store.getState().openImageOverlay,
                busy: false
            }
        )
    }

    render() {

        var appState = store.getState();

        return (
            <Layout className={s.content}>
                <section>
                    <div dangerouslySetInnerHTML={{__html: html}}/>
                </section>

                <AddItemForm
                    categories={appState.categories}
                    selectedImage=""
                />

                <section ref="imageOverlay" className={
                    s.overlaySection +
                    (appState.openImageOverlay ? "" : " " + s.hidden)
                }>
                    <div className={s.content + " " + s.overlayContent}>
                        <button
                            className={s.button + " " + s.button__close}
                            onClick={(e) => {
                                store.dispatch({
                                    type: CLOSE_IMAGE_OVERLAY
                                });
                            }}>Close
                        </button>
                        <ImagesOverlay
                            images={appState.images}
                            selectedImage={this.state.selectedImage}
                            selectImage={this.selectImage}
                        />
                    </div>
                </section>
            </Layout>
        );
    }

}

export default AddPage;