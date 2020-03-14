function converToStarsArray(stars) {
    var starsArray = [0, 0, 0, 0, 0]
    var count = stars.slice(0, 1)
    for (var i = 0; i < count; i++) {
        starsArray[i] = 1
    }
    return starsArray
}

function http(url, callBack) {
    wx.request({
        url: url,
        method: 'GET',
        header: {
            'Content-Type': 'json'
        },
        success: (res) => {
            callBack(res.data)
        },
        fail: (error) => {
            console.log(error)
        }
    })
}

function convertToCastString(casts) {
    var castsjoin = "";
    for (var idx in casts) {
        castsjoin += casts[idx].name + " / ";
    }
    return castsjoin.substring(0, castsjoin.length - 2);
}

function convertToCastInfos(casts) {
    var castsArray = []
    for (var idx in casts) {
        var cast = {
            img: casts[idx].avatars ? casts[idx].avatars.large : "",
            name: casts[idx].name
        }
        castsArray.push(cast);
    }
    return castsArray;
}

module.exports = {
    converToStarsArray: converToStarsArray,
    http: http,
	convertToCastString,
	convertToCastInfos
}