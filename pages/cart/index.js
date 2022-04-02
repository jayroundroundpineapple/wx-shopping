// pages/cart/index.js
import { getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  /* 获取用户的收获地址
      1绑定点击事件
      2调用小程序内置api 
     
     获取用户对小程序所授予获取地址的权限状态scope
     1.假设用户点击获取收获地址的提示框 确定authSetting scope.address
     确定scope为ture  取消为false
     拒绝过的诱导(wx.openSetting)  
     把获取到的收获地址存入本地存储
     2.页面加载完毕（onload onshow）
        获取本地存储中的地址数据
        把数据设置给data中的变量
     4.全选的实现 数据的展示
     1.onShow 获取缓存中的购物车数组
     2.根据购物车中的商品数据   
     5总价格和总数量
         1.都需要被选中才计算
         2.获取购物车数组，遍历
         3，总价+=商品单价*数量
         4.把计算后的结果设置回data
      5 全选复选框的绑定事件change
        1获取data中的全选变量allChecked,直接取反
        2.遍历购物车数组，更新数据
      6.商品数量功能
        1.+，—按钮绑定同一个点击事件
        区分的关键（自定义属性）
        2传递被点击商品的goods_id
      7.结算，判断有没有收获地址和购物商品
         跳转支付页面
     */
  data:{
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    //1.获取本地存储的地址数据
    const address=wx.getStorageSync("address");
    const cart =wx.getStorageSync("cart")||[]; 
    this.setData({address});
    this.setCart(cart);
  },
  //点击收获地址
    async handleChooseAddress(){
     try {
     //1.获取权限状态
    const res1=await getSetting();
      const scopeAddress=res1.authSetting["scope.address"];
      //判断权限状态
      if(scopeAddress===false){
       await openSetting();
       }
       //4.调用获取收获地址api
     let address=await chooseAddress();
     address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo
     //console.log(address);
   //5存入缓存中
   wx.setStorageSync("address",address);
    } catch (error) {
     console.log(error);
      }
},
//商品选中,绑定change事件
  handleItemChange(e){
    //获取被修改商品的id
    const goods_id=e.currentTarget.dataset.id;
    //获取购物车数组
    let allChecked=true;
    let {cart}=this.data; 
    //找到被修改的商品对象
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    //取反
    cart[index].checked=!cart[index].checked;
    this.setCart(cart);
      
  },
  //设置购物车状态   （全选，总价格，购买的数量）
  setCart(cart){
  let allChecked=true;
  let totalPrice=0;
  let totalNum=0;
  cart.forEach(v=>{
    if(v.checked){
      totalPrice+=v.num*v.goods_price;
      totalNum+=v.num;
    }else{
      allChecked=false;
    }
    allChecked=cart.length!=0?allChecked:false;
  })
  this.setData({
    cart,
    totalPrice,
    totalNum,
    allChecked
  });
  wx.setStorageSync("cart",cart);
  },
  //全选
  handleItemAllCheck(){
    let {cart,allChecked}=this.data;
    allChecked=!allChecked;
    //循环修改cart数组中的商品选中状态
    cart.forEach(v=>v.checked=allChecked);
    //更新数据
    this.setCart(cart);
  },
  //商品数量编辑功能
  async handleNumEdit(e){
    //获取传递过来的参数
    const {operation,id}=e.currentTarget.dataset;
    // 获取购物车数组
    let {cart}=this.data; //console.log(cart);
    //3找到需要修改的索引
    const index=cart.findIndex(v=>v.goods_id===id);
    //4进行修改数量
    if(cart[index].num===1&&operation===-1){
      const res=await showModal({content:'是否要删除该商品?'});
      if(res.confirm){
        cart.splice(index,1);
        this.setCart(cart);
        }
       }else{
      cart[index].num+=operation;
      //设置回缓存和data中
      this.setCart(cart);
    }
  },
  async handlePay(){
    const {address,totalNum}=this.data;
    if(!address.userName){
      await showToast({title:"您还没有选择收获地址"});
      return;
    }
    if(totalNum===0){
    await showToast({title:'您还没选择商品'});
      return;
    }
    //跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  }
})
