import { extname, resolve, relative } from 'path';
import { readdir, stat } from 'fs-extra';
import { FileInfo } from './interface';
import slash from 'slash';
import { info } from '@actions/core';

interface GetFileInfo {
  folder: string;
  ext?: string;
  root?: string;
}

export default async function getFileInfo({
  folder,
  ext = '.json',
  root = folder
}: GetFileInfo): Promise<FileInfo[]> {
  const fileList = await readdir(folder);
  return fileList.reduce<Promise<FileInfo[]>>(async (prev, cur) => {
    const absolutePath = slash(resolve(folder, cur));
    const fileState = await stat(absolutePath);
    if (fileState.isDirectory()) {
      return [
        ...(await prev),
        ...(await getFileInfo({ folder: absolutePath, ext, root }))
      ];
    } else if (!ext || extname(absolutePath) === ext) {
      /**
       * 情况一: 未提供后缀名, 则所有文件都放入
       * 情况二: 提供了后缀, 则判断后缀
       */
      const relativePath = slash(relative(root, absolutePath));
      const interfaceName = relativePath
        .slice(0, relativePath.length - ext.length)
        .split('/')
        .map(v => v[0].toUpperCase() + v.slice(1))
        .join('');
      info(`reading ${relativePath}`);
      return [...(await prev), { absolutePath, relativePath, interfaceName }];
    }
    return prev;
  }, Promise.resolve<FileInfo[]>([]));
}
