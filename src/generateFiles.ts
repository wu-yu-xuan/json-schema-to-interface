import { FileInfo } from './interface';
import { resolve, extname, dirname, format, basename } from 'path';
import inputs from './inputs';
import compileSchemaToCode from './compileSchemaToCode';
import { writeFile, mkdirp } from 'fs-extra';
import { info } from '@actions/core';

export default function generateFiles(fileInfos: FileInfo[]) {
  return Promise.all(
    fileInfos.map(async ({ absolutePath, interfaceName, relativePath }) => {
      const outputDir = resolve(
        process.cwd(),
        inputs.outputDir,
        dirname(relativePath)
      );
      await mkdirp(outputDir);
      const outputPath = format({
        dir: outputDir,
        name: basename(relativePath, extname(relativePath)),
        ext: '.d.ts'
      });
      const code = await compileSchemaToCode({
        absolutePath,
        interfaceName,
        relativePath
      });
      info(`writing ${outputPath}`);
      return writeFile(outputPath, code);
    })
  );
}
