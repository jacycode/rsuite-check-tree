import React, { Component } from 'react';
import CheckTree from '../../src';
import treeData from '../data/treeData';

class CheckTree2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentWillMount() {
    this.loadTreeDataAsync(3000);
  }
  loadTreeDataAsync = (timeout) => {
    setTimeout(() => {
      this.setState({
        data: treeData
      });
    }, timeout);
  }
  render() {
    const { data } = this.state;
    return (
      <div className="doc-example">
        <CheckTree
          defaultExpandAll
          relation={false}
          data={data}
          value={['Dave']}
          disabledItems={['disabled']}
          height={300}
          onExpand={(activeNode, layer) => {
            console.log(activeNode, layer);
          }}
          onChange={(activeNode, layer, event) => {
            console.log(activeNode, layer, event);
          }}
        />
      </div>
    );
  }
}


export default CheckTree2;