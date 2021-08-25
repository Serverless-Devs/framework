import alibaba from './alibaba';

// 支持的云厂商
const providers = {
  alibaba
};

export default (options) => {
  const { provider = 'alibaba' } = options;

  if (provider in providers) {
    return providers[provider](options);
  }

  throw new Error(`Unsupported provider ${provider}`);
};
