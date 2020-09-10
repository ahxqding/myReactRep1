import React, { Component } from 'react';
import './index.less';
import { formatDate } from '../../utils/dateUtils';
import memoryUtils from '../../utils/memoryUtils';
import { reqWeather } from '../../api';
import { withRouter } from 'react-router-dom';
import menuList from '../../config/menuConfig';
import { Modal } from 'antd';
import storageUtils from '../../utils/storageUtils';
import LinkButton from '../link-button';


const { confirm } = Modal;
/**
 * 头部导航组件
 */
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTime: formatDate(Date.now()),//获取当前时间字符串
            dayPictureUrl: '',//天气图片
            weather: '',//天气文本
        };
    }

    // 获取当前时间
    getTime = () => {
        //每隔一秒获取当前时间,并更新状态数据currentTime
        // 需要把intervalId存起来,退出登录的时候需要销毁使用
        this.intervalId = setInterval(() => {
            const currentTime = formatDate(Date.now());
            this.setState({
                currentTime: currentTime
            })
        }, 1000)
    }

    // 获取实时天气
    getWeather = async () => {
        //调用接口请求函数,异步获取数据
        const { dayPictureUrl, weather } = await reqWeather('北京');
        console.log(dayPictureUrl);
        console.log(weather);
        this.setState({
            dayPictureUrl: dayPictureUrl,
            weather: weather
        })
    }

    // 获取当前菜单项的title
    getTitle = () => {
        //得到当前请求路径
        //!!!这里注意,由于当前组件是非路由组件,没有location,所以需要引入withRouter将Header组件进行包装,暴露新的包装组件
        const path = this.props.location.pathname;
        let title;
        menuList.forEach(item => {
            if (item.key === path) {//如果当前item对象的key与path一样,item的title就是需要显示的title
                title = item.title;
            } else if (item.children) {
                //在所有子item中查找匹配的
                const cItem = item.children.find(cItem => cItem.key === path);
                //如果有值才说明有匹配的
                if (cItem) {
                    //取出title
                    title = cItem.title;
                }
            }
        })
        return title;
    }

    //退出登录
    logout = () => {
        //显示确认框
        confirm({
            content: '确认退出吗?',
            onOk: () => {
                //删除保存的user数据
                storageUtils.removeUser();// local中的删除
                memoryUtils.user = {}; //内存中的删除
                //跳转到login,这里需要重新指定this指向
                this.props.history.replace('/login');
            }
        });
    }

    // 当前组件卸载之前调用
    componentWillUnmount() {
        // 清除定时器
        clearInterval(this.intervalId);
    }


    //每秒更新一下时间,在第一次render之后执行,一般在此执行异步操作.1:发ajax请求;2.启动定时器
    componentDidMount() {
        this.getTime();//获取当前时间
        this.getWeather();//获取当前天气
    }

    render() {
        const { currentTime, dayPictureUrl, weather } = this.state;//得到当前时间,天气信息
        const username = memoryUtils.user.username;//得到当前登录的用户名
        const title = this.getTitle();//得到当前需要显示的title
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎：{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);