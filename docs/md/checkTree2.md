```js
import React from 'react';
import { CheckTree } from 'rsuite-tree';
import treeData from '../data/treeData';


export default React.createClass({

    render() {
        return (
            <div className="doc-example">
                 <CheckTree
                    defaultExpandAll
                    relationCheck={false}
                    data={treeData}
                    height={300}
                    onSelectNode={(activeNode, allNodes, layer) => {
                        console.log(activeNode, allNodes, layer);
                    }} />
            </div>
        );
    }
});

```
