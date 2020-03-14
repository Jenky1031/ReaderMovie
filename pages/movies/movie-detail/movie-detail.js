let app = getApp()
let util = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let movieId = options.id
        let baseUrl = app.globalData.doubanBase
        let http = util.http
        let url = baseUrl + '/v2/movie/subject/' + movieId
        http(url, this.processDoubanData)
    },

    processDoubanData: function(data) {
        if (!data) {
            return
        }
        let director = {
            avatar: '',
            name: '',
            id: ''
        }
        // 判空 有导演
        if (data.directors[0] != null) {
            if (data.directors[0].avatars != null) {
                // 有导演 有图片
                director.avatar = data.directors[0].avatars.large
            }
            director.name = data.directors[0].name
            director.id = data.directors[0].id
        }
        let movie = {
            movieImg: data.images ? data.images.large : '',
            country: data.countries[0],
            title: data.title,
            originalTitle: data.original_title,
            wishCount: data.wish_count,
            commentCount: data.comments_count,
            year: data.year,
            genres: data.genres.join('、'),
            stars: util.converToStarsArray(data.rating.stars),
            score: data.rating.average,
            director: director,
            casts: util.convertToCastString(data.casts),
            castsInfo: util.convertToCastInfos(data.casts),
            summary: data.summary
        }
        this.setData({
            movie: movie
        })
    },
    // 查看图片
    viewMoviePostImg: function(event) {
        let src = event.currentTarget.dataset.src;
        wx.previewImage({
            current: src,
            urls: [src],
        })
    }
})