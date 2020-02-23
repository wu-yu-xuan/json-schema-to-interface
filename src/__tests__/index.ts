process.env.INPUT_DIR = 'example';
process.env.OUTPUT_DIR = 'output';
process.env.OUTPUT_INTERFACE = 'Api';

import { setFailed } from '@actions/core';
import getFileInfo from '../getFileInfo';
import inputs from '../inputs';
import prepareOutput from '../prepareOutput';
import generateIndex from '../generateIndex';
import generateFiles from '../generateFiles';

it('test run', async () => {
  try {
    const [fileInfos] = await Promise.all([
      getFileInfo({
        folder: inputs.inputDir,
        root: process.cwd()
      }),
      prepareOutput()
    ]);
    expect(fileInfos).toMatchInlineSnapshot();
    generateIndex(fileInfos);
    generateFiles(fileInfos);
  } catch (e) {
    setFailed(`Action failed with ${e}`);
  }
});
