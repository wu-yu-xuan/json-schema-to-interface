import { resolve } from 'path';
import { emptyDir, pathExists, mkdirp, stat } from 'fs-extra';
import inputs from './inputs';
import { info } from '@actions/core';

export default async function prepareOutput() {
  const outputFolder = resolve(process.cwd(), inputs.outputDir);
  const isExist = await pathExists(outputFolder);
  if (!isExist) {
    info(`${outputFolder} not exists, creating`);
    return mkdirp(outputFolder);
  }
  const status = await stat(outputFolder);
  if (status.isDirectory()) {
    info(`${outputFolder} exists, emptying`);
    return emptyDir(outputFolder);
  } else {
    info(`${outputFolder} not exists, creating`);
    return mkdirp(outputFolder);
  }
}
