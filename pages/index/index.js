//引入request.js(用来发送请求的方法)
import {request} from "../../request/index.js"
Page({
  data:{
    //轮播图数组
    swiperList:[],
    //导航数组
    catesList:[],
    //楼层数据
    floorList:[]
  },
  //options(Object)页面开始加载就会触发
  onLoad: function(options){
   /* wx.request({
      url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
      method: 'GET',
      dataType: 'json',
      responseType: 'text',  //method,dataType,responseType都是默认值可以删掉
      success: (result)=>{  //result是接口成功后得到的数据
        this.setData({
          swiperList:result.data.message
        })
      }
    });*/
    this.getSwiperList();
    this. getCateList();
    this.getFloorList();
  },
  //获取轮播图数据方法
  getSwiperList(){
    request({url:"/home/swiperdata"})
    .then(result=>{
      this.setData({
        swiperList:result
      })
    })
  },
  //获取分类导航数据
  getCateList(){
    request({url:"/home/catitems"})
    .then(result=>{
      this.setData({
        catesList:result
      })
    })
  },
  //获取楼层数据
  getFloorList(){
    request({url:"/home/floordata"})
    .then(result=>{
      this.setData({
        floorList:result
      })
    })
  }
});