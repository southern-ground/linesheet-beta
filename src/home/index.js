/**
 * Created by fst on 2/1/17.
 */

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {
    title,
    html
} from './index.md';
import s from './styles.css';
import {
    GET_INVENTORY
} from '../constants';
import InventoryItems from '../../components/layout/inventory/InventoryItems';
import InventoryItemsHeader from '../../components/layout/InventoryItemsHeader';
import InventoryItemsFooter from '../../components/layout/InventoryItemsFooter';
import Layout from '../../components/Layout';
import Link from '../../components/Link';
import store from '../store';

class HomePage extends React.Component {

    constructor(props) {

        super(props);

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
        if (!appState.inventoryInitialized) {
            store.dispatch({
                type: GET_INVENTORY
            });
        } else {
            this.updateProps();
        }
        /*
        ReactDOM.findDOMNode(this.refs.items).addEventListener('scroll', ()=>{
            console.log('EABOD');
        });
        */
    }

    componentWillUnmount() {
        this.unsubscribeFunciton();
        /*
        ReactDOM.findDOMNode(this.refs.items).removeEventListener('scroll', this.handleScroll);
        */
    }

    handleScroll(event) {
        let scrollBarPosition = window.pageYOffset | document.body.scrollTop;

        console.log('handleScroll', scrollBarPosition);
        console.log(this.refs.scrollToTop);
        /*
            // At specifiv position do what you want
            if(scrollBarPosition == 0) {
                document.getElementById('status').innerHTML = "User is on top of the page, position=" + scrollBarPosition;
            }
            else {
                document.getElementById('status').innerHTML = "User is not on top of the page, position="  + scrollBarPosition;
            }*/

    }

    numItemsSelected() {
        return (store.getState().inventory).map((item) => {
            return item.selected ? 1 : 0;
        }).reduce((a, b) => {
            return a + b;
        }, 0);
    }

    updateProps() {
        this.setState({
            ...this.state,
            loading: false
        });
    }

    render() {

        var appState = store.getState();

        return (
            <Layout id="Items" className={s.content  + " items"} ref="items">

                <section>
                    <div dangerouslySetInnerHTML={{__html: html}}/>
                </section>

                <section>
                    <Link
                        className={s.button + " " + s.button__addItem}
                        to={'/add'}>
                        Add Item
                    </Link>
                </section>

                <InventoryItemsHeader
                    className={(appState.inventory || []).length === 0 ? s.hidden : ""}
                    numItems={(appState.inventory || []).length}
                    numItemsSelected={this.numItemsSelected()}
                />

                <InventoryItems
                    categories={(appState.categories || [])
                        .sort((a, b) => {
                            return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
                        })}
                    inventory={appState.inventory || []}
                    allSelected={appState.allSelected}
                    sortOn={appState.homeInventorySort}
                />

                <a href="#Items" id="ScrollToTop" ref="scrollToTop" className={s.scrollToTop} >Back To Top</a>

                <InventoryItemsFooter
                    className={(appState.inventory || []).length === 0 ? s.hidden : ""}
                    numItems={(appState.inventory || []).length}
                    numItemsSelected={this.numItemsSelected()}
                />

            </Layout>
        );
    }

}

export default HomePage;
