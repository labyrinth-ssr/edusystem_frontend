lab2_back-end
---
### Register实现
localhost:8080/register

#### request参数：（数据为空时传递空字符串）

```java
String role;
String user_id;
String username;
String id_number;
String phone_number;
String email;
```

#### response参数：
```java
public class RegisterFormat{
    public boolean isOk;//如果输入完全符合要求，返回为true
    //6个变量反应输入参数是否为空串
    public boolean role;
    public boolean user_id;
    public boolean username;
    public boolean id_number;
    public boolean phone_number;
    public boolean email;
    //返回设置的默认密码
    public String passwd;
    public RegisterFormat registerFormat{ 
        public boolean isOk;//如果下列8个变量全部正确，返回为true
        //下列8个变量反映输入参数格式是否符合要求、唯一性参数是否与库中重复
        public boolean id_numberUnique;
        public boolean id_numberFormat;
        public boolean emailFormat;
        public boolean phone_numberFormat;
        public boolean usernameFormat;
        public boolean roleFormat;
        public boolean user_idUnique;
        public boolean user_idFormat;
    }
}
```

### Login实现
localhost:8080/login

#### request参数：（数据为空时传递空字符串）

```java
String visitor_id;//user_id
String login_url;//格式：xxx.xxx.xxx.xxx
String role;
String passwd;
```

#### response参数：
```java
public class LoginResponse {
    public boolean login_approved;//成功登陆
    public boolean find_id;//找到id对应的用户
    public boolean passwd_correct;
    public boolean passwd_check;//需要修改密码
    public boolean url_empty;
    public String login_message;

    public LoginResponse(){
        this.login_approved = false;
        this.find_id = false;
        this.passwd_correct = false;
        this.passwd_check = false;
        this.url_empty = false;
        this.login_message = "";
    }
}
```

### 修改密码实现
localhost:8080/change_passwd

#### request参数：（数据为空时传递空字符串）

```java
String visitor_id;//user_id
String old_passwd;
String new_passwd;
```

#### response参数：
```java
public class ChangePasswordResponse {
    public boolean change_approved;//成功修改
    public boolean old_passwd_correct;
    public PasswordFormat passwdFormat;

    public ChangePasswordResponse(){
        this.change_approved = false;
        this.old_passwd_correct = false;
    }
}
```
#### PasswordFormat：
```java
public class PasswordFormat{
    public boolean legal;
    public boolean too_short;
    public boolean too_long;
    public boolean too_simple;
    public PasswordFormat(){
        this.legal = false;
        this.too_short = true;
        this.too_long = true;
        this.too_simple = true;
    }
}
```

### 所有request的接口
```java
public interface CommonRequest{
    String getVisitor_id();
}
```

### 拦截器
参见 com.h6lab2.lab2_backend.Interceptor</br>
分别检测root权限（仅用于register）和登陆状态</br>
拦截器返回json数据，内容为"NO_AUTHORITY"或"NO_LOGIN"