import React, { Component } from 'react';
import { Card, Form, Select, Input, Cascader, Upload, Button, Icon } from 'antd';
import LinkButton from '../../components/link-button';
import { reqCategorys } from '../../api/index';
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
    }

    // 初始化options
    initOptions = (categorys) => {
        // 根据categorys生成options数组
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false
        }));
        this.setState({options});
    }

    // 获取一级/二级分类列表
    // async函数的返回值是一个新的promise对象，promise结果和值又async的结果来决定
    getCategotys = async (partentyId) => {
        const result = await reqCategorys(partentyId);
        if(result.status === 0){
            const categorys = result.data;
            // 如果是一级分类列表
            if(partentyId === '0'){
                this.initOptions(categorys);
            }else{// 二级列表
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
        if(subCategorys && subCategorys.length > 0) {
            // 生成一个二级列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }));
            // 关联到当前options上
            targetOption.children = childOptions;
        }else{//当前选中的分类没有二级分类
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
                alert('发送请求');
            }
        })
    }

    componentDidMount () {
        this.getCategotys('0');
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 2 }, // 左侧label的宽度
            wrapperCol: { span: 8 }, // 右侧包裹的宽度
        };

        const title = (
            <span>
                <LinkButton>
                    <Icon type='arrow-left' style={{ fontSize: 18 }} />
                </LinkButton>
                <span>添加商品</span>
            </span>
        )
        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label='商品名称'>
                        {
                            getFieldDecorator('name', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: '商品名称必须输入' }
                                ]
                            })(<Input placeholder='请输入商品名称' />)
                        }
                    </Item>
                    <Item label='商品描述'>
                        {
                            getFieldDecorator('desc', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: '商品描述必须输入' }
                                ]
                            })(<TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRows: 6 }} />)
                        }
                    </Item>
                    <Item label='商品价格'>
                        {
                            getFieldDecorator('price', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: '商品价格必须输入' },
                                    { validator: this.validatorPrice }
                                ]
                            })(<Input type='number' placeholder='请输入商品价格' addonAfter='元' />)
                        }
                    </Item>
                    <Item label='商品分类'>
                        <Cascader
                            options={this.state.options}
                            loadData={this.loadData}
                        />
                    </Item>
                    <Item label='商品图片'>
                        商品图片
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