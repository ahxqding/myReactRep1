import React,{Component} from 'react';
import memoryUtils from '../../utils/memoryUtils';
import {Redirect} from 'react-router-dom'
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
            <div>
                Hello {user.username}
            </div>
        );
    }
}

export default Admin;