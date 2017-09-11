import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Header, Navbar, Nav, Row, Col } from 'rsuite';
import { Markdown } from 'markdownloader';

import '../src/less/index.less';
import './less/index.less';


import CheckTree1 from './examples/CheckTree1';
import CheckTree2 from './examples/CheckTree2';
import ControlledTree from './examples/ControlledTree';
import DynamicTree from './examples/dynamic';


class App extends Component {
  render() {
    return (
      <div className='doc-page'>
        <Header inverse>
          <div className='container'>
            <Navbar.Header>
              <Navbar.Brand>
                <a href='#'><span className='prefix'>R</span>Suite  Tree</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                <Nav.Item href="#Tree">Tree</Nav.Item>
                <Nav.Item href="#CheckTree">CheckTree</Nav.Item>
                <Nav.Item href="#API">API</Nav.Item>
              </Nav>
              <Nav pullRight>
                <Nav.Item href="https://rsuite.github.io">RSuite</Nav.Item>
                <Nav.Item href='https://github.com/rsuite/rsuite-tree'>GitHub</Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Header>

        <div className='container'>
          <Markdown>
            {require('../README.md')}
          </Markdown>
          <br />
          <h2 id="CheckTree"><code>{'# <CheckTree>'}</code></h2>
          <Markdown>
            {require('./md/checkTree1.md')}
          </Markdown>
          <h5><code>非关系状态检查</code></h5>
          {/* <CheckTree2 /> */}
          <Markdown>
            {require('./md/checkTree2.md')}
          </Markdown>
          <br />
          {/* <h5><code>受控组件</code></h5>
          <ControlledTree />
          <Markdown>
            {require('./md/checkTree2.md')}
          </Markdown>
          <br /> */}
          <h5><code>异步加载数据</code></h5>
          <DynamicTree />
          <Markdown>
            {require('./md/checkTree2.md')}
          </Markdown>
          <br />
          <h2 id="API"><code>{'API'}</code></h2>
          <Markdown>
            {require('./md/checkTreeProps.md')}
          </Markdown>

        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />,
  document.getElementById('app')
);