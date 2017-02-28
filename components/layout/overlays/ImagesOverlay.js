/**
 * Created by fst on 2/16/17.
 */
import React, {PropTypes} from 'react';
import s from './ImagesOverlay.css';
import store from '../../../src/store';
import EditItemImage from '../../../components/layout/images/EditItemImage';
import {
    ITEM_IMAGE_PATH,
    UPLOAD_IMAGES
} from '../../../src/constants';

import {} from '../../../src/constants';

class ImagesOverlay extends React.Component {

    static propTypes = {
        selectImage: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            uploadFormOpen: false
        }
    }

    componentDidMount() {

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
                "Upload " + this.state.files.length + " files";
    }

    render() {

        return (
            <div className={s.imageOverlay}
                 onDragEnd={e => {
                     e.preventDefault();
                     e.stopPropagation();
                     return false;
                 }}
                 onDrop={e => {
                     e.preventDefault();
                     e.stopPropagation();
                     return false;
                 }}>
                <h2 className={s.addItemFormHeading}>
                    Images
                </h2>

                <button
                    className={
                        s.button + " " +
                        s.buttonOpenUpload +
                        (this.state.uploadFormOpen ? " " + s.hidden : "")
                    }
                    onClick={(e) => {
                        this.refs["uploadForm"].classList.toggle(s.uploadFormOpen);
                        this.refs["imagesList"].classList.toggle(s.imagesListOpen);
                        this.setState({uploadFormOpen: true})
                    }}>
                    Upload
                </button>
                <button
                    className={
                        s.button + " " +
                        s.buttonOpenUpload +
                        (this.state.uploadFormOpen ? "" : " " + s.hidden)
                    }
                    onClick={(e) => {
                        this.refs["uploadForm"].classList.toggle(s.uploadFormOpen);
                        this.refs["imagesList"].classList.toggle(s.imagesListOpen);
                        this.setState({uploadFormOpen: false})
                    }}>
                    Close
                </button>

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
                        type="file" name="files[]" id="file" ref="files"
                        data-multiple-caption="{count} files selected" multiple
                        className={this.isAdvancedUpload() ? s.hidden : ""}
                        onChange={(e) => {

                            this.setState({
                                files: e.target.files
                            });

                        }}/>
                    <label
                        htmlFor="file"
                        className={this.isAdvancedUpload() ? "" : s.hidden}>
                        <strong>Choose a file</strong>
                        <span className="box__dragndrop"> or drag it here</span>.
                    </label>
                    <button
                        className={
                            s.button + " " +
                            s.button__upload + " " +
                            ((this.state.files || []).length === 0 ? s.button__disabled : "")
                        }
                        type="submit"
                        disabled={(this.state.files || []).length === 0 ? "disabled" : ""}
                        onClick={(e)=>{
                            e.stopPropagation();
                            e.preventDefault();
                            store.dispatch({
                                type: UPLOAD_IMAGES,
                                form: this.refs.uploadForm,
                                files: this.state.files
                            });
                        }}
                    >
                        {this.uploadButtonLabel()}
                    </button>

                    <div className={s.status}>{store.getState().imageUploadStatus}</div>
                </form>

                <ul className={s.imagesList}
                    ref="imagesList">
                    {this.props.images.map((image, index) => {
                        return (<EditItemImage
                            imagePath={ITEM_IMAGE_PATH}
                            imageName={image}
                            key={' product-image-' + index}
                            selectImage={this.props.selectImage}
                            selectedImage={this.props.selectedImage}
                        />);
                    })}
                </ul>
            </div>
        );
    }

}

export default ImagesOverlay;
