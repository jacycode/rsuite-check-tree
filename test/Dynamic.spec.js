import React from 'react';
import { shallow, render, mount } from 'enzyme';
import cloneDeep from 'lodash/cloneDeep';
import CheckTree from '../src/index';
import treeData from '../docs/data/treeData';
import delay from './utils';

const mockOnExpand = jest.fn().mockImplementation(activeNode => activeNode);
const mockOnSelect = jest.fn().mockImplementation(activeNode => activeNode);
const mockOnChange = jest.fn().mockImplementation(values => values);


const newTreeData = [{
  value: 'children1',
  label: 'children1'
}];

function setTreeData(child, activeNode, layer, treeNodes) {
  if (layer < 0) {
    return;
  }

  const loop = (nodes) => {
    nodes.forEach((node) => {
      if (node.value === activeNode.value && activeNode.expand) {
        node.children = [...node.children, ...child];
      }
      if (node.children) {
        loop(node.children);
      }
    });
  };

  loop(treeNodes);
  return treeNodes;
}


const setup = () => {
  const props = {
    defaultExpandAll: true,
    cascade: true,
    data: treeData,
    height: 400,
    value: ['Maya'],
    onExpand: mockOnExpand,
    onSelect: mockOnSelect,
    onChange: mockOnChange
  };

  const wrapper = shallow(<CheckTree {...props} />);
  const staticRender = render(<CheckTree {...props} />);
  const fullRender = mount(<CheckTree {...props} />);
  return {
    wrapper,
    staticRender,
    fullRender
  };
};

describe('ChectTree test suite', () => {
  const { staticRender, fullRender } = setup();
  it('newData should be load after 2s', async () => {
    fullRender.find('div[data-key="0-4"] > .expand-icon-wrapper > .expand-icon').simulate('click');
    const activeNode = mockOnExpand.mock.calls[0][0];
    const layer = mockOnExpand.mock.calls[0][1];
    const nextTreeData = cloneDeep(treeData);
    setTreeData(newTreeData, activeNode, layer, nextTreeData);

    fullRender.setState({
      data: nextTreeData
    });

    await delay(3000);
    expect(fullRender.exists('div[data-key="0-4-0"]')).toBe(true);
  });
});
