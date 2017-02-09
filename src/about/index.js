
import React from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';
import {title, html} from './index.md';

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
