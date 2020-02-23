import ts from 'typescript';
import { format } from 'prettier';
import prettierOptions from './prettierOption';

export default function compileAstToCode(ast: ts.Node[]) {
  const file = ts.createSourceFile(
    '',
    '',
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS
  );
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const code = printer.printList(
    ts.ListFormat.AllowTrailingComma,
    (ast as unknown) as ts.NodeArray<ts.Node>,
    file
  );
  return format(code, prettierOptions);
}
