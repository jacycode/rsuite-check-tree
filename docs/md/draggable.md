```js
import React from 'react';
import Tree from '../../src';
import treeData from '../data/treeData';
import { Row, Col } from 'rsuite';
import { DropContainer } from 'react-drag-handler';

const DragTree = React.createClass({
    getInitialState() {
        return {
            data: []
        };
    },
    handleDragEnd(node) {
        if (!this._isDrag) {
            return;
        }
        const data = Object.assign([], this.state.data);
        data.push(node);
        this.setState({
            data
        });
    },
    handleMouseEnter() {
        this._isDrag = true;
    },
    handleMouseLeave() {
        this._isDrag = false;
    },
    render() {

        const { data } = this.state;
        const items = data.map((item, index) => {
            return (
                <label className="label" key={index}>{item.title}</label>
            );
        });

        return (
            <div className="doc-example">
                <Row>
                    <Col md={4}>
                        <Tree
                            data={treeData}
                            height={300}
                            draggable
                            onDragEnd={this.handleDragEnd}
                        />
                    </Col>
                    <Col md={8}>
                        <DropContainer
                            onMouseEnter={this.handleMouseEnter}
                            onMouseLeave={this.handleMouseLeave}
                        >
                            {items.length ? items : <div className="tip">把树上面的标签拖拽到这里</div>}
                        </DropContainer>
                    </Col>
                </Row>
            </div>
        );
    }
});

export default DragTree;

```
