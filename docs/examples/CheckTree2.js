import React from 'react';
import CheckTree from '../../src';
import treeData from '../data/treeData';


const CheckTree2 = props => (
  <div className="doc-example">
    <CheckTree
      defaultExpandAll
      relation={false}
      data={treeData}
      value={['Dave']}
      disabledItems={['disabled']}
      height={300}
      onExpand={(activeNode, layer) => {
        console.log(activeNode, layer);
      }}
      onChange={(activeNode, layer, event) => {
        console.log(activeNode, layer, event);
      }}
    />
  </div>
);

export default CheckTree2;
