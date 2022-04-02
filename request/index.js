//同时发送异步请求的情况
let ajaxTimes=0;
export const request=(params)=>{
     //判断url是否带有/my/ 请求是私有的路径，要带上请求头header token
     let header={...params.header};
     if(params.url.includes("/my/")){
          //拼接header 带上token
          header["Authorization"]=wx.getStorageSync("token");
     }
     ajaxTimes++;
     //显示加载中的效果
     wx.showLoading({
          title: '加载中',
          mask: true
     });
     //定义公共的url
     const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve,reject)=>{
      wx.request({
           ...params,
           header:header,
           url:baseUrl+params.url,
           success:(result)=>{
                resolve(result.data.message);
           },
           fail:(err)=>{
                reject(err);
           },
           complete(){ //关闭加载中的图标
               ajaxTimes--;
              if(ajaxTimes==0){
               wx.hideLoading();
              }
           },
        });
    })
}