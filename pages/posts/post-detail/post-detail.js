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
        // 将post页中传入的id，接收并保存
        var postId = options.id;
        // 保存页面当前的postId
        this.data.currentPostId = postId;
        // 获得该id的数据
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

        // 获取收藏缓存
        var postsCollected = wx.getStorageSync("posts_collected");
        // 如果缓存存在
        if (postsCollected) {
            // 将该id收藏的缓存值保存
            var postCollected = postsCollected[postId];
            // 设置collected变量值
            // 这里可能会报错，由于需要collected
            this.setData({
                collected: postCollected,
            })
        } else {
            // 使用字典记录全部文章的收藏类型
            var postsCollected = {};
            // 如果缓存不存在，将该id的文章收藏设置初始值为false
            postsCollected[postId] = false;
            // 并将初次的字典记录放入缓存
            wx.setStorageSync("posts_collected", postsCollected);
        };

        // 如果当前有播放的音乐，并且该音乐是此id的音乐
        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
            // 将该页面的播放音乐值设置为true
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


    // 监听音乐播放状态
    setMusicMonitor: function () {
        var that = this;
        // 监听播放音乐
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isPlayingMusic: true
            })
            app.globalData.g_isPlayingMusic = true;
            // 将当前音乐播放的文章id放入全局变量
            app.globalData.g_currentMusicPostId = that.data.currentPostId;
        })
        // 监听关闭音乐
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            // 将当前音乐播放的文章id置为null
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


    // 点击收藏按钮
    onCollectionTap: function (event) {
        this.getPostsCollectedSyc();
        // this.getPostsCollectedAsy();
    },

    // 收藏的方法异步
    getPostsCollectedAsy: function () {
        var that = this;
        // 获得缓存异步方法
        wx.getStorage({
            key: 'posts_collected',
            success: function (res) {
                // 获取收藏缓存的全部数据
                var postsCollected = res.data;
                // 获取该id文章的收藏状态
                var postCollected = postsCollected[that.data.currentPostId];
                // 收藏变成未收藏，未收藏变成收藏（动态语言的优势）
                postCollected = !postCollected;
                // 将该id文章的收藏状态进行更改
                postsCollected[that.data.currentPostId] = postCollected;
                // this.showModal(postsCollected, postCollected);
                // 调用显示消息提示框方法
                that.showToast(postsCollected, postCollected);
            },
        })
    },


    // 收藏的方法同步
    getPostsCollectedSyc: function () {
        // 获得缓存同步方法
        var postsCollected = wx.getStorageSync("posts_collected");
        // 获取该id文章的收藏状态
        var postCollected = postsCollected[this.data.currentPostId];
        // 收藏变成未收藏，为收藏变成收藏
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        // this.showModal(postsCollected, postCollected);
        // 调用显示消息提示框方法
        this.showToast(postsCollected, postCollected);
    },


    // ​显示模态弹窗方法（本案例未调用，收藏时需要用户确认体验不好）
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
                // res.confirm为 true 时，表示用户点击了确定按钮
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

    // 显示消息提示框方法
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

    // 分享按钮
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

    // 音乐播放按钮
    onMusicTap: function (event) {
        // 获得当前文章id
        var currentPostId = this.data.currentPostId;
        // 获取当前文章的信息
        var postData = postsData.postList[currentPostId]
        // 获取当前文章的音乐播放状态
        var isPlayingMusic = this.data.isPlayingMusic;
        // 正在播放音乐
        if (isPlayingMusic) {
            // 暂停音乐
            wx.pauseBackgroundAudio();
            // isPlayingMusic数据绑定到页面
            this.setData({
                isPlayingMusic: false
            })
        } else {
            // 播放音乐
            wx.playBackgroundAudio({
                // 音乐地址,不支持本地音乐
                dataUrl: postData.music.url,
                // 音乐标题
                title: postData.music.url,
                // 封面图
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