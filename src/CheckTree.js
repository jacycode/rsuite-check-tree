import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import { toggleClass, addClass, hasClass } from 'dom-lib';
import TreeCheckNode from './TreeCheckNode';
import InternalNode from './InternalNode';
import Tree from './Tree';
import { CHECK_STATE } from './constants';


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
  onScroll: PropTypes.func,
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
    this.nodes = {};
    this.tempNode = null;
    this.isControlled = 'value' in props;
    const nextValue = props.value || props.defaultValue || [];

    this.flattenNodes(this.props.data);
    this.unserializeLists({
      check: nextValue
    });

    this.state = {
      data: [],
      selectedValues: nextValue,
    };
  }


  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.data, nextProps.data)) {
      this.flattenNodes(nextProps.data);
    }

    if (!isEqual(this.props.value, nextProps.value)) {
      this.setState({
        selectedValues: nextProps.value,
      });
    }
    this.unserializeLists({
      check: nextProps.value
    });
  }
  /**
    * 初始化 TreeData
    */
  getInitialTreeData(data, value) {
    const { relation } = this.props;
    this.tempNode = cloneDeep(data || this.props.data);

    if (relation) {
      this.createParentNode(value);
      const leafNodes = this.initChildrenNodeCheckState();
      this.initParentNodeCheckState(leafNodes);
    } else {
      this.initCheckedState(value);
    }

    return this.tempNode;
  }

  getNodeCheckState(node, relation) {
    const { childrenKey } = this.props;
    if (!node[childrenKey] || !node[childrenKey].length || !relation) {
      return node.check ? CHECK_STATE.CHECK : CHECK_STATE.UNCHECK;
    }

    if (this.isEveryChildChecked(node)) {
      return CHECK_STATE.CHECK;
    }

    if (this.isSomeChildChecked(node)) {
      return CHECK_STATE.HALFCHECK;
    }

    return CHECK_STATE.UNCHECK;
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
      if (isEqual(nodes[i][valueKey], value)) {
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

  getDisabledState(node) {
    const { disabledItems, valueKey } = this.props;
    return disabledItems.some((value) => {
      return isEqual(this.nodes[node.refKey][valueKey], value);
    });
  }

  getFormattedNodes(nodes) {
    return nodes.map((node) => {
      const formatted = { ...node };
      formatted.check = this.nodes[node.refKey].check;

      if (Array.isArray(node.children) && node.children.length > 0) {
        formatted.children = this.getFormattedNodes(formatted.children);
      }

      return formatted;
    });
  }

  getSelectedValues = (nextData) => {
    const { valueKey, childrenKey } = this.props;
    let selectedValues = [];

    const loop = (nodes) => {
      nodes.forEach((node) => {
        if (node.checkState === 'checked') {
          selectedValues.push(node[valueKey]);
        }
        if (node[childrenKey]) {
          loop(node[childrenKey]);
        }
      });
    };
    loop(nextData);

    return selectedValues;
  }

  /**
   * 拍平数组，将tree 转换为一维数组
   * @param {*} nodes tree data
   * @param {*} ref 当前层级
   */
  flattenNodes(nodes, ref = 0) {
    const { labelKey, valueKey } = this.props;

    if (!Array.isArray(nodes) || nodes.length === 0) {
      return;
    }
    nodes.forEach((node, index) => {
      const refKey = `${ref}-${index}`;
      node.refKey = refKey;
      this.nodes[refKey] = {
        label: node[labelKey],
        value: node[valueKey]
      };
      this.flattenNodes(node.children, refKey);
    });
  }

  unserializeLists(lists) {
    const { valueKey } = this.props;
    // Reset values to false
    Object.keys(this.nodes).forEach((refKey) => {
      Object.keys(lists).forEach((listKey) => {
        this.nodes[refKey][listKey] = false;
        lists[listKey].forEach((value) => {
          if (isEqual(this.nodes[refKey][valueKey], value)) {
            this.nodes[refKey][listKey] = true;
          }
        });
      });
    });
    console.log(this.nodes);
  }

  serializeList(key) {
    const { valueKey } = this.props;
    const list = [];

    Object.keys(this.nodes).forEach((refKey) => {
      if (this.nodes[refKey][key]) {
        list.push(this.nodes[refKey][valueKey]);
      }
    });
    return list;
  }

  isEveryChildChecked(node) {
    return node.children.every((child) => {
      if (child.children) {
        return this.isEveryChildChecked(child);
      }

      return child.check;
    });
  }

  isSomeChildChecked(node) {
    return node.children.some((child) => {
      if (child.children) {
        return this.isSomeChildChecked(child);
      }

      return child.check;
    });
  }
  /**
   * 初始化选中的状态
   */
  initCheckedState = (value) => {
    const selectedValues = value || this.state.selectedValues;
    const { valueKey, childrenKey } = this.props;
    let level = 0;
    const loop = (nodes, ref) => {
      nodes.forEach((node, index) => {
        node.refKey = `${ref}-${index}`;
        node.checkState = 'unchecked';
        selectedValues.forEach((selected) => {
          if (isEqual(selected, node[valueKey])) {
            node.checkState = 'checked';
          }
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
    const { valueKey, childrenKey } = this.props;
    const leafNodes = [];
    const loop = (nodes) => {
      nodes.forEach((node) => {
        if (node[childrenKey]) {
          if (isEqual(node, node[valueKey]) || node.checkState === 'checked') {
            node[childrenKey].map((v) => {
              v.checkState = 'checked';
            });
          }
          loop(node[childrenKey]);
        } else {
          leafNodes.push(node);
        }
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
  createParentNode = (value) => {
    const selectedValues = value || this.state.selectedValues;
    const { valueKey, childrenKey } = this.props;
    let level = 0;
    const loop = (nodes, parentNode, ref) => {
      nodes.forEach((node, index) => {
        node.refKey = `${ref}-${index}`;
        node.expand = this.getExpandState(node);
        node.parentNode = parentNode;
        // 同时加上 checkState 属性
        node.checkState = 'unchecked';
        selectedValues.forEach((selected) => {
          if (isEqual(selected, node[valueKey])) {
            node.checkState = 'checked';
          }
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

  toggleChecked(node, isChecked, relation) {
    const { childrenKey } = this.props;
    if (!node[childrenKey] || !node[childrenKey].length || !relation) {
      this.toggleNode('check', node, isChecked);
    } else {
      this.toggleNode('check', node, isChecked);
      node.children.forEach((child) => {
        this.toggleChecked(child, isChecked);
      });
    }
  }

  toggleNode(key, node, toggleValue) {
    this.nodes[node.refKey][key] = toggleValue;
  }

  /**
   * 选择某个节点后的回调函数
   * @param {object} activeNodeData   节点的数据
   * @param {number} layer            节点的层级
   */
  handleSelect = (activeNode, layer, event) => {
    const { valueKey, childrenKey, onChange, onSelect, relation } = this.props;
    // this.toggleNode('check', activeNode, activeNode.check);
    this.toggleChecked(activeNode, activeNode.check, relation);
    console.log(this.nodes);
    const selectedValues = this.serializeList('check');
    this.setState({
      selectedValues
    }, () => {
      onChange && onChange(selectedValues);
      onSelect && onSelect(activeNode, layer, event);
    });

    // const nextData = this.state.data;

    // if (
    //   'defaultValue' in this.props ||
    //   (this.isControlled && onChange)
    // ) {
    //   const activeNode = this.getActiveNode(nextData, activeNodeData[valueKey]);
    //   relation && this.checkChildren(activeNode[childrenKey], activeNode.checkState);
    //   const selectedValues = this.getSelectedValues(nextData);
    //   activeNode.check = activeNode.checkState === 'checked';
    //   this.setState({
    //     data: nextData,
    //     selectedValues
    //   }, () => {
    //     onChange && onChange(selectedValues);
    //     onSelect && onSelect(activeNode, layer);
    //   });
    // }
  }

  handleToggle = (nodeData, layer) => {
    const { onExpand } = this.props;
    nodeData.check = nodeData.checkState === 'checked';
    const nextData = this.state.data;
    this.setState({
      data: nextData,
    }, () => {
      onExpand && onExpand(nodeData, layer);
    });
  }

  renderNode(node, index, layer) {
    const {
          defaultExpandAll,
      valueKey,
      labelKey,
      childrenKey,
      renderTreeNode,
      renderTreeIcon,
      relation
        } = this.props;

    const key = `${node.refKey}`;
    const checkState = this.getNodeCheckState(node, relation);
    this.toggleNode('check', node, node.check);
    const children = node[childrenKey];
    const disabled = this.getDisabledState(node);
    const hasNotEmptyChildren = children && Array.isArray(children) && children.length > 0;

    const props = {
      value: node[valueKey],
      label: node[labelKey],
      nodeData: node,
      onTreeToggle: this.handleTreeToggle,
      onRenderTreeNode: renderTreeNode,
      onRenderTreeIcon: renderTreeIcon,
      onSelect: this.handleSelect,
      onKeyDown: this.handleKeyDown,
      // active: this.state.activeNode === value,
      hasChildren: !!children,
      disabled,
      children,
      index,
      layer,
      checkState,
      defaultExpandAll
    };

    if (props.hasChildren) {
      layer += 1;

      // 是否展开树节点且子节点不为空
      let childrenClasses = classNames('node-children', {
        open: defaultExpandAll && hasNotEmptyChildren
      });

      let nodes = children || [];
      return (
        <InternalNode
          className={childrenClasses}
          key={key}
          ref={key}
          multiple={true}
          {...props}
        >
          {nodes.map((child, i) => this.renderNode(child, i, layer, node))}
        </InternalNode>
      );
    }

    return (
      <TreeCheckNode
        key={key}
        ref={key}
        {...props}
      />
    );
  }

  render() {
    const { onScroll } = this.props;
    // 树节点的层级
    let layer = 0;

    const { data = [], className, height } = this.props;
    const classes = classNames('tree-view', className, {
      checktree: true
    });
    const nodes = this.getFormattedNodes(data).map((node, index) => {
      return this.renderNode(node, index, layer);
    });
    const styles = {
      height
    };

    return (
      <div
        ref={(ref) => {
          this.treeView = ref;
        }}
        className={classes}
        style={styles}
        onScroll={onScroll}
      >
        {nodes}
      </div>
    );
  }
}

CheckTree.propTypes = propTypes;
CheckTree.defaultProps = defaultProps;
export default CheckTree;
