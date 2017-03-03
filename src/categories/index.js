/**
 * Created by fst on 2/7/17.
 */

import React from 'react';
import {title, html} from './index.md';
import s from './styles.css';
import {
    ADD_CATEGORY,
    GET_CATEGORIES,
    ERROR_CATEGORY
} from '../constants';
import Layout from '../../components/Layout';
import Category from '../../components/layout/categories/Category';
import store from '../store';

class CategoriesPage extends React.Component {

    constructor(props) {

        super(props);

        this.addCategory = this.addCategory.bind(this);
        this.updateButtonEnable = this.updateButtonEnable.bind(this);
        this.updateProps = this.updateProps.bind(this);

        this.state = {
            busy: false,
            busyMsg: "",
            loaded: false,
            error: '',
            errorText: '',
            formDisabled: true
        };

    }

    componentWillMount() {
        this.unsubscribeFunciton = store.subscribe(this.updateProps);
    }

    componentDidMount() {
        document.title = title;
        if (!store.getState().inventoryInitialized) {
            store.dispatch({type: GET_CATEGORIES});
            this.setState({busy: true});
        }
    }

    componentWillUnmount() {
        this.unsubscribeFunciton();
    }

    addCategory(e) {

        e.preventDefault();

        var newCategory = this.refs.category.value || '';

        if (newCategory.length === 0) {
            this.setState({
                error: ERROR_CATEGORY,
                categoryErrorText: "Please enter a valid category name"
            });
        } else {
            this.setState({
                error: '',
                categoryErrorText: '',
                busy: true
            });
            store.dispatch({
                type: ADD_CATEGORY,
                category: newCategory
            });
        }

        this.refs.category.value = '';

        this.updateButtonEnable();
    }

    updateButtonEnable(){
        this.setState({
            formDisabled: this.refs.category.value.length === 0
        })
    }

    updateProps() {
        var appState = store.getState();
        this.setState({
            ...this.state,
            busy: false,
            loaded: true,
            error: appState.error || ""
        });
    }

    render() {

        return (
            <Layout className={s.content}>
                <section>
                    <div dangerouslySetInnerHTML={{__html: html}}/>
                </section>
                <section>
                    <h2>Add A Category</h2>
                    <form onSubmit={this.addCategory}>
                        <ul className={s.formItems}>
                            <li>
                                <label htmlFor="Category_Name">Category Name</label>
                                <input type="text"
                                       id="Category_Name"
                                       name="category_name"
                                       placeholder="Category"
                                       ref="category"
                                       className={this.state.error === ERROR_CATEGORY ? s.errorInput : ''}
                                       onChange={this.updateButtonEnable}
                                />
                            </li>
                            <li>
                                <input className={
                                    s.formSubmit + " " +
                                    s.button + " " +
                                    s.buttonSave + " " +
                                    s.align__right +
                                    (this.state.formDisabled ? " " + s.buttonDisabled : "")

                                }
                                       type="submit"
                                       value="Add Category"
                                       disabled={this.state.busy || this.state.formDisabled ? 'disabled' : ''}
                                       onClick={this.addCategory}/>
                            </li>
                            <li>
                                <p className={s.errorMessage}>
                                    {this.state.categoryErrorText}
                                </p>
                            </li>
                        </ul>
                    </form>
                </section>
                <section>
                    <h2>Current Categories</h2>
                    <p className={s.errorMessage}>{this.state.error}</p>
                    <div className={s.categoryList}>
                        {(store.getState().categories || [])
                            .sort((a, b) => {
                                return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
                            })
                            .map((category, index) => {
                                return <Category
                                    id={category.id}
                                    name={category.name}
                                    key={'cat-' + index}
                                    className={index % 2 ? "even" : ""}/>
                            })}
                    </div>
                </section>
            </Layout >
        );
    }

}

export default CategoriesPage;
