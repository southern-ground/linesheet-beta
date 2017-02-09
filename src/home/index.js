
import React, {PropTypes} from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';
import {title, html} from './index.md';
import {
    GET_INVENTORY
} from '../constants';
import store from '../store';
import AddForm from '../../components/Layout/AddForm';
import InventoryItems from '../../components/Layout/InventoryItems';

class HomePage extends React.Component {

    constructor(props) {

        super(props);

        this.refreshInventory = this.refreshInventory.bind(this);
        this.updateProps = this.updateProps.bind(this);

        var appState = store.getState(),
            localState = {loading: true};

        this.state = {
            ...localState,
            inventory: appState.inventory,
            categories: appState.categories
        };

    }

    componentWillMount() {

        this.unsubscribeFunciton = store.subscribe(this.updateProps);

    }

    componentDidMount() {

        document.title = title;

        if (store.getState().initialized === false) {
            // Inventory hasn't been loaded; go get it.
            store.dispatch({
                type: GET_INVENTORY
            });
        }

    }

    componentWillUnmount() {

        this.unsubscribeFunciton();

    }

    refreshInventory() {
        console.log('Home::refreshInventory');
        store.dispatch({type: GET_INVENTORY, refresh: true})
        this.setState({...this.state, loading: true});
    }

    updateProps() {

        var appState = store.getState();

        console.log('Home::updateProps State:', appState);

        this.setState({
            ...this.state,
            loading: false,
            inventory: appState.inventory,
            categories: appState.categories.sort((a, b) => {
                return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
            }),
            openItemForm: appState.openInventoryForm
        });

    }

    render() {

        return (
            <Layout className={s.content}>

                <section>
                    <div dangerouslySetInnerHTML={{__html: html}}/>
                </section>

                <AddForm
                    categories={this.state.categories}
                    openForm={this.state.openItemForm}
                />

                <InventoryItems
                    categories={this.state.categories}
                    inventory={this.state.inventory}
                />

            </Layout>
        );
    }

}

export default HomePage;
