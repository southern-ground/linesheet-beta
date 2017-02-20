/**
 * Created by fst on 2/20/17.
 */
import React, {PropTypes} from 'react';
import s from './styles.css';
import {
    title,
    html
} from './index.md';
import Layout from '../../components/Layout';
import Link from '../../components/Link';
import store from '../store';

class OrganizePage extends React.Component {

    constructor(props) {

        super(props);

        this.updateProps = this.updateProps.bind(this);

        this.state = {
            loading: true
        };

    }

    componentWillMount() {
        this.unsubscribeFunciton = store.subscribe(this.updateProps);
    }

    componentDidMount() {
        document.title = title;
    }

    componentWillUnmount() {
        this.unsubscribeFunciton();
    }

    updateProps() {
        this.setState({
            ...this.state,
            loading: false
        });
    }

    render() {

        return (
            <Layout className={s.content}>

                <section>
                    <div dangerouslySetInnerHTML={{__html: html}}/>
                </section>

            </Layout>
        );
    }

}

export default OrganizePage;
