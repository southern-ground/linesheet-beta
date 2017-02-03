/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, {PropTypes} from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';
import {title, html} from './index.md';
import {GET_INVENTORY} from '../constants';
import store from '../store';
import Link from '../../components/Link';

class HomePage extends React.Component {

    static propTypes = {
        // articles: PropTypes.array.isRequired,
    };

    constructor(props) {

        super(props);

        this.refreshInventory = this.refreshInventory.bind(this);

        this.renderLoading = this.renderLoading.bind(this);
        this.renderInventory = this.renderInventory.bind(this);
        this.renderPrompt = this.renderPrompt.bind(this);

        this.updateProps = this.updateProps.bind(this);

        var appState = store.getState(),
            localState = {inventory: [], loading: true};

        console.log(appState);

        this.state = {...localState, inventory: appState.inventory, loading: !appState.cookieLoaded};

    }

    componentWillMount() {

        this.unsubscribeFunciton = store.subscribe(this.updateProps);

        document.title = title;

    }

    componentDidMount() {

        document.title = title;

        var appState = store.getState(),
            localState = {inventory: [], loading: true};

        if (!appState.cookieLoaded) {
            store.dispatch({type: GET_INVENTORY});
        }

    }

    componentWillUnmount() {

        this.unsubscribeFunciton();

    }

    updateProps() {

        console.log('Home::updateProps');

        this.setState({...this.state, loading: false, inventory: store.getState().inventory});

    }

    refreshInventory(){
        console.log('Home::refreshInventory');
        store.dispatch({type:GET_INVENTORY, refresh: true})
        this.setState({...this.state, loading: true});
    }

    renderInventory() {
        return (<div>
            {this.state.inventory.length === 0 ? this.renderPrompt() : ''}
        </div>);
    }

    renderLoading() {
        return (<span>Loading &#133;</span>);
    }

    renderPrompt(){
        return (<div>
            <p>
                <span className={s.generic__error}>Error:</span> There doesn't appear to be any inventory in the system.
            </p>
            <p>
                You can add some by clicking "ADD" at the top of the page, or clicking <Link to="add">here</Link>.
            </p>
        </div>);
    }

    render() {
        console.log('Home::render');
        console.log(this.state);
        return (
            <Layout className={s.content}>

                <section>
                    <div dangerouslySetInnerHTML={{__html: html}}/>
                </section>

                <section>
                    <div className={s.align__right}>
                        <button onClick={this.refreshInventory} disabled={this.state.loading}>Refresh Inventory</button>
                    </div>
                    <div ref="inventory">
                        { this.state.loading ?
                            this.renderLoading()
                            :
                            this.state.inventory.length === 0 ?
                                this.renderPrompt()
                                :
                                this.renderInventory() }
                    </div>
                </section>
            </Layout>
        );
    }

}

export default HomePage;
