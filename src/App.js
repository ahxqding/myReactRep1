import React,{Component} from 'react';
import { Button,message } from 'antd';
// import 'antd/dist/antd.css';
/**
 * 应用的根组件
 */
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }

    handleClick =()=>{
        message.success('This is a success message');
    }
    render() {
        return (
            <div>
                这是APP根组件
                <Button type="primary" onClick={this.handleClick}>Primary Button</Button>
            </div>
        );
    }
}

export default App;