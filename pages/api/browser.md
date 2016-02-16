##browser
浏览器检测对象

>该对象是使用浏览器的userAgent信息进行相关识别，并且通过枚举出常见浏览器的userAgent信息来进行最终的功能实现，所以无法保证检测的绝对正确性和匹配的完整性。该对象被注册到packet全局对象上。

###name()
获取浏览器名称，在非常用浏览器中运行调用该方法会返回```unknow```

###version()
获取当前浏览器的版本，如果不存在则返回```unknow```

###isMobile()
判断当前浏览器是否为移动端浏览器，如果是返回`true`，否则返回`false`

###isAndroid()
判断当前浏览器所运行的系统是否为Android

###isIos()
判断当前浏览器所运行的系统是否为IOS

###isWebkit()
判断浏览器内核是否为webkit

###isGecko()
判断浏览器内核是否为gecko

###isTrident()
判断浏览器内核是否为trident

###isEdge()
判断浏览器是否为edge

###isIe()
判断浏览器是否为IE

###isSupport()
判断当前浏览器是否支持packet的运行













