/**
 * Created by fst on 2/1/17.
 */

import React from 'react';
import {title, html} from './index.md';
import s from './styles.css';
import Layout from '../../components/Layout';

class AboutPage extends React.Component {

    componentDidMount() {
        document.title = title;
    }

  render() {
    return (
      <Layout className={s.content}>
          <section>
              <div dangerouslySetInnerHTML={{__html: html}}/>
          </section>
      </Layout>
    );
  }

}

export default AboutPage;
