import React, { Component } from 'react';
import { Card, Table, Button, Icon, message, Modal } from 'antd';
import LinkButton from '../../components/link-button';
import { reqCategorys, reqAddCategorys, reqUpdateCategorys } from '../../api/index';
import AddForm from './AddForm';
import UpdateForm from './UpdateForm';
/**
 * 商品分类路由
 */
class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false, // 是否正在获取数据中
            categorys: [], //一级分类列表
            subCategorys: [], // 子分类列表
            parentId: '0', // 当前需要显示的分类列表的parentId
            parentName: '',// 当前需要显示的分类列表的父级名称

        };
    }

    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    showUpdate = (category) => {
        this.category = category;
        this.setState({
            showStatus: 2
        })
    }

    handleCancel = () => {
        // 清除输入数据,重置所有表单项
        this.form.resetFields();
        this.setState({
            showStatus: 0
        })
    }

    addCategory = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                // 隐藏确认框
                this.setState({
                    showStatus: 0
                })
                // 收集数据和提交请求
                const { parentId, categoryName } = values;
                // 清除输入数据,重置所有表单项
                this.form.resetFields();
                const result = await reqAddCategorys(parentId, categoryName);
                if (result.status === 0) {
                    //添加的分类就是当前的分类
                    if (parentId === this.state.parentId) {
                        this.getCategorys();
                    } else if (parentId === '0') {
                        // 在二级分类列表下添加一级分类,重新获取一级分类列表,但不需要显示一级列表
                        this.getCategorys('0');
                    }
                } else {
                    message.error('添加失败');
                }
            }
        })
    }

    updateCategory = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                // 隐藏确认框
                this.setState({
                    showStatus: 0
                })
                const categoryId = this.category._id;
                // 这里是子组件将form对象传递给父组件的
                const { categoryName } = values;
                // 清除输入数据,重置所有表单项
                this.form.resetFields();
                // 更新分类
                const result = await reqUpdateCategorys({ categoryId, categoryName });
                if (result.status === 0) {
                    // 刷新列表
                    this.getCategorys();
                } else {
                    message.error('修改失败');
                }
            }
        })

    }



    // 初始化Table所有列的数组
    initColums = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name', // 显示数据对应的属性名
            },
            {
                title: '操作',
                width: '30%',
                render: (category) => ( // 返回需要显示的界面标签
                    <span>
                        <LinkButton onClick={this.showUpdate.bind(this, category)}>修改分类</LinkButton>
                        {this.state.parentId !== '0' ? null : <LinkButton onClick={this.showSubCategorys.bind(this, category)}>查看子分类</LinkButton>}
                    </span>
                )
            }
        ];
    }

    showSubCategorys = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            this.getCategorys();
        })
    }

    showCategorys = () => {
        // 更新为显示一级列表的状态
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: [],
            showStatus: 0 //标识添加|| 更新的确认框是否显示:0都不显示,1显示添加,2显示更新
        })
    }

    // 异步获取一级||二级分类列表
    // parentId: 如果没有指定,根据状态中的parentId查询,如果指定了,用这个值查询
    getCategorys = async (parentId) => {
        // 在发请求前,显示loading
        this.setState({ loading: true });
        parentId = parentId || this.state.parentId;
        const result = await reqCategorys(parentId);
        this.setState({ loading: false });
        if (result.status === 0) {
            // 取出分类列表
            if (parentId === '0') {
                const categorys = result.data;
                this.setState({ categorys })
            } else {
                const subCategorys = result.data;
                this.setState({ subCategorys })
            }

        } else {
            message.error('获取分类列表失败')
        }
    }

    // 为第一次render准备数据
    componentWillMount() {
        this.initColums();
    }

    // 请求分类列表
    componentDidMount() {
        // 获取一级分类列表
        this.getCategorys();
    }

    render() {

        const { categorys, loading, subCategorys, parentName, parentId, showStatus } = this.state;
        const category = this.category || {}; // 如果还没有,指定一个空对象

        // card的左侧标题
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <Icon type='arrow-right' style={{ marginRight: 5 }} />
                <span>{parentName}</span>
            </span>
        )
        // card的右侧
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type='plus' />添加
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    loading={loading}
                    rowKey='_id'
                    dataSource={parentId === '0' ? categorys : subCategorys}
                    columns={this.columns}
                    pagination={{
                        defaultPageSize: 5,
                        showQuickJumper: true,
                    }}
                />

                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm categorys={categorys} parentId={parentId} setForm={(form) => { this.form = form }} />
                </Modal>

                <Modal
                    title="修改分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm categoryName={category.name} setForm={(form) => { this.form = form }} />
                </Modal>
            </Card>
        );
    }
}

export default Category;