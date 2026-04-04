// deno-lint-ignore-file no-explicit-any

const STRUCT_NVGcolor: Deno.NativeStructType = {
  struct: ['f32', 'f32', 'f32', 'f32'],
};

const STRUCT_NVGpaint = {
  struct: [
    ...['f32', 'f32', 'f32', 'f32', 'f32', 'f32'], // xform[6]
    ...['f32', 'f32'], // extent[2]
    'f32', // radius
    'f32', // feather
    STRUCT_NVGcolor, // innerColor
    STRUCT_NVGcolor, // outerColor
    'i32', // image
  ],
};

export const symbols: Deno.ForeignLibraryInterface = {};
export const symbolsMeta: Record<string, { parameterNames: string[] }> = {};

const conversionTable: Record<string, any> = {
  int: 'i32',
  'const int': 'i32',
  char: 'i8',
  'unsigned char': 'u8',
  'short int': 'i16',
  'unsigned short int': 'u16',
  'unsigned int': 'u32',
  'long long int': 'i64',
  'unsigned long': 'u64',
  'long int': 'u64',
  size_t: 'isize',
  float: 'f32',
  double: 'f64',
  void: 'void',
  'void *': 'pointer',
  'char *': 'buffer',
  'const char *': 'buffer',
  NVGpaint: STRUCT_NVGpaint,
  NVGcolor: STRUCT_NVGcolor,
};

const blackList = ['nvgCreateImageMem', 'nvgCreateImage'];

const command = new Deno.Command('clang++', {
  args: [
    '-Xclang',
    '-ast-dump=json',
    '-fsyntax-only',
    import.meta.dirname + '/../build/_deps/nanovg-src/src/nanovg.h',
  ], // Pass the script name as an argument to bash
  stdout: 'piped',
  stderr: 'piped',
});

const output = command.outputSync();
const decoder = new TextDecoder();
const ast = JSON.parse(decoder.decode(output.stdout));

ast.inner
  .flatMap((decl: any) => decl.inner)
  .filter(
    (decl: any) =>
      decl.kind === 'FunctionDecl' && !blackList.includes(decl.name),
  )
  .forEach((decl: any) => {
    const returnType = (decl.type.qualType as string)
      .match(/(\S+\s?\*?)\(/)?.[1]
      .trim();

    const result =
      returnType && conversionTable[returnType]
        ? conversionTable[returnType]
        : returnType?.includes('*')
          ? 'pointer'
          : 'invalid';

    const parameters = decl.inner.map((p: any) =>
      conversionTable[p.type.qualType]
        ? conversionTable[p.type.qualType]
        : p.type.qualType?.includes('*')
          ? 'pointer'
          : 'invalid',
    );
    const parameterNames = decl.inner.map((p: any) => {
      return p.name;
    });

    if (parameters.includes(undefined)) {
      console.log(decl);
    }

    symbolsMeta[decl.name] = { parameterNames };
    symbols[decl.name] = {
      parameters,
      result,
    };
  });

// const fileContent = `
// // !!! DO NOT EDIT !!! AUTO GENERATED !!!
// // prettier-ignore
// export const NANOVG_SYMBOLS = ${JSON.stringify(symbols)} as const;

// // For type checking
// NANOVG_SYMBOLS as Deno.ForeignLibraryInterface;
// `;

// const outfilePath = import.meta.dirname + '/nanovgSymbols.ts';
// Deno.writeFileSync(outfilePath, new TextEncoder().encode(fileContent));
// new Deno.Command(Deno.execPath(), { args: ['fmt', outfilePath] }).outputSync();
