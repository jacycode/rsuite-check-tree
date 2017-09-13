import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { hasClass } from 'dom-lib';
import { DragSource } from 'react-drag-handler';

const propTypes = {
  checkState: PropTypes.oneOf(['checked', 'halfChecked', 'unchecked']),
};

class TreeCheckNode extends Component {
  /**
      * 展开收缩节点
      */
  handleTreeToggle = (event) => {
    const { onTreeToggle, layer, nodeData } = this.props;
    onTreeToggle(nodeData, layer, event);
  }

  handleSelect = (event) => {
    const {
        onTreeToggle,
      onSelect,
      hasChildren,
      labelClickableExpand,
      layer,
      disabled,
      nodeData
      } = this.props;

    if (disabled) {
      return;
    }

    // 如果点击的是展开 icon 就 return
    if (hasClass(event.target.parentNode, 'expand-icon-wrapper')) {
      return;
    }

    // 点击title的时候，如果 title 设置为可以点击，同时又拥有子节点，则可以展开数据
    labelClickableExpand && hasChildren && onTreeToggle(nodeData, layer, event);
    onSelect(nodeData, layer, event);
  }

  renderIcon = () => {
    const { onRenderTreeIcon, hasChildren, labelClickableExpand, nodeData } = this.props;

    const expandIcon = (typeof onRenderTreeIcon === 'function') ? onRenderTreeIcon(nodeData) : <i className="expand-icon icon" />;
    return hasChildren ? (
      <div
        className="expand-icon-wrapper"
        onClick={e => {
          if (labelClickableExpand) {
            return;
          }
          this.handleTreeToggle(e);
        }}
      >
        {expandIcon}
      </div>
    ) : null;
  }

  renderLabel = () => {
    const { nodeData, onRenderTreeNode, title } = this.props;
    let label = (typeof onRenderTreeNode === 'function') ?
      onRenderTreeNode(nodeData) : title;
    return (<label className="checknode-label" title={label}>{label}</label>);
  }

  render() {
    const {
      id,
      title,
      active,
      index,
      layer,
      onTreeToggle,
      hasChildren,
      disabled,
      onKeyDown,
      labelClickableExpand,
      nodeData,
      checkState,
      defaultExpandAll
    } = this.props;

    const classes = classNames('tree-node', {
      'text-muted': disabled,
      'half-checked': checkState === 'halfChecked',
      view: defaultExpandAll,
      checked: checkState === 'checked',
      disabled,
      active,

    });

    const styles = {
      paddingLeft: layer * 20
    };

    return (
      <div
        tabIndex={-1}
        onClick={this.handleSelect}
        onKeyDown={onKeyDown}
        ref="node"
        data-value={id}
        data-key={nodeData.refKey}
        style={styles}
        className={classes}
      >
        {this.renderIcon()}
        {this.renderLabel()}
      </div>
    );
  }
}

TreeCheckNode.propTypes = propTypes;
export default TreeCheckNode;
