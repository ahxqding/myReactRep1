import React,{Component} from 'react';
import './index.less';
import logo from '../../assets/images/logo.png';
import {Link,withRouter} from 'react-router-dom';
import {Menu, Icon} from 'antd';
import menuList from '../../config/menuConfig';

const SubMenu = Menu.SubMenu;
/**
 * 左侧导航的组件
 */
class Left extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }

    // 根据menuList的数据数组动态生成菜单项（标签数组）：使用map和递归调用
    getMenuNodes_map=(menuList)=>{
        return menuList.map(item =>{
            // 只有一级菜单项
            if(!item.children){
                return(
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            }else{//有二级菜单项
                return(
                    <SubMenu 
                        key={item.key} 
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }>

                        {/* 递归调用生成二级子菜单！！！ */}
                        {
                            this.getMenuNodes_map(item.children)
                        }
                    </SubMenu>
                )
            }
        })
    }
    // 根据menuList的数据数组动态生成菜单项（标签数组）：使用reduce和递归调用
    getMenuNodes_reduce=(menuList)=>{
        const path = this.props.location.pathname;
        return menuList.reduce((pre,item)=>{
            // 像pre中添加</Menu.Item>或者添加<SubMenu>
            if(!item.children){
                pre.push((
                    <Menu.Item key={item.key}>
                    <Link to={item.key}>
                        <Icon type={item.icon} />
                        <span>{item.title}</span>
                    </Link>
                </Menu.Item>
                ));
            }else{
                //查找一个与当前请求路径匹配的子Item
                const cItem = item.children.find(cItem=>cItem.key===path);
                // 如果存在，说明当前item的子列表需要打开
                if(cItem){
                    this.openKey = item.key;
                }
                
                pre.push((
                    <SubMenu 
                        key={item.key} 
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }>

                        {/* 递归调用生成二级子菜单！！！ */}
                        {
                            this.getMenuNodes_reduce(item.children)
                        }
                    </SubMenu>
                ));
            }
            return pre;
        },[])
    }

    // 在第一次render()之前执行一次。为第一次render()准备数据--必须是同步的
    componentWillMount(){
        this.menuNodes = this.getMenuNodes_reduce(menuList);
    }
    render() {
        // 得到当前请求的路径,但是当前组价不是一份路由组件，所以需要引入withRouter这个高阶组件对当前组件进行包装
        const path = this.props.location.pathname;
        // 得到需要打开菜单项的key
        const openKey = this.openKey;
        return (
            <div className="left-nav">
                <Link to="/" className="left-nav-header">
                    <img src={logo} alt="logo"/>
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    // defaultSelectedKeys={[path]}//默认选中，传的是一个数组，数组里面的值是每个菜单项的key---这个只能是第一次传入的数组有用，已经填的值改变了就没用了
                    selectedKeys={[path]}//这个也是默认选中，是动态的，只要数组发生改变，就能随时更新
                    defaultOpenKeys={[openKey]}//默认展开子菜单项，里面传的是父菜单项的key
                    mode="inline"
                    theme="dark"
                >
                    {/* <Menu.Item key="1">
                        <Link to="/home">
                            <Icon type="home" />
                            <span>首页</span>
                        </Link>
                    </Menu.Item>
        
                    <SubMenu 
                        key="sub1" 
                        title={
                            <span>
                                <Icon type="appstore" />
                                <span>商品</span>
                            </span>
                        }>
                        <Menu.Item key="5">
                            <Link to="/category">
                                <Icon type="unordered-list" />品类管理
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="6">
                            <Link to="/product">
                                <Icon type="tool" />商品管理
                            </Link>
                        </Menu.Item>
                    </SubMenu> */}

                    {/* 动态生成菜单项 */}
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
            
        );
    }
}
/**
 * withRouter高阶组件：
 *     包装非路由组件，返回一个新的组件
 *     新的组件向非路由组件传递三个属性：history、location、match
 */
export default withRouter(Left);