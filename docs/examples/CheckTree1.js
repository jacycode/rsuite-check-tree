import React from 'react';
import CheckTree from '../../src';
import treeData from '../data/treeData';


const CheckTree1 = props => (
  <div className="doc-example">
    <CheckTree
      defaultExpandAll
      data={treeData}
      height={400}
      defaultValue={['Dave', 'tester10']}
      disabledItems={['disabled']}
      onExpand={(activeNode, layer) => {
        console.log(activeNode, layer);
      }}
      onSelect={(activeNode, layer) => {
      }}
      onScroll={(e) => {
        console.log(e.target);
      }}
    />
  </div>
);

export default CheckTree1;

