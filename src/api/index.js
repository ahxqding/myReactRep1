/**
 * 包含应用中所有接口请求函数的模块
 * 每个函数的返回值都是promise
 */
// 登录
import ajax from './Ajax';
const BASE="";
export const reqLogin = (username,password) =>ajax(BASE+'/login',{username,password},'POST');//使用箭头函数来简化代码
export const reqAddUser = (user) =>ajax(BASE+'/manger/user/add',user,'POST');