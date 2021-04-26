const https = require('https');

const dingHookLink =
  'https://oapi.dingtalk.com/robot/send?access_token=6d45a7399e3123fb4ff5869f22f44ba6c5d24040a79316612be24cb3f27ef7bc';

const makeRequest = (content) => {
  const requestData = JSON.stringify({
    msgtype: 'text',
    text: { content },
  });

  const req = https.request(
    process.env.dingHook || dingHookLink,
    {
      method: 'POST',
      port: 443,
      headers: {
        'Content-Type': 'application/json',
      },
    },
    (res) => {
      console.log(`statusCode: ${res.statusCode}`);
      res.on('data', (d) => {
        process.stdout.write(d);
      });
    },
  );
  req.on('error', (error) => {
    console.error(error);
  });
  req.write(requestData);
  req.end();
};

exports.handler = (req, resp, context) => {
  const { payload } = req.body || {};
  const latestTags = payload['dist-tags'];
  const { event } = payload;
  const { name, version } = payload.versions[latestTags.latest];
  // 发布版本通知
  if (event === 'package:publish') {
    makeRequest(`npm包：${name}，发布新版本：${version}`);
  }
  resp.end('success');
};
