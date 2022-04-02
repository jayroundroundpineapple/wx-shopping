import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
   data: {
    //左侧菜单数据
    leftMenuList:[],
    //右侧商品数据
    rightContent:[],
    //被选中的左侧商品
    currentIndex:0,
    //右侧内容滚动条的距离
    scrollTop:0
  },
//接受返回数据
  Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 
    1.先判断本地存储中有没有旧的数据
    {time:Date.now(),data:[...]}
    2.没有旧数据，直接发送请求
    3.有旧数据，同时旧数据没过期，使用本地存储的旧数据
    */
   //1.获取本地存储的数据
   const Cates=wx.getStorageSync("cates");
   //2.判断
   if(!Cates){
    // 不存在本地存储，发送请求获取数据
    this.getCates();
   }else{
     //如果存在本地存储，先判断有无过期
     if(Date.now() - Cates.time>1000*10){
       //重新发送请求
       this.getCates();
     }else{
       //使用旧的数据
        this.Cates=Cates.data;
        let leftMenuList=this.Cates.map(v=>v.cat_name);
        let rightContent=this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
     }
   }
  },
  //获取数据
  async getCates(){
    /*request({
      url:'/categories'
    })
    .then(res=>{
      this.Cates=res.data.message;
      //把接口的数据存储的本地存储中
      wx.setStorageSync("cates",{time:Date.now(),data:this.Cates});
      //构造左侧大菜单数据
      let leftMenuList=this.Cates.map(v=>v.cat_name);
      //构造右侧商品数据
      let rightContent=this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })
    })*/
    //使用es7的async和await发送请求
    const res=await request({url:'/categories'});
    this.Cates=res;
      //把接口的数据存储的本地存储中
      wx.setStorageSync("cates",{time:Date.now(),data:this.Cates});
      //构造左侧大菜单数据
      let leftMenuList=this.Cates.map(v=>v.cat_name);
      //构造右侧商品数据
      let rightContent=this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })

  },
  //左侧菜单点击事件
  handleItemTap(e){
    //console.log(e);
    //获取点击左侧商品的index
    const {index}=e.currentTarget.dataset;
    let rightContent=this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      scrollTop:0
    })   
  }
})