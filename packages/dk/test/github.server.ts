import { githubHandler } from '../src';
const http = require('http');
const github = githubHandler({ path: '/webhooks', secret: 'my_secrets2' });

github.on('issues', (data) => {
  console.log('监听到 issue', data.event)

})
github.on('error', (data) => {
  console.log('监听到 error', data.event)
})
github.onEvent(data => {
  console.log('监听到 event', data.event)
});

http.createServer(async (req, res) => {
  const data = github(req)
  console.log(data);
  res.writeHead(data.code, { 'content-type': 'application/json' })
  res.end(data.message)
}).listen(8082);

console.log('Server running at http://127.0.0.1:8082/');
