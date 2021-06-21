export { default as portIsOccupied } from './portIsOccupied';

export const isPlainObject = (value: object) => {
  return Object.prototype.toString.call(value) === '[object Object]';
};

export const isContainerEmpty = (value: any): boolean => {
  if (isPlainObject(value)) {
    return Object.keys(value).length === 0;
  } else if (Array.isArray(value)) {
    return value.length === 0;
  }
  return true;
};

export const omit = (value: object, list: string[]) => {
  const newObject = {};
  if (!isPlainObject(value)) return newObject;
  Object.keys(value)
    .filter((item) => !list.includes(item))
    .map((key) => {
      newObject[key] = value[key];
    });
  return newObject;
};

export const jsonSafeParse = (
  string: string,
  reviver?: (this: any, key: string, value: any) => any,
) => {
  if (typeof string !== 'string') return string;
  const firstChar = string[0];
  if (firstChar !== '{' && firstChar !== '[' && firstChar !== '"') return string;
  try {
    return JSON.parse(string, reviver);
  } catch (e) {}

  return string;
};

export const normalizeHttpResponse = (response) => {
  // May require updating to catch other types
  if (response === undefined) {
    response = {};
  } else if (Array.isArray(response) || typeof response !== 'object' || response === null) {
    response = { body: response };
  }
  response.headers = response?.headers ?? {};
  return response;
};

/**
 *
 * @param variables
 * @param request
 * 基本用法:
 *  const getInternalRequest = {
  internal: {
    boolean: true,
    number: 1,
    string: 'string',
    array: [],
    object: {
      key: 'value'
    },
  }
  getInternal(
    ['array', 'object'],
    getInternalRequest
  ) => { array: [],object: {key: 'value'} }
 */
export const getInternal = async (variables, request) => {
  if (!variables) return {};
  let keys = [];
  let values = [];
  if (variables === true) {
    keys = values = Object.keys(request.internal);
  } else if (typeof variables === 'string') {
    keys = values = [variables];
  } else if (Array.isArray(variables)) {
    keys = values = variables;
  } else if (typeof variables === 'object') {
    keys = Object.keys(variables);
    values = Object.values(variables);
  }
  const promises = [];
  for (const internalKey of values) {
    // 'internal.key.sub_value' -> { [key]: internal.key.sub_value }
    const pathOptionKey = internalKey.split('.');
    const rootOptionKey = pathOptionKey.shift();
    let valuePromise = request.internal[rootOptionKey];
    if (typeof valuePromise?.then !== 'function') {
      valuePromise = Promise.resolve(valuePromise);
    }
    promises.push(valuePromise.then((value) => pathOptionKey.reduce((p, c) => p?.[c], value)));
  }
  // ensure promise has resolved by the time it's needed
  // If one of the promises throws it will bubble up to @dk/core
  // @ts-ignore
  values = await Promise.allSettled(promises);
  const errors = values.filter((res) => res.status === 'rejected').map((res) => res.reason.message);
  if (errors.length) throw new Error(JSON.stringify(errors));
  return keys.reduce(
    (obj, key, index) => ({ ...obj, [sanitizeKey(key)]: values[index].value }),
    {},
  );
};

const sanitizeKeyPrefixLeadingNumber = /^([0-9])/;
const sanitizeKeyRemoveDisallowedChar = /[^a-zA-Z0-9]+/g;
const sanitizeKey = (key) => {
  return key
    .replace(sanitizeKeyPrefixLeadingNumber, '_$1')
    .replace(sanitizeKeyRemoveDisallowedChar, '_');
};
