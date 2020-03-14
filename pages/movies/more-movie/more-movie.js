let {
    converToStarsArray,
    http
} = require('../../../utils/util.js')
let app = getApp()

Page({
    data: {
        totalCount: 0,
        isMoviesEmpty: true,
        movies: []
    },
    onLoad: function(options) {
        let baseUrl = app.globalData.doubanBase
        let category = options.category;
        wx.setNavigationBarTitle({
            title: category
        })
        let choiceUrl = {
            '正在热映': baseUrl + '/v2/movie/in_theaters',
            '即将上映': baseUrl + '/v2/movie/coming_soon',
            '豆瓣Top250': baseUrl + '/v2/movie/top250'
        }
        let dataUrl = choiceUrl[category]
        this.setData({
            baseUrl: baseUrl,
            dataUrl: dataUrl
        })
        http(dataUrl, this.processDoubanData)
    },

	onReachBottom: function (event) {
		let nextUrl = this.data.dataUrl + '?start=' + this.data.totalCount + '&count=20'
		http(nextUrl, this.processDoubanData)
		wx.showNavigationBarLoading()
	},

    onPullDownRefresh: function() {
        let refleshUrl = this.data.dataUrl + '?start=0&count=20'
        this.data.movies = []
        this.data.isMoviesEmpty = true
        http(refleshUrl, this.processDoubanData)
        wx.showNavigationBarLoading()
    },

    // 回调函数处理数据
    processDoubanData: function(moviesDouban) {
        let movies = []
        for (let idx in moviesDouban.subjects) {
            let subject = moviesDouban.subjects[idx]
            let title = subject.title
            if (title.length >= 6) {
                title = title.slice(0, 6) + '...'
            }
            let stars = subject.rating.stars
            let starsArray = converToStarsArray(stars)
            let tmp = {
                title: title,
                coverImg: subject.images.large,
                average: subject.rating.average,
                starsArray: starsArray,
                movieId: subject.id,
            }
            movies.push(tmp)
        }
        if (!this.data.isMoviesEmpty) {
            movies = this.data.movies.concat(movies)
        }
        this.data.isMoviesEmpty = false
        this.setData({
            movies: movies
        })
        this.data.totalCount += 20
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
    }
})