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
import s from './Footer.css'

function Footer() {
    return (
        <footer>
            <div className={s.footer__content}>
                &copy;{new Date().getFullYear()} Shelly Brown
            </div>
        </footer>
    );
}

export default Footer;
