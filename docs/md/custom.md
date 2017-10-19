```js
import React, { Component } from 'react';
import _ from 'lodash';
import CheckTree from 'rsuite-check-tree';
import treeData from '../data/treeData';


const newTreeData = [{
  value: 'children1',
  label: 'children1'
}];
class CheckTree2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: treeData,
      selectedValues: ['Dave']
    };
  }

  setExpand(activeNode) {
    const { data } = this.state;
    const nextTreeData = _.cloneDeep(data);
    const loop = (nodes) => {
      nodes.forEach((node) => {
        if (node.value === activeNode.value) {
          node.expand = activeNode.expand;
        }
        if (node.children) {
          loop(node.children);
        }
      });
    };

    loop(nextTreeData);
    this.setState({
      data: nextTreeData
    });
  }

  handleOnChange = (values) => {
    console.log(values);
    this.setState((preveState) => {
      return {
        selectedValues: values
      };
    });
  }

  handleOnExpand = (activeNode, layer) => {
    if (activeNode.children.length) {
      this.setExpand(activeNode);
    }
  }

  renderTreeIcon = (nodeData) => {
    if (nodeData.expand) {
      return (
        <i className="icon-minus-square-o icon " />
      );
    }
    return (
      <i className="icon-plus-square-o icon " />
    );
  }

  render() {
    const { data, selectedValues } = this.state;

    return (
      <div className="doc-example">
        <CheckTree
          defaultExpandAll
          cascade={false}
          data={data}
          value={selectedValues}
          disabledItems={['disabled']}
          height={400}
          onExpand={this.handleOnExpand}
          onChange={this.handleOnChange}
          renderTreeIcon={this.renderTreeIcon}
        />
      </div>
    );
  }
}

export default CheckTree2;

```