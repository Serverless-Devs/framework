export const mockResponse = {
  setStatusCode: () => { },
  setHeader: () => { },
  deleteHeader: () => { },
  send: console.log,
};
export const EVENT = 'event';
export const ACCESS_KEY_ID = '123456';
export const mockContext = {
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    accessKeySecret: 'aasass',
    securityToken: 'ppoooio',
  },
};
export const mockEvent = Buffer.from(EVENT);
export const mockCallback = () => { };
