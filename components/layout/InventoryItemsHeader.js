/**
 * Created by fst on 4/19/17.
 */

import React, {PropTypes} from 'react';
import s from './InventoryItemsHeader.css';
import Link from '../../components/Link';

class InventoryItemsHeader extends React.Component {

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
                                className={s.errorMessage + " " + s.inputErrorMsg}>
                                {this.state.errorMsg}
                            </span>

                            <Link
                                type="submit"
                                className={
                                    s.align__right + " " +
                                    s.button + " " +
                                    s.buttonSave +
                                    (this.props.numItemsSelected == 0
                                        ? " " + s.buttonDisabled
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

export default InventoryItemsHeader;