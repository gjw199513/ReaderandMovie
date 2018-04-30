Page({
  onTap:function(){
    //   从父级页面跳转到子级页面（最多五级页面跳转）
    //   wx.navigateTo({
    //       url: '../posts/post',
    //   });

    // 平级页面跳转
    //   wx.redirectTo({
    //       url: '../posts/post',
    //   })

      wx.switchTab({
          url: '../posts/post',
      })
  },
  onUnload:function(){
    //   console.log("welcome page is unload");
  },

  onHide: function () {
    //   console.log("welcome page is hide");
  }
})