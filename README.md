![banner]()

<div align="center">
<h1>在线地图编辑器 online-map-editor</h1>
<p><em>实时在线与您的同伴编辑地图Real time online editing of maps with your companions</em></p>
</div>

## 免责声明

本项目开源仅供学习使用，不得用于任何违法用途，否则后果自负，与本人无关。使用请保留项目地址，谢谢。

<div align="center">

[![GitHub forks](https://img.shields.io/github/forks/emilia-t/online-map-editor.svg?abel=Fork&style=for-the-badge)](https://github.com/emilia-t/online-map-editor)
[![npm](https://img.shields.io/badge/npm-8.11.0-green.svg?style=for-the-badge)]()
[![LICENSE](https://img.shields.io/badge/LICENSE-APACHE2-green.svg?style=for-the-badge)](https://github.com/emilia-t/online-map-editor/blob/main/LICENSE)
[![VUE](https://img.shields.io/badge/VUE-2.5.2-green.svg?style=for-the-badge)](https://github.com/vuejs/vue/blob/main/LICENSE)

</div>

## 📝 项目简介

用于在线协作编辑地图svg图像的前端web程序

Front end web program for online collaborative editing of map SVG images

### 🆕 版本更新内容

+ 待写

## 📥 下载项目

项目结构
```
待写
└───
    ├───
    ├───
    └───
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
