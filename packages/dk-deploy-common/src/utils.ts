import path from 'path';

export const transformCodeUriToS = (codeUri: string) => {
  const codeUriPath = path.resolve(codeUri);
  const cwdindex = process.cwd().split('/').length;
  let filePath: any = codeUriPath.split('/');
  filePath.splice(cwdindex, 0, '.s');
  return filePath.join('/');
};
