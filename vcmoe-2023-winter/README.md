# 小横竖2023冬曲萌前端
## Demo
[分组抽签](https://xiaohengshu.com/vcmoe-2023-winter/draw.html) | [查看投票结果](https://xiaohengshu.com/vcmoe-2023-winter/vote.html) 

## 部署
前端为纯静态页面。您可以使用任何静态网站托管服务托管相关页面，如 [GitHub Pages](https://pages.github.com/)。

您也可以在本地使用任何服务器软件部署前端，如
```shell
git clone https://github.com/eggry/xiaohengshu.com.git
cd xiaohengshu.com/vcmoe-2023-winter
python -m http.server 9999
```
## 配置
您需要将每个js文件中的 `SERVER_URL` 变量更改为对应的后端地址，如
```js
const SERVER_URL = "http://example.com"
```

后端项目：https://github.com/eggry/vcmoe-2023-winter-backend

如果无法连接后端，请考虑是否是[CORS策略](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)，或[混合内容](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content)导致的。

## 概述
本项目使用HTML+JS开发。使用的前端库包括
- [jQuery](https://jquery.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Bootstrap Table](https://bootstrap-table.com/)


本项目主要有三个页面。每个页面分别有独立的HTML和JS文件。

分组 (draw) 基于B站收藏夹。待分组视频需要添加至同一B站收藏夹中。

投票详情 (vote) 基于B站评论区。每场比赛都是一个评论楼，每个子评论都是一个投票。