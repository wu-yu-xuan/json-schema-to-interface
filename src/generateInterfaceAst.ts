import { FileInfo } from './interface';
import ts from 'typescript';
import inputs from './inputs';
import { basename } from 'path';

interface Interface {
  [path: string]: {
    [method: string]: {
      [requestOrResponse: string]: string;
    };
  };
}

interface CreateTypeLiteralNode {
  [k: string]: string | CreateTypeLiteralNode;
}

/**
 * export default interface ${inputs.interfaceName} {
 *   ${path}: {
 *     ${method}: {
 *       ${requestOrResponse}: ${interfaceName}
 *     }
 *   }
 * }
 */
export default function generateInterfaceAst(fileInfos: FileInfo[]) {
  const temp = fileInfos.reduce<Interface>((prev, cur) => {
    const pathArray = cur.relativePath.split('/');
    const { length } = pathArray;
    const path = pathArray.slice(0, length - 2).join('/');
    const method = pathArray[length - 2];
    const requestOrResponse = basename(pathArray[length - 1], '.json');
    prev[path] = prev[path] ?? {};
    prev[path][method] = prev[path][method] ?? {};
    prev[path][method][requestOrResponse] = cur.interfaceName;
    return prev;
  }, {});
  const propertySignatures = Object.entries(temp).map(([path, value]) =>
    ts.createPropertySignature(
      undefined,
      ts.createStringLiteral(path),
      undefined,
      createTypeLiteralNode(value),
      undefined
    )
  );
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

function createTypeLiteralNode(o: CreateTypeLiteralNode): ts.TypeLiteralNode {
  return ts.createTypeLiteralNode(
    Object.entries(o).map(([key, value]) =>
      ts.createPropertySignature(
        undefined,
        ts.createIdentifier(key),
        undefined,
        typeof value === 'string'
          ? ts.createTypeReferenceNode(ts.createIdentifier(value), undefined)
          : createTypeLiteralNode(value),
        undefined
      )
    )
  );
}
