# 开发文档
## 功能
- 使用反向代理解决跨域问题。
- 未装饰的登录界面，在/login路径中。
- 后端暂时使用了lab2—pre测试，已成功连接。
- 点击登录可跳转至hello页面  
(I hate css style.)

## 知识点
- webpack、代理、nginx、RESTful API、ajax
- mvvm

----
登录拦截
登录成功，跳转到登录前页面。


知识点
- localStorage(类似缓存)
- hitstory模式
- vuex
![](https://v3.vuex.vuejs.org/vuex.png)
- 版本依赖：vuex3对应vue2

---
主页：index：helloworld，如果没有登录信息，立刻弹出登录界面。
拦截器：vue-router。
若登录失败，给出提示后在此login界面。
若登录成功，进入helloworld界面。
若登陆为管理员，导航栏包括添加功能。
初次登录？在登录成功后弹出重置密码界面。
如何实现弹出？

虽然没有弹出效果，但问题不大...

---
一些问题：寻找更常见合理的实现方法。
get传参还是post？怎样算安全？
搁置的问题：开发环境没有域名。
（有没有要求用url，搞那么复杂干什么？？？

---
期望测试登录功能首先要有zhuce？
可以用管理员！！！