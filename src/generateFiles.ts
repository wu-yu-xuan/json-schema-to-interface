import { FileInfo } from './interface';
import { resolve, basename } from 'path';
import inputs from './inputs';
import compileSchemaToCode from './compileSchemaToCode';
import { writeFile } from 'fs-extra';
import { info } from '@actions/core';

export default function generateFiles(fileInfos: FileInfo[]) {
  return Promise.all(
    fileInfos.map(({ absolutePath, interfaceName, relativePath }) => {
      const baseName = basename(relativePath);
      const outputPath = resolve(
        process.cwd(),
        inputs.outputDir,
        baseName + '.d.ts'
      );
      const code = compileSchemaToCode({
        absolutePath,
        interfaceName,
        relativePath
      });
      info(`writing ${outputPath}`);
      return writeFile(outputPath, code);
    })
  );
}
