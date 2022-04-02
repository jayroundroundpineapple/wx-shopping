/*
1.发送请求，获取数据
2.点击轮播图 预览大图
   1.给轮播图绑定点击事件，调用小程序api previewImage
3.点击加入购物车事件
    绑定点击事件，获取缓存中的购物车数据 （数组格式）
    先判断是否存在购物车，若已存在，修改商品数据，购物车数量++，重新把购物车数组填充回缓存中
    不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素带上一个购买属性
 4.商品收藏
 1.页面onShow时，加载缓存中商品收藏的数据
 2.判断当前商品是不是被收藏的（是，改变图标 ）
 3.
*/
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    isCollect:false
  },
  //商品对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages =  getCurrentPages();
    let currentPage=pages[pages.length-1];
    let options=currentPage.options;
    const {goods_id}=options;
   this.getGoodsDetail(goods_id);
  },
  //获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj=await request({url:"/goods/detail",data:{goods_id}});
    console.log(goodsObj);
    this.GoodsInfo=goodsObj;
       //获取缓存中的商品收藏的数组
   let collect=wx.getStorageSync("collect")||[];
   //判断当前商品是否被收藏
   let isCollect=collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      },
      isCollect
    })
  },
  //点击轮播图放大预览
  handlePrevewImage(e){
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);//字符串数组
    //接受传递过来的图片url
    const current=e.currentTarget.dataset.url;
    //console.log(e);
    wx.previewImage({
      current,
      urls
    });
  },
  //点击加入购物车
  handleCartAdd(){
   //获取缓存中的购物车  数组
   let cart=wx.getStorageSync("cart")||[];
   //判断商品对象是否存在于购物车数组中
   let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
   if(index===-1){//不存在，第一次添加
     this.GoodsInfo.num=1;
     this.GoodsInfo.checked=true;
     cart.push(this.GoodsInfo);
   }else{
      cart[index].num++;
   }
   //把购物车重新添加回缓存中
   wx.setStorageSync("cart", cart);
   //弹窗提示
   wx.showToast({
     title: '加入成功',
     icon: 'success',
     mask: true,   //防止疯狂点击
   });
  },
  //点击商品收藏
  handleCollect(){
    let isCollect=false;
    let collect=wx.getStorageSync("collect")||[];
    //判断是否被收藏过
    let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    //当index！=-1表示已经收藏过了
    if(index!==-1){
      //已经收藏   数组中删除该商品
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title: '取消成功',
        icon:'success',
        mask:true
      });
    }else{
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon:'success',
        mask:true
      });
    }
    //把数组存入缓存中
    wx.setStorageSync("collect",collect);
    //修改data中的属性 isCollect
    this.setData({
      isCollect
    })
  }
})