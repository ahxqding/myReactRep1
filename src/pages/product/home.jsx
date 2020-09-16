import React, { Component } from 'react';
import { Card, Select, Input, Button, Icon, Table, message } from 'antd';
import LinkButton from '../../components/link-button';
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api/index';
import { PAGE_SIZE } from '../../utils/constants';
const Option = Select.Option;
/**
 * product的默认子路由组件
 */
class ProductHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [], //商品的数组
            total: 0, // 总记录数
            loading: false, // 是否正在加载中
            searchName: '', //搜索的关键字
            searchType: 'productName', //根据那个字段进行搜索
        };
    }

    // 更新指定商品的状态
    updateStatus = async (status, productId) => {
        const result = await reqUpdateStatus(productId, status);
        if(result.status === 0){
            message.success('更新商品成功');
            this.getProducts(this.pageNum);
        }
    }

    // 获取指定页码的列表数据展示
    getProducts = async (pageNum) => {
        this.pageNum = pageNum;// 保存pageNum,让其他方法可以看到
        this.setState({ loading: true });
        const { searchName, searchType } = this.state;
        // 如果搜索关键字有值，说明要做搜索分页
        let result;
        if(searchName){
            result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchType, searchName});
        }else{
            result = await reqProducts(pageNum, PAGE_SIZE);
        }
        this.setState({ loading: false })
        if (result.status === 0) {
            const { list, total } = result.data;
            this.setState({
                tatol: total,
                products: list
            })
        }
    }
    // 初始化表格列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '￥' + price // 当前指定了对应的属性，传入的是对应的属性值
            },
            {
                title: '状态',
                width: 100,
                render: (product) => {
                    const { status, _id } = product;
                    return (
                        <span>
                            <Button type="primary" onClick={this.updateStatus.bind(this, status === 1 ? 2 : 1, _id)}>{status === 1 ? '下架' : '上架'}</Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                width: 100,
                render: (product) => {
                    return (
                        <span>
                            {/* 将product对象使用state传递给目标路由组件 */}
                            <LinkButton onClick={() => this.props.history.push('/product/detail', product)}>详情</LinkButton>
                            <LinkButton>修改</LinkButton>
                        </span>
                    )
                }
            }
        ];
    }

    componentWillMount() {
        this.initColumns();
    }

    componentDidMount() {
        this.getProducts(1);
    }

    render() {

        const { products, total, loading, searchName, searchType } = this.state;

        const title = (
            <span>
                <Select
                    value={searchType}
                    style={{ width: 150 }}
                    onChange={value => this.setState({ searchType: value })}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    placeholder='关键字'
                    style={{ width: 150, margin: '0 15px' }}
                    value={searchName}
                    onChange={event => this.setState({ searchName: event.target.value })}
                />
                <Button type='primary' onClick={this.getProducts.bind(this,1)}>搜索</Button>
            </span>
        )

        const extra = (
            <Button type='primary'>
                <Icon type='plus' />添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    rowKey='_id'
                    bordered
                    dataSource={products}
                    columns={this.columns}
                    loading={loading}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        total,
                        showQuickJumper: true,
                        onChange: this.getProducts
                    }}
                />
            </Card>
        );
    }
}

export default ProductHome;