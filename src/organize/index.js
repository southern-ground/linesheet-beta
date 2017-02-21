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
            fields: [
                {name: "Materials", field: "material", selected: true},
                {name: "MSRP", field: "msrp", selected: true},
                {name: "Wholesale", field: "wholesale", selected: true}
            ]
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

        var els = ((htmlCollection) => {
                var a = [], i = 0;
                for (i; i < htmlCollection.length; i++) {
                    a.push(htmlCollection[i]);
                }
                return a;
            })(e.to.children),
            inventory = store.getState().inventory,
            newOrder = [];

        els.forEach(item => {
            /*var match = inventory.filter
             newOrder.push(
             inventory.filter(ii=>{
             return ii.sku === item.getAttribute('data-sku');
             }).pop());*/
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

    updateProps() {

        console.log('OrganizePage::updateProps parity:', (store.getState().inventory === this.state.orderedInventory));

        this.setState({
            ...this.state,
            loading: false
        });

    }

    render() {

        console.log('OrganizePage::render');

        var items = store.getState().inventory
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

                </section>

                <Link
                    to={'/'}
                    className={
                        s.backButton + " " +
                        s.button + " " +
                        s.button__cancel
                    }
                >
                    Back
                </Link>

            </Layout>
        );
    }

}

export default OrganizePage;
