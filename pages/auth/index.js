import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
import {login} from "../../utils/asyncWx"
Page({
//  获取用户信息
  async handleGetUserInfo(e){
  try {
    const {encryptedData,rawData,iv,signature}=e.detail;
    const {code}=await login(); //code是用户登录凭证
    const loginParams={encryptedData,rawData,iv,signature,code};
    //发送请求，获取用 户得token值 
    const {token}=await request({url:"/users/wxlogin",data:loginParams,method:"post"});
    //console.log(token);为null
    //吧token存入缓存中 同时跳转回上一个页面
    wx.setStorageSync("token", token);
    wx.navigateBack({
      delta: 1
    });
  } catch (error) {
    console.log(error);
  }
}
})