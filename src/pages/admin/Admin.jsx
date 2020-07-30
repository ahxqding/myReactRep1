import React,{Component} from 'react';
import memoryUtils from '../../utils/memoryUtils';
import {Redirect,Route,Switch} from 'react-router-dom';
import { Layout } from 'antd';
import Left from '../../components/left-nav';
import Header from '../../components/header';
import Home from '../home/home';
import Category from '../category/category';
import Role from '../role/role';
import User from '../user/user';
import Product from '../product/product';
import Bar from '../charts/bar';
import Line from '../charts/line';
import Pie from '../charts/pie';

const {Footer, Sider, Content } = Layout;
/**
 * 后台管理的路由组件
 */ 
class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        const user = memoryUtils.user;
        //如果内存中没有存储user，说明当前没有登录
        if(!user || !user._id){
            // 自动跳转到登录(在render中)
            return <Redirect to='/login'/>
        }
        return (
            <Layout style={{height: "100%"}}>
                {/* 左侧 */}
            <Sider>
                <Left/>
            </Sider>
            <Layout>
                {/* 右侧 */}
                {/* 右侧头部 */}
              <Header/>
              {/* 右侧中部 */}
              <Content style={{margin:20, backgroundColor:"#fff"}}>
                  <Switch>
                      <Route path="/home" component={Home}/>
                      <Route path="/category" component={Category}/>
                      <Route path="/role" component={Role}/>
                      <Route path="/user" component={User}/>
                      <Route path="/product" component={Product}/>
                      <Route path="/charts/bar" component={Bar}/>
                      <Route path="/charts/line" component={Line}/>
                      <Route path="/charts/pie" component={Pie}/>
                      {/* 默认访问首页 */}
                      <Redirect to="/home"/>
                  </Switch>
              </Content>
              {/* 右侧底部 */}
              <Footer style={{textAlign:"center",color:"#cccc"}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
            </Layout>
          </Layout>
        );
    }
}

export default Admin;