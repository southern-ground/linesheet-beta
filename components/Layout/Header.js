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
import s from './Header.css';
import Navigation from './Navigation';
import Link from '../Link';

class Header extends React.Component {

    componentDidMount() {
        window.componentHandler.upgradeElement(this.root);
    }

    componentWillUnmount() {
        window.componentHandler.downgradeElements(this.root);
    }

    render() {
        return (
            <header className={s.header} ref={node => (this.root = node)}>

                <div className={s.headerContent}>
                    <Link className={s.title} to="/">
                        Line Sheet Generator
                    </Link>
                    <Navigation />
                </div>
            </header>
        );
    }

}

export default Header;
