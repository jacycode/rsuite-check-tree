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

  componentDidMount() {
    // this.loadTreeDataAsync(3000);
  }

  setTreeData = (child, activeNode, layer, treeNodes) => {
    const nextTreeData = _.cloneDeep(treeNodes);
    if (layer < 0) {
      return;
    }

    const loop = (nodes) => {
      nodes.forEach((node) => {
        if (node.value === activeNode.value && activeNode.expand) {
          node.children = [...node.children, ...child];
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

  setLoading(activeNode, loading = true) {
    const { data } = this.state;
    const nextTreeData = _.cloneDeep(data);
    const loop = (nodes) => {
      nodes.forEach((node) => {
        if (node.value === activeNode.value) {
          node.loading = loading;
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

  loadData = (avtiveNode, layer) => {
    const { data } = this.state;
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setTreeData(newTreeData, avtiveNode, layer, data);
        resolve();
      }, 2000);
    });
  }

  handleOnClick = () => {
    this.setState({
      data: treeData
    });
  }


  handleOnChange = (values) => {
    this.setState((preveState) => {
      return {
        selectedValues: [...preveState.selectedValues, ...values]
      };
    });
  }

  handleOnExpand = (activeNode, layer) => {
    if (activeNode.children.length === 0) {
      activeNode.expand && this.setLoading(activeNode, true);
      this.loadData(activeNode, layer)
        .then(() => {
          this.setLoading(activeNode, false);
        });
    }
  }
  renderTreeNode = (nodeData) => {
    if (nodeData.loading) {
      return (
        <span>
          <i className="icon-spinner icon icon-spin" />
          {nodeData.label}
        </span>
      );
    }
    return nodeData.label;
  }

  render() {
    const { data, selectedValues, test } = this.state;

    return (
      <div className="doc-example">
        <CheckTree
          test={test}
          defaultExpandAll
          relation={true}
          data={data}
          value={selectedValues}
          disabledItems={['disabled']}
          height={300}
          onExpand={this.handleOnExpand}
          onChange={this.handleOnChange}
          onSelect={this.hanldeOnSelect}
          renderTreeNode={this.renderTreeNode}
        />
      </div>
    );
  }
}

export default CheckTree2;

```
