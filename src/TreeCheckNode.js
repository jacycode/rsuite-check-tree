import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DragSource } from 'react-drag-handler';

import NodeHoc from './hoc/NodeHoc';

const propTypes = {
  checkState: PropTypes.oneOf(['checked', 'halfChecked', 'unchecked']),
};

class TreeCheckNode extends Component {
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
      renderTreeNode
    } = this.props;

    const classes = classNames('tree-node', {
      'text-muted': nodeData.status === 'DISABLE',
      'half-checked': checkState === 'halfChecked',
      checked: checkState === 'checked',
      disabled,
      active
    });

    const styles = {
      paddingLeft: layer * 20
    };

    const expandIcon = hasChildren ? (
      <i className="expand-icon icon"
        onClick={e => {

          if (labelClickableExpand) {
            return;
          }
          this.handleTreeToggle(e);
        }}>
      </i>
    ) : null;

    const label = (<label className="checknode-label" title={title}>{title}</label>);

    return (
      <div
        tabIndex={-1}
        onClick={this.handleSelect}
        onKeyDown={onKeyDown}
        ref="node"
        data-value={id}
        data-layer={layer}
        style={styles}
        className={classes}
      >
        {expandIcon}
        {label}
      </div>
    );
  }
}

TreeCheckNode.propTypes = propTypes;
export default NodeHoc(TreeCheckNode);
