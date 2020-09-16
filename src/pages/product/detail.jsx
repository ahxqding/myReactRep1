import React, { Component } from 'react';
import { Card, Icon, List } from 'antd';
import LinkButton from '../../components/link-button';
import { BASE_IMG_URL } from '../../utils/constants';
import { reqCategory } from '../../api/index';
const Item = List.Item;
/**
 * product的详情子路由组件
 */
class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cName1: '', // 一级分类名称
            cName2:'', // 二级分类名称
        };
    }

    async componentDidMount () {
        // 得到当前商品的分类ID
        const { pCategoryId, categoryId } = this.props.location.state.product;
        if(pCategoryId === '0'){
            const result = await reqCategory(categoryId);
            const cName1 = result.data.name;
            this.setState({cName1});
        } else { // 二级分类下的商品
            // 通过多个await的方式发多个请求： 后面的请求是在前一个请求成功返回之后才发送 
            // const result1 = await reqCategory(pCategoryId);
            // const result2 = await reqCategory(categoryId);
            // const cName1 = result1.data.name;
            // const cName2 = result2.data.name;

            // 一次性发送多个请求，只有都成功了，才正常处理
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)]);
            const cName1 = results[0].data.name;
            const cName2 = results[1].data.name;
            this.setState({cName1,cName2});
        }
    }

    render() {
        // 读取携带过来的数据
        const { product } = this.props.location.state;
        const { cName1, cName2 } = this.state;
        const title = (
            <span>
                <LinkButton>
                    <Icon type='arrow-left' style={{ marginRight: 10, fontSize: 18 }} onClick={() => this.props.history.goBack()} />
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item>
                        <span className='left'>商品名称：</span>
                        <span>{product.name}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品描述：</span>
                        <span>{product.desc}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品价格：</span>
                        <span>{product.price}</span>
                    </Item>
                    <Item>
                        <span className='left'>所属分类：</span>
                        <span>{cName1} {cName2 ? '-->' + cName2 : null}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品图片：</span>
                        <span>
                            {
                                product.imgs.map(img => (
                                   <img 
                                   key={img}
                                   className='product-img'
                                   src={BASE_IMG_URL + img}
                                   alt='img'
                                   /> 
                                ))
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className='left'>商品详情：</span>
                        <span dangerouslySetInnerHTML={{ __html: product.detail }}></span>
                    </Item>
                </List>
            </Card>
        );
    }
}

export default ProductDetail;