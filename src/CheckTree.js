import React, {
	Component
} from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import { toggleClass, hasClass } from 'dom-lib';
import TreeCheckNode from './TreeCheckNode';
import InternalNode from './InternalNode';
import { CHECK_STATE } from './constants';

const propTypes = {
	height: PropTypes.number,
	data: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
	/**
	 * 是否级联选择
	 */
	cascade: PropTypes.bool,
	defaultValue: PropTypes.any, // eslint-disable-line react/forbid-prop-types
	value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
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
	renderTreeIcon: PropTypes.func,
	didMount: PropTypes.func,
};

const defaultProps = {
	cascade: true,
	valueKey: 'value',
	labelKey: 'label',
	childrenKey: 'children',
	disabledItems: [],
};

class CheckTree extends Component {
	constructor(props) {
		super(props);
		this.nodes = {};
		this.isControlled = 'value' in props;
		const nextValue = props.value || props.defaultValue || [];

		this.flattenNodes(this.props.data);
		this.unserializeLists({
			check: nextValue
		});

		this.state = {
			formattedNodes: [],
			data: [],
			selectedValues: nextValue,
		};
	}

	componentDidMount() {
		const {
			didMount
		} = this.props;
		const selectedValues = this.serializeList('check');

		didMount && didMount(selectedValues);
	}

	componentWillReceiveProps(nextProps) {
		if(!isEqual(this.props.data, nextProps.data)) {
			this.flattenNodes(nextProps.data);
			this.unserializeLists({
				check: nextProps.value
			});
		}

		if(!isEqual(this.props.value, nextProps.value)) {
			this.setState({
				selectedValues: nextProps.value,
			});
		}

	}

	getNodeCheckState(node, cascade) {
		const {
			childrenKey
		} = this.props;
		if(!node[childrenKey] || !node[childrenKey].length || !cascade) {
			return node.check ? CHECK_STATE.CHECK : CHECK_STATE.UNCHECK;
		}

		if(this.isEveryChildChecked(node)) {
			return CHECK_STATE.CHECK;
		}

		if(this.isSomeChildChecked(node)) {
			return CHECK_STATE.HALFCHECK;
		}

		return CHECK_STATE.UNCHECK;
	}

	getExpandState(node) {
		const {
			childrenKey,
			defaultExpandAll
		} = this.props;
		if(node[childrenKey] && node[childrenKey].length) {
			if('expand' in node) {
				return !!node.expand;
			} else if(defaultExpandAll) {
				return true;
			}
			return false;
		}
		return false;
	}

	getActiveElementOption(options, refKey) {
		for(let i = 0; i < options.length; i += 1) {
			if(options[i].refKey === refKey) {
				return options[i];
			} else if(options[i].children && options[i].children.length) {
				let active = this.getActiveElementOption(options[i].children, refKey);
				if(active) {
					return active;
				}
			}
		}
		return false;
	}

	getFocusableMenuItems = () => {
		const {
			data,
			childrenKey
		} = this.props;

		let items = [];
		const loop = (treeNodes) => {
			treeNodes.forEach((node) => {
				if(!this.getDisabledState(node)) {
					items.push(node);
					const nodeData = { ...node,
						...this.nodes[node.refKey]
					};
					if(!this.getExpandState(nodeData)) {
						return;
					}
					if(node[childrenKey]) {
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
			if(item.refKey === document.activeElement.getAttribute('data-key')) {
				activeIndex = index;
			}
		});
		return {
			items,
			activeIndex
		};
	}

	getActiveItem() {
		const {
			data
		} = this.props;
		const activeItem = document.activeElement;
		const {
			key,
			layer
		} = activeItem.dataset;
		const nodeData = this.getActiveElementOption(data, key);
		nodeData.check = !this.nodes[nodeData.refKey].check;
		return {
			nodeData,
			layer
		};
	}

	getElementByDataKey = (dataKey) => {
		const ele = findDOMNode(this);
		return ele.querySelector(`[data-key="${dataKey}"]`);
	}

	getDisabledState(node) {
		const {
			disabledItems,
			valueKey
		} = this.props;
		return disabledItems.some((value) => {
			return isEqual(this.nodes[node.refKey][valueKey], value);
		});
	}

	getFormattedNodes(nodes) {
		return nodes.map((node) => {
			const formatted = { ...node
			};
			
			formatted.check = this.nodes[node.refKey].check;
			formatted.expand = this.nodes[node.refKey].expand;
			if(Array.isArray(node.children) && node.children.length > 0) {
				formatted.children = this.getFormattedNodes(formatted.children, formatted.check);
			}

			return formatted;
		});
	}

	setCheckState(nodes) {
		const {
			cascade
		} = this.props;
		nodes.forEach((node) => {
			const checkState = this.getNodeCheckState(node, cascade);
			let isChecked = false;
			if(checkState === CHECK_STATE.UNCHECK || checkState === CHECK_STATE.HALFCHECK) {
				isChecked = false;
			}
			if(checkState === CHECK_STATE.CHECK) {
				isChecked = true;
			}
			this.toggleNode('check', node, isChecked);
			if(Array.isArray(node.children) && node.children.length > 0) {
				this.setCheckState(node.children);
			}
		});
	}

	setChildCheckState(parentNode) {
		Object.keys(this.nodes).forEach((refKey) => {
			const node = this.nodes[refKey];
			if('parentNode' in node && isEqual(node.parentNode.value, parentNode.value)) {
				this.nodes[refKey].check = true;
			}
		});
	}

	/**
	 * 拍平数组，将tree 转换为一维数组
	 * @param {*} nodes tree data
	 * @param {*} ref 当前层级
	 */
	flattenNodes(nodes, ref = 0, parentNode) {
		const {
			labelKey,
			valueKey,
			childrenKey
		} = this.props;

		if(!Array.isArray(nodes) || nodes.length === 0) {
			return;
		}
		nodes.forEach((node, index) => {
			const refKey = `${ref}-${index}`;
			node.refKey = refKey;
			this.nodes[refKey] = {
				label: node[labelKey],
				value: node[valueKey],
				expand: this.getExpandState(node)
			};
			if(parentNode) {
				this.nodes[refKey].parentNode = parentNode;
			}
			this.flattenNodes(node[childrenKey], refKey, this.nodes[refKey]);
		});
	}

	unserializeLists(lists) {
		const {
			valueKey,
			cascade
		} = this.props;
		// Reset values to false
		Object.keys(this.nodes).forEach((refKey) => {
			Object.keys(lists).forEach((listKey) => {
				const node = this.nodes[refKey];
				if(cascade && 'parentNode' in node) {
					node[listKey] = node.parentNode[listKey];
				} else {
					node[listKey] = false;
				}
				lists[listKey].forEach((value) => {
					if(isEqual(this.nodes[refKey][valueKey], value)) {
						this.nodes[refKey][listKey] = true;
					}
				});
			});
		});
	}

	serializeList(key) {
		const {
			valueKey
		} = this.props;
		const list = [];

		Object.keys(this.nodes).forEach((refKey) => {
			if(this.nodes[refKey][key]) {
				list.push(this.nodes[refKey][valueKey]);
			}
		});
		return list;
	}

	isEveryChildChecked(node) {
		return node.children.every((child) => {
			if(child.children) {
				return this.isEveryChildChecked(child);
			}

			return child.check;
		});
	}

	isSomeChildChecked(node) {
		return node.children.some((child) => {
			if(child.children) {
				return this.isSomeChildChecked(child);
			}

			return child.check;
		});
	}

	toggleChecked(node, isChecked, cascade) {
		const {
			childrenKey
		} = this.props;
		if(!node[childrenKey] || !node[childrenKey].length || !cascade) {
			this.toggleNode('check', node, isChecked);
		} else {
			this.toggleNode('check', node, isChecked);
			node.children.forEach((child) => {
				this.toggleChecked(child, isChecked, cascade);
			});
		}
	}

	toggleNode(key, node, toggleValue) {
		this.nodes[node.refKey][key] = toggleValue;
	}

	toggleExpand(node, isExpand) {
		this.nodes[node.refKey].expand = isExpand;
	}

	selectActiveItem = (event) => {
		const {
			nodeData,
			layer
		} = this.getActiveItem();
		this.handleSelect(nodeData, +layer, event);
	}

	focusNextItem() {
		const {
			items,
			activeIndex
		} = this.getItemsAndActiveIndex();
		if(items.length === 0) {
			return;
		}
		const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
		this.getElementByDataKey(items[nextIndex].refKey).focus();
	}

	focusPreviousItem() {
		const {
			items,
			activeIndex
		} = this.getItemsAndActiveIndex();

		if(items.length === 0) {
			return;
		}

		const prevIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
		this.getElementByDataKey(items[prevIndex].refKey).focus();
	}

	/**
	 * 选择某个节点后的回调函数
	 * @param {object} activeNodeData   节点的数据
	 * @param {number} layer            节点的层级
	 */
	handleSelect = (activeNode, layer) => {
		
		const {
			onChange,
			onSelect,
			cascade,
			data
		} = this.props;
		this.toggleChecked(activeNode, activeNode.check, cascade);
		const formattedNodes = this.getFormattedNodes(data);

		if(cascade) {
			this.setCheckState(formattedNodes);
		}

		const selectedValues = this.serializeList('check');
		
		/////////////////////////////////////////////////////////////
		//                    单选、互斥逻辑                        //
		/////////////////////////////////////////////////////////////
		var res = this.props.filterNodes(formattedNodes, selectedValues);
		var tempFormattedNodes = res[0];
		var tempSelectedValues = res[1];
		if(this.isControlled) {
			onChange && onChange(tempSelectedValues);
			onSelect && onSelect(activeNode, layer, tempSelectedValues);
		} else {
			this.setState({
				tempFormattedNodes,
				tempSelectedValues
			}, () => {
				onChange && onChange(tempSelectedValues);
				onSelect && onSelect(activeNode, layer, tempSelectedValues);
			});
		}
		
	}

	/**
	 * 展开、收起节点
	 */
	handleToggle = (nodeData, layer) => {
		const {
			onExpand
		} = this.props;
		toggleClass(findDOMNode(this.refs[nodeData.refKey]), 'open');
		nodeData.expand = hasClass(findDOMNode(this.refs[nodeData.refKey]), 'open');
		this.toggleExpand(nodeData, nodeData.expand);
		onExpand && onExpand(nodeData, layer);
	}

	/**
	 * 处理键盘方向键移动
	 */
	handleKeyDown = (event) => {
		switch(event.keyCode) {
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

	renderNode(node, index, layer) {
		const {
			defaultExpandAll,
			valueKey,
			labelKey,
			childrenKey,
			renderTreeNode,
			renderTreeIcon,
			cascade
		} = this.props;

		const key = `${node.refKey}`;
		const checkState = this.getNodeCheckState(node, cascade);
		const children = node[childrenKey];
		const disabled = this.getDisabledState(node);
		const hasNotEmptyChildren = children && Array.isArray(children) && children.length > 0;

		const props = {
			value: node[valueKey],
			label: node[labelKey],
			nodeData: node,
			onTreeToggle: this.handleToggle,
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
			visible: node.visible,
			defaultExpandAll
		};
		
		if(props.hasChildren) {
			layer += 1;

			// 是否展开树节点且子节点不为空
			let childrenClasses = classNames('node-children', {
				open: defaultExpandAll && hasNotEmptyChildren
			});

			let nodes = children || [];
			return(
				<InternalNode
          className={childrenClasses}
          key={key}
          ref={key}
          multiple
          {...props}
        >
          {nodes.map((child, i) => this.renderNode(child, i, layer, node))}
        </InternalNode>
			);
		}

		return(
			<TreeCheckNode
        key={key}
        ref={key}
        {...props}
      />
		);
	}

	render() {
		const {
			onScroll,
			cascade
		} = this.props;
		// 树节点的层级
		let layer = 0;
		const {
			data = [], className, height
		} = this.props;
		const classes = classNames('tree-view', className, {
			checktree: true
		});

		const formattedNodes = this.state.formattedNodes.length ?
			this.state.formattedNodes : this.getFormattedNodes(data);
		
		if(cascade) {
			this.setCheckState(formattedNodes);
		}

		const nodes = formattedNodes.map((node, index) => {
			return this.renderNode(node, index, layer);
		});
		const styles = {
			height
		};

		return(
			<div
        ref={(ref) => {
          this.treeView = ref;
        }}
        className={classes}
        style={styles}
        onScroll={onScroll}
      >
        <div className="tree-nodes">
          {nodes}
        </div>
      </div>
		);
	}
}

CheckTree.propTypes = propTypes;
CheckTree.defaultProps = defaultProps;
export default CheckTree;