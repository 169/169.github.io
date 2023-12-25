---
layout: '@/templates/BasePost.astro'
title: 如何自定义streamlit组件
description: 基于我开源的streamlit-component-video详解如何自定义streamlit组件
pubDate: 2023-12-24T12:00:00Z
imgSrc: '/assets/images/custom-streamlit-component.png'
imgAlt: 'custom-streamlit-component'
---

最近在写[video-translation](https://github.com/169/video-translation)的时候，由于streamlit自带的 `st.video` 不支持字幕和显示当前时间，所以写了一个视频组件[streamlit-component-video](https://github.com/169/streamlit-component-video)，算是把自定义组件搞清楚了，今天写一篇文章记录下来。

### 使用创建组件模版初始化

如果想要了解自定义组件，首先需要看官方文档[# Custom Components](https://docs.streamlit.io/library/components)，其中提到了[component-template](https://github.com/streamlit/component-template)这个项目，里面包含模版和例子，你可以克隆它并按照文档要修配置，然后修改就可以了。

`streamlit`既然是一个Web UI，也就是会有前端的文件，例如HTML，css，JavaScript。所以这个模版里面有2个版本的组件风格:

1. [template](https://github.com/streamlit/component-template/tree/master/template "template")。默认官方推荐的，前端用的是React+Typescript
2. [template-reactless](https://github.com/streamlit/component-template/tree/master/template-reactless "template-reactless")。如其名字，是没有react的版本，直接用Typescript方式写代码。

你可以基于上述2个风格组件例子去改，当然项目还提供了用项目模板创建项目的命令行工具CookieCutter的方法，你可以看[cookiecutter](https://github.com/streamlit/component-template/tree/master/cookiecutter)子目录。

由于我对写前端TypeScript不熟悉，会写JavaScript，所以我没有用这个项目离得方法，而是通过官方博客找到另外一篇文章:

[How to build your own Streamlit component](https://blog.streamlit.io/how-to-build-your-own-streamlit-component/)

这也是一篇值得参考的文章，其中提到了 [https://github.com/blackary/cookiecutter-streamlit-component/](https://github.com/blackary/cookiecutter-streamlit-component/?ref=blog.streamlit.io) ，所以我使用它创建的组件。

### 项目结构

目前 [streamlit-component-video](https://github.com/169/streamlit-component-video) 在实现功能后，目录和文件如下:

```bash
➜ streamlit-component-video ✔ /opt/homebrew/bin/tree -L 4 -I 'venv|streamlit.egg-info'

.
├── LICENSE
├── MANIFEST.in
├── README.md
├── examples  # 看起来是一种惯例，里面有几个使用我这个组件的例子，从最初级到进阶
│   ├── basic.py  # 基本用法
│   ├── examples.mp4
│   ├── examples.vtt
│   ├── if_statement.py  # 判断条件下的用法
│   └── record_current_time.py  # 反馈当时视频时间
├── requirements.txt  # 项目依赖，其实只有streamlit
├── setup.py  # 配置，用于打包并上传到PYPI
└── src  # 代码源文件
    └── streamlit_component_video  # 这个结构是模版自动的，当然也可以把Python和前端文件隔开
        ├── __init__.py
        └── frontend  # 前端文件目录
            ├── index.html  # 组件的HTML，用户在Web UI里看到的内容，它会被放在iframe里面，js和css等都在这里相对引用
            ├── main.js  # 主程序，架子
            ├── streamlit-component-lib.js  # 实际video的逻辑
            ├── style.css  # 自定义样式，我这里只是改了下在Web UI里的长和宽
            ├── video-js.min.css  # 视频库我用的是Video.js: https://videojs.com/ 这是压缩的css文件
            └── video.min.js  # Js文件
```

这里面，`streamlit-component-lib.js`和`main.js`其实也可以合并起来。不过大家不一定学我哈，因为我这里前端没有打包，所以没有package.json, 就是源文件用着了。

### 如何调试

上一节已经可以跑起来一个我这个组件了。如果想要开发它，可以创建虚拟环境，再`streamlit run`:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd examples
streamlit run basic.py
```

接着打开浏览器，访问 http://localhost:8501 就可以运行项目的例子了，如果改动了代码后刷新页面就可以了。

### 前后端数据是如何交互的

这个组件远比我设想的实现难。主要有2个细节难懂:

1. 前后端交互方法。
2. 触发模版重新渲染。

一个自定义组件包含2部分:

1. 前端部分。包含HTML，CSS，JavaScript(或者Typescript)，通过 iframe 标签在 streamlit 应用程序中呈现。
2. Python API。Streamlit 应用程序使用它来实例化前端并与前端对话。

它们的交互不像我们日常看到的那种明显的API应用。我这几天的理解:

1. streamlit确实内置了一个使用Tornado实现的Web服务器，媒体上传等功能还是通过接口实现的。所以streamlit不能直接读取本地文件，需要先通过这个服务上传到服务里面用HTTP的服务里的地址访问。
2. streamlit实现了一个runtime，请求也会有会话ID(session id)在里面，而全局的状态数据和对象都存在runtime里，如果组件会有改动，会触发rerun，页面就会刷新。

在 [components-api文档页面](https://docs.streamlit.io/library/components/components-api)里提到了React和TypeScript-only的数据流，都讲的挺好，我这里换成纯JavaScript的版本，从调用Python开始介绍前后端怎么通信的:

例如我这个组件，后端调用是这样的:

```python
result = streamlit_component_video(
    path="./examples.mp4",
    mimetype="video/mp4",
    track="./examples.vtt",
)
```

可以看到，函数接受四个参数。接着前端页面会收到`Streamlit.RENDER_EVENT`事件:

```javascript
function onRender(event) {
  if (!window.rendered) {
    const {path, mimetype, track, current_time} = event.detail.args

    if (path != "" && mimetype != "" && track != "") {
      Streamlit.setComponentValue({path: path, mimetype: mimetype, track: track, current_time: current_time})
      window.rendered = true
    }
  }
}

Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender)
```

这样就触发了`onRender`函数。事件参数都在`event.detail.args`，这样前端就能获取后端传入的那些参数了，如`path`、`mimetype`和`track`。

上面的`onRender`函数还有个用法，就是`Streamlit.setComponentValue`，它的意思是把前端的数据作为参数返回给Python这边，这样在Python里就可以获取函数参数当前的值了，其他的不变，`current_time`是在播放开始后不断变的，这样Python就可以获取前端库产生的值了。当然也可以设置`result`的值。

默认情况下`setComponentValue`就是返回数据，不过实际使用中还需要更多操作，在项目中有个`streamlit-component-lib.js`，我重新了`Streamlit`对象:

```javascript
function sendMessageToStreamlitClient(type, data) {
  const outData = Object.assign({
      isStreamlitMessage: true,
      type: type,
  }, data);
  window.parent.postMessage(outData, "*");
}

const Streamlit = {
  setComponentReady: function() {
      sendMessageToStreamlitClient("streamlit:componentReady", {apiVersion: 1});
  },
  setFrameHeight: function(height) {
      sendMessageToStreamlitClient("streamlit:setFrameHeight", {height: height});
  },
  setComponentValue: function(value) {
    sendMessageToStreamlitClient("streamlit:setComponentValue", {value: value});

    var options = {
      tracks: [{
        id: 'alternate-video-track',
        src: value['track'],
        kind:'subtitles',
        srclang: 'en',
        label: 'English',
        mode: 'showing'
      }],
      sources: [{
        src: value['path'],
        type: value['mimetype']
      }]
    };
    var player = videojs('my-player', options, function onPlayerReady() {
      function getCurrentTime() {
        value['current_time'] = this.currentTime();
        sendMessageToStreamlitClient("streamlit:setComponentValue", {value: value});
      }

      this.on("timeupdate", getCurrentTime);

      this.on('paused', function() {
        var track = options['tracks'][0];
        this.videoTracks().removeTrack(track);
        this.videoTracks().addTrack(track);
      });
    });
  },
  RENDER_EVENT: "streamlit:render",
  events: {
    addEventListener: function(type, callback) {
      window.addEventListener("message", function(event) {
        if (event.data.type === type) {
          event.detail = event.data
          callback(event);
        }
      });
    }
  }
}
```

其中`setComponentValue`实现里 `sendMessageToStreamlitClient("streamlit:setComponentValue", {value: value})` 就是用于返回数据。下面就是把Python传来的参数作为前端Js参数传给Video.js，这样就可以显示播放器了。

其实对我这个需求，前端部分没那么复杂。这样就差不多了。

另外，要额外注意，`Streamlit.setComponentReady()` 和 `Streamlit.setFrameHeight(HeightSize)` 都是有必要的。
### 上传包到PYPI

首先需要注册 https://pypi.org/ 的账号，然后访问 [https://pypi.org/manage/account/#api-tokens](https://pypi.org/manage/account/?ref=blog.streamlit.io#api-tokens) 创建一个API token，接着按照网页的提示，把秘钥信息写入 `~/.pypirc` 里，注意现在只接受token的方式，用户名要写成 `username = __token__` 不要写真的用户名。

接着安装 `wheel`和``，它们一个是用户生成wheel包，一个用来上传:

```bash
pip install wheel twine
```

接着就可以生成Python包和上传了:

```bash
python setup.py sdist bdist_wheel
twine upload --verbose dist/*
```

无论上传成功或者失败，命令行都会有提示。

### 如果组件开发遇到困难

在实现过程中，我用到了如下几个方法帮助我解决问题:

1. 从其他开发者写的组件里找思路。官方有个建议，可以在项目下添加`streamlit-component`这个topic，所以你可以搜 [https://github.com/topics/streamlit-component](https://github.com/topics/streamlit-component)，找和你的组件看起来相关的，或者其他组件的源码看看实现。我之前为了解决一个问题，翻了好几个组件，发现实现和我的大同小异，这样可以确定我代码层面没问题，那么就可以找其他角度的原因了。
2. 看源码里面相关组件的实现原理。是的，没办法就得翻源码了。例如怎么实现video组件，肯定得先看`st.video`的源码。

### 延伸阅读

1. https://docs.streamlit.io/library/components/components-api
2. https://blog.streamlit.io/how-to-build-your-own-streamlit-component/
