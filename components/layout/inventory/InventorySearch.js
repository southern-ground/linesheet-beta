/**
 * Created by fst on 3/3/17.
 */

import React, {PropTypes} from 'react';
import s from './InventorySearch.css';

export default class InventorySearch extends React.Component {

    static propTypes = {
        filterFunc: PropTypes.func,
        filterOnSelectedFunc: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            search: "",
            filterOnSelected: false
        }
    }

    clearSearch() {

        if (this.props.filterFunc) {
            this.props.filterFunc("");
        };

        this.setState({
            search: ""
        });
    }

    updateSearch(str) {

        if (this.props.filterFunc) {
            this.props.filterFunc(str);
        };

        this.setState({
            search: str
        });

    }

    updateFilter(str) {

        if (this.props.filterOnSelectedFunc) {
            this.props.filterOnSelectedFunc(str);
        };

        this.setState({
            filterOnSelected: str
        });

    }

    render() {
        return <div className={s.inventorySearch}>

            <label
                className={s.label}
                htmlFor="FilterOnSelected">
                Filter on Selected:
            </label>
            <input
                id="FilterOnSelected"
                ref="selectOnFilter"
                type="checkbox"
                className={s.filterOn}
                value={this.state.filterOnSelected}
                onChange={(e) => {
                    this.updateFilter(e.target.checked)
                }}
            />

            <label
                className={s.label}
                htmlFor="InventorySearch">
                Search:
            </label>
            <input
                className={s.input}
                id="InventorySearch"
                ref="searchField"
                type="text"
                value={this.state.search}
                onChange={(e) => {
                    this.updateSearch(e.target.value);
                }}
                placeholder="SKU or Name"
            />

            <img
                className={s.clear + (this.state.search.length > 0 ? " " + s.active : "")}
                src="../images/delete.svg"
                ref="clear"
                onClick={e => {
                    this.clearSearch();
                }}
            />

        </div>
    }
}