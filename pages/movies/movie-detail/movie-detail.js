import {
    Movie
} from 'class/Movie.js'

let app = getApp()

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
        let url = baseUrl + '/v2/movie/subject/' + movieId

        let movie = new Movie(url)
        movie.getMovieData(movie => {
            this.setData({
                movie: movie
            })
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