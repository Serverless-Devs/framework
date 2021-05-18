export const mockResponse = {
  setStatusCode: () => { },
  setHeader: () => { },
  deleteHeader: () => { },
  send: console.log,
};
export const EVENT = 'event';
export const mockContext = {
  credentials: {
    accessKeyId: 'accessKeyId',
    accessKeySecret: 'accessKeySecret',
  },
};
export const mockEvent = Buffer.from(EVENT);
export const mockCallback = () => { };

export const VERTIFICATION_CODE = 'CODE';

export const TRANSPORT = {
  // host: 'smtp.ethereal.email',
  service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 465, // SMTP 端口
  secureConnection: true, // 使用了 SSL
  auth: {
    user: '243973775@qq.com',
    // 这里密码不是qq密码，是你设置的smtp授权码
    pass: 'xxxxxxxxxxxx',
  }
}
