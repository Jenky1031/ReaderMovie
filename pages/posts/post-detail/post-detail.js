var postData = require('../../../data/posts-data.js')
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
    onLoad: function(options) {
        var postId = options.id
        var g_isPlayingMusic = app.globalData.g_isPlayingMusic
        var g_currentMuiscPostId = app.globalData.g_currentMuiscPostId
        this.setData({
            isPlayingMusic: g_isPlayingMusic && g_currentMuiscPostId === postId
        })

        this.data.currentPostId = postId
        this.setData({
            postId: postId,
            postData: postData.postList[postId]
        })

        // 缓存数据为这样的结构
        // var posts_collected = {
        // 	0: false,
        // 	1: true,
        // 	2: true
        // }
        var postsCollected = wx.getStorageSync('posts_collected')
        if (postsCollected) {
            var postCollected = postsCollected[postId]
            if (postCollected) {
                this.setData({
                    collected: postCollected
                })
            }
        } else {
            var postsCollected = {}
            postsCollected[postId] = false
            wx.setStorageSync('posts_collected', postsCollected)
        }

        this.setMusicMonitor()
    },

    // onUnload: function() {
    //     if (isPlayingMusic && app.globalData.g_currentMuiscPostId === this.data.postId) {
    //         app.globalData.g_isPlayingMusic = this.data.isPlayingMusic
    //         app.globalData.g_currentMuiscPostId = this.data.postId
    //     }
    // },

    // 设置 音乐控件 和 页面 同步
    setMusicMonitor: function() {
        // 监听当前背景音频播放
        var backgroundAudioManager = wx.getBackgroundAudioManager()
        backgroundAudioManager.onPlay(() => {
            app.globalData.g_isPlayingMusic = true
            app.globalData.g_currentMuiscPostId = this.data.postId
            // 改变当前页面音频播放状态
            this.setData({
                isPlayingMusic: true
            })
        })
        // 监听当前背景音频暂停
        backgroundAudioManager.onPause(() => {
            app.globalData.g_isPlayingMusic = false
            app.globalData.g_currentMuiscPostId = null
            // 改变当前音频播放状态
            this.setData({
                isPlayingMusic: false
            })
        })
        // 监听当前背景音频停止
        backgroundAudioManager.onEnded(() => {
			app.globalData.g_isPlayingMusic = false
			app.globalData.g_currentMuiscPostId = null
			this.setData({
				isPlayingMusic: false
			})
        })
    },
    onCollectionTap: function(event) {
        var postsCollected = wx.getStorageSync('posts_collected')
        var postCollected = postsCollected[this.data.currentPostId]
        this.showToast(postsCollected, postCollected)
        // this.showModal(postsCollected, postCollected)
    },
    showModal: function(postsCollected, postCollected) {
        var that = this
        wx.showModal({
            title: '收藏',
            content: postCollected ? '是否取消收藏该文章' : '是否收藏该文章',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#333',
            confirmText: '确认',
            confirmColor: '#405f80',
            success: function(res) {
                if (res.confirm) {
                    // 收藏变为为收藏，为收藏变为收藏
                    postCollected = !postCollected
                    postsCollected[that.data.currentPostId] = postCollected
                    wx.setStorageSync('posts_collected', postsCollected)
                    that.setData({
                        collected: postCollected
                    })
                }
            }
        })
    },
    showToast: function(postsCollected, postCollected) {
        // 收藏变为为收藏，为收藏变为收藏
        postCollected = !postCollected
        postsCollected[this.data.currentPostId] = postCollected
        wx.setStorageSync('posts_collected', postsCollected)
        this.setData({
            collected: postCollected
        })
        wx.showToast({
            title: postCollected ? '收藏成功' : '取消收藏',
            duration: 1000,
            icon: 'success'
        })
    },
    onShareTap: function(event) {
        var itemList = [
            '分享到微信好友',
            '分享到朋友圈',
            '分享到QQ',
            '分享到微博'
        ]
        wx.showActionSheet({
            itemList: itemList,
            itemColor: '#405f80',
            success: function(res) {
                // res.tapIndex,当前点击数组中某个元素的序号
                wx.showModal({
                    title: '用户' + itemList[res.tapIndex],
                    content: '暂时无法实现分享功能'
                })
            }
        })
    },

    // 点击音乐图标事件
    onMusicTap: function(event) {
        // 获取当前页面音乐数据
        var music = this.data.postData.music
        // 调用小程序 背景音频管理器 的API
        var backgroundAudioManager = wx.getBackgroundAudioManager()
        // 获取当前音频播放状态
        var isPlayingMusic = this.data.isPlayingMusic
        // 调用小程序 背景音频管理器 的API
        var backgroundAudioManager = wx.getBackgroundAudioManager()
        if (isPlayingMusic) {
            // 音乐正在播放, 点击图标暂停
            backgroundAudioManager.pause()
            // 更新音乐播放状态
            this.setData({
                isPlayingMusic: false
            })
        } else {
            // 未播放,则设置音乐
            // 设置了新的src,会自动播放
            backgroundAudioManager.src = music.url
            backgroundAudioManager.title = music.title
            backgroundAudioManager.singer = music.singer
            backgroundAudioManager.coverImgUrl = music.coverImg
            // 更新音乐播放状态
            this.setData({
                isPlayingMusic: true
            })
            // }
        }
    }
})