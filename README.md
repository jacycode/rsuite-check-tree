# rsuite-tree  [![npm][npm-badge]][npm]

树形控件


## # 快速开始

安装

```
npm install rsuite-tree --save
```

示例

```js

import { CheckTree } from 'rsuite-tree';

<CheckTree
    defaultExpandAll
    data={treeData}
    height={300}
    onSelectNode={(activeNode, allNodes, layer) => {
        console.log(activeNode, allNodes, layer);
    }}
/>
```



[npm-badge]: https://badge.fury.io/js/rsuite-tree.svg
[npm]: http://badge.fury.io/js/rsuite-tree
