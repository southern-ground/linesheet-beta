/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Link from '../Link';
import s from './Navigation.css';

class Navigation extends React.Component {

    componentDidMount() {
        window.componentHandler.upgradeElement(this.root);
    }

    componentWillUnmount() {
        window.componentHandler.downgradeElements(this.root);
    }

    render() {
        return (
            <nav
                className={s.nav}
                ref={node => (this.root = node)}>
                <Link to="/">Items</Link>
                <Link to="/add">Add Item</Link>
                <Link to="/import">Import</Link>
                <Link to="/categories">Categories</Link>
                <Link to="/images">Images</Link>
                <Link to="/sheets">Saved Sheets</Link>
                <Link to="/about">About</Link>
            </nav>
        );
    }

}

export default Navigation;
