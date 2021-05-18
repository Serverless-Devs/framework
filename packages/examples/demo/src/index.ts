/** 86 行的 path 字段
 * 1、path: '/update-tablestore'， 发邮件
 * 2、path: `/update-tablestore?code=${VERTIFICATION_CODE}`, 修改 tablestore
 */

import { mockResponse, mockContext, mockCallback, VERTIFICATION_CODE, TRANSPORT } from './fixtures/mock-data';
import noah from '@serverless-devs/noah-core';
import jsonBodyParser from '@serverless-devs/http-json-body-parser';
import routeParser from '@serverless-devs/http-route-parser';
import tablestoreInitialzerPlugin from '@serverless-devs/tablestore-initialzer-plugin';
import { INoahRequest, Imail } from './interface';
import nodemailer from 'nodemailer';

const { parse } = require('qs');
const http = require('http');

// updateRow
const updateRow = async (request: INoahRequest, object: object) => {
  const tableClient = request?.internal?.tableClient;
  const data = await tableClient.updateRow(object);
  console.log('---执行 table', data);
};

// 发邮件
const sendMail = async (option: Imail) => {
  console.log('准备发送邮件')
  const transporter = nodemailer.createTransport(TRANSPORT);
  const data = await transporter.sendMail(option);
  console.log('发送成功', data);
}

const server = http.createServer(async (req, res) => {
  process.env.tablestore_endpoint = 'https://hfs-ots.cn-hangzhou.ots.aliyuncs.com';
  process.env.tablestore_instanceName = 'hfs-ots';

  const handler = noah((request) => {
    return request.req.body;
  });

  handler.use(tablestoreInitialzerPlugin()).use(jsonBodyParser()).use(routeParser({
    '/update-tablestore': {
      GET: async (config) => {
        const { queries } = config.req;
        // 发邮件
        if (queries?.code !== VERTIFICATION_CODE) { // 存在code，并且 code 为 VERTIFICATION_CODE
          const { url } = config.req;
          const { host } = config.req.headers;
          await sendMail({
            from: '"验证码" <243973775@qq.com>',
            to: 'huangfushan@126.com',
            subject: 'code 验证码',
            html: `<div>请点击<a href="https://${host}${url}?code=${VERTIFICATION_CODE}"> CODE </a>进行授权</div>`
          });
        } else { // 修改 tablestore
          const code = config?.req?.queries?.code;
          if (code !== VERTIFICATION_CODE) return;
          await updateRow(config, {
            tableName: 'test',
            condition: {
              rowExistenceExpectation: 0,
            },
            primaryKey: [{ 'id': '1' }],
            updateOfAttributeColumns: [
              { 'PUT': [{ 'verified': true }] },
            ]
          }); // 执行 table 操作
          await sendMail({
            from: '"邮箱" <243973775@qq.com>',
            to: 'huangfushan@126.com',
            subject: '注册成功',
            text: '通知用户注册成功'
          }); // 通知用户注册成功
        }
      },
    },
    '/user:1': {
      GET: (config) => {
        console.log('----用户详情----- /user:1', config.req.match)
      },
    }
  }));

  await handler.initializerHandler(mockContext, mockCallback);

  // 这里是因为本地模拟的http请求 stream 流与 FC 不一致， 
  const [path, search] = req.url.split('?');
  req.path = path; // 手动加上
  req.queries = parse(search); // 手动加上，FC 会自动结构
  await handler(req, mockResponse, mockContext);

  res.end();
});

server.listen(() => {
  const { port } = server.address();
  const client = http.request({
    method: 'GET',
    port,
    path: '/update-tablestore', // '/update-tablestore' 或者 ` / update - tablestore ? code = ${ VERTIFICATION_CODE }`
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  });
  client.end('{}');

  client.on('response', () => {
    server.close();
  });
});