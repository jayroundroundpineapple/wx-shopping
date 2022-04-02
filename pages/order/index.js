import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    orders:[],
    tabs:[
      {
        id:0,
        value:'全部订单',
        isActive:true
      },
      {
        id:1,
        value:'待付款',
        isActive:false
      },
      {
        id:2,
        value:'待发货',
        isActive:false
      },
      {
        id:2,
        value:'退货/退款',
        isActive:false
      }
    ]
  },
  onShow(){
    //判断有无token值，没有的就授权
    //const token=wx.getStorageSync("token");
    /*if(!token){
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }*/
    let pages=getCurrentPages();
    //拿到数组中最大的索引
    let currentPage=pages[pages.length-1];
    //获取url上的type参数
    const {type}=currentPage.options;
    //激活选中标题
    this.ChangeTitleByIndex(type-1);
    this.getOrders(type);
  },
  //获取订单列表的方法
  async getOrders(type){
    const res=await request({url:"/my/orders/all",data:{type}});
    this.setData({
      orders:res.orders
    })
  },
  //根据标题索引来激活选中的数组
  ChangeTitleByIndex(index){
      //修改源数组
      let {tabs}=this.data
      tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
      //赋值到data
      this.setData({
        tabs
      })
  },
  handleTabsItemChange(e){
    //console.log(e)
    //获取被点击的索引
    const {index}=e.detail;
    this.ChangeTitleByIndex(index);
    this.getOrders(index+1);
  }
})