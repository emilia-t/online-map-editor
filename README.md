<div align="center">
  <img src="https://raw.githubusercontent.com/emilia-t/online-map-editor/main/other/img/map-log.png" alt="log" width="64"/>
</div>

<div align="center">
<h1>在线地图编辑器 online-map-editor</h1>
<p><em>实时在线与您的同伴编辑地图Real time online editing of maps with your companions</em></p>
</div>

## 免责声明(Disclaimers)

本项目开源仅供学习使用，不得用于任何违法用途，否则后果自负，与本人无关。使用请保留项目地址，谢谢。

This project is open source for learning purposes only and cannot be used for any illegal purposes. Otherwise, the consequences will be borne by oneself and have nothing to do with myself. Please keep the project address for use, thank you.

<div align="center">

[![GitHub forks](https://img.shields.io/github/forks/emilia-t/online-map-editor.svg?abel=Fork&style=for-the-bright)](https://github.com/emilia-t/online-map-editor)
[![npm](https://img.shields.io/badge/npm-8.11.0-brightgreen)]()
[![nodejs](https://img.shields.io/badge/nodejs-16.16.0-brightgreen)]()
[![VUE](https://img.shields.io/badge/VUE-2.5.2-brightgreen)](https://github.com/vuejs/vue/blob/main/LICENSE)
![Vue CLI](https://img.shields.io/badge/vue--cli-5.0.8-brightgreen)
[![LICENSE](https://img.shields.io/badge/LICENSE-APACHE2-brightgreen)](https://github.com/emilia-t/online-map-editor/blob/main/LICENSE)


</div>

## 📝 项目简介(Project Introduction)

用于在线协作编辑地图svg图像的前端web程序

Front end web program for online collaborative editing of map SVG images

用于连接在线地图服务器并进行地图数据的实时编辑

Used to connect to online map servers and perform real-time editing of map data

若要创建在线地图服务器，请前往此处https://github.com/emilia-t/OnlineMapServer

To create an online map server, please go here https://github.com/emilia-t/OnlineMapServer

## 🌎️ 一些截图(Some screenshots)

<img src="https://raw.githubusercontent.com/emilia-t/online-map-editor/main/other/img/START.png" alt="Screenshot 1" width="800"/>

## 🆕 版本更新内容(Version update content)

+ 增加了对曲线的支持(快捷键"4"
+ Added support for curves(Shortcut keys "4"
+ 增加了对模板的支持(位于图层模板设置
+ Added support for template
+ 增加了路由的支持(位于左侧菜单面板
+ Added support for route
+ 增加了网咯延迟检测
+ Added network latency detection
+ 修复了已知的bug
+ Fixed known bugs
+ 优化了渲染方式
+ Optimized rendering method
+ 增加了图层翻页功能
+ Added layer page function

## 📥 下载项目(Download project)

项目结构(Project Structure)
```
root
└───
  ├───build[构建项目的脚本(Build the script for the project)]
  ├───config[vue、webpack配置文件(vue webpack config file)]
  └───document[一些笔记或文档(Some notes or documents)]
  └───other[其他资料(other resources)]

  └───src [主要的源码(Main code)]
    └───assets[存放静态资源的地方,但更多是存放在static(Static resources,but more of it is stored in static)]
    └───components[存放vue组件的地方(Where to store Vue components)]
    └───icons[旧时存放icon的地方,现已弃用(The place where icons were stored in the past has been abandoned)]
    └───js[存放js脚本的地方(JS scripts)]
    └───router[存放vue路由的地方(vue route)]
    └───store[存放vueX的地方(VueX)]
    └───App.vue[根组件(root component)]
    └───main.js[主文件(main js)]

  └───static[静态的资源(Static resources)]
  └───.babelrc[Babel 的配置文件(Babel's configuration file)]
  └───.editorconfig[开发环境(development environment )]
  └───.gitignore[忽略文件列表(Ignore file list)]
  └───.postcssrc.js[PostCSS 的配置文件(PostCSS configuration file)]
  └───LICENSE[许可声明]
  └───NOTICE
  └───README.md
  └───index.html
  └───package-lock.json[依赖包(dependency package)]
  └───package.json
```



## 🔧 开发您的地图web程序(Develop your map web program)

### 安装所有的依赖(Install all dependencies)
````
bash
npm run install
````

### 使用开发模式启动web服务(Starting a web service using development mode)
````
bash
npm run dev
````

## 📤 导出为标准web程序(Export web program)
````
bash
npm run build
````
注意：您的服务器还需要额外准备一个URL重定项的模块或程序，以便使vue-route正常工作。

Note: Your server also needs to prepare an additional URL redirection module or program to make vue route work properly.

如果是Apache2：

If it is Apache2:

1.确保您已经安装rewrite模块，并确保在httpd.conf中启用了rewrite模块。

1.Ensure that you have installed the rewrite module and enabled it in httpd.conf.

2.在根目录的位置添加 .htaccess 文件，并写入如下内容：

2.Add the .htaccess file to the root directory and write the following content.
````
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
````



## 📎 参考文章链接(Reference article link)

| URL | 作者或来源(Author or Source) | 标题(title) | 在本项目中的应用(Application in this project) |
| --- | ----------- | ----- | --------------------- |
|[瓦片(Tile)地图原理](https://xcsf.github.io/blog/2020/06/12/%E7%93%A6%E7%89%87Tile%E5%9C%B0%E5%9B%BE%E5%8E%9F%E7%90%86) | xcsf | 瓦片(Tile)地图原理 | [LayerRealisticBaseMap.vue](https://github.com/emilia-t/online-map-editor/blob/main/src/components/LayerRealisticBaseMap.vue) |
|[瓦片(Tile)行列号计算方法](https://xcsf.github.io/blog/2020/06/12/%E7%93%A6%E7%89%87Tile%E8%A1%8C%E5%88%97%E5%8F%B7%E8%AE%A1%E7%AE%97%E6%96%B9%E6%B3%95) | xcsf | 瓦片(Tile)行列号计算方法 | [LayerRealisticBaseMap.vue](https://github.com/emilia-t/online-map-editor/blob/main/src/components/LayerRealisticBaseMap.vue) |
|[墨卡托投影法](https://zh.wikipedia.org/wiki/%E9%BA%A5%E5%8D%A1%E6%89%98%E6%8A%95%E5%BD%B1%E6%B3%95) | wikipedia | 墨卡托投影法 | [LayerRealisticBaseMap.vue](https://github.com/emilia-t/online-map-editor/blob/main/src/components/LayerRealisticBaseMap.vue) |
|[Web墨卡托投影](https://zh.wikipedia.org/wiki/Web%E5%A2%A8%E5%8D%A1%E6%89%98%E6%8A%95%E5%BD%B1) | wikipedia | Web墨卡托投影 | [LayerRealisticBaseMap.vue](https://github.com/emilia-t/online-map-editor/blob/main/src/components/LayerRealisticBaseMap.vue) |


## 💪 感谢所有的贡献者(Thank you to all the contributors)
ALIMU

Emilia-t
