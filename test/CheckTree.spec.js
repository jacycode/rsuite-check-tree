import React from 'react';
import { shallow, render, mount } from 'enzyme';
import CheckTree from '../src/index';
import treeData from '../docs/data/treeData';

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

const setup = () => {
  const mockExpand = (activeNode) => {
  };
  const state = {};
  const props = {
    defaultExpandAll: true,
    cascade: false,
    data: treeData,
    height: 400,
    defaultValue: ['Dave', 'Maya'],
    onExpand: mockExpand
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
  const { wrapper, staticRender, fullRender } = setup();

  /**
   * test tree render
   */
  it('CheckTree should be render', () => {
    expect(wrapper.find('.tree-view.checktree').length).toBe(1);
  });

  // test active node
  it('Node Dave and Maya should be active when cascade is false', () => {
    expect(staticRender.find('.tree-node.checked').length).toBe(2);
  });

  // test select node
  it('test toggle click Dave node', () => {
    fullRender.find('div[data-key="0-0-1-0"]').simulate('click');
    expect(fullRender.find('.tree-node.checked').length).toBe(1);

    fullRender.find('div[data-key="0-0-1-0"]').simulate('click');
    expect(fullRender.find('.tree-node.checked').length).toBe(2);
  });

  // test expand node TODO:
  it('expand node', async () => {
    expect(staticRender.find('.open > div[data-key="0-0-1-1"]').length).toBe(1);
    fullRender.find('div[data-key="0-0-1-1"] > .expand-icon-wrapper > .expand-icon').simulate('click');
    await delay(4000);
    // fullRender.find('div[data-key="0-0-1-1"] > .expand-icon-wrapper > .expand-icon').simulate('click');
    // expect(staticRender.find('.open > div[data-key="0-0-1-1"]').length).toBe(0);
    console.log(staticRender.find('.open > div[data-key="0-0-1-1"]').length);
  });
});
