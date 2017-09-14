import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import { toggleClass, addClass, hasClass } from 'dom-lib';
import TreeCheckNode from './TreeCheckNode';
import InternalNode from './InternalNode';

/**
 * @example
 * [{
 *      "value":1
 *      "label":"label-1",
 *      "hasChildren": true,
 *      "children":[{
 *          "value":2
 *          "label":"label-2",
 *          "hasChildren": false
 *      },{
 *          "value":3
 *          "label":"label-3",
 *          "hasChildren": false
 *      }]
 * }]
* */
const propTypes = {
  height: PropTypes.number,
  data: React.PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
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
  activeNode: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onChange: PropTypes.func,
  onExpand: PropTypes.func,
  onSelect: PropTypes.func,
  renderTreeNode: PropTypes.func,
  renderTreeIcon: PropTypes.func
};

const defaultProps = {
  defaultExpandAll: false,
};

class TreeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeNode: props.activeNode
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.activeNode !== nextProps.activeNode &&
      this.state.activeNode !== nextProps.activeNode
    ) {
      let activeNode = nextProps.activeNode;
      let targetNode = this.refs[`children_${activeNode}`];
      let el = findDOMNode(targetNode);
      let container = findDOMNode(this.treeView);
      let curNode = targetNode;

      while (curNode) {
        let parent = curNode.props.parent;
        curNode = parent ? this.refs[`children_${curNode.props.parent.id}`] : null;
        curNode && addClass(findDOMNode(curNode), 'open');
      }

      if (el && container) {
        container.scrollTop = el.offsetTop;
      }
      this.setState({ activeNode });
    }
  }

  getActiveElementOption(options, value) {
    for (let i = 0; i < options.length; i += 1) {
      if (options[i].value === value) {
        return options[i];
      } else if (options[i].children && options[i].children.length) {
        let active = this.getActiveElementOption(options[i].children, value);
        if (active) {
          return active;
        }
      }
    }
    return false;
  }

  getFocusableMenuItems = () => {
    const { data, childrenKey } = this.props;

    let items = [];
    const loop = (nodes) => {
      nodes.forEach((node) => {
        if (!node.disabled) {
          items.push(node);
          if (!node.expand) {
            return;
          }
          if (node[childrenKey]) {
            loop(node[childrenKey]);
          }
        }
      });
    };

    loop(data);
    return items;
  }

  getItemsAndActiveIndex() {
    const items = this.getFocusableMenuItems();

    let activeIndex = 0;
    items.forEach((item, index) => {
      if (item.refKey === document.activeElement.getAttribute('data-key')) {
        activeIndex = index;
      }
    });
    return { items, activeIndex };
  }

  getActiveItem() {
    const { data } = this.props;
    const activeItem = document.activeElement;
    const { value, layer } = activeItem.dataset;
    const nodeData = this.getActiveElementOption(data, value);
    return {
      nodeData,
      layer
    };
  }

  getElementByDataKey = (dataKey) => {
    const ele = findDOMNode(this);
    return ele.querySelector(`[data-key="${dataKey}"]`);
  }

  selectActiveItem = (event) => {
    const { onChange } = this.props;
    const { nodeData, layer } = this.getActiveItem();
    onChange && onChange(nodeData, +layer, event);
  }

  focusNextMenuItem() {
    this.focusNextItem();
  }

  focusNextItem() {
    const { items, activeIndex } = this.getItemsAndActiveIndex();
    if (items.length === 0) {
      return;
    }
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    this.getElementByDataKey(items[nextIndex].refKey).focus();
  }

  focusPreviousItem() {
    const { items, activeIndex } = this.getItemsAndActiveIndex();

    if (items.length === 0) {
      return;
    }

    const prevIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    this.getElementByDataKey(items[prevIndex].refKey).focus();
  }

  // 展开，收起节点
  handleTreeToggle = (nodeData, layer) => {
    const { onExpand } = this.props;

    toggleClass(findDOMNode(this.refs[nodeData.refKey]), 'open');
    nodeData.expand = hasClass(findDOMNode(this.refs[nodeData.refKey]), 'open');

    onExpand && onExpand(nodeData, layer);
  }

  handleNodeSelect = (nodeData, layer, event) => {
    const { valueKey } = this.props;

    this.setState({
      activeNode: nodeData[valueKey]
    }, () => {
      const { onChange } = this.props;
      onChange && onChange(nodeData, layer, event);
    });
  }

  handleKeyDown = (event) => {
    switch (event.keyCode) {
      // down
      case 40:
        this.focusNextItem();
        event.preventDefault();
        break;
      // up
      case 38:
        this.focusPreviousItem();
        event.preventDefault();
        break;
      // enter
      case 13:
        this.selectActiveItem(event);
        event.preventDefault();
        break;
      default:
    }

    event.preventDefault();
  }

  renderNode(itemData, index, layer, parent) {
    const {
      disabledItems = [],
      defaultExpandAll,
      valueKey,
      labelKey,
      childrenKey,
      renderTreeNode,
      renderTreeIcon,
    } = this.props;

    const { hasChildren, id, title, checkState } = itemData;
    const children = itemData[childrenKey];
    const value = itemData[valueKey];
    const label = itemData[labelKey];
    const hasNotEmptyChildren = (hasChildren !== undefined) ?
      hasChildren :
      (children && Array.isArray(children) && children.length > 0);
    const props = {
      id: value || id,
      title: label || title,
      nodeData: itemData,
      onTreeToggle: this.handleTreeToggle,
      onRenderTreeNode: renderTreeNode,
      onRenderTreeIcon: renderTreeIcon,
      onSelect: this.handleNodeSelect,
      onKeyDown: this.handleKeyDown,
      active: this.state.activeNode === value,
      hasChildren: !!children,
      disabled: disabledItems.filter(disabledItem => _.isEqual(disabledItem, value)).length > 0,
      children,
      index,
      layer,
      parent,
      checkState,
      defaultExpandAll
    };


    const Node = TreeCheckNode;

    const refKey = itemData.refKey;

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
          key={itemData.refKey}
          ref={refKey}
          multiple={true}
          {...props}
        >
          {nodes.map((child, i) => this.renderNode(child, i, layer, itemData))}
        </InternalNode>
      );
    }

    return (<Node key={itemData.refKey} {...props} ref={refKey} />);
  }

  render() {
    // 树节点的层级
    let layer = 0;

    const { data = [], className, height } = this.props;
    const classes = classNames('tree-view', className, {
      checktree: true
    });
    const nodes = data.map((dataItem, index) => {
      return this.renderNode(dataItem, index, layer);
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
      >
        {nodes}
      </div>
    );
  }
}

TreeView.propTypes = propTypes;
TreeView.defaultProps = defaultProps;

export default TreeView;
