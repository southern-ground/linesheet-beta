import React, {PropTypes} from 'react';
import s from './SaveSection.css';
import {
    SAVE_SELECTION,
    sanitizeString
} from '../../src/constants';
import store from '../../src/store';

const FILE_NAME_ERROR = "Please enter a valid filename";

class SaveSection extends React.Component {

    static propTypes = {
        numItems: PropTypes.number,
        numItemsSelected: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);
        this.saveItems = this.saveItems.bind(this);
        this.updateFileName = this.updateFileName.bind(this);
        this.state = {
            errorMsg: ''
        }
    }

    saveItems(e) {

        e.preventDefault();
        e.stopPropagation();

        var fileName = sanitizeString(this.refs.fileName.value || "").toLowerCase();

        if (fileName.length === 0) {
            this.setState({
                errorMsg: FILE_NAME_ERROR
            });
        }else{
            store.dispatch({
                type: SAVE_SELECTION,
                fileName: fileName
            });
        }
    }

    updateFileName(){
        this.setState({
            errorMsg: (this.refs.fileName.value || "").length > 0 ? "" : FILE_NAME_ERROR
        });
    }

    render() {
        return (
            <section>
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

                        <input
                            ref="fileName"
                            placeholder="File Name"
                            disabled={this.props.numItemsSelected == 0}
                            className={this.state.errorMsg !== "" ? " " + s.error__input : ""}
                            onChange={this.updateFileName}
                        />
                        <input
                            type="submit"
                            className={s.align__right + " " +
                            s.button + " " +
                            s.button__save +
                            (this.props.numItemsSelected == 0
                                ? " " + s.button__disabled
                                :
                                "")}
                            disabled={this.props.numItemsSelected == 0}
                            value="Save Selection"
                        />
                        </form>
                    </div>
                </div>
            </section>
        );
    }

}

export default SaveSection;