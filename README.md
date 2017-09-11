# rsuite-tree  [![npm][npm-badge]][npm]

check 树形控件


## # 快速开始

安装

```
npm install rsuite-check-tree --save
```

示例

```js

import CheckTree from 'rsuite-tree';
    <CheckTree
      defaultExpandAll
      data={treeData}
      height={300}
      defaultValue={['Dave']}
      onExpand={(activeNode, layer) => {
        console.log(activeNode, layer);
      }}
      onChange={(activeNode, layer, event) => {
        console.log(activeNode, layer, event);
      }}
    />
```



[npm-badge]: https://badge.fury.io/js/rsuite-check-tree.svg
[npm]: http://badge.fury.io/js/rsuite-check-tree
