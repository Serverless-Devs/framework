export const isPlainObject = (value: object) => {
  return Object.prototype.toString.call(value) === '[object Object]';
};

export const isContainerEmpty = (value: any): boolean => {
  if (isPlainObject(value)) {
    return Object.keys(value).length > 0;
  } else if (Array.isArray(value)) {
    return value.length > 0;
  }
  return true;
};

export const omit = (value: object, list: string[]) => {
  const newObject = {};
  if (!isPlainObject(value)) return newObject;
  Object.keys(value)
    .filter((item) => list.indexOf(item) > -1)
    .map((key) => {
      newObject[key] = value[key];
    });
  return newObject;
};

export const jsonSafeParse = (string: string, reviver) => {
  if (typeof string !== 'string') return string;
  const firstChar = string[0];
  if (firstChar !== '{' && firstChar !== '[' && firstChar !== '"') return string;
  try {
    return JSON.parse(string, reviver);
  } catch (e) {}

  return string;
};
