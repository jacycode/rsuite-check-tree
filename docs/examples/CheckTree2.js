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
        data: treeData,
        value: ['Dave']
      });
    }, timeout);
  }

  handleOnChange = (activeNode, layer, event) => {
    console.log(activeNode, layer, event);
  }
  render() {
    const { data, value } = this.state;

    return (
      <div className="doc-example">
        <CheckTree
          defaultExpandAll
          relation={false}
          data={treeData}
          value={value}
          disabledItems={['disabled']}
          height={300}
          onExpand={(activeNode, layer) => {
            console.log(activeNode, layer);
          }}
          onChange={this.handleOnChange}
        />
      </div>
    );
  }
}


export default CheckTree2;