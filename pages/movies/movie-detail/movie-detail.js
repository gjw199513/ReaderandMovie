import { Movie } from 'class/Movie.js';
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        movie: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 该值与传入
        var movieId = options.id;
        var url = app.globalData.doubanBase +
            "/v2/movie/subject/" + movieId;
        var movie = new Movie(url);

        // var that = this;
        // var movieData = movie.getMovieData();
        // 由于是调用了异步方法，无法使用上面的直接复制，必须使用回调函数
        // movie.getMovieData(function (movie) {
        //     that.setData({
        //         movie: movie
        //     })
        // })

        // 使用箭头函数改写
        // 箭头函数中的this是定义方法的环境，而不是调用方的环境
        movie.getMovieData((movie) =>{
            this.setData({
                movie: movie
            })
        })
    },

    // // 处理数据
    // processDoubanData: function (data) {


    // },

    /*查看图片*/
    viewMoviePostImg: function (e) {
        var src = e.currentTarget.dataset.src;
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: [src] // 需要预览的图片http链接列表
        })
    },
})