#serialize
数据序列化模块`brooder.serialize`

##postData(object)
将object序列化为可以作为http请求的数据格式，可以包含满足`XMLHttpRequest Level2`的任何数据类型。

##queryString(object)
将object序列化为url的query部分的数据格式

##getURLInfo(url)
从url中获取query和hash部分的信息，并序列化为对象返回

##queryObject(url)
从url中获取query部分信息并序列化为对象返回

##hashObject(url)
从url中获取hash部分的信息并序列化为对象返回