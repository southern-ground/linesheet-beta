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
import history from '../history';
import store from '../store';
import ArrangableItem from '../../components/layout/inventory/ArrangableItem';
import {
    SAVE_FILE,
    SORT_SKU,
    SORT_NAME
} from '../../src/constants';
import Sortable from 'sortablejs';

class OrganizePage extends React.Component {

    constructor(props) {

        super(props);
        this.updateProps = this.updateProps.bind(this);
        this.state = {
            loading: true,
            orderedInventory: [],
            sortOn: SORT_SKU,
            title: "",
            fileName: "",
            items: [],
            fields: [
                {name: "Materials", field: "material", selected: true},
                {name: "MSRP", field: "msrp", selected: true},
                {name: "Wholesale", field: "wholesale", selected: true}
            ],
            status: ""
        };

    }

    componentWillMount() {
        this.unsubscribeFunciton = store.subscribe(this.updateProps);
    }

    componentDidMount() {

        document.title = title;

        var appState = store.getState(),
            isError = false;

        if (!appState.inventoryInitialized) {
            isError = true;
        } else if (appState.inventory.filter(item => {
                if (item.selected) {
                    return item;
                }
            }).length === 0) {
            isError = true;
        }

        if (isError) { // There's either no inventory or no items selected; redirect.
            history.push('/');
        }

    }

    componentWillUnmount() {
        this.unsubscribeFunciton();
    }

    orderUpdate(e) {

        /*var els = ((htmlCollection) => {
         var a = [], i = 0;
         for (i; i < htmlCollection.length; i++) {
         a.push(htmlCollection[i]);
         }
         return a;
         })(e.to.children),
         inventory = store.getState().inventory,
         newOrder = [];

         els.forEach(item => {
         /!*var match = inventory.filter
         newOrder.push(
         inventory.filter(ii=>{
         return ii.sku === item.getAttribute('data-sku');
         }).pop());*!/
         });*/

    }

    save() {

        var payload = {
            title: this.refs.title.value,
            fileName: this.refs.fileName.value,
            fields: {},
            items: []
        };

        this.state.fields.forEach((field) => {
            payload.fields[field.field] = field.selected;
        });

        var items = (htmlCollection => {
            var a = [], i = 0;
            for (i; i < htmlCollection.length; i++) {
                a.push(htmlCollection[i]);
            }
            return a;
        })(document.getElementById('SelectedItems').children)
            .forEach(item => {
                payload.items.push(item.getAttribute('data-sku'));
            });

        store.dispatch({
            type: SAVE_FILE,
            data: payload
        });

        this.setState({
            title: "",
            fileName: "",
        });

    }

    sortableContainersDecorator = (componentBackingInstance) => {
        if (componentBackingInstance) {
            let options = {
                draggable: "div", // Restricts sort start click/touch to the specified element
                group: "stack",
                onUpdate: this.orderUpdate
            };
            Sortable.create(componentBackingInstance, options);
        }
    };

    status() {
        if (this.state.status === "") {
            return (
                <p className={s.fileMessage}><Link to={"./sheets"}>View All Files</Link></p>
            );
        } else {
            return (
                <p className={s.fileMessage}>
                    <strong>SUCCESS:</strong> {this.state.status} was {
                    this.state.fileExists === 1
                        ?
                        "updated"
                        :
                        "written"
                } successfully. <a
                    href={
                        "http://shellybrown.com/linesheets/pdf/?data=" +
                        store.getState().savedFileStore.lastSavedFile
                    }
                    target="_blank">
                    View as PDF
                </a>
                    <br />
                    <Link to={"./sheets"}>View All Files</Link>
                </p>
            )
        }
    }

    updateProps() {

        var fileInfo = store.getState().savedFileStore;

        this.setState({
            ...this.state,
            loading: false,
            status: fileInfo.lastSavedFile,
            fileExists: fileInfo.fileExists
        });

    }

