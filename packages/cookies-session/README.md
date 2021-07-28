## Cookies

## 基础使用方式

```javascript
'use strict';
const dk = require('@serverless-devs/dk-core');
const { cookiesMiddleware } = require('@serverless-devs/cookies-session');

const handler = dk((request) => {
  const cookies = request.req.cookies;
  const lastVisit = cookies.get('LastVisit', { signed: true });
  cookies.set('LastVisit', new Date().toISOString(), { signed: true });
  return { body: 'hello world' };
});
handler.use(cookiesMiddleware({ keys: ['keys'] }));
exports.handler = handler;
```
### handler.use(cookiesMiddleware([ options ]));

这个将会创建一个cookies的实例放到req上面，一个[Keygrip](https://www.npmjs.com/package/keygrip) 实例或密钥数组可以选择作为options.keys传递，以此为凭据启用基于SHA1 HMAC的加密签名。
可以选择将布尔值作为options.secure传递，以明确指定连接是否安全。

### cookies.get( name, [ options ] )

这将从请求中的“cookie”头中提取具有给定名称的cookie。如果存在这样的cookie，则返回其值。否则，将不返回任何内容。
`{signed:true}`可以选择作为第二个参数传递,将获取签名cookie（以“.sig”后缀结尾的同名cookie）。如果不存在这样的cookie，则不返回任何内容。

### cookies.set( name, [ value ], [ options ] )
这将在响应中设置给定的cookie
如果省略了value，将会删除此cookies
如果提供了options对象，它将用于生成出cookie头，如下所示：
- `maxAge`: session存在的时间，24 * 60 * 60 * 1000
- `expires`: 一个“Date”对象，指示cookie的过期日期（默认在会话结束时过期）。
- `path`: cookie的路径（默认情况下为`/`)。
- `httpOnly`: 一个布尔值，指cookie是否仅通过HTTP发送，而不可用于客户端JavaScript获取（默认为true）。
- `domain`: 表示cookie的域的字符串（无默认值）。
- `secure`:一个布尔值，指示cookie是否仅通过HTTPS发送（HTTP默认为false，HTTPS默认为true）。。
- `sameSite`: 一个布尔值或字符串，指示cookie是否为“同一站点”cookie（默认为“false”）。可以将其设置为“strict”、“lax”、“none”或“true”。
- `signed`: 一个布尔值，指示是否对cookie进行签名（默认为“true”）。
- `overwrite`: 一个布尔值，指示是否覆盖以前设置的同名cookie（默认为“true”）。




## cookie-session

## 基础使用方式

```javascript
'use strict';
const dk = require('@serverless-devs/dk-core');
const { cookieSessionMiddleware } = require('@serverless-devs/cookies-session');

const handler = dk((request) => {
  const session = request.req.session;
});
handler.use(
  cookieSessionMiddleware({
    name: 'session',
    keys: ['keys'],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }),
);
exports.handler = handler;
```

## sessionOptions

##### name
设置cookie的名称，默认`session`.

##### keys
用于签名和验证cookie值的密钥列表，或配置的[`Keygrip`](https://www.npmjs.com/package/keygrip)实例。

##### secret
如果未提供“keys”，则用单一的key。



## req.session
表示给定请求的session

#### req.session.isChanged
如果在请求过程中更改了session，则为“true”。

#### req.session.isNew

如果session是新session，则为“true”。


#### req.session.isPopulated

确定session是否已被数据填充。

### 清除session
```
req.session = null
```