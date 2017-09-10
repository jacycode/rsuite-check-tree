import React, { Component } from 'react';
import _ from 'lodash';
import CheckTree from '../../src';
import treeData from '../data/treeData';


class LoadDataTree extends Component {
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
  loadTreeDataAsync = (timeout) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        treeData.push({
          label: 'New Added ',
          value: 'New Added'
        });
        this.setState({
          data: treeData,
        });
        resolve();
      }, timeout);
    });
  }

  setTreeChildren = (curKey, treeNodes, child) => {
    const loop = (nodes) => {
      nodes.forEach((node) => {
        if (node.value === curKey.value) {
          node.children = [...node.children, ...child];
        }
        if (node.children) {
          loop(node.children);
        }
      });
    };

    loop(treeNodes);
    // const nextTreeData = _.cloneDeep(treeNodes);
    this.setState({
      data: treeNodes
    });
  }

  handleOnload = () => {

  }

  handleOnAdd = () => {
    const nextData = _.cloneDeep(treeData);
    nextData.push({
      label: 'New Added',
      value: 'New Added'
    });
    this.setState({
      data: nextData,
    });
  }
  handleOnChange = (selectedValues) => {
  }

  hanldeOnSelect = (activeNode, nextData, layer) => {
    console.log(activeNode, nextData, layer);
  }

  handleOnExpand = (activeNode, nextData, layer) => {
    const { data } = this.state;
    const child = [{
      label: 'chilren1',
      value: 'children1'
    }];
    if (activeNode.checkState === 'checked') {
      this.setTreeChildren(activeNode, data, child);
    }
  }

  renderLoadingIcon(activeNode) {
    const { data } = this.state;
  }

  render() {
    const { data, selectedValues } = this.state;

    return (
      <div className="doc-example">
        <CheckTree
          defaultExpandAll
          relation={true}
          data={data}
          value={selectedValues}
          disabledItems={['disabled']}
          height={300}
          onExpand={this.handleOnExpand}
          onChange={this.handleOnChange}
          onSelect={this.hanldeOnSelect}
        />
        <button onClick={this.handleOnAdd}>add data </button>
        <button onClick={this.handleOnload}>load data async </button>
      </div>
    );
  }
}


export default LoadDataTree;