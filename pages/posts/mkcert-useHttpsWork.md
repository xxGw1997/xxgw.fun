---
title: 在本地 localhost 开发时也可以有https凭证
date: 2022-11-24T18:50:00.000+00:00
tags: ["https", "mkcert"]
tagsColor: ["#ba38fe", "#268785"]
duration: 20min
---

## 遇到的问题

在本地进行开发时,我们都是在 localhost 进行 dev 的开发,最近在项目需要集成 google、facebook 第三方登录、注册时遇到了问题。

### 问题

- 现在所有的网站慢慢都采用了 HTTPS 协议来避免骇客的攻击，但是要想要使用 HTTPS 协议就必须使用 TLS 证书，这代表你必须先拥有一个网域（例如 techmoon.xyz），否则假如你是将网站安装在本地主机或是 IP Server 上，就无法透过 Let’s Encrypt 这样的 SSL 发证平台获取 Localhost 的 SSL 证书。

- 但当我们在进行网站测试时，有时仍然会先在本地 Localhost 安装一个 Beta 版本进行调教与测试，或是使用 IP 位址作为测试开发环境。此时若仅能使用 HTTP 进行测试的话，在正式上线时就常常会发生网站出现许多 Mixed Content 混合内容的问题。

- 这就是在 Localhost 上使用 HTTP 协议开发的缺点。

- 因此，国外的大神 Filippo Valsorda 开源了一款名为 mkcert 的工具，让所有开发人员可以透过此工具快速的配置一个本地 Localhost 的 SSL 证书，使我们在本地 Localhost 开发时仍然可以使用 HTTPS 协议进行测试

- 我们所遇到的问题就是由于在 google、facebook 开发者后台集成登录功能时,需要配置一个安全域名(即在这个配置的安全域名下,你应用集成的第三方登录功能才能正常工作),google 和 facebook 所考虑的问题是,如果用户在 google 或 facebook 注册的 clientId 泄露时,如果不限制白名单的域名话就会造成安全问题。所以 google 和 facebook 才需要强制设置安全的域名白名单。正是因为这个域名,所以才导致不能设置http://localhost下的域名。但是我们本地开发的项目都是http协议的。所以要去集成第三方登录的功能就必须要将项目先部署至线上可用的https协议的地址。然而集成第三方的功能坑非常的多，需要不断的进行调试，显然在本地开发然后部署到线上调试非常的麻烦。

- 所以就思考，能在本地开发的环境也支持 https 协议呢。

## 解决方案 Mkcert

一个简单的零配置工具，可以使用您喜欢的任何名称制作本地可信的开发证书。

### 安装 Mkcert

#### Windows 系统

需要使用 Chocolatey 来进行安装,如果没有 Chocolatey,则需要通过管理员权限打开 PowerShell。
将以下的命令执行

```bash
Set-ExecutionPolicy Bypass -Scope Process -Force;
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072;
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

等待安装完毕就可以了

接下来再通过 Chocolatey 来安装 mkcert

```bash
mkcert -install
```

这样就可以使用 mkcert 的一些命令了

#### Mac 系统

如果是 Mac 则只需要打开终端,直接安装就行

```bash
$ brew install mkcert
$ brew install nss # 如果在firefox浏览器开发的话
```

### 创建本地凭证

创建之前可以 cd 到项目的目录

例如: 我是 nuxt 项目所以我放在 nuxt 项目的 assets 文件夹了

```bash
cd nuxt-app/assets/static
```

然后在这个目录下打开终端开始创建:

```bash
mkcert -install
mkcert localhost
```

执行完上面两个命令,会发现在执行目录的文件夹下多出了 `localhost-key.pem` 和 `localhost.pem` 两个文件

### 配置 nuxt.config.js

```js
import path from "path";
import fs from "fs";
export default {
  //... other options
  server: {
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, "assets/static/localhost-key.pem")
      ),
      cert: fs.readFileSync(
        path.resolve(__dirname, "assets/static/localhost.pem")
      ),
    },
  },
};
```

### 重启项目
配置完成之后重启项目,会发现之前的 http://localhost:3000 的开发地址打不开了,这是因为配置完成后,需要访问 https://localhost:3000 进行本地开发。这样就让本地开发也有https的凭证了,也符合了google、facebook 登录的功能 配置白名单域名的要求了。
