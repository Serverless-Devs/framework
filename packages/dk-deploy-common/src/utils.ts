export const transformCodeUriToS = (codeUri: string, cwd: string) => {
  const cwdindex = cwd.split('/').length;
  let filePath: any = codeUri.split('/');
  filePath.splice(cwdindex, 0, '.s');
  return filePath.join('/');
};
