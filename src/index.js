import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import memoryUtils from './utils/memoryUtils';
import storageUtils from './utils/storageUtils'

/**
 * 入口js
 */

//  读取localStorage中保存的user，保存到内存中(防止刷新浏览器或者关闭电脑时导致掉线的情况)
const user = storageUtils.getUser();
memoryUtils.user = user;


// 将APP组件标签渲染到index页面的div上
ReactDOM.render(<App/>,document.getElementById("root"));