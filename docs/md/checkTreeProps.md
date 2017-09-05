属性名称                 | 类型               | 默认值   | 描述
-------------------- | ---------------- | ----- | -------------------
data                 | array            |       | 组件数据
height               | number           |       | 树高度
defaultExpandAll     | bool             | false | 默认展开所有节点
labelClickableExpand | bool             | false | 点击标题的时候是否可以展开节点
draggable            | bool             | false | 是否可拖拽
onSelectNode         | function         |       | 选择节点的回调
onToggle             | function         |       | 展开节点回调
disabledList         | array            |       | 禁用节点列表
activeNode           | string or number |       | 当前默认选中节点 (value)
relationCheck        | bool             | true  | 当设置为 `false` , 点击某个节点不会影响其他节点的状态变化
<br>

`data` 的结构是:

```javascript
 [{
      "value":1
      "label":"label-1",
      "children":[{
          "value":2
          "label":"label-2",
          "checked": true
      },{
          "value":3
          "label":"label-3"
      }]
 }]
```
