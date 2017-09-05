```js
import React from 'react';
import { Tree } from 'rsuite-tree';
import treeData from '../data/treeData';

export default () => {
    return (
        <div className="doc-example">
            <Tree
                data={treeData}
                height={300}
                defaultExpandAll
                onSelectNode={(node) => {
                    console.log(node);
                }} />
        </div>
    );
};
```
