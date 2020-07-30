/**
 * 包含应用中所有接口请求函数的模块
 * 每个函数的返回值都是promise
 */

import ajax from './Ajax';
import jsonp from 'jsonp';
import { message } from 'antd';
// 登录
const BASE="";
export const reqLogin = (username,password) =>ajax(BASE+'/login',{username,password},'POST');//使用箭头函数来简化代码
export const reqAddUser = (user) =>ajax(BASE+'/manger/user/add',user,'POST');

// jsonp请求的接口请求函数
export const reqWeather =(city) =>{
    return new Promise((resolve,reject)=>{
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        // 发送jsonp请求
        jsonp(url,{},(err,data)=>{
            console.log('jsonp',err,data);
            // 成功
            if(!err && data.status==='success'){
                //取出需要的数据
                const {dayPictureUrl,weather} = data.results[0].weather_data[0];
                resolve(dayPictureUrl,weather);
            }else{
                // 失败
                message.error('获取天气信息失败');
            }
        })
    })
}
reqWeather('北京')