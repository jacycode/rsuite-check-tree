import React, { Component } from 'react';
import _ from 'lodash';
import CheckTree from '../../src';
import treeData from '../data/treeData';

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

  handleOnClick = () => {
    this.setState({
      data: treeData
    });
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

  handleOnChange = (values) => {
    this.setState((preveState) => {
      return {
        selectedValues: [...preveState.selectedValues, ...values]
      };
    });
  }

  hanldeOnSelect = (activeNode, nextData, layer) => {
    // console.log(activeNode, nextData, layer);
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
          onExpand={(activeNode, layer) => {
            console.log(activeNode, layer);
          }}
          onChange={this.handleOnChange}
          onSelect={this.hanldeOnSelect}
        />
      </div>
    );
  }
}


export default CheckTree2;