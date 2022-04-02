/*
  点击+号触发小程序内置的选择图片事件
  获取到图片的路径
  把图片路径存到data的变量
*/
Page({
  data: {
    tabs:[
      {
        id:0,
        value:'体验问题',
        isActive:true
      },
      {
        id:1,
        value:'商品、商家投诉',
        isActive:false
      }
    ],
    chooseImgs:[],
    //文本域的内容
    textVal:""
  },
  //外网的图片的路径数组
  UpLoadImgs:[],
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
  //点击+号选择图片
  handleChooseImg(){
    //内置选择图片api
    wx.chooseImage({
      count: 9,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (result)=>{
        this.setData({
          //图片数组拼接
          chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths]
        })
      }
    });

  },
  //点击图片
  handleRemoveImg(e){
    //获取被点击的索引
    const {index}=e.currentTarget.dataset;
    //获取data中的图片数组
    let {chooseImgs}=this.data;
    //删除元素
    chooseImgs.splice(index,1);
    this.setData({
      chooseImgs
    })
  },
  //文本域输入事件
  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },
  //提交按钮点击事件
  handleFromSubmit(){
    //获取文本域内容
    const {textVal,chooseImgs}=this.data;
    //对文本进行合法性的验证
    if(!textVal.trim()){
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask:true
      });
       return;
    } 
    wx.showLoading({
      title: "正在加载中",
      mask: true,
    });
    //判断有无需要上传的图片
    if(chooseImgs.length!=0){
      chooseImgs.forEach((v,i)=>{
        wx.uploadFile({
           url: 'https://img.kuibu.net/',
           filePath: v,
           name: "file",
           formData: {},
           success: (result)=>{
             console.log(result);
             let url=JSON.parse(result.data).url;
             this.UpLoadImgs.push(url);
             //所有图片上传完毕才触发
             if(i===chooseImgs.length-1){
               //弹窗关闭
               wx.hideLoading();
               console.log("把文本内容和外网图数组提交到后台上去")
               //提交成功，重置页面，返回上一个页面
               this.setData({
                 textVal:"",
                 chooseImgs:[]
               })
               //返回上一个页面
               wx.navigateBack({
                 delta: 1
               });
             }
           }
         });
       })
    }else{
      wx.hideLoading();
      console.log(只提交了文本);
      wx.navigateBack({
        delta: 1
      });
    }
  
  }
})