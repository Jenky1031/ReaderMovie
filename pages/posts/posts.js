var postData = require('../../data/posts-data.js')

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
        this.setData({
            posts_key: postData.postList
        })
    },

    onPostTap: function(event) {
        var postId = event.currentTarget.dataset.index;
        wx.navigateTo({
            url: 'post-detail/post-detail?id=' + postId,
        })
    },

    onSwiperTap: function(event) {
        var postId = event.target.dataset.id
        wx.navigateTo({
            url: 'post-detail/post-detail?id=' + postId,
        })
    },

    onSwiperItemTap: function(event) {
        var postId = event.target.dataset.id
        wx.navigateTo({
            url: 'post-detail/post-detail?id=' + postId,
        })
    }
})