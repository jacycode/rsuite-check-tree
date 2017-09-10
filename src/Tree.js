import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import { toggleClass, addStyle, getHeight, getWidth, addClass } from 'dom-lib';
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
  data: PropTypes.array.isRequired,
  height: PropTypes.number,
  defaultExpandAll: PropTypes.bool,
  onChange: PropTypes.func,
  onExpand: PropTypes.func,
  disabledItems: PropTypes.array,
  value: PropTypes.array,
  defaultValue: PropTypes.array,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  childrenKey: PropTypes.string,
  activeNode: PropTypes.object
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
    for (let i = 0; i < options.length; i++) {
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

  getFocusableMenuItems() {
    const node = findDOMNode(this);
    if (!node) {
      return [];
    }
    return Array.from(node.querySelectorAll('[tabIndex="-1"]')).filter((item) => {
      return !~item.className.indexOf('disabled');
    });
  }

  getItemsAndActiveIndex() {
    const items = this.getFocusableMenuItems();
    const activeIndex = items.indexOf(document.activeElement);
    return { items, activeIndex };
  }

  // 展开，收起节点
  handleTreeToggle = (nodeData, layer, event) => {
    const { onExpand } = this.props;
    toggleClass(findDOMNode(this.refs[`children_${nodeData.value}`]), 'open');
    onExpand && onExpand(nodeData, layer);
  }

  handleNodeSelect = (nodeData, layer, event) => {

    this.setState({
      activeNode: nodeData.value
    }, () => {
      const { onChange } = this.props;
      onChange && onChange(nodeData, layer, event);
    });
  }

  selectActiveItem = (event) => {
    const { onChange, data } = this.props;
    const activeItem = document.activeElement;
    const { value, layer } = activeItem.dataset;
    const nodeData = this.getActiveElementOption(data, value);

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
    items[nextIndex].focus();
  }

  focusPreviousItem() {

    const { items, activeIndex } = this.getItemsAndActiveIndex();

    if (items.length === 0) {
      return;
    }

    const prevIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    items[prevIndex].focus();
  }

  handleKeyDown = (event) => {
    switch (event.keyCode) {
      //down
      case 40:
        this.focusNextItem();
        event.preventDefault();
        break;
      //up
      case 38:
        this.focusPreviousItem();
        event.preventDefault();
        break;
      //enter
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
      childrenKey
    } = this.props;

    const { hasChildren, id, title, disabled, checkState } = itemData;
    const children = itemData[childrenKey];
    const value = itemData[valueKey];
    const label = itemData[labelKey];
    const _hasChildren = (hasChildren !== undefined) ? hasChildren : (children && Array.isArray(children) && children.length > 0);

    const props = {
      id: value || id,
      title: label || title,
      nodeData: itemData,
      onTreeToggle: this.handleTreeToggle,
      onSelect: this.handleNodeSelect,
      onKeyDown: this.handleKeyDown,
      active: this.state.activeNode === value,
      hasChildren: _hasChildren,
      disabled: disabledItems.filter((disabledItem) => disabledItem === value).length > 0,
      children,
      index,
      layer,
      parent,
      checkState
    };


    const Node = TreeCheckNode;

    const refKey = `children_${itemData.value}`;
    const node = (<Node key={index}  {...props} />);

    if (_hasChildren) {

      layer++;

      //是否展开树节点
      let childrenClasses = classNames('node-children', {
        open: defaultExpandAll
      });

      let nodes = children || [];
      return (
        <InternalNode
          className={childrenClasses}
          key={index}
          ref={refKey}
          multiple={true}
          {...props}
        >
          {nodes.map((child, index) => this.renderNode(child, index, layer, itemData))}
        </InternalNode>
      );
    }

    return (<Node key={index}  {...props} ref={refKey} />);
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
      <div ref={(ref) => this.treeView = ref} className={classes} style={styles}>
        {nodes}
      </div>
    );
  }
}

TreeView.propTypes = propTypes;
TreeView.defaultProps = defaultProps;

export default TreeView;