const middy = require('@serverless-devs/noah-core');
const tablestoreInitialzerPlugin = require('@serverless-devs/tablestore-initialzer-plugin');
const { FROM, TO, TRANSPORT } = require('./constants');
const nodemailer = require('nodemailer');

// 发送邮件
const sendMail = async (option) => {
    console.log('准备发送邮件')
    const transporter = nodemailer.createTransport(TRANSPORT);
    const data = await transporter.sendMail(option);
    console.log(data)
}

const handler = middy(async (request) => {

    const { event = {} } = request;
    const Records = event.Records || [];
    if (!Records.length) return;
    const { Type, PrimaryKey = [] } = Records[0];
    if (!PrimaryKey.length || !PrimaryKey.length) return;
    const code = Date.now();
    const { Value: id } = PrimaryKey.find(item => item.ColumnName === 'id') || {};

    switch (Type) {
        case 'PutRow':
            await sendMail({
                from: `"验证码" <${FROM}>`,
                to: TO,
                subject: 'code',
                html: `<div>请点击<a href="https://1267445841694946.cn-hangzhou.fc.aliyuncs.com/2016-08-15/proxy/tablestore-server/tablestore-http/UpdateRow?code=${code}&id=${id}"> CODE </a>进行授权</div>`
            });
            break;
        case 'UpdateRow':
            await sendMail({
                from: `"完成" <${FROM}>`,
                to: TO,
                subject: '验证完成',
                text: `用户注册完成`
            });
            break;
        default:
            break;

    }
})

handler.use(tablestoreInitialzerPlugin())
exports.initializer = handler.initializerHandler;

exports.handler = handler;
