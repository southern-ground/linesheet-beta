/**
 * Created by fst on 2/28/17.
 */

import React, {PropTypes} from 'react';
import {
  title,
  html
} from './index.md';
import s from './styles.css';
import {
  DELETE_IMAGE,
  GET_IMAGES,
  ITEM_IMAGE_PATH
} from '../constants';
import Layout from '../../components/Layout';
import ItemImage from '../../components/layout/images/ItemImage';
import UploadImage from '../../components/layout/UploadImage';
import Link from '../../components/Link';
import store from '../store';

class ImagePage extends React.Component {

  /*
  * TODO: Break Out Upload Image form to standalone Component.
  * TODO: Add that brand-spanking new component RIGHT HERE.
  * */

  constructor(props) {

    super(props);

    this.updateProps = this.updateProps.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.state = {
      images: [],
      msg: ""
    };

  }

  componentWillMount() {
    this.unsubscribeFunciton = store.subscribe(this.updateProps);
  }

  componentDidMount() {
    document.title = title;
    var imageStore = store.getState().imageStore;
    if (!imageStore.initialized) {
      store.dispatch({
        type: GET_IMAGES
      })
    } else {
      this.setState({
        images: imageStore.images
      })
    }
  }

  componentWillUnmount() {
    this.unsubscribeFunciton();
  }

  deleteImage(id) {
    console.log('ImagePage::deleteImage', id);
    store.dispatch({
      type: DELETE_IMAGE,
      imageName: id
    });
  }

  updateProps() {
    var imageStore = store.getState().imageStore;
    this.setState({
      ...this.state,
      images: imageStore.images,
      status: imageStore.deleteStatus,
      msg: imageStore.deleteStatusMsg,
      itemSku: imageStore.itemSku
    });
  }

  render() {

    return (
      <Layout className={s.content}>

        <section>
          <div dangerouslySetInnerHTML={{__html: html}}/>
        </section>

        <UploadImage/>

        <section>

          <ul className={s.imagesList}>
            {this.state.images.map((image, index) => {
              return <ItemImage
                key={"image_" + index}
                imageName={image}
                imagePath={ITEM_IMAGE_PATH}
                deleteFunc={this.deleteImage}
              />
            })}
          </ul>
        </section>

        <div
          className={this.state.msg === "" ? s.hidden : s.modalBlocker}
          ref="deleteMessageModal">
          <div className={s.modal}>
                        <span className={s.modalTitle}>
                            {this.state.status === 0 ? "Success" : "Could Not Delete Image"}
                            </span>
            <span className={s.modalMessage}>
                            {this.state.msg}
              <strong>{this.state.itemSku !== "" ? "#" + this.state.itemSku : ""}</strong>
                        </span>
            <span className={s.modalEdit}>
                            {this.state.itemSku === "" ? "" : <Link to={"/edit/" + this.state.itemSku}>Edit Item</Link>}
                        </span>
            <button
              className={s.button}
              onClick={e => {
                this.setState({
                  msg: ''
                });
              }}>
              OK
            </button>
          </div>
        </div>

      </Layout>
    );
  }

}

export default ImagePage;
