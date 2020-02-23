import { FileInfo } from './interface';
import ts from 'typescript';
import inputs from './inputs';
import { basename } from 'path';

export default function generateInterfaceAst(fileInfos: FileInfo[]) {
  const temp = fileInfos.reduce<{ [k: string]: { [k: string]: string } }>(
    (prev, cur) => {
      const index = cur.relativePath.lastIndexOf('/');
      prev[cur.relativePath.slice(0, index)] =
        prev[cur.relativePath.slice(0, index)] ?? {};
      prev[cur.relativePath.slice(0, index)][
        basename(cur.relativePath.slice(index + 1), '.json')
      ] = cur.interfaceName;
      return prev;
    },
    {}
  );
  const propertySignatures = Object.entries(temp).map(([path, value]) => {
    const typeElements = Object.entries(value).map(([name, interfaceName]) =>
      ts.createPropertySignature(
        undefined,
        ts.createIdentifier(name),
        undefined,
        ts.createTypeReferenceNode(
          ts.createIdentifier(interfaceName),
          undefined
        ),
        undefined
      )
    );
    return ts.createPropertySignature(
      undefined,
      ts.createStringLiteral(path),
      undefined,
      ts.createTypeLiteralNode(typeElements),
      undefined
    );
  });
  return ts.createInterfaceDeclaration(
    undefined,
    [
      ts.createModifier(ts.SyntaxKind.ExportKeyword),
      ts.createModifier(ts.SyntaxKind.DefaultKeyword)
    ],
    ts.createIdentifier(inputs.outputInterface),
    undefined,
    undefined,
    propertySignatures
  );
}
