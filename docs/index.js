import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Header, Navbar, Nav, Row, Col } from 'rsuite';
import { Markdown } from 'markdownloader';
import Affix from 'rsuite-affix';
import CodeView from 'react-code-view';
import cloneDeep from 'lodash/cloneDeep';
import { PageContainer } from 'rsuite-docs';
import 'react-code-view/lib/less/index.less';
import '../src/less/index.less';
import './less/index.less';
import CheckTree from '../src';
import data from './data/treeData';
const largeData = require('./data/testData.json');

const babelOptions = {
  presets: ['stage-0', 'react', 'es2015'],
  plugins: [
    'transform-class-properties'
  ]
};

class App extends Component {
  render() {
    return (
      <PageContainer
        activeKey="CheckTree"
        githubURL="https://github.com/rsuite/rsuite-check-tree"
      >
        <a id="README" className="target-fix" />
        <Markdown>{require('../README.md')}</Markdown>

        <h2 id="examples">示例</h2>
        <Row>
          <Col md={12}>
            <CodeView
              source={require('./md/checkTree1.md')}
              dependencies={{
                data,
                CheckTree
              }}
              babelTransformOptions={babelOptions}
            />
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <CodeView
              source={require('./md/checkTree2.md')}
              dependencies={{
                data,
                CheckTree
              }}
              babelTransformOptions={babelOptions}
            />
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <CodeView
              source={require('./md/controllerTree.md')}
              dependencies={{
                data,
                CheckTree
              }}
              babelTransformOptions={babelOptions}
            />
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <CodeView
              source={require('./md/dynamic.md')}
              dependencies={{
                data,
                CheckTree,
                cloneDeep
              }}
              babelTransformOptions={babelOptions}
            />
          </Col>
        </Row>


        <Row>
          <Col md={12}>
            <CodeView
              source={require('./md/custom.md')}
              dependencies={{
                data,
                CheckTree,
                cloneDeep
              }}
              babelTransformOptions={babelOptions}
            />
          </Col>
        </Row>


        <Row>
          <Col md={12}>
            <CodeView
              source={require('./md/large.md')}
              dependencies={{
                largeData,
                CheckTree,
                cloneDeep
              }}
              babelTransformOptions={babelOptions}
            />
          </Col>
        </Row>

        <h2 >API</h2>
        <Markdown>
          {require('./md/props.md')}
        </Markdown>
      </PageContainer>
    );
  }
}

ReactDOM.render(<App />,
  document.getElementById('app')
);
