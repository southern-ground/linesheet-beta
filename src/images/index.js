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
    GET_IMAGES
} from '../constants';
import Layout from '../../components/Layout';
import Link from '../../components/Link';
import store from '../store';

class ImagePage extends React.Component {

    constructor(props) {

        super(props);

        this.updateProps = this.updateProps.bind(this);

        this.state = {};

    }

    componentWillMount() {
        this.unsubscribeFunciton = store.subscribe(this.updateProps);
        this.setState({
            ...this.state
        });
    }

    componentDidMount() {
        document.title = title;
        /*var appState = store.getState();
         if (!appState.inventoryInitialized) {
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

    updateProps(){
        console.log('ImagePage::updateProps');
    }

    render() {
        console.log('ImagePage::render');

        var appState = store.getState();

        return (
            <Layout className={s.content}>

                <section>
                    <div dangerouslySetInnerHTML={{__html: html}}/>
                </section>

                <section>
                    <h2>Eat your images here</h2>
                </section>

            </Layout>
        );
    }

}

export default ImagePage;
