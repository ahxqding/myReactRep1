import React,{Component} from 'react';
import './login.less';
import logo from './images/logo.png';
/**
 * 登录的路由组件
 */
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>react项目: 后台管理系统</h1>
                </header>
                <section className="login-center">
                    <h2>用户登录</h2>
                    <div>
                        
                    </div>
                </section>
            </div>
        );
    }
}

export default Login;