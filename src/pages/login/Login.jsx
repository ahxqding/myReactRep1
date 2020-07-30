import React, { Component } from 'react';
import './login.less';
import logo from '../../assets/images/logo.png';

import { Form, Input, Button,Icon, message } from 'antd';
import {reqLogin} from '../../api';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import {Redirect} from 'react-router-dom';


const Item = Form.Item;//不能写在import之前
/**
 * 登录的路由组件
 * 1.前台的表单认证
 *     用户名、密码的合法性要求：
 *         1.必须输入；
 *         2.必须大于4位；
 *         3.必须小于12位；
 *         4.必须是英文、数字或下划线组成
 * 2.收集表单输入数据
 */
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // 提交
    handleSubmit=(e)=>{
        // 阻止表单自动提交数据
        e.preventDefault();
        // 对所有的表单字段进行验证
        this.props.form.validateFields(async (err,values)=>{
            // 校验成功
            if(!err){
                console.log('提交的登录的ajax请求',values);
                // 请求登录
                const {username,password}= values;
                // reqLogin(username,password).then(response=>{
                //     console.log('成功了',response.data);
                // }).catch(error=>{
                //     console.log('失败了',error);
                // });
                /**
                 * async和await
                 * 1.作用：
                 *       简化promise对象的使用：不用使用then来指定成功、失败的回调函数
                 *       以同步编码的方式（没有回调函数）来实现异步流程
                 * 2.哪里写await
                 *       在返回Promise左侧写await；不想要promise，想要promise异步执行成功的value的数据
                 * 3.哪里写async
                 *       await所在函数（最近的）定义的左侧写async
                 */
                // 由于Ajax.js中已经将出错信息封装好了，外层调用就不需要再处理请求出错的信息了
                const result = await reqLogin(username,password);//{status:0,data:user} // {status:1,msg:""}
                console.log('请求成功',result);
                if(result.status===0){
                    //登陆成功
                    message.success("登录成功！");
                    
                    // 将用户信息存起来,到后台管理界面展示
                    const user = result.data;
                    memoryUtils.user = user;//保存在内存中
                    storageUtils.saveUser(user);//保存在localStorage中
                    //跳转后台管理(不需要再回退回来)，如果需要回退回来就用push()
                    this.props.history.replace('/')
                }else{//登录失败
                    message.error(result.msg);
                }
            }else{
                console.log('校验失败！');
            }
        });
    }
    // 自定义验证规则，对密码进行自定义验证
    validatorPwd=(rule,value,callback)=>{
        console.log('pwd',rule,value);
        // 1.必须输入；
        // 2.必须大于4位；
        // 3.必须小于12位；
        // 4.必须是英文、数字或下划线组成
        if(!value){
            callback('密码不能为空'); //验证失败，并指定提示的文本
        }else if(value.length < 4){
            callback('密码至少4位'); //验证失败，并指定提示的文本
        }else if(value.length > 12){
            callback('密码不能超过12位'); //验证失败，并指定提示的文本
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            callback('密码必须是英文、数字或下划线组成'); //验证失败，并指定提示的文本
        }else{
            callback(); //验证通过
        }
    }
    render() {
 
        // 判断用户是否登录，如果用户已经登录，直接跳转到后台
        if(memoryUtils.user && memoryUtils.user._id){
            return <Redirect to='/'/>
        }


        //获取form对象
        const form = this.props.form;
        const {getFieldDecorator} =form;
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>react项目: 后台管理系统</h1>
                </header>
                <section className="login-center">
                    <h2>用户登录</h2>
                    <div>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Item>
                                {
                                    getFieldDecorator('username',{ // 配置对象
                                        // 声明式验证：直接使用别人定义好的验证规则进行验证
                                        // 1.必须输入；
                                        // 2.必须大于4位；
                                        // 3.必须小于12位；
                                        // 4.必须是英文、数字或下划线组成
                                        rules:[
                                            {required:true, witespace:true, message:'用户名不能为空'},
                                            {max:12,message:'用户名不能超过12位'}, 
                                            {min:4,message:'用户名至少4位'},
                                            {pattern:/^[a-zA-Z0-9_]+$/,message:'用户名必须是英文、数字或下划线组成'},
                                        ],
                                        initialValue:'admin'//指定初始值
                                    })(
                                        <Input prefix={<Icon type="user" style={{color:'rgba(0,0,0,.25)'}} />} placeholder="用户名" />
                                )}
                            </Item>

                            <Item>
                                {
                                    getFieldDecorator('password',{
                                        rules:[
                                           // 自定义验证规则
                                           {validator:this.validatorPwd}
                                        ],
                                    })(
                                        <Input prefix={<Icon type="lock" style={{color:'rgba(0,0,0,.25)'}} />} type="password" placeholder="密码"/>
                                )}  
                            </Item>

                            <Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    登录
                                </Button>
                            </Item>
                        </Form>
                    </div>
                </section>
            </div>
        );
    }
}

/**
 * 包装Form组件，生成一个新的组件：Form(Login)
 * 新组件会向Form组件传递一个强大的对象属性：form
 * 1.高阶函数
 *    一类特别的函数：
 *        接受函数类型的参数  ||  返回值是函数
 *    常见的高阶函数：
 *        定时器：setTimeout()/setInterval()
 *        Promise:Promise(()=>{}).then(value=>{},reason=>{})
 *        数组遍历相关：foreach()/filter()/map()/reduce()/find()/findIndex()
 *        函数对象的bind()
 *        Form.create()()/getFieldDecorator()()
 *    高阶函数更新动态，更加具备扩展性
 * 
 * 2.高阶组件
 *    本质就是一个函数。接受一个组件（被包装组件），返回一个新的组件（包装组件），包装组件会向被包装组件传入特定属性。新组件内部渲染被包装组件
 *    作用：扩展组件的功能\
 *    高阶组件也是高阶函数，接受一个组件函数，返回一个新的组件函数
 */
const WrapLogin = Form.create()(Login);
export default WrapLogin;
