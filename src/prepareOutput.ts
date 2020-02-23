import { resolve } from 'path';
import { emptyDir, pathExists, mkdirp, stat } from 'fs-extra';
import inputs from './inputs';

export default async function prepareOutput() {
  const outputFolder = resolve(process.cwd(), inputs.outputDir);
  const isExist = await pathExists(outputFolder);
  if (!isExist) {
    return mkdirp(outputFolder);
  }
  const status = await stat(outputFolder);
  if (status.isDirectory()) {
    return emptyDir(outputFolder);
  } else {
    return mkdirp(outputFolder);
  }
}
