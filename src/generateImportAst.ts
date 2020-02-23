import { FileInfo } from './interface';
import ts from 'typescript';

export default function generateImportAst(fileInfos: FileInfo[]) {
  return fileInfos.map(({ interfaceName, relativePath }) =>
    ts.createImportDeclaration(
      undefined,
      undefined,
      ts.createImportClause(
        undefined,
        ts.createNamedImports([
          ts.createImportSpecifier(
            undefined,
            ts.createIdentifier(interfaceName)
          )
        ])
      ),
      ts.createStringLiteral(`./${relativePath}`)
    )
  );
}