    render() {

        var items = store.getState().inventory
            .slice(0)
            .filter((item) => {
                return item.selected;
            }).sort((a, b) => {
                switch (this.state.sortOn) {
                    case SORT_NAME:
                        return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
                        break;
                    case SORT_SKU:
                    default:
                        return a.sku.toUpperCase() > b.sku.toUpperCase() ? 1 : -1;
                }
            });

        return (
            <Layout className={s.content}>

                <section>
                    <div dangerouslySetInnerHTML={{__html: html}}/>
                </section>

                <section>

                    <div>

                        {/* SORTING */}
                        <div className={s.filterGroup}>
                            <span className={s.filterGroupTitle}>Sort By: </span>
                            <Link
                                to="#"
                                className={s.sortType}
                                onClick={(e) => {
                                    this.setState({
                                        sortOn: SORT_SKU
                                    });
                                }}
                            >
                                Sku
                            </Link>
                            <Link
                                to="#"
                                className={s.sortType}
                                onClick={(e) => {
                                    this.setState({
                                        sortOn: SORT_NAME
                                    });
                                }}
                            >
                                Name
                            </Link>
                        </div>

                        {/* FIELDS */}
                        <div className={s.filterGroup}>
                            <span className={s.filterGroupTitle}>Show: </span>
                            <ul className={s.fieldsList}>
                                {this.state.fields.map((item, index) => {
                                    return <li
                                        className={s.field}
                                        key={"field-" + index}>
                                        <input
                                            id={"Field_" + index}
                                            type="checkbox"
                                            data-id={item.name}
                                            checked={item.selected}
                                            onChange={(e) => {
                                                this.setState({
                                                    fields: this.state.fields.map(itemField => {
                                                        if (itemField['name'] === e.target.getAttribute('data-id')) {
                                                            itemField['selected'] = !itemField['selected']
                                                        }
                                                        return itemField;
                                                    })
                                                })
                                            }}
                                        />
                                        <label
                                            htmlFor={"Field_" + index}
                                            className={s.fieldLabel}>
                                            {item.name}
                                        </label>
                                    </li>
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* ITEMS */}

                    <div
                        id="SelectedItems"
                        className={s.itemList + " sortable"} ref={this.sortableContainersDecorator}>
                        {items.map((item, index) => {
                            return <ArrangableItem
                                key={'item-' + index}
                                state={item}
                                fields={this.state.fields}
                            />
                        })}
                    </div>

                    <form
                        method="GET"
                        onSubmit={(e) => {
                            e.preventDefault();
                            this.save();
                        }}
                        className={s.saveForm + " " + s.flexBox}
                    >
                        <div>
                            <label
                                htmlFor="Title">
                                Line Sheet <strong>Title</strong>:
                            </label>
                            <input
                                id="Title"
                                type="text"
                                ref="title"
                                placeholder="Title"
                                value={this.state.title}
                                onChange={e => {
                                    this.setState({
                                        title: this.refs.title.value
                                    })
                                }}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="FileName">
                                Line Sheet <strong>File Name</strong>:
                            </label>
                            <input
                                id="FileName"
                                type="text"
                                ref="fileName"
                                placeholder="File Name"
                                value={this.state.fileName}
                                onChange={e => {
                                    this.setState({
                                        fileName: this.refs.fileName.value
                                    })
                                }}
                            />
                        </div>
                        <input
                            className={
                                s.button + " " +
                                s.buttonSave +
                                ((this.state.title || "").length > 0 &&
                                (this.state.fileName || "").length > 0
                                    ? "" : " " + s.buttonDisabled)
                            }
                            type="submit"
                            value="Save"/>
                    </form>
                </section>

                <section>
                    {this.status()}
                </section>

                <Link
                    to={'/'}
                    className={
                        s.backButton + " " +
                        s.button + " " +
                        s.buttonCancel
                    }
                >
                    Back
                </Link>

            </Layout>
        );
    }

}

export default OrganizePage;
