import React, {PropTypes} from 'react';
import s from './styles.css';
import {
    title,
    html
} from './index.md';
import {
    GET_INVENTORY
} from '../constants';
import AddForm from '../../components/Layout/AddForm';
import InventoryItems from '../../components/Layout/InventoryItems';
import SaveSection from '../../components/Layout/SaveSection';
import Layout from '../../components/Layout';
import store from '../store';

class HomePage extends React.Component {

    constructor(props) {

        super(props);

        this.refreshInventory = this.refreshInventory.bind(this);
        this.updateProps = this.updateProps.bind(this);

        this.state = {
            loading: true
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
        if (!appState.inventory || !appState.categories) {
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

    refreshInventory() {
        console.log('Home::refreshInventory');
        store.dispatch({type: GET_INVENTORY, refresh: true});
        this.setState({
            ...this.state,
            loading: true
        });
    }

    numItemsSelected() {
        return (store.getState().inventory || []).map((item) => {
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

                <AddForm
                    categories={(appState.categories || [])
                        .sort((a, b) => {
                            return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
                        })}
                    formOpen={appState.openInventoryForm}
                />

                <InventoryItems
                    categories={(appState.categories || [])
                        .sort((a, b) => {
                            return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
                        })}
                    inventory={appState.inventory || []}
                    allSelected={appState.allSelected}
                />

                <SaveSection
                    numItems={(appState.inventory || []).length}
                    numItemsSelected={this.numItemsSelected()}
                />

            </Layout>
        );
    }

}

export default HomePage;
