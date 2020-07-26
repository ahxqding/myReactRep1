import React,{Component} from 'react';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import Login from './pages/login/Login';
import Admin from './pages/admin/Admin';

/**
 * 应用的根组件
 */
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }

    
    render() {
        return (
            <Router>
                {/* Switch：只匹配其中一个 */}
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/" component={Admin} />
                </Switch>
            </Router>
        );
    }
}

export default App;