/**
 * Created by fst on 3/10/17.
 */

import React, {PropTypes} from 'react';
import s from './UploadXLSX.css'
import {
    UPLOAD_XLSX
} from '../../src/constants';
import store from '../../src/store';

export default class UploadXLXS extends React.Component {

    static propTypes = {
        openListeners: PropTypes.array
    };

    constructor(props) {
        super(props);
        this.state = {
            files: []
        }
    }

    isAdvancedUpload() {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }

    uploadButtonLabel() {
        return (this.state.files || []).length === 0
            ?
            "Upload"
            :
            this.state.files.length === 1
                ?
                "Upload 1 file"
                :
                "Upload 1 file (only the first will be processed)";
    }

    render() {
        return (<div className={s.xlxsUpload}>
            <form
                className={
                    s.uploadFormContainer
                }
                ref="uploadForm"
                encType="multipart/form-data"
                onDrag={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }}
                onDragStart={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }}
                onDragEnd={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.refs["uploadForm"].classList.remove(s.dragOver);
                    return false;
                }}
                onDragOver={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.refs["uploadForm"].classList.add(s.dragOver);
                    return false;
                }}
                onDragEnter={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.refs["uploadForm"].classList.add(s.dragOver);
                    return false;
                }}
                onDragLeave={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.refs["uploadForm"].classList.remove(s.dragOver);
                    return false;
                }}
                onDrop={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.refs["uploadForm"].classList.remove(s.dragOver);
                    this.setState({
                        files: e.dataTransfer.files
                    });
                    return false;
                }}>
                <input
                    type="file"
                    name="files[]"
                    id="file"
                    ref="files"
                    className={this.isAdvancedUpload() ? s.hidden : ""}
                    data-multiple-caption="{count} files selected" multiple
                    onChange={(e) => {
                        this.setState({
                            files: e.target.files
                        });
                    }}/>
                <label
                    htmlFor="file"
                    className={this.isAdvancedUpload() ? s.chooseFiles : s.hidden}>
                    <strong>Choose a single file</strong> or drag it here.
                </label>

                <div className={this.state.files.length > 1 ? s.uploadLimit : s.hidden}>
                    Only the first file will be processed
                </div>

                <button
                    className={
                        s.button + " " +
                        s.button__upload + " " +
                        ((this.state.files || []).length === 0 ? s.buttonDisabled : "")
                    }
                    type="submit"
                    disabled={(this.state.files || []).length === 0 ? "disabled" : ""}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        store.dispatch({
                            type: UPLOAD_XLSX,
                            form: this.refs.uploadForm,
                            files: this.state.files
                        });
                        this.refs.files.value = "";
                        this.setState({
                            files: []
                        });
                    }}>
                    {this.uploadButtonLabel()}
                </button>

                <div className={s.status}>{store.getState().imageUploadStatus}</div>

            </form>
        </div>)
    }

}