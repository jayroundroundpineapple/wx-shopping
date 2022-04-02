// pages/login/index.js
Page({
  handleGetUserInfo(e){
    const {userInfo}=e.detail;
    wx.setStorageSync("userinfo", userInfo);
    wx.switchTab({
      url: '/pages/index/index',
    });
  }
})