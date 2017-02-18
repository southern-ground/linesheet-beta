import React, {PropTypes} from 'react';
import s from './styles.css';
import {
    title,
    html
} from './index.md';
import {
    CLOSE_IMAGE_OVERLAY,
    GET_INVENTORY
} from '../constants';
import AddItemOverlay from '../../components/layout/overlays/AddItemOverlay';
import ImagesOverlay from '../../components/layout/overlays/ImagesOverlay';
import InventoryItems from '../../components/layout/inventory/InventoryItems';
import SaveSection from '../../components/Layout/SaveSection';
import Layout from '../../components/Layout';
import store from '../store';

class HomePage extends React.Component {

    constructor(props) {

        super(props);

        this.refreshInventory = this.refreshInventory.bind(this);
        this.updateProps = this.updateProps.bind(this);

        this.state = {
            loading: true,
            selectedImage: ""
        };

    }

    componentWillMount() {
        this.unsubscribeFunciton = store.subscribe(this.updateProps);
        this.setState({
            ...this.state,
            loading: false
        });
    }

    componentDidMount() {
        document.title = title;
        var appState = store.getState();
        if (!appState.inventoryInitialized) {
            store.dispatch({
                type: GET_INVENTORY
            });
        } else {
            this.updateProps();
        }
        /*if (!appState.inventory || !appState.categories) {
         store.dispatch({
         type: GET_INVENTORY
         });
         } else {
         this.updateProps();
         }*/
    }

    componentWillUnmount() {
        this.unsubscribeFunciton();
    }

    refreshInventory() {
        store.dispatch({type: GET_INVENTORY, refresh: true});
        this.setState({
            ...this.state,
            loading: true
        });
    }

    numItemsSelected() {
        return (store.getState().inventory).map((item) => {
            return item.selected ? 1 : 0;
        }).reduce((a, b) => {
            return a + b;
        }, 0);
    }

    updateProps() {

        var appState = store.getState();

        this.setState({
            ...this.state,
            loading: false
        });

    }

    render() {

        var appState = store.getState();

        return (
            <Layout className={s.content}>

                <section>
                    <div dangerouslySetInnerHTML={{__html: html}}/>
                </section>

                <section>
                    <button
                        className={s.button}
                        onClick={(e) => {
                            this.refs.addOverlay.classList.toggle(s.hidden);
                        }}>
                        Add Item
                    </button>
                </section>

                <InventoryItems
                    categories={(appState.categories || [])
                        .sort((a, b) => {
                            return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
                        })}
                    inventory={appState.inventory || []}
                    allSelected={appState.allSelected}
                    sortOn={appState.homeInventorySort}
                />

                <SaveSection
                    className={(appState.inventory || []).length === 0 ? s.hidden : ""}
                    numItems={(appState.inventory || []).length}
                    numItemsSelected={this.numItemsSelected()}
                />

                <section ref="addOverlay" className={s.overlaySection + " " + s.hidden}>
                    <div className={s.content + " " + s.overlayContent}>
                        <button
                            className={
                                s.button + " " +
                                s.button__close
                            }
                            onClick={(e) => {
                                this.refs.addOverlay.classList.toggle(s.hidden);
                            }}>
                            Close
                        </button>

                        <AddItemOverlay
                            categories={(appState.categories || [])
                                .sort((a, b) => {
                                    return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
                                })}
                            formOpen={appState.openInventoryForm}
                            selectedImage={this.state.selectedImage}
                        />

                    </div>
                </section>

                <section
                    ref="addImageOverlay"
                    className={
                        s.overlaySection +
                        (!appState.openImageOverlay ? " " + s.hidden : "")
                    }>
                    <div className={s.content + " " + s.overlayContent}>
                        <button
                            className={
                                s.button + " " +
                                s.button__close
                            }
                            onClick={(e) => {
                                store.dispatch({
                                    type: CLOSE_IMAGE_OVERLAY
                                })
                            }}>Close
                        </button>

                        <ImagesOverlay
                            images={appState.images}
                            selectImage={(image) => {
                                this.setState({
                                    selectedImage: image
                                });
                            }}
                            selectedImage={this.state.selectedImage}
                        />
                    </div>
                </section>

            </Layout>
        );
    }

}

export default HomePage;
