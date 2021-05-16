export const mockResponse = {
  setStatusCode: () => {},
  setHeader: () => {},
  deleteHeader: () => {},
  send: (value) => console.log(`HTTP response: ${value}`),
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
export const mockCallback = (error, result) => (error ? console.log(error) : console.log(result));
