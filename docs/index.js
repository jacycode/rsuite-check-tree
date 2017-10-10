import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Header, Navbar, Nav, Row, Col } from 'rsuite';
import { Markdown } from 'markdownloader';
import Affix from 'rsuite-affix';

import '../src/less/index.less';
import './less/index.less';

import CodeComponent from './components/CodeComponent';

import CheckTree1 from './examples/CheckTree1';
import CheckTree2 from './examples/CheckTree2';
import ControlledTree from './examples/ControlledTree';
import DynamicTree from './examples/Dynamic';
import CustomIcon from './examples/CustomIcon';
import LargeData from './examples/LargeData';

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
                  <Nav.Item href="#API"># API</Nav.Item>
                </Nav>
              </Affix>
            </Col>
            <Col md={10}>
              <a id="README" className="target-fix" />
              <Markdown>{require('../README.md')}</Markdown>

              <h2 id="examples"><code>示例</code></h2>
              <h5 id="relation"><code>关系状态检查</code></h5>
              {<CheckTree1 /> }
              <CodeComponent md={require('./md/checkTree1.md')} />
              <h5 id="unrelation"><code>非关系状态检查</code></h5>
              {<CheckTree2 /> }
              <CodeComponent md={require('./md/checkTree2.md')} />
              <br />
              <h5 id="controlled"><code>受控组件</code></h5>
              {<ControlledTree /> }
              <CodeComponent md={require('./md/controllerTree.md')} />
              <br />
              <h5 id="dynamic"><code>异步加载数据</code></h5>
              {<DynamicTree />}
              <CodeComponent md={require('./md/dynamic.md')} />
              <div>
                <code>注意：在使用动态加载数据时，应当注意对 data 进行 深拷贝后再出入到 check-tree 组件中。如示例当中的，使用 _.cloneDeep() 对原始 data 进行深拷贝后再进行操作</code>
              </div>
              <br />
              <h5 id="custom"><code>自定义图标</code></h5>
              {<CustomIcon />}
              <CodeComponent md={require('./md/custom.md')} />

              <h5 id="custom"><code>Large Data</code></h5>
              {<LargeData />}
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
