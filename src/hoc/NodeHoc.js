import { hasClass } from 'dom-lib';

export default function (WrappedComponent) {
  return class Enhancer extends WrappedComponent {
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
      if (hasClass(event.target, 'expand-icon')) {
        return;
      }


      // 点击title的时候，如果 title 设置为可以点击，同时又拥有子节点，则可以展开数据
      labelClickableExpand && hasChildren && onTreeToggle(nodeData, layer, event);
      onSelect(nodeData, layer, event);
    }

    render() {
      return super.render();
    }
  };
}
