import React from 'react';
import CheckTree from '../../src';
import treeData from '../data/treeData';


const CheckTree1 = props => (
  <div className="doc-example">
    <CheckTree
      defaultExpandAll
      data={treeData}
      height={400}
      defaultValue={['Dave']}
      disabledItems={['disabled']}
      onExpand={(activeNode, layer) => {
        console.log(activeNode, layer);
      }}
    />
  </div>
);

export default CheckTree1;

