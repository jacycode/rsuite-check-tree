import React, { Component } from 'react';
import _ from 'lodash';
import CheckTree from '../../src';
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
          relation={false}
          data={data}
          value={selectedValues}
          disabledItems={['disabled']}
          height={400}
          onExpand={this.handleOnExpand}
          onChange={this.handleOnChange}
          onSelect={this.hanldeOnSelect}
          renderTreeIcon={this.renderTreeIcon}
        />
      </div>
    );
  }
}

export default CheckTree2;
