```js
import React, { Component } from 'react';
import _ from 'lodash';
import CheckTree from 'rsuite-check-tree';
import treeData from '../data/treeData';

class ControlledTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: treeData,
      selectedValues: ['Dave']
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
    const { data, selectedValues, test } = this.state;

    return (
      <div className="doc-example">
        <CheckTree
          test={test}
          defaultExpandAll
          relation={false}
          data={data}
          value={selectedValues}
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

export default ControlledTree;

```
