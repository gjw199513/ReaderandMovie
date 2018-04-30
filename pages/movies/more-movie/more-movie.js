var util = require('../../../utils/util.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        movies: {},
        navigateTitle: "",
        requestUrl: "",
        totalCount: 0,
        isEmpty: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var category = options.category;
        this.data.navigateTitle = category;
        var dataUrl = "";
        switch (category) {
            case "正在热映":
                dataUrl = app.globalData.doubanBase +
                    "/v2/movie/in_theaters";
                break;
            case "即将上映":
                dataUrl = app.globalData.doubanBase +
                    "/v2/movie/coming_soon";
                break;
            case "豆瓣Top250":
                dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
                break;
        }
        this.data.requestUrl = dataUrl;
        util.http(dataUrl, this.processDoubanData);
    },

    // 上滑加载更多
    onScrollLower: function (event) {
        var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
        util.http(nextUrl, this.processDoubanData);
        wx.showNavigationBarLoading();
    },

    // 下拉刷新
    // onPullDownRefresh: function (event) {
    //     var refreshUrl = this.data.requestUrl +
    //         "?start=0&count=20";
    //         // 初始化，将数据置空
    //         this.data.movies = {};
    //         this.data.isEmpty = false;
    //         this.data.totalCount = 0;
    //     util.http(refreshUrl, this.processDoubanData);
    //     wx.showNavigationBarLoading();
    // },
    onReachBottom: function (event) {
        var nextUrl = this.data.requestUrl +
            "?start=" + this.data.totalCount + "&count=20";
        util.http(nextUrl, this.processDoubanData)
        wx.showNavigationBarLoading()
    },

    processDoubanData: function (moviesDouban) {
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            // 处理title
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + '...';
            }
            var temp = {
                // [1,1,1,1,1] [1,1,1,0,0]
                stars: util.convertToStarsArray(subject.rating.stars),
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id
            }
            movies.push(temp);
        }
        var totalMovies = {}
        // 如果需要绑定新加载的数据，需要和旧有数据合并在一起
        // 判断数据是否为空
        // 将新旧数据连接在一起
        if (!this.data.isEmpty) {
            totalMovies = this.data.movies.concat(movies);
        } else {
            totalMovies = movies;
            this.data.isEmpty = false;
        }
        this.setData({
            movies: totalMovies
        });
        this.data.totalCount += 20;
        wx.hideNavigationBarLoading();
        // wx.stopPullDownRefresh();
    },
    // 只能在onReady中设置bartitle
    onReady: function (event) {
        // 动态设置导航栏标题
        wx.setNavigationBarTitle({
            title: this.data.navigateTitle,
            success: function (res) {

            }
        })
    },
    // 跳转详情页
    onMovieTap: function (event) {
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: '../movie-detail/movie-detail?id=' + movieId,
        })
    }

})