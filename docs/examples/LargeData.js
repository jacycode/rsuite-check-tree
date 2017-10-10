import React, { Component } from 'react';
import CheckTree from '../../src';

const largeData = require('../data/testData.json');

class LargeData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: largeData,
      selectedValues: ['Dave', 'Maya']
    };
  }

  handleOnChange = (values) => {
    console.log(values);
    this.setState((preveState) => {
      return {
        selectedValues: values
      };
    });
  }

  render() {
    const { data, selectedValues } = this.state;

    return (
      <div className="doc-example">
        <CheckTree
          defaultExpandAll
          cascade
          data={data}
          value={selectedValues}
          disabledItems={['disabled']}
          height={400}
          onSelect={(activeNode, layer) => {
            console.log(activeNode, layer);
          }}
          onExpand={(activeNode, layer) => {
            console.log(activeNode, layer);
          }}
          onChange={this.handleOnChange}
        />
      </div>
    );
  }
}

export default LargeData;

