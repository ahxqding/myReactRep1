1、此项目为一个前后台分离的后台管理的SPA（单页应用项目）,包括前端PC应用和后端应用
2、包括用户管理、商品分类管理、商品管理、权限管理等功能模块
3、前端：使用react全家桶+antd+axios+ES6+Webpack等技术
4、后端：使用node+Express+Mongodb等技术
5、采用模块化、组件化、工程化的模式开发

一、引入antd以及按需打包：https://ant.design/docs/react/use-with-create-react-app-cn
    1.下载组件包：yarn add antd
    2.下载依赖模块：yarn add react-app-rewired customize-cra babel-plugin-import
    3.定义加载配置的js 模块: config-overrides.js
          const {override, fixBabelImports} = require('customize-cra');
          module.exports = override(
            fixBabelImports('import', {
            libraryName: 'antd',
            libraryDirectory: 'es',
            style: 'css',
            }),
        );
    4.修改配置: package.json：
          "scripts": {
            "start": "react-app-rewired start",
            "build": "react-app-rewired build",
            "test": "react-app-rewired test",
            "eject": "react-scripts eject"
          },
    5.在应用中使用antd 组件，例如：
          import {Button, message} from 'antd';
          // import 'antd/dist/antd.css';
          <Button type='primary' onClick={this.handleClick}>学习</Button>
    6.自定义主题：
         需求：使antd 的默认基本颜色从Blue 变为Green
         下载工具包：yarn add less less-loader
         修改config-overrides.js：
                const {override, fixBabelImports, addLessLoader} = require('customize-cra');
                module.exports = override(
                //针对antd实现按需打包，根据import来打包（使用babel-plugin-import）
                    fixBabelImports('import', {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: true,
                    }),
                    addLessLoader({
                    javascriptEnabled: true,
                    modifyVars: {'@primary-color': '#1DA57A'},
                    }),
                );
        注意咯: 我自己出现了一个问题：ValidationError: Invalid options object. Less Loader has been initialized using an opti ons object
                解决办法：卸载less-loader，安装less-loader@5.0.0
                         yarn remove less-loader
                         yarn add less-loader@5.0.0
            
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

二、引入路由：
       1.下载工具包：yarn add react-router-dom
        
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

三、安装axios：npm install axios
      在API文件夹下封装ajax请求
      跨域访问需要使用代理配置跨域：在package.json中添加一个配置："proxy":"http://localhost:5000"

 --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

 四、为了localStorage可以跨浏览器使用，推荐安装store库： yarn add store;     
    