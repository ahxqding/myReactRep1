import React, { Component } from 'react';
import { Modal, Button, Form, Input } from 'antd';
const { TextArea } = Input;
/**
 * 柱形图路由
 */
class Bar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Open Modal
                </Button>
                <Modal
                    title="皮肤集合维护"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={
                        <div>
                            <Button
                                type="primary"
                                onClick={() => this.onOk()}
                            >
                                添加
                          </Button>
                            <Button
                                type="primary"
                                onClick={() => this.onOk()}
                            >
                                重置
                          </Button>
                            <Button
                                type="primary"
                                onClick={() => this.handleCancel()}
                            >
                                取消
                          </Button>
                        </div>
                    }
                >
                    <Form onSubmit={this.handleSubmit} layout='horizontal'>
                        <Form.Item label='当前皮肤数量'>
                            {getFieldDecorator('username', {
                                initialValue: '9999'
                            })( 
                                <Input disabled addonAfter='条'/>,
                            )}
                        </Form.Item>
                       
                        <Form.Item label='皮肤ID(英文逗号或换行分割)'>
                            {getFieldDecorator('password', {})(
                                <TextArea/>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(Bar);