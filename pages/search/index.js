import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
//防抖：通过定时器
Page({
  data: {
    goods:[],
    //取消按钮 是否显示
    isFocus:false,
    inpValue:'',//输入框value值
  },
  TimeId:-1,
  //输入框搜索功能
  handleInput(e){
    const {value}=e.detail;
    if(!value.trim()){
      this.setData({
        goods:[],
        isFocus:false
      })
      return;
    }
    this.setData({
      isFocus:true
    })
    //准备发送请求获取数据
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(() => {
      this.qsearch(value);
    }, 1000);
  },
  //发送请求函数
  async qsearch(query){
    const res=await request({url:"/goods/qsearch",data:{query}});
    this.setData({
      goods:res
    })
  },
  handleCancel(){
    this.setData({
      inpValue:"",
      isFocus:false,
      goods:[]
    })
  }
})