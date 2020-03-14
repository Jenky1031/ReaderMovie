let {
    converToStarsArray,
    http
} = require('../../utils/util.js')
let app = getApp()

Page({
    data: {
        readyData: {},
        containerShow: true,
        searchPanelShow: false,
        baseUrl: '',
        searchResult: {}
    },
    onLoad: function(options) {
        let baseUrl = app.globalData.doubanBase
        this.setData({
            baseUrl
        })
        let inTheatersUrl = baseUrl + '/v2/movie/in_theaters?start=0&count=3'
        let comingSoonUrl = baseUrl + '/v2/movie/coming_soon?start=0&count=3'
        let top250Url = baseUrl + '/v2/movie/top250?start=0&count=3'
        this.getMovieListData(inTheatersUrl, 'inTheaters', '正在热映')
        this.getMovieListData(comingSoonUrl, 'comingSoon', '即将上映')
        this.getMovieListData(top250Url, 'top250', '豆瓣Top250')
    },

    getMovieListData: function(url, settedKey, categoryTitle) {
        wx.request({
            url: url,
            method: 'GET',
            header: {
                'Content-Type': 'haha'
            },
            success: (res) => {
                this.processDoubanData(res.data.subjects, settedKey, categoryTitle)
            },
            fail: function() {
                console.log('fail')
            }
        })
    },

    processDoubanData: function(moviesDouban, settedKey, categoryTitle) {
        let movies = []
        for (let idx in moviesDouban) {
            let subject = moviesDouban[idx]
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
        let readyData = {}
        readyData[settedKey] = {
            movies: movies,
            categoryTitle: categoryTitle
        }
        this.setData(readyData)
    },

    onMoreTap: (event) => {
        let categoryId = event.currentTarget.dataset.id
        wx.navigateTo({
            url: 'more-movie/more-movie?category=' + categoryId
        })
    },

    onBindFocus: function(event) {
        this.setData({
            containerShow: false,
            searchPanelShow: true
        })
    },

    onBindConfirm: function(event) {
        let text = event.detail.value
		let searchUrl = this.data.baseUrl + '/v2/movie/search?q=' + text
        this.getMovieListData(searchUrl, 'searchResult', '')
    },

    onCancelImgTap: function(event) {
        this.setData({
            containerShow: true,
            searchPanelShow: false
        })
        this.setData({
            searchResult: {}
        })
    },

    onMovieTap: function(event) {
        let movieId = event.currentTarget.dataset.id
        wx.navigateTo({
            url: 'movie-detail/movie-detail?id=' + movieId
        })
    }
})