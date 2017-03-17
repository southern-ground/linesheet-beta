/**
 * Created by fst on 2/20/17.
 */

import React from 'react';
import {title, html} from './index.md';
import s from './styles.css';
import {
    GET_INVENTORY,
    IMPORT_XLSX
} from '../constants';
import Layout from '../../components/Layout';
import Link from '../../components/Link';
import UploadXLXS from '../../components/layout/UploadXLSX';
import store from '../../src/store';

class ImportPage extends React.Component {

    constructor(props) {

        super(props);

        this.updateProps = this.updateProps.bind(this);

        this.state = {
            edited: false,
            error: "",
            errorText: "",
            selectedImage: "",
            imagesOverlayOpen: false,
            importedOpen: false,
            skippedOpen: false
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

    renderComplete() {
        return <section className={s.bottomSection}>

            <strong>Import Complete</strong>

            <p>A total of {this.state.imported.length} item{this.state.imported.length === 1 ? " was" : "s were"} imported. <a
                href="#"
                className={this.state.imported.length === 0 ? s.hidden : ""}
                onClick={e => {
                    e.preventDefault();
                    this.setState({
                        importedOpen: !this.state.importedOpen
                    });
                }}>
                {this.state.importedOpen ? "Close" : "View Imported SKUs"}
            </a>
            </p>

            <div ref="imported" className={(this.state.importedOpen ? "" : s.collapsed) + " " + s.skuList}>
                <ol>
                    {this.state.imported.map((sku,index) => {
                        return <li key={"imported_" + index}>{sku}</li>
                    })}
                </ol>
            </div>

            <p>A total of {this.state.skipped.length} item{this.state.skipped.length === 1 ? " was" : "s were"} skipped. <a
                href="#"
                className={this.state.skipped.length === 0 ? s.hidden : ""}
                onClick={e => {
                    e.preventDefault();
                    this.setState({
                        skippedOpen: !this.state.skippedOpen
                    });

                }}>
                {this.state.skippedOpen ? "Close" : "View Skipped SKUs"}
            </a>
            </p>

            <div ref="skipped" className={(this.state.skippedOpen ? "" : s.collapsed) + " " + s.skuList}>
                <ol>
                    {this.state.skipped.map((sku, index) => {
                        return <li key={"skipped_" + index}>{sku}</li>
                    })}
                </ol>
            </div>

        </section>
    }

    renderUploadedFile() {
        return <section className={s.bottomSection + (this.state.target === "" ? " " + s.collapsed : "")}>

            <strong>Uploaded File:</strong> {this.state.target !== "" ? this.state.target : ""}

            <button
                className={s.button + " " + s.uploadButton + " " + (this.state.target === "" ? s.buttonDisabled : "")}
                disabled={this.state.target !== "" ? "" : "DISABLED"}
                onClick={(e) => {
                    store.dispatch({
                        type: IMPORT_XLSX,
                        file: this.state.target
                    });
                    console.log('Go ahead and process ' + this.state.target);
                }}>
                Import File
            </button>

        </section>
    }

    updateProps() {
        this.setState(
            {
                ...this.state,
                ...store.getState().xlsx
            }
        )
    }

    render() {

        console.log(this.state.complete);

        return (
            <Layout className={s.content}>

                <section>
                    <div dangerouslySetInnerHTML={{__html: html}}/>
                    Download a <a href={"http://linesheets.shellybrown.com/data/sample_catalog.xlsx"} target="_blank">sample
                    file</a>.
                </section>

                <section>

                    <UploadXLXS />

                </section>

                {this.state.complete ? this.renderComplete() : this.renderUploadedFile()}

            </Layout>
        );
    }

}

export default ImportPage;
