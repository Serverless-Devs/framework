import { main_initializer, index_handler } from './fixture/initializer';
import fcProcess from '../src/sanbox/fcProcess';

const mockContext = {
  credentials: {
    accessKeyId: 'LTAIlxppDzxWXcv7', // <your access key id>,
    secretAccessKey: 'bctsyreHniTxs3wiBCTiUAhjFiFRjX',
  },
};

// // @ts-ignore
// main_initializer(mockContext, (error, result) => {
//   // console.log(error, result);
// });


fcProcess({
// @ts-ignore
  context: mockContext,
  // @ts-ignore
  req: {},
  // @ts-ignore
  resp: {},
  initializerHandler: main_initializer,
  entryHandler: index_handler,
});
