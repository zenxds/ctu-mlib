/**
 * 微信相关封装
 */
var $ = require('../../zepto/zepto')
require('../../zepto/ajax')

var wx = window.wx
var isWX = /MicroMessenger/i.test(navigator.userAgent)

/**
 * 
 */
var share = function(options) {
  if (!isWX || !wx) {
    return
  }
  options = mix({
    title: document.title,
    desc: document.title,
    link: location.href,
    imgUrl: ''
  }, options || {})

  $.ajax({
    url: options.shareConfigUrl || '/weixin/sdkconfig',
    dataType: 'json',
    success: (config) => {
      config.jsApiList = [
        'onMenuShareAppMessage',
        'onMenuShareTimeline'
      ]
      wx.config(config)
      wx.ready(() => {
        wx.onMenuShareTimeline(options)
        wx.onMenuShareAppMessage(options)
      })
    }
  })
}

module.exports = {
  share: share
}

function mix(to, from) {
  for (var i in from) {
    to[i] = from[i]
  }
  return to
}