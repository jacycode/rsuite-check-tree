import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TreeCheckNode from './TreeCheckNode';

class InternalNode extends Component {
  render() {
    const {
      className,
      children,
      nodeData,
      ...props
    } = this.props;

    const Node = TreeCheckNode;
    return (
      <div
        className={className}
      >
        <Node {...this.props} />
        <div className="children" >
          {children}
        </div>
      </div>
    );
  }
}


export default InternalNode;
