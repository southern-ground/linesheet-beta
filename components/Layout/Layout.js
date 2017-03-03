/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, {PropTypes} from 'react';
import cx from 'classnames';
import s from './Layout.css';
import Header from './Header';
import Footer from '../Footer';
import store from '../../src/store';

class Layout extends React.Component {

    static propTypes = {
        className: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.getBusyMessage = this.getBusyMessage.bind(this);
        this.updateProps = this.updateProps.bind(this);
        var appState = store.getState();
        this.state = {busy: appState.busy, busyMsg: appState.busyMsg};
    }

    componentWillMount() {
        this.unsubscribeFunciton = store.subscribe(this.updateProps);
    }

    componentDidMount() {
        window.componentHandler.upgradeElement(this.root);
    }

    componentWillUnmount() {
        window.componentHandler.downgradeElements(this.root);
        this.unsubscribeFunciton();
    }

    getBusyMessage(){
        return this.state.busyMsg == "" ? "" : <p className={s.busyMessage}>({this.state.busyMsg})</p>;
    }

    updateProps() {
        var appState = store.getState();
        this.setState({...this.state, busy: appState.busy, busyMsg: appState.busyMsg});
    }

    render() {
        return (
            <div className="mdl-layout mdl-js-layout" ref={node => (this.root = node)}>

                <div className={s.blocker + " " + (this.state.busy ? "" : s.hidden)} ref="blocker">
                    <p>Please Wait &#133;</p>
                    {this.getBusyMessage()}
                </div>

                <div className="mdl-layout__inner-container">
                    <Header />
                    <main className="mdl-layout__content">
                        <div {...this.props} className={cx(s.content, this.props.className)}/>
                        <Footer />
                    </main>
                </div>
            </div>
        );
    }
}

export default Layout;
