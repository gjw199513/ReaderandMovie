var postsData = require('../../../data/posts-data.js')
// 获取全局变量
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlayingMusic: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var globalData = app.globalData;
        var postId = options.id;
        this.data.currentPostId = postId;
        var postData = postsData.postList[postId];
        this.setData({
            postData: postData
        });


        // var postsCollected = {
        //     1: "true",
        //     2: "true",
        //     3: "false",
        //     ...
        // }

        var postsCollected = wx.getStorageSync("posts_collected");
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            // 设置collected变量值
            this.setData({
                collected: postCollected,
            })
        } else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync("posts_collected", postsCollected);
        };

        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
            this.setData({
                isPlayingMusic: true
            })
        }
        this.setMusicMonitor();
        // 设置缓存，同步
        // wx.setStorageSync("key", "data");
        // wx.setStorageSync("key", {
        //     game: "fbyx",
        //     dev: "zs"
        // })
        // wx.setStorageSync("key1", {
        //     game: "fbyx",
        //     dev: "zaaaas"
        // })
    },

    setMusicMonitor: function () {
        var that = this;
        // 监听播放音乐
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isPlayingMusic: true
            })
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentMusicPostId = that.data.currentPostId;
        })
        // 监听关闭音乐
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });
        // 音乐播放完后关闭
        wx.onBackgroundAudioStop(function () {
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });
    },
    onCollectionTap: function (event) {
        this.getPostsCollectedSyc();
        // this.getPostsCollectedAsy();
    },
    // 收藏的方法异步
    getPostsCollectedAsy: function () {
        var that = this;
        wx.getStorage({
            key: 'posts_collected',
            success: function (res) {
                var postsCollected = res.data;
                var postCollected = postsCollected[that.data.currentPostId];
                // 收藏变成未收藏，为收藏变成收藏
                postCollected = !postCollected;
                postsCollected[that.data.currentPostId] = postCollected;
                // this.showModal(postsCollected, postCollected);
                that.showToast(postsCollected, postCollected);
            },
        })
    },

    // 收藏的方法同步
    getPostsCollectedSyc: function () {
        var postsCollected = wx.getStorageSync("posts_collected");
        var postCollected = postsCollected[this.data.currentPostId];
        // 收藏变成未收藏，为收藏变成收藏
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        // this.showModal(postsCollected, postCollected);
        this.showToast(postsCollected, postCollected);
    },


    showModal: function (postsCollected, postCollected) {
        // this指代函数调用上下文
        var that = this;
        wx.showModal({
            title: '收藏',
            content: postCollected ? '收藏该文章?' : '取消收藏该文章?',
            showCancel: 'true',
            cancelText: "取消",
            cancelColor: '#333',
            confirmText: '确认',
            confirmColor: '#405f80',
            success: function (res) {
                if (res.confirm) {
                    wx.setStorageSync("posts_collected", postsCollected);
                    // 更新数据绑定,实现切换图片
                    that.setData({
                        collected: postCollected
                    })
                }
            }
        })
    },
    showToast: function (postsCollected, postCollected) {
        // 更新文章是否更新的缓存值
        wx.setStorageSync("posts_collected", postsCollected);
        // 更新数据绑定,实现切换图片
        this.setData({
            collected: postCollected
        })
        // 收藏弹出反馈
        wx.showToast({
            title: postCollected ? '收藏成功' : "取消成功",
            // 修改间隔时间
            duration: 1000,
            // 图标
            icon: "success"
        })
    },
    onShareTap: function (event) {
        var itemList = [
            "分享给微信好友",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博",
        ]
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                // res.cancel 用户是不是点击了取消按钮
                // res.tapIndex 数组元素的序号，从0开始
                wx.showModal({
                    title: '用户' + itemList[res.tapIndex],
                    content: '用户是否取消?' + res.cancel + '现在无法实现分享功能，什么时候支持呢'
                })
            }
        })
    },

    // 音乐播放
    onMusicTap: function (event) {
        var currentPostId = this.data.currentPostId;
        var postData = postsData.postList[currentPostId]
        var isPlayingMusic = this.data.isPlayingMusic;
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            // isPlayingMusic数据绑定到页面
            this.setData({
                isPlayingMusic: false
            })
        } else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.url,
                coverImgUrl: postData.music.coverImg
            });
            this.setData({
                isPlayingMusic: true
            })
        }



    }
    // onCollectionTap: function (event) {
    //     // 获得该key缓存
    //     var game = wx.getStorageSync('key');
    //     console.log(game);
    // },
    // onShareTap:function(event){
    //     // 清除该key缓存
    //     wx.removeStorageSync("key");
    //     // 清除全部缓存
    //     // 缓存的上限最大不能超过10MB
    //     wx.clearStorageSync();
    // }

})