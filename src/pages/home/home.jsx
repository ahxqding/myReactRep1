import React,{Component} from 'react';
import './home.less';
/**
 * 首页路由
 */
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <div className='home'>
                欢迎使用硅谷后台管理系统
            </div>
        );
    }
}

export default Home;