import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TreeCheckNode from './TreeCheckNode';

class InternalNode extends Component {
  render() {
    const {
      className,
      key,
      children,
      ...props
    } = this.props;

    const Node = TreeCheckNode;
    return (
      <div
        className={className}
        key={key}
      >
        <Node {...props} />
        <div className="children" >
          {children}
        </div>
      </div>
    );
  }
}


export default InternalNode;
