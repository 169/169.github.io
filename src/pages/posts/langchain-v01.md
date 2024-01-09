---
layout: '@/templates/BasePost.astro'
title: Langchain 0.1稳定版本全解析
description: 揭秘Langchain最新的状态
pubDate: 2024-01-09T12:00:00Z
imgSrc: '/assets/images/langchain-v01.png'
imgAlt: 'langchain-01'
---

Langchain最近发布了第一个稳定版本0.1，其中包含了LangChain包架构的重大改变，今天给大家整理出来。

### 包架构改动

![](https://blog.langchain.dev/content/images/size/w1600/2023/12/LangChain-Stack---split---V3.png)

Langchain被称为粘合剂(Glue)，基本上常见的用于构建 对应LLM 应用程序所需的部分它都内置，优点当然是全，缺点是这些部分很杂，还耦合到一起。

所以从半年前Langchain团队就开始筹划，并先后做了如下改动:

1. 23年7月份就开始把一些研究和实验用途的逻辑拆分成为Langchain Experimental，可以使用pip独立安装 `langchain-experimental`，代码目录在 `libs/experimental`。这里面的代码的执行有一定危险性，例如`PythonREPLTool`，所以最好在沙盒环境中运行。
2. 23年10月份实现了一个命令行包 `langchain-cli`，它主要用于LangServe和模版，和`langchain`不直接关系。
3. 23年11月份把主要的抽象、运行时逻辑、接口和核心功能拆分成为LangChain Core，可以使用pip独立安装 `langchain-core`，代码目录在`libs/core`。
4. 23年12月份把所有第三方集成拆分为LangChain  Community， 包名为`langchain-community`，代码目录在`libs/community`。也就是说，`langchain`把核心和社区贡献的构建部分终于分开了。
5. 23年12月份底开始，将一些重要的集成拆分为独立的合作伙伴包，例如OpenAI、Google、Mistral等。代码目录在`libs/partners`。 例如OpenAI，现在的包名就是`langchain-openai`，是一个独立的包。这种拆分成独立的包的好处之一是更好的依赖关系管理 - 以前，所有依赖关系都是可选的，导致在尝试安装特定版本时遇到一些麻烦。现在，如果集成位于他们自己的包中，我们可以更严格地控​​制他们的要求，从而使安装更容易。另一个好处是版本控制。通常，第三方集成会发生变化，这需要进行重大更改。现在，这些可以通过独立集成包中的正确版本控制在单独的集成基础上反映出来。

需要说明的是，这些修改是基本向后兼容的，所以langchain并不是把自己拆分成了5个包，而是把代码按照不同的功能拆出去，但是langchain本身还是这些包的Endpoint，所以开发者在导入时用法可以一样。举个例子，即便上面提到的OpenAI已经独立，但是你依然可以通过如下三种方式`import`:

```python
# 任意一种就可以
from langchain_openai import ChatOpenAI
from langchain_community.chat_models.openai import ChatOpenAI
from langchain.chat_models.openai import ChatOpenAI
```

### 版本

从 `langchain` 0.1.0 开始，所有未来版本都将遵循新的版本控制标准：

>Any breaking changes to the public API will result in a minor version bump (the second digit)
  Any bug fixes or new features will result in a patch version bump (the third digit)

如官方说明，对公共 API 的任何重大更改都将导致次要版本，任何错误修复或新功能都将导致补丁版本提升。

### 0.2.0

Langchain经过这次调整其实也不是完全的被拆分，目前还留下了链、代理、高级检索方法以及构成应用程序认知架构的其他通用编排部分，现阶段先不动了，但官方明确提到在0.2.0时要做几个改动:

1. 用 LCEL 重写遗留链。可以看延伸链接三Changelog部分，其中提到那些遗留链。
2. 添加新类型的链。
3. 添加新类型的代理。
4. 删除旧的和未使用的功能。

### langchain-0.1-guides


Langchain作者搞了一个小项目: https://github.com/hwchase17/langchain-0.1-guides/

里面有几个例子，包含了最新的用法，开发者可以去大体了解一下。

### 相关链接

1. https://github.com/langchain-ai/langchain/discussions/15712
2. https://blog.langchain.dev/langchain-v0-1-0/
3. https://python.langchain.com/docs/changelog/langchain
4. https://blog.langchain.dev/the-new-langchain-architecture-langchain-core-v0-1-langchain-community-and-a-path-to-langchain-v0-1/
