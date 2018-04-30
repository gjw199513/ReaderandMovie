// 只能使用相对路径
var postsData = require('../../data/posts-data.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 小程序总是会读取data对象来做数据绑定，这个动作我们称为动作A
        // 而这个动作A的执行，是在onLoad事件执行之后发生的
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData({
            posts_key: postsData.postList
        });
    },

    onPostTap: function (event) {
        // 获取所有自定义属性的集合，其中的postId
        // 自动转换为全部小写的
        var postId = event.currentTarget.dataset.postid;
        // console.log(postId);
        wx.navigateTo({
            url: 'post-detail/post-detail?id=' + postId,
        })
    },

    // onSwiperItemTap: function (event) {
    //     var postId = event.currentTarget.dataset.postid;
    //     wx.navigateTo({
    //         url: 'post-detail/post-detail?id=' + postId,
    //     })
    // },


    onSwiperTap: function (event) {
        // target和currentTarget
        // target指的是当前点击的组件，target和currentTarget指的是事件捕获的组件
        // target这里指的是image，而currentTarget指的是swiper
        var postId = event.target.dataset.postid;
        wx.navigateTo({
            url: 'post-detail/post-detail?id=' + postId,
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})