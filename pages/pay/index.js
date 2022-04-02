// pages/cart/index.js
import { getSetting,chooseAddress,openSetting,showModal,showToast,requestPayment} from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
import {request} from "../../request/index.js"
/* 
  1.微信支付
     1.企业账号，企业账号小程序后台必须给开发者添加白名单
     一个appid可以同时绑定多个开发者，开发者可以共用appid和权限
  2.支付按钮
    判断有没有缓存，没有的话进行授权，进行获取token
    有token创建订单 获取订单编码
    完成微信支付后，手动删除商品缓存中已经支付的商品
*/
Page({
  data:{
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    //1.获取本地存储的地址数据
    const address=wx.getStorageSync("address");
    let cart =wx.getStorageSync("cart")||[]; 
    //过滤后的购物车数组
    cart=cart.filter(v=>v.checked);
    this.setData({address});
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
    })
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },
  //点击支付功能
  async handleOrderPay(){
    try {
      //判断缓存中有无token
    const token=wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }
    //创建订单,(请求头参数)Authorization(用户登录成功获取的token值)
    const header={Authorization:token}
    //请求体参数
    const order_price=this.data.totalPrice;
    const consignee_addr=this.data.address.all;
    const cart=this.data.cart;
    let goods=[];
    cart.forEach(v=>goods.push({
      goods_id:v.goods_id,
      goods_number:v.num,
      goods_price:v.goods_price
    }))
    const orderParams={order_price,consignee_addr,goods};
    //准备发送请求 创建订单 获取订单编号
    const order_number=await request({url:"/my/orders/create",method:"POST",data:orderParams});
    //发起预支付接口
    const {pay}=await request({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number}});
    //发起微信支付
    await requestPayment(pay);
    const res=await request({url:"/my/orders/chkOrder",method:"POST",data:{order_number}});
    await showToast({title:"支付成功"});
    //手动删除缓存中已经支付了的商品
    let newCart=wx.getStorageSync("cart");
    newCart=newCart.filter(v=>!v.checked);
    wx.wx.setStorageSync("cart", newCart);
    //支付成功跳转订单页面
    wx.navigateTo({
      url: '/pages/order/index'
    });
    } catch (error) {
      await showToast({title:"支付失败"});
      console.log(error);
    }
  }
})
