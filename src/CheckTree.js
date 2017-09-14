import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Tree from './Tree';


const propTypes = {
  height: PropTypes.number,
  data: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  /**
   * 是否关系检查
   */
  relation: PropTypes.bool,
  defaultValue: PropTypes.any,  // eslint-disable-line react/forbid-prop-types
  value: PropTypes.any,         // eslint-disable-line react/forbid-prop-types
  disabledItems: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  childrenKey: PropTypes.string,
  defaultExpandAll: PropTypes.bool,
  onChange: PropTypes.func,
  onExpand: PropTypes.func,
  onSelect: PropTypes.func,
  renderTreeNode: PropTypes.func,
  renderTreeIcon: PropTypes.func
};

const defaultProps = {
  relation: true,
  valueKey: 'value',
  labelKey: 'label',
  childrenKey: 'children'
};

class CheckTree extends Component {
  constructor(props) {
    super(props);
    this.tempNode = null;
    this.isControlled = 'value' in props;
    const nextValue = props.value || props.defaultValue || [];
    this.state = {
      data: [],
      selectedValues: nextValue,
      defaultExpandAll: props.defaultExpandAll
    };
  }
  componentWillMount() {
    this.setState({
      data: this.getInitialTreeData()
    });
  }

  componentWillReceiveProps(nextProps) {

    if (!_.isEqual(this.props.data, nextProps.data)) {
      this.setState({
        data: this.getInitialTreeData(nextProps.data)
      });
    }

    if (!_.isEqual(this.props.value, nextProps.value)) {

      this.setState({
        selectedValues: nextProps.value,
      });
    }
  }
  /**
    * 初始化 TreeData
    */
  getInitialTreeData(data) {

    const { relation } = this.props;
    this.tempNode = _.cloneDeep(data || this.props.data);

    if (relation) {
      this.createParentNode();
      const leafNodes = this.initChildrenNodeCheckState();
      this.initParentNodeCheckState(leafNodes);
    } else {
      this.initCheckedState();
    }

    return this.tempNode;
  }

  getCheckState(checkedNodes, node) {
    const { childrenKey } = this.props;
    if (checkedNodes.length === node[childrenKey].length) {
      return 'checked';
    } else if (checkedNodes.length > 0) {
      return 'halfChecked';
    }
    return 'unchecked';
  }

  getExpandState(node) {
    const { childrenKey, defaultExpandAll } = this.props;
    if (node[childrenKey] && node[childrenKey].length) {
      if ('expand' in node) {
        return !!node.expand;
      } else if (defaultExpandAll) {
        return true;
      }
      return false;
    }
    return false;
  }

  /**
   * 当前找到当前选中的节点
   * 同时依次查找父节点，并改变 checkState 状态: 'checked', 'halfChecked', 'unchecked'
   * @param {array} nodes
   * @param {any} value
   */
  getActiveNode = (nodes, value) => {
    const { relation, valueKey, childrenKey } = this.props;
    for (let i = 0; i < nodes.length; i += 1) {
      if (nodes[i][valueKey] === value) {
        nodes[i].checkState = nodes[i].checkState !== 'checked' ? 'checked' : 'unchecked';
        return nodes[i];
      } else if (nodes[i][childrenKey]) {
        let activeNode = this.getActiveNode(nodes[i][childrenKey], value);
        if (activeNode) {
          if (relation) {
            let checkedNodes = nodes[i][childrenKey].filter((node) => {
              return node.checkState === 'checked' ||
                node.checkState === 'halfChecked';
            });
            nodes[i].checkState = this.getCheckState(checkedNodes, nodes[i]);
          }
          return activeNode;
        }
      }
    }
    return false;
  }

  getSelectedValues(selectValue, checkState) {
    let selectedValues = this.state.selectedValues;
    let key = -1;
    selectedValues.forEach((value, index) => {
      if (_.isEqual(selectedValues, value)) {
        key = index;
      }
    });
    if (checkState === 'checked') {
      selectedValues.push(selectValue);
    } else if (checkState === 'unchecked' || !checkState) {
      if (key !== -1) {
        selectedValues.splice(key, 1);
      }
    }
    return selectedValues;
  }

  /**
   * 初始化选中的状态
   */
  initCheckedState = () => {
    const { selectedValues } = this.state;
    const { valueKey, childrenKey } = this.props;
    let level = 0;
    const loop = (nodes, ref) => {
      nodes.forEach((node, index) => {
        node.refKey = `${ref}-${index}`;
        selectedValues.forEach((selected) => {
          node.checkState = _.isEqual(selected, node[valueKey]) ? 'checked' : 'unchecked';
        });
        node.expand = this.getExpandState(node);
        if (node[childrenKey]) {
          loop(node[childrenKey], node.refKey);
        }
      });
    };
    loop(this.tempNode, level);
  }

  /**
   * 初始化子节点的 CheckState
   */
  initChildrenNodeCheckState() {
    const { selectedValues } = this.state;
    const { valueKey, childrenKey } = this.props;
    const leafNodes = [];
    const loop = (nodes) => {
      nodes.forEach((node) => {
        selectedValues.forEach((selected) => {
          if (node[childrenKey]) {
            if (_.isEqual(node, node[valueKey]) || node.checkState === 'checked') {
              node[childrenKey].map((v) => {
                v.checkState = 'checked';
              });
            }
            loop(node[childrenKey]);
          } else {
            leafNodes.push(node);
          }
          if (_.isEqual(selected, node[valueKey])) {
            node.checkState = 'checked';
          }
        });
      });
    };
    loop(this.tempNode);
    return leafNodes;
  }

  /**
   * 初始化父节点的 CheckState
   * @param {array} leafNodes  所有的叶子节点
   */
  initParentNodeCheckState(leafNodes) {
    const { childrenKey } = this.props;
    const upLoop = (leafNode) => {
      let parentNode = leafNode.parentNode;
      if (parentNode) {
        let checkedNodes = parentNode[childrenKey].filter((node) => {
          return node.checkState === 'checked' ||
            node.checkState === 'halfChecked';
        });
        parentNode.checkState = this.getCheckState(checkedNodes, parentNode);
        upLoop(parentNode);
      }
    };
    for (let i = 0; i < leafNodes.length; i += 1) {
      upLoop(leafNodes[i]);
    }
  }


  /**
  * 给所有的节点，创建一个 parentNode 属性
  */
  createParentNode = () => {
    const { selectedValues } = this.state;
    const { valueKey, childrenKey } = this.props;
    let level = 0;
    const loop = (nodes, parentNode, ref) => {
      nodes.forEach((node, index) => {
        node.refKey = `${ref}-${index}`;
        node.expand = this.getExpandState(node);
        node.parentNode = parentNode;
        // 同时加上 checkState 属性
        selectedValues.forEach((selected) => {
          node.checkState = _.isEqual(selected, node[valueKey]) ? 'checked' : 'unchecked';
        });
        if (node[childrenKey]) {
          loop(node[childrenKey], node, node.refKey);
        }
      });
    };
    loop(this.tempNode, null, level);
  }

  /**
   * 递归查找子节点，
   * 并根据 checkState 参数改变所有字节点的 checkState 状态
   * @param {*} nodes
   * @param {*} checkState
   */
  checkChildren = (nodes, checkState) => {
    const { childrenKey } = this.props;
    if (!nodes) {
      return;
    }
    for (let i = 0; i < nodes.length; i += 1) {
      nodes[i].checkState = checkState;
      if (nodes[i][childrenKey]) {
        this.checkChildren(nodes[i][childrenKey], checkState);
      }
    }
  }

  /**
   * 选择某个节点后的回调函数
   * @param {object} activeNodeData   节点的数据
   * @param {number} layer            节点的层级
   */
  handleSelect = (activeNodeData, layer) => {
    const { valueKey, childrenKey, onChange, onSelect, relation } = this.props;
    const nextData = _.cloneDeep(this.state.data);
    if (
      'defaultValue' in this.props ||
      (this.isControlled && onChange)
    ) {
      const activeNode = this.getActiveNode(nextData, activeNodeData[valueKey]);
      const selectedValues = this.getSelectedValues(activeNode[valueKey], activeNode.checkState);
      relation && this.checkChildren(activeNode[childrenKey], activeNode.checkState);

      this.setState({
        data: nextData,
        selectedValues
      }, () => {
        onChange && onChange(selectedValues);
        onSelect && onSelect(activeNode, nextData, layer);
      });
    }
  }

  handleToggle = (nodeData, layer) => {
    const { onExpand } = this.props;
    const nextData = _.cloneDeep(this.state.data);
    this.setState({
      data: nextData,
    }, () => {
      onExpand && onExpand(nodeData, layer);
    });
  }

  render() {
    const { onChange, ...props } = this.props;
    return (
      <Tree
        {...props}
        multiple
        data={this.state.data}
        defaultExpandAll={this.state.defaultExpandAll}
        onChange={this.handleSelect}
        onExpand={this.handleToggle}
      />
    );
  }
}

CheckTree.propTypes = propTypes;
CheckTree.defaultProps = defaultProps;
export default CheckTree;
