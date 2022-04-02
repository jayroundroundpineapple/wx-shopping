// pages/goods_list/index.js
/*
  1.用户上滑页面 滚动条触底开始加载下一页数据
     1.找到滚动条触底事件
     2.判断还有没有下一页数据,(判断当前页码是否>总页数)没有下一页数据弹出提示框
        总页数=Math.ceil(总条数/页容量 pagesize)=Math.ceil(23/10)=3
     3.有下页 加载下一页数据
          1当前页面++，2重新发送请求  3数据请求回来（要对data中的数组进行拼接 而不是全部替换！！）
   二、下拉刷新页面
   1.触发下拉刷新事件(需要在页面的json文件开启一个配置项)
   2.重置 数据 数组
   3.重置页码， 设置为1     4.重新发送请求  5.数据请求完成，手动关闭等待效果    
*/
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data:{
    tabs:[
      {
        id:0,
        value:'综合',
        isActive:true
      },
      {
        id:1,
        value:'销量',
        isActive:false
      },
      {
        id:2,
        value:'价格',
        isActive:false
      }
    ],
    goodsList:[],
    
  },
  //接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.query||"";
    this.getGoodList();
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },
  //获取商品列表数据
  async getGoodList(){
    const res=await request({url:'/goods/search',data:this.QueryParams});
    //console.log(res);
    //获取总条数
    const total=res.total;
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    console.log(this.totalPages)
    this.setData({
      //拼接数组
      goodsList:[...this.data.goodsList,...res.goods]
    })
    //关闭下拉请求等待效果
    wx.stopPullDownRefresh();
  },
  //标题点击事件 从子组件Tabs传递过来
  handleTabsItemChange(e){
    //console.log(e)
    //获取被点击的索引
    const {index}=e.detail;
    //修改源数组
    let {tabs}=this.data
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    //赋值到data
    this.setData({
      tabs
    })
  },
  //页面上滑 滚动条触底事件
  onReachBottom(){
    //console.log('页面触底了');
    //判断还有没有下一页
    if(this.QueryParams.pagenum>=this.totalPages){
       //console.log('没有下一页了');
       wx.showToast({title: '没有下一页数据了',});//提示框
    }else{
      this.QueryParams.pagenum++;
      this.getGoodList();
    }
  },
  //下拉刷新事件
  onPullDownRefresh(){
    //1.重置数组
    this.setData({
      goodsList:[]
    })
    this.QueryParams.pagenum=1;//重置页码
    this.getGoodList();//重新发送请求
  }
})