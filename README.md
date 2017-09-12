[![Travis](https://img.shields.io/travis/rsuite/rsuite-check-tree.svg)](https://travis-ci.org/rsuite/rsuite-check-tree) [![npm](https://img.shields.io/npm/v/rsuite-notification.svg)](https://www.npmjs.com/package/rsuite-check-tree)
# rsuite-check-tree

check 树形控件


## # 快速开始

安装

```
npm install rsuite-check-tree --save
```

示例

```js

import CheckTree from 'rsuite-check-tree';
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

