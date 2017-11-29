import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Header, Navbar, Nav, Row, Col } from 'rsuite';
import { Markdown } from 'markdownloader';
import Affix from 'rsuite-affix';
import CodeView from 'react-code-view';
import cloneDeep from 'lodash/cloneDeep';
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
      <div className="doc-page">
        <Header inverse>
          <div className="container">
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#"><span className="prefix">R</span>Suite CheckTree</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                <Nav.Item href="#README">CheckTree</Nav.Item>
                <Nav.Item href="#API">API</Nav.Item>
              </Nav>
              <Nav pullRight>
                <Nav.Item href="https://rsuite.github.io">RSuite</Nav.Item>
                <Nav.Item href="https://github.com/rsuite/rsuite-check-tree">GitHub</Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Header>

        <div className="container">
          <Row>
            <Col md={2} xsHidden smHidden>
              <Affix offsetTop={70}>
                <Nav pills stacked className="sidebar">
                  <Nav.Item href="#README"># 概述</Nav.Item>
                  <Nav.Item href="#examples"># 示例</Nav.Item>
                  <Nav.Item href="#relation">&nbsp;&nbsp;- 关系检查</Nav.Item>
                  <Nav.Item href="#unrelation">&nbsp;&nbsp;- 非关系检查</Nav.Item>
                  <Nav.Item href="#controlled">&nbsp;&nbsp;- 受控组件</Nav.Item>
                  <Nav.Item href="#dynamic">&nbsp;&nbsp;- 异步加载数据</Nav.Item>
                  <Nav.Item href="#custom">&nbsp;&nbsp;- 自定义图标</Nav.Item>
                  <Nav.Item href="#large">&nbsp;&nbsp;- Large Data</Nav.Item>
                  <Nav.Item href="#API"># API</Nav.Item>
                </Nav>
              </Affix>
            </Col>
            <Col md={10}>
              <a id="README" className="target-fix" />
              <Markdown>{require('../README.md')}</Markdown>
              <hr id="relation" className="target-fix" />
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
              <hr id="unrelation" className="target-fix" />
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
              <hr id="relation" className="target-fix" />
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
              <hr id="dynamic" className="target-fix" />
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

              <hr id="custom" className="target-fix" />
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

              <hr id="large" className="target-fix" />
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
              <h2 id="API"><code>{'API'}</code></h2>
              <Markdown>
                {require('./md/props.md')}
              </Markdown>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />,
  document.getElementById('app')
);
