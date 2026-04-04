// deno-lint-ignore-file no-explicit-any
import { symbols, symbolsMeta } from './generateSymbols.ts';

const WHITELIST = [
  'nvgArc',
  'nvgArcTo',
  'nvgBeginPath',
  'nvgBezierTo',
  'nvgClearRect',
  'nvgClosePath',
  // 'nvgCreateFont',
  'nvgDrawImage',
  'nvgDrawImageWithDeafultSize',
  'nvgFill',
  'nvgFillColor',
  // 'nvgFindFont',
  'nvgFontFaceId',
  'nvgFontSize',
  'nvgGetImageHandleFromMemory',
  'nvgGetImageHandleFromPath',
  'nvgGlobalAlpha',
  'nvgGlobalCompositeOperation',
  'nvgLineCap',
  'nvgLineJoin',
  'nvgLineTo',
  'nvgMiterLimit',
  'nvgMoveTo',
  'nvgQuadTo',
  'nvgRect',
  'nvgRestore',
  'nvgRotate',
  'nvgRoundedRect',
  'nvgSave',
  'nvgScale',
  'nvgStroke',
  'nvgStrokeColor',
  'nvgStrokeWidth',
  // 'nvgText',
  'nvgTextAlign',
  'nvgTextLetterSpacing',
  'nvgTransform',
  'nvgTranslate',
];

const TYPES = {
  i32: 'number',
  i64: 'bigint',
  f32: 'number',
  f64: 'number',
};

const jsFunctions: string[] = [];
const cppFunctions: string[] = [];

// let a = 0;

Object.entries(symbols)
  .toSorted()
  // @ts-expect-error - parameters is not typed, but we know it's there from generateSymbols.ts
  .forEach(([name, { parameters }]) => {
    // if (parameters[0] === 'pointer' && result !== 'void') {
    //   console.log(name, typeof result);
    // }

    if (WHITELIST.includes(name)) {
      const command = name
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace('nvg_', '')
        .toUpperCase();

      // Enum and command mapping list is small enough to log them, and copy-paste
      // console.log(command + '=' + a++ + ',');
      // console.log(
      //   `nvg_dispatcher[${command}] = nvg::${command.toLowerCase()};`,
      // );

      let paramsCount = 0;
      const params = parameters
        .slice(1)
        .map((p: any, i: number) => {
          const argName = symbolsMeta[name]?.parameterNames[i + 1] || `arg${i}`;
          if (typeof p === 'object') {
            const structAsParams = p.struct.map(
              (s: string, j: number) =>
                `${argName}_${j}: ${TYPES[s as keyof typeof TYPES] || 'unknown'}`,
            );

            paramsCount += p.struct.length;

            return structAsParams.join(', ');
          }

          paramsCount++;
          return `${argName}: ${TYPES[p as keyof typeof TYPES] || 'unknown'}`;
        })
        .join(', ');

      // console.log(command, parameters.length);
      const jsFunc = `static ${name}(${params}): void {
  CommandBuffer.write(Command.${command});
  CommandBuffer.write(${paramsCount});
  ${params
    .split(', ')
    .filter(Boolean)
    .map((p: string) => `CommandBuffer.write(${p.split(':')[0]});`)
    .concat(['CommandBuffer.schedule();'])
    .join('\n  ')}
}`;
      let argsIndex = 0;
      const cppFuncArgs = parameters
        .slice(1)
        .map((p: { struct: any[] }) => {
          if (typeof p === 'object') {
            const structArgs = p.struct
              .map(() => {
                return `args[${argsIndex++}]`;
              })
              .join(', ');

            // Assuming the struct is always NVGcolor for now
            return `nvgRGBA(${structArgs})`;
          }

          return `args[${argsIndex++}]`;
        })
        .join(', ');

      const cppFunc = cppFuncArgs
        ? `void ${command.toLowerCase()}(NVGcontext* ctx, const float* args, const uint8_t*) {
  ${name}(ctx, ${cppFuncArgs});
}`
        : `void ${command.toLowerCase()}(NVGcontext* ctx, const float*, const uint8_t*) {
  ${name}(ctx);
}`;

      jsFunctions.push(jsFunc);
      cppFunctions.push(cppFunc);
    }
  });

const jsContent = jsFunctions.filter(Boolean).join('\n\n');

Deno.writeTextFileSync(
  import.meta.dirname + '/../src/nanoVGBridge.ts',
  `// !!! DO NOT EDIT !!! AUTO GENERATED !!!
// prettier-ignore
import { Command, CommandBuffer } from './commandBuffer.ts';

export class NanoVGBridge {
${jsContent}
}
`,
);

Deno.spawn('deno', ['fmt', import.meta.dirname + '/../src/nanoVGBridge.ts']);

const cppContent = cppFunctions.filter(Boolean).join('\n\n');
Deno.writeTextFileSync(
  import.meta.dirname + '/../native/nvg/nvg.h',
  `// !!! DO NOT EDIT !!! AUTO GENERATED !!!
// clang-format off
#pragma once

#include "nanovg.h"

namespace nvg {
${cppContent}
} // namespace nvg
`,
);
