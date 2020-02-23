import { FileInfo } from './interface';
import generateImportAst from './generateImportAst';
import generateInterfaceAst from './generateInterfaceAst';
import { resolve } from 'path';
import inputs from './inputs';
import compileAstToCode from './compileAstToCode';
import { writeFile } from 'fs-extra';
import { info } from '@actions/core';

export default function generateIndex(fileInfos: FileInfo[]) {
  const ast = [
    ...generateImportAst(fileInfos),
    generateInterfaceAst(fileInfos)
  ];
  const indexPath = resolve(process.cwd(), inputs.outputDir, 'index.d.ts');
  const code = compileAstToCode(ast);
  info(`writing ${indexPath}`);
  return writeFile(indexPath, code);
}
