# 其他功能

这里简单介绍brooder框架提供的辅助性的功能。

## DOM处理

brooder提供类似jQuery的内置DOM处理对象，API的设计也参考于jQuery

> 具体信息请参考query对象

## 异步编程

brooder提供常用于异步编程的支持

- **queue** 静态队列，用于一次完成所有任务的队列
- **dynamicQueue** 动态队列，用于持续添加任务持续执行的队列
- **promise** 按照promise标准设计的功能

> 具体信息请参考queue,dynamicQueue,promise对象的说明

## transition

brooder提供对css3 transition的封装，并于brooder query对象合并，brooder的内置动画也都完全通过css3 transition来实现。

```
$("body").transition().all().done(function(){
	$(this).css("background","yellow");
}).scope().css("background","red“);
```

## transform

brooder提供对css3 transform的封装，并于brooder query对象合并。

```
$("body").transform().x("-100%");
```

## 缓动

brooder提供基于数学运算的缓动算法，用于实现css3无法实现的缓动处理。

> 具体信息请参考tween对象

## 网络通信

brooder的通信功能由request对象提供，该对象是一个对新标准的XMLHttpRequest对象的封装，可以提交文件。

> 具体信息请参考request对象

## override

override是覆盖brooder的默认方法实现的方法途径，它会生成一个新的副本，并且可以通过`brooder.toggle()`方法进行切换。

> 具体信息请参考override和toggle
