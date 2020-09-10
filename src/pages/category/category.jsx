import React, { Component } from 'react';
import { Card, Table, Button, Icon, message } from 'antd';
import LinkButton from '../../components/link-button';
import { reqCategorys, reqAddCategorys, reqUpdateCategorys } from '../../api/index';
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
                        <LinkButton>修改分类</LinkButton>
                        <LinkButton onClick={this.showSubCategorys.bind(this, category)}>查看子分类</LinkButton>
                    </span>
                )
            }
        ];
    }

    showSubCategorys = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.parentName
        }, () => {
            this.getCategorys();
        })
    }

    // 异步获取一级||二级分类列表
    getCategorys = async () => {
        // 在发请求前,显示loading
        this.setState({ loading: true });
        const { parentId } = this.state;
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

        const { categorys, loading, subCategorys, parentName, parentId } = this.state;

        // card的左侧标题
        const title = `一级分类列表${parentId === '0' ? null : ` ->${parentName}`}`;
        // card的右侧
        const extra = (
            <Button type='primary'>
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
            </Card>
        );
    }
}

export default Category;