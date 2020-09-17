import React, { Component } from 'react';
import { Card, Form, Select, Input, Cascader, Upload, Button, Icon } from 'antd';
import LinkButton from '../../components/link-button';
import { reqCategorys } from '../../api/index';
import PicturesWall from './picturesWall';
const { Item } = Form;
const { TextArea } = Input;
/**
 * product的添加或者更新的子路由
 */
class ProductAddUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        };
        // 创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef();
    }

    // 初始化options
    initOptions = async (categorys) => {
        // 根据categorys生成options数组
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false
        }));

        // 如果是一个二级分类商品的更新
        const{ pCategoryId, categoryId } = this.product;
        if(this.isUpdate && pCategoryId !== '0'){
            // 获取对应的二级分类列表
            const subCategorys = await this.getCategotys(pCategoryId);
            // 生成二级下拉列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }));
            // 找到当前商品对应的一级option对象
            const targetOption = options.find(option => option.value === pCategoryId);
            // 关联到对应的一级option上
            targetOption.children = childOptions;
        }
        this.setState({ options });
    }

    // 获取一级/二级分类列表
    // async函数的返回值是一个新的promise对象，promise结果和值又async的结果来决定
    getCategotys = async (partentyId) => {
        const result = await reqCategorys(partentyId);
        if (result.status === 0) {
            const categorys = result.data;
            // 如果是一级分类列表
            if (partentyId === '0') {
                this.initOptions(categorys);
            } else {// 二级列表
                return categorys; // 返回二级列表 ==>当前async函数返回的promise就会成功且value为categorys
            }
        }
    }

    // 用于加载下一级列表的函数
    loadData = async selectedOptions => {
        // 得到选择的option对象
        const targetOption = selectedOptions[0];
        // 显示loading
        targetOption.loading = true;
        // 根据选中的分类请求获取二级分类列表
        const subCategorys = await this.getCategotys(targetOption.value);
        // 隐藏loading
        targetOption.loading = false;
        if (subCategorys && subCategorys.length > 0) {
            // 生成一个二级列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }));
            // 关联到当前options上
            targetOption.children = childOptions;
        } else {//当前选中的分类没有二级分类
            targetOption.isLeaf = true;
        }
        // 更新options
        this.setState({
            options: [...this.state.options],
        });
    };

    validatorPrice = (rule, value, callback) => {
        if (value * 1 <= 0) {
            callback('价格必须大于0');
        } else {
            callback();
        }
    }

    submit = () => {
        // 进行表单验证，如果通过了，才发送请求
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                const imgs = this.pw.current.getImgs();
                console.log('imgs', imgs);
                alert('发送请求');
            }
        })
    }

    componentDidMount() {
        this.getCategotys('0');
    }

    componentWillMount() {
        // 取出携带的state
        const product = this.props.location.state;// 如果是添加，product没值，否则有值
        // 保存一个是否更新的标识 !!强行转换成boolean
        this.isUpdate = !!product;
        // 保存商品，如果没有，保存空对象，避免报错
        this.product = product || {};
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 2 }, // 左侧label的宽度
            wrapperCol: { span: 8 }, // 右侧包裹的宽度
        };

        // 头部左侧标题
        const title = (
            <span>
                <LinkButton>
                    <Icon type='arrow-left' style={{ fontSize: 18 }} onClick={() => this.props.history.goBack()} />
                </LinkButton>
                <span>{this.isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )

        // 用来接收级联分类ID的数组
        const categoryIds = [];
        if(this.isUpdate){//修改
            // 商品是一个一级分类的商品
            if(this.product.pCategoryId === '0'){
                categoryIds.push(this.product.categoryId);
            }else{
                // 商品是一个二级分类的商品
                categoryIds.push(this.product.pCategoryId);
                categoryIds.push(this.product.categoryId);
            }   
        }

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label='商品名称'>
                        {
                            getFieldDecorator('name', {
                                initialValue: this.product.name,
                                rules: [
                                    { required: true, message: '商品名称必须输入' }
                                ]
                            })(<Input placeholder='请输入商品名称' />)
                        }
                    </Item>
                    <Item label='商品描述'>
                        {
                            getFieldDecorator('desc', {
                                initialValue: this.product.desc,
                                rules: [
                                    { required: true, message: '商品描述必须输入' }
                                ]
                            })(<TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRows: 6 }} />)
                        }
                    </Item>
                    <Item label='商品价格'>
                        {
                            getFieldDecorator('price', {
                                initialValue: this.product.price,
                                rules: [
                                    { required: true, message: '商品价格必须输入' },
                                    { validator: this.validatorPrice }
                                ]
                            })(<Input type='number' placeholder='请输入商品价格' addonAfter='元' />)
                        }
                    </Item>
                    <Item label='商品分类'>
                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: categoryIds,
                                rules: [
                                    { required: true, message: '商品分类必须输入' }
                                ]
                            })(<Cascader
                                options={this.state.options}
                                loadData={this.loadData}
                            />)
                        }

                    </Item>
                    <Item label='商品图片'>
                        <PicturesWall ref={this.pw}/>
                    </Item>
                    <Item label='商品详情'>
                        商品详情
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        );
    }
}

export default Form.create()(ProductAddUpdate);

/**
 * 1.子组件调用父组件的方法：将父组件的方法以函数的形式传递给子组件，子组件就可以调用
 * 2.父组件调用子组件的方法：在父组件中通过ref得到子组件标签对象（也就是组件对象），调用其方法
 *      创建用来保存ref标识的标签对象的容器:this.pw = React.createRef();
 *      <PicturesWall ref={this.pw}/>
 *      const imgs = this.pw.current.getImgs();
 */