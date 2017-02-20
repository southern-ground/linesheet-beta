import React, {PropTypes} from 'react';
import s from './InventoryItemsFooter.css';
import {
    ORGANIZE_SELECTION,
    sanitizeString
} from '../../src/constants';
import store from '../../src/store';
import Link from '../../components/Link';

const FILE_NAME_ERROR = "Please enter a valid filename";

class InventoryItemsFooter extends React.Component {

    static propTypes = {
        numItems: PropTypes.number,
        numItemsSelected: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            errorMsg: ''
        }
    }

    render() {
        return (
            <section className={this.props.className}>
                <div className={s.saveNav}>
                    <span className={s.selectCount}>
                        {this.props.numItemsSelected} of {this.props.numItems} selected.
                    </span>
                    <div>
                        <form onSubmit={this.saveItems}>
                            <span
                                className={s.error__message + " " + s.inputErrorMsg}>
                                {this.state.errorMsg}
                            </span>

                            <Link
                                type="submit"
                                className={
                                    s.align__right + " " +
                                    s.button + " " +
                                    s.button__save +
                                    (this.props.numItemsSelected == 0
                                        ? " " + s.button__disabled
                                        :
                                        "")
                                }
                                to={'./organize'}
                                disabled={this.props.numItemsSelected === 0}>
                                {"Organize Selection" + (this.props.numItemsSelected > 1 ? "s" : "")}
                            </Link>
                        </form>
                    </div>
                </div>
            </section>
        );
    }

}

export default InventoryItemsFooter;