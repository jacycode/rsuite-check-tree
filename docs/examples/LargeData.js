import React, { Component } from 'react';
import CheckTree from '../../src';

const parents = [];

for (let i = 0; i < 2; i += 1) {
  const children = [];

  for (let j = 0; j < 200; j += 1) {
    children.push({
      value: `node-0-${i}-${j}`,
      label: `Node 0-${i}-${j}`,
    });
  }

  parents.push({
    value: `node-0-${i}`,
    label: `Node 0-${i}`,
    children,
  });
}

const nodes = [{
  value: 'node-0',
  label: 'Node 0',
  children: parents,
}];


class LargeData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: nodes,
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

