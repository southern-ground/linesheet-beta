/**
 * Created by fst on 2/22/17.
 */

import React, {PropTypes} from 'react';
import s from './styles.css';
import _ from 'lodash';
import {
    title,
    html
} from './index.md';
import {
    GET_FILE_LIST
} from '../../src/constants';
import Layout from '../../components/Layout';
import Link from '../../components/Link';
import history from '../history';
import store from '../store';

const SORT_DATE = "sort-date";
const SORT_NAME = "sort-name";

class SheetsPage extends React.Component {

    constructor(props) {

        super(props);
        this.updateProps = this.updateProps.bind(this);
        this.state = {
            status: "",
            sort: SORT_DATE,
            files: []
        }

    }

    componentWillMount() {
        this.unsubscribeFunciton = store.subscribe(this.updateProps);
    }

    componentDidMount() {

        document.title = title;

        if (!store.getState().savedFileStore.initialized) {
            store.dispatch({
                type: GET_FILE_LIST
            })
        } else {
            this.updateProps();
        }

    }

    componentWillUnmount() {
        this.unsubscribeFunciton();
    }

    updateProps() {

        var state = store.getState().savedFileStore;

        this.setState({
            ...this.state,
            files: this.state.sort === SORT_DATE
                ?
                state.files
                :
                state.files.sort((a, b) => {
                    return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
                }),
            msg: state.msg
        });

    }

    render() {
        return (
            <Layout className={s.content}>

                <section>
                    <div dangerouslySetInnerHTML={{__html: html}}/>
                </section>

                <section
                    className={this.state.files.length === 0 ? s.hidden : ""}>
                    <strong>Order by:</strong> <Link
                    to={'#'}
                    onClick={e => {
                        e.preventDefault();
                        this.setState({
                            sort: SORT_DATE,
                            files: store.getState().savedFileStore.files.slice(0)
                        });
                    }}
                    className={s.sortLink + (this.state.sort === SORT_DATE ? " " + s.active : "")}>
                    Last Modified
                </Link> or <Link
                    to={'#'}
                    onClick={e => {
                        e.preventDefault();
                        this.setState({
                            sort: SORT_NAME,
                            files: store.getState().savedFileStore.files.slice(0)
                                .sort((a, b) => {
                                    return a.toUpperCase() > b.toUpperCase() ? 1 : -1;
                                })
                        })
                    }}
                    className={s.sortLink + (this.state.sort === SORT_NAME ? " " + s.active : "")}>
                    Name
                </Link>
                    <ul className={s.fileList}>
                        {this.state.files.map((file, index) => {
                            return <li
                                key={"file_" + index}>
                                {index + 1 + ".) "} <a
                                target="_blank"
                                href={"http://shellybrown.com/linesheets/pdf/?data=" + file}>
                                {file.replace(/\.json/gi, '')}
                            </a>
                            </li>
                        })}
                    </ul>
                </section>
                <section>
                    <div className={s.filesMessage}>{this.state.msg}</div>
                </section>

            </Layout>
        );
    }

}

export default SheetsPage;