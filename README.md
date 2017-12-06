[![Travis](https://img.shields.io/travis/rsuite/rsuite-check-tree.svg)](https://travis-ci.org/rsuite/rsuite-check-tree) [![npm](https://img.shields.io/npm/v/rsuite-check-tree/version2.x.svg)](https://www.npmjs.com/package/rsuite-check-tree) [![Coverage Status](https://coveralls.io/repos/github/rsuite/rsuite-check-tree/badge.svg?branch=master)](https://coveralls.io/github/rsuite/rsuite-check-tree?branch=master)
# rsuite-check-tree

check 树形控件，支持层级关系关联检查、受控与非受控设置、异步加载数据、自定义图标等。



## 快速开始

### 安装

```
npm install rsuite-check-tree --save
```

### 引入 less 文件
```
@import "~rsuite-check-tree/lib/less/index";
```

### 示例
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
      onChange={(activeNode, layer) => {
        console.log(activeNode, layer);
      }}
    />
```

