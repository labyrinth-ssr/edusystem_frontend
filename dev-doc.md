# 开发文档
## 功能
- 使用反向代理解决跨域问题。
- 登录界面在/login路径中。

## 知识点
- webpack、代理、nginx、RESTful API、ajax
- mvvm
- localStorage(类似缓存)
- router:hitstory模式
- vuex
![](https://v3.vuex.vuejs.org/vuex.png)
- 版本依赖：vuex3对应vue2

---
开发时遇到的问题：
添加div后样式失效，发现是默认的div display的问题
没有约定好初始密码是什么，以及登录成功的判定规则是什么，以及某些变量比如login_status含义略有不清。

---
成功登录后指向同一个页面。
导航栏信息：
- 管理：添加信息；修改密码
- 用户：修改密码
动态导航栏数据都直接存储在data中

登录成功后直接进入主页面，此时检查state，初次登录则转到修改密码。
初次登录状态在login时录入，在进入主页面时使用。
不存在子组件，所有dialog单独拥有一个路由（页面）

关于前端拦截：
直接输入要求权限的路由时会跳转到login，登录满足权限后跳转回刚才输入的路由

---
剩下的问题：
导航栏sub-menu按键宽度太小，背景图片颜色太亮，初次登录用户进入主界面会被卡在重设密码的地方
get直接传参的安全问题
开发环境无法获取客户端域名
美化info
直接使用user_id作为token的安全性问题，使用cookie还是localStorage?目前在前端使用localStorage。不点击刷新页面时存储着user_id，first_login（即权限信息）
登录时无角色选择框，而是通过user_id长度判断role后传给后端。

---
2022-4-7 
TODO:layout
16:10
在layout里装什么？直接 done:16:53
18:44
mockjs,md,我人没了，我不理解！
22:04 时间完全没掌握好，失败，应该使用v-for
路由使用permission list
权限控制
用户profile
13:25
table 行内编辑

form：
teacher
admin

add
edit
watch

17:00:权限管理
17:55 课程表
19:09
md 动态路由wcnm

---
4-9
修改密码
userform 是否需要复用？
先完成功能 再重构。

---
我真的会被耗死就是说。
新增课程
拿出一个表格的信息。

---
4-13:
改路由 权限

---
责任的模糊性。
