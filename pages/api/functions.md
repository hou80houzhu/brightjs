
# 核心功能

这里简单介绍brooder框架中最为重要的内置对象的基本信息。


## 面向对象

adapt是brooder框架中所有与面向对象相关的基础。

> 具体信息请参考adapt对象的说明

## 模板引擎

`brooder.template()` 是brooder的内置模板引擎，用于处理插值运算。它是轻量级的，并且具备自定义标签的能力

### 语法

`broode.template`为保证处理的性能在异常处理上有所保留，所以尽可能的保证语法的正确以免进入复杂的调试过程。

- `<% code %>`表达式为标准javascript语句（严格模式），语句末尾必须加`;`
- `<%=code;%>`赋值语句为标准javascript语句（严格模式），语句末尾必须加`;`
- 模板不止于HTML语法文件，更适用于任何文本文件。

### 宏

`brooder.template` 支持自定义标签（宏），单标签宏的写法为`<@tagname prop=""... />`，带标签体的宏写法`<@tagname prop=""...>body</@tagname>`。宏实际上为一个javascript处理函数，它会接受两个参数，第一个参数为自定义标签属性的key-value对象，第二个为`render`函数，如果该标签用于影响模板输出则应该有返回值，返回值则会直接渲染进模板。


**全局宏**

全局宏只需注册一次便在页面生命周期内任何地方调用模板引擎都会携带该宏

```
brooder.setTemplateGlobalMacro("tagname",function(attrs,render){
	return "";
});
```

**对象宏**

对象宏则依赖于调用模板对象，对象被清除则宏随之消失。调用方法：

```
brooder.template().macro("tagname",function(attrs,render){
    return "";
})
```

> 其他功能请参见template说明

## 内建框架对象

Module是brooder内置框架的核心对象。Module与DOM紧密连接，Module对象是一个自包含的页面单元，并作为一个组件存在。Module只负责处理自身的逻辑而尽量不与其他Module产生依赖，Module间的交互应该通过`ViewEvent`来传递实现。

### 预置Module类型

- **request** 是Module的基类，用于实现RESTful通信，任何其他Module都继承于此，故所有的Module类都具备通信能力
- **view** 是单独（不可包含其他Module）的View类，并拓展了大量用于DOM处理和Module间通信的功能
- **viewgroup** 是View的组合对象，代表view的布局，拓展了大量用于子View管理的功能
- **root** 是页面的根View继承与viewgroup，本身没有拓展任何viewgroup的功能

> Module的API请参见request,view,viewgroup,root说明

### Module生命周期

- **创建Module对象** module的创建依赖于布局（viewgroup对象的append）而不能手动创建。当module被append到布局中，module进入初始化阶段。
- **初始化Module对象**
  - 继承于view的Module调用方法的顺序如下
    - `onbeforeinit(option)`
    - `init(option)`
    - `onendinit(option)`
    - `onnodeinserted(dom)`view的dom有DOM插入时调用
    - `onchildremove(dom)`view的dom有DOM删除时调用
  - 继承于viewgroup的Module的回调
    - `onbeforeinit(option)`
    - `ondomready(option)`view的dom可用时调用
    - `onnodeinserted(dom)`view的dom有DOM插入时调用
    - `init(option)`
    - `onendinit(option)`
    - `oninitchild(child)`子view创建时调用
    - `onoption(ops, subview, subid)`处理子view初始化option时调用
    - `onchildremove(dom)`view的dom有DOM删除时调用
    - `onchildremove(child)`子view被移除时调用
- **Module销毁** 当view被其父view手动移除时Moudle被销毁
  - `onunload()` 释放view所占资源或其他

### option来源

- Module类中定义（包括继承关系）
- 初始化Module时传入
- 从父Module实例中option对象中同子view类名相同的属性中获取

### view间通信

view的通信功能定义于view类中，所以任何继承于view的类都具备通信能力。使用`Module.dispatchEvent(eventtype,data[,true])`实现通信。当第三个参数为`true`（默认为true）时对象会随着view的组合树向树顶传递，否则向所有子叶子传递。

**注册事件**

- 定义类时注册事件,只需定义以`event_*[eventname]`为名的方法
- 运行时注册事件，调用`Module.addEventListener(evnetype,fn)`方法

> viewevent请参见viewevent对象

### finder，group与groupi

finder与group及groupi是将代码逻辑与DOM结构进行分离而设置的Module功能，finder或者group是一个DOM集合的包装对象，它会收集任何在模板中包含`data-finder`和`data-group`属性的DOM，该功能还需配合`Module.delegate()`方法使用，当DOM有增加或删除操作时，需要调用该方法以更新finder和group集合。group是与groupi配合使用的，以脱离DOM结构而形成一个子集合，一个group中不能包含同名groupi。

```
<div data-find="test"></div>
<div data-group="test">
	<div data-groupi="test-a"></div>
	<div data-groupi="test-b"></div>
</div>
```

**find和group回调**

View初始化时会主动调用类中以`find_*[findname]`,`group_*[groupname]`为名的方法并传入对应的DOM


### bind

bind与find类似，是分离逻辑与DOM结构的方法。模板标签中包含`data-bind`属性的NODE会注册相应事件，回调定义于类中`bind_*[bindname]`的方法。

```
<div data-bind="click:name mouseup:name2"></div>
```

### observe(observername,obj)

该方法是用于实现类似MVVM模式的双重绑定而设置，用于处理简单业务问题。调用该方法会将传入的对象改造成具备`观察者`能力的新对象，当该对象有变动时会将对象的具体变动信息传递出去，只需在Module定义中定义以`observername_objpropname_dealtype`为方法名的方法即可收到通知。对象的观察能力不同于浏览器内置的，它会传递更多信息，监听更多内容。

```
Module({
	name:"test",
	extend:"view",
	init:function(){
		this.observe("observname",{
			aa:{
				aaa:"aaa"
			},
			bb:"bb",
			cc:[]
		});
	},
	"observname_aa.aaa_edit":function(){},
	observname_aa_edit:function(){},
	observname_cc_add:function(){},
	observname_cc.remove:function(){}
});

```

## 项目启动

调用`brooder.App()`返回bootstarp对象，用于配置以及启动项目。

- **id** 项目id
- **preload** 预加载资源，在项目启动前加载的资源
- **basePath** packet路径
- **debug** 是否开启debug模式，开启debug模式会方便调试，关闭则几乎禁止大部分的调试功能
- **update** 用于项目更新
- **sourceMapping** 用于项目更新

> 很多时候我们只需要关心basePath和update属性，其他属性都交由brooderbuilder构建工具进行自动处理。

项目启动前可以处理很多事情,比如监听预处理资源加载，处理被载入的javascript代码等，具体信息参考brooderstrap对象
