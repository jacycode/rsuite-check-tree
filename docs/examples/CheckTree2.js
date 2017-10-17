import React, { Component } from 'react';
import CheckTree from '../../src';
import treeData from '../data/treeData';

class CheckTree2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: ['Dave']
    };
  }
  render() {
    const { data, value } = this.state;

    return (
      <div className="doc-example">
        <CheckTree
          defaultExpandAll
          cascade={false}
          data={treeData}
          defaultValue={value}
          disabledItems={['disabled']}
          height={400}
          onChange={(values) => {
            console.log(values);
          }}
          onSelect={(activeNode, layer) => {
            console.log(activeNode, layer);
          }}
          onExpand={(activeNode, layer) => {
            console.log(activeNode, layer);
          }}
        />
      </div>
    );
  }
}

export default CheckTree2;