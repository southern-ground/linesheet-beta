import React from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';
import {title, html} from './index.md';
import store from '../../src/store';
import {
    ERROR_SKU,
    ERROR_NAME,
    GET_IMAGES,
    GET_INVENTORY,
    ITEM_IMAGE_PATH,
    ITEM_IMAGE_PLACEHOLDER,
    UPDATE_ITEM,
    SKU_FIELD_REF,
    NAME_FIELD_REF,
    IMAGE_SRC_REF,
    MATERIAL_FIELD_REF,
    SWAROVSKI_FIELD_REF,
    NAT_FIELD_REF,
    CATEGORIES_FIELD_REF,
    WHOLESALE_FIELD_REF,
    MSRP_FIELD_REF,
    sanitizeProductName
} from '../constants';
import CategorySelect from '../../components/layout/categories/CategorySelect';
import Link from '../../components/Link';
import ImageOverlay from '../../components/layout/overlays/ImagesOverlay';

class EditPage extends React.Component {

    constructor(props) {

        super(props);

        this.selectImage = this.selectImage.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.updateImage = this.updateImage.bind(this);
        this.updateProps = this.updateProps.bind(this);

        this.state = {
            edited: false,
            initialized: false,
            item: {
                sku: this.props.route.params.id,
                name: "",
                image: "",
                material: "",
                swavoski: "",
                natural: "",
                categories: [],
                wholesale: "",
                msrp: ""
            },
            error: "",
            errorText: ""
        };

    }

    componentWillMount() {
        this.unsubscribeFunciton = store.subscribe(this.updateProps);
    }

    componentDidMount() {

        document.title = title;

        var appState = store.getState();

        if (!appState.inventoryInitialized) {
            store.dispatch({
                type: GET_INVENTORY
            });
            this.setState({
                busy: true
            });
        } else {
            this.updateProps();
        }
    }

    componentWillUnmount() {
        this.unsubscribeFunciton();
    }

    getCategories() {
        var checkboxes = this.refs[CATEGORIES_FIELD_REF].getElementsByTagName('input'),
            itemCategories = new Array();

        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == 'checkbox') {
                if (checkboxes[i].checked) {
                    itemCategories.push(checkboxes[i].getAttribute('data-id'));
                }
            }
        }

        return itemCategories;
    }

    selectImage(img) {
        console.log('EditPage::selectImage', img);
        this.setState({
            ...this.state,
            item: {
                ... this.state.item,
                image: img
            },
            edited: true
        })
    }

    updateField(ref) {

        var item = this.state.item;

        switch (ref) {
            case SKU_FIELD_REF:
                item.sku = this.refs[ref].value;
                break;
            case NAME_FIELD_REF:
                item.name = this.refs[ref].value;
                break;
            case MATERIAL_FIELD_REF:
                item.material = this.refs[ref].value;
                break;
            case SWAROVSKI_FIELD_REF:
                item.swarovski = this.refs[ref].value;
                break;
            case NAT_FIELD_REF:
                item.natural = this.refs[ref].value;
                break;
            case WHOLESALE_FIELD_REF:
                item.wholesale = this.refs[ref].value;
                break;
            case MSRP_FIELD_REF:
                item.msrp = this.refs[ref].value;
                break;
        }

        item.categories = this.getCategories();

        this.setState({
            edited: true,
            item: item
        });

    }

    updateImage(e) {
        e.preventDefault();
        e.stopPropagation();
        this.refs.imageOverlay.classList.toggle(s.hidden);
        if (!store.getState().imagesInitialized) {
            store.dispatch({
                type: GET_IMAGES
            });
        }
    }

    updateItem(e) {

        e.preventDefault();

        var item = {
                sku: this.state.item.sku,
                name: sanitizeProductName(this.refs[NAME_FIELD_REF].value || ''),
                image: this.state.item.image,
                material: this.refs[MATERIAL_FIELD_REF].value || '',
                swarovski: this.refs[SWAROVSKI_FIELD_REF].value || '',
                natural: this.refs[NAT_FIELD_REF].value || '',
                categories: this.getCategories().join(','),
                wholesale: this.refs[WHOLESALE_FIELD_REF].value || 0,
                msrp: this.refs[MSRP_FIELD_REF].value || 0
            },
            newState = {
                error: '',
                itemErrorText: ''
            };

        if (item.sku.length === 0) {
            newState.error = ERROR_SKU;
            newState.itemErrorText = "Please enter a valid sku";
        } else if (item.name.length === 0) {
            newState.error = ERROR_NAME;
            newState.itemErrorText = "Please enter a valid name";
        }

        if (newState.error.length) {
            this.setState(newState);
        } else {

            console.log('EditPage::updateItem item:',item);
            store.dispatch({
                type: UPDATE_ITEM,
                item: item
            });
            this.setState({
                edited: false
            });
        }
    }

    toggleCategory(id) {
        var item = this.state.item,
            categories = this.state.item.categories,
            index = categories.indexOf(id);

        if (index == -1) {
            categories.push(id);
        } else {
            categories.splice(index, 1)
        }
        item.categories = categories;

        this.setState({
            edited: true,
            item: item
        });

    }

    updateProps() {
        var appState = store.getState(),
            filteredInventory = (appState.inventory || []).filter((inventoryItem) => {
                return inventoryItem.sku === this.state.item.sku
            }),
            currentItem,
            newState = {
                ...this.state
            };
        if (filteredInventory.length > 0) {
            currentItem = filteredInventory.pop();
            newState = {
                ...newState,
                item: {
                    ...currentItem,
                    categories: currentItem.categories.split(',') || []
                },
                busy: false
            };
        }

        console.log('EditPage::updateProps state:',newState);
        this.setState(newState);

    }

    render() {

        var appState = store.getState();

        console.log('EditPage::render image:', this.state.item.image);
        return (
            <Layout className={s.content}>
                <section>
                    <div dangerouslySetInnerHTML={{__html: html}}/>
                </section>
                <section>
                    <form className={s.itemEditForm} onSubmit={this.updateItem}>
                        <ul className={s.formItems}>
                            <li>
                                <label htmlFor="Item_SKU">SKU</label>
                                <input
                                    type="text"
                                    id="Item_SKU"
                                    name="item_sku"
                                    placeholder="SKU"
                                    ref={SKU_FIELD_REF}
                                    className={this.state.error === ERROR_SKU ? s.error__input : ""}
                                    value={this.state.item.sku}
                                    disabled
                                    onChange={(e) => {
                                        this.updateField(SKU_FIELD_REF);
                                    }}
                                />
                            </li>
                            <li>
                                <label htmlFor="Item_Name">Item Name</label>
                                <input
                                    type="text"
                                    id="Item_Name"
                                    name="item_name"
                                    placeholder="Item Name"
                                    ref={NAME_FIELD_REF}
                                    className={this.state.error === ERROR_NAME ? s.error__input : ""}
                                    value={this.state.item.name}
                                    onChange={(e) => {
                                        this.updateField(NAME_FIELD_REF);
                                    }}
                                />
                            </li>
                            <li>
                                <label htmlFor="Item_Image">Item Image</label>
                                <img
                                    className={s.itemImage}
                                    ref={IMAGE_SRC_REF}
                                    src={ this.state.item.image
                                        ?
                                        ITEM_IMAGE_PATH + this.state.item.image
                                        :
                                        ITEM_IMAGE_PLACEHOLDER}/>
                                <button
                                    className={s.button}
                                    onClick={this.updateImage}>
                                    Change
                                </button>
                            </li>
                            <li>
                                <label htmlFor="Item_Material">Material</label>
                                <input
                                    type="text"
                                    id="Item_Material"
                                    name="item_material"
                                    placeholder="Item Material"
                                    ref={MATERIAL_FIELD_REF}
                                    value={this.state.item.material}
                                    onChange={(e) => {
                                        this.updateField(MATERIAL_FIELD_REF);
                                    }}
                                />
                            </li>
                            <li>
                                <label htmlFor="Item_Swavoski">Swavoski Stones</label>
                                <input
                                    type="text"
                                    id="Item_Name"
                                    name="item_swavoski"
                                    placeholder="Swavoski Stones"
                                    ref={SWAROVSKI_FIELD_REF}
                                    value={this.state.item.swarovski}
                                    onChange={(e) => {
                                        this.updateField(SWAROVSKI_FIELD_REF);
                                    }}
                                />
                            </li>
                            <li>
                                <label htmlFor="Item_Natural">Natural Stones</label>
                                <input
                                    type="text"
                                    id="Item_Natural"
                                    name="item_natural"
                                    placeholder="Natural Stones"
                                    ref={NAT_FIELD_REF}
                                    value={this.state.item.natural}
                                    onChange={(e) => {
                                        this.updateField(NAT_FIELD_REF);
                                    }}
                                />
                            </li>
                            <li>
                                <label htmlFor="Category_Name">Product Category</label>
                                <ul
                                    ref={CATEGORIES_FIELD_REF}
                                    className={s.categoriesList}>
                                    {
                                        (appState.categories || [])
                                            .map((category, index) => {
                                                return <CategorySelect
                                                    id={category.id}
                                                    name={category.name}
                                                    index={index}
                                                    key={"category-" + index}
                                                    checked={(this.state.item.categories || [])
                                                        .filter(catId => {
                                                            return catId === category.id
                                                        })
                                                        .length > 0}
                                                    change={(e, id) => {
                                                        this.toggleCategory(id);
                                                    }}
                                                />
                                            })
                                    }
                                </ul>
                            </li>
                            <li>
                                <label htmlFor="Item_Wholesale">Wholesale Price </label>
                                <input type="text"
                                       id="Item_Wholesale"
                                       name="item_wholesale"
                                       placeholder="$0.00"
                                       ref={WHOLESALE_FIELD_REF}
                                       value={this.state.item.wholesale}
                                       onChange={(e) => {
                                           this.updateField(WHOLESALE_FIELD_REF);
                                       }}
                                />
                            </li>
                            <li>
                                <label htmlFor="Item_MSRP">MSRP</label>
                                <input
                                    type="text"
                                    id="Item_MSRP"
                                    name="item_msrp"
                                    placeholder="$0.00"
                                    ref={MSRP_FIELD_REF}
                                    value={this.state.item.msrp}
                                    onChange={(e) => {
                                        this.updateField(MSRP_FIELD_REF);
                                    }}
                                />
                            </li>
                            <li className={s.as__row + " " + s.align__right}>
                                <Link to="#"
                                      className={
                                          s.button + " " +
                                          s.button__save + " " +
                                          s.formSubmit + " " +
                                          s.button__group +
                                          (this.state.edited ? "" : " " + s.button__disabled)
                                      }
                                      onClick={this.updateItem}
                                      disabled={this.state.edited}
                                >Update Item</Link>
                                <Link to={'/'}
                                      className={
                                          s.button + " " +
                                          s.button__cancel + " " +
                                          s.button__group}>
                                    Done
                                </Link>
                            </li>
                            <li>
                                <p className={s.error__message}>{this.state.itemErrorText}</p>
                            </li>
                        </ul>
                    </form>
                </section>
                <section ref="imageOverlay" className={s.overlaySection + " " + s.hidden}>
                    <div className={s.content + " " + s.overlayContent}>
                        <button
                            className={s.button + " " + s.button__close}
                            onClick={(e) => {
                                this.refs.imageOverlay.classList.toggle(s.hidden);
                            }}>Close
                        </button>
                        <ImageOverlay
                            images={appState.images}
                            selectedImage={this.state.item.image}
                            selectImage={this.selectImage}
                        />
                    </div>
                </section>
            </Layout>
        );
    }

}

export default EditPage;
