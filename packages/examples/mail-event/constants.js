
const FROM = '243973775@qq.com'; // 发送邮箱
const TO = 'huangfushan@126.com'; // 接收邮箱
const PASS = 'csyjruhnyelpcagd'; // 发送邮箱的smtp授权码
const SERVIVE = 'qq'; // 发送平台

const TRANSPORT = {
  // host: 'smtp.ethereal.email',
  service: SERVIVE, // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 465, // SMTP 端口
  secureConnection: true, // 使用了 SSL
  auth: {
    user: FROM,
    pass: PASS, // 这里密码不是qq密码，是你设置的smtp授权码
  }
}

module.exports = { FROM, TO, TRANSPORT };
