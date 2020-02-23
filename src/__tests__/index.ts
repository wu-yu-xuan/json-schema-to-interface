process.env.INPUT_INPUT_DIR = 'example';
process.env.INPUT_OUTPUT_DIR = 'output';
process.env.INPUT_OUTPUT_INTERFACE = 'Api';

import { setFailed } from '@actions/core';
import getFileInfo from '../getFileInfo';
import inputs from '../inputs';
import generateIndex from '../generateIndex';
import generateFiles from '../generateFiles';
import prepareOutput from '../prepareOutput';

it('test run', async () => {
  try {
    const [fileInfos] = await Promise.all([
      getFileInfo({
        folder: inputs.inputDir,
        root: process.cwd()
      }),
      prepareOutput()
    ]);
    expect(fileInfos).toMatchInlineSnapshot(`
      Array [
        Object {
          "absolutePath": "D:/Frontend/json-schema-to-interface/example/user/post/request.json",
          "interfaceName": "ExampleUserPostRequest",
          "relativePath": "example/user/post/request.json",
        },
      ]
    `);
    await Promise.all([generateIndex(fileInfos), generateFiles(fileInfos)]);
  } catch (e) {
    setFailed(`Action failed with ${e}`);
  }
});
