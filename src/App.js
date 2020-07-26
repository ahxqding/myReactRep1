import React,{Component} from 'react';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom';
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
                <Route path="/login" component={Login} />
                <Route exact path="/" component={Admin} />
            </Router>
        );
    }
}

export default App;