import { STRUCT_NVGcolor, STRUCT_NVGpaint } from "./structs.ts";

const symbols = {};

const conversionTable = {
  int: "i32",
  "const int": "i32",
  char: "i8",
  "unsigned char": "u8",
  "short int": "i16",
  "unsigned short int": "u16",
  "unsigned int": "u32",
  "long long int": "i64",
  "unsigned long": "u64",
  "long int": "u64",
  size_t: "isize",
  float: "f32",
  double: "f64",
  void: "void",
  "void *": "pointer",
  NVGpaint: STRUCT_NVGpaint,
  NVGcolor: STRUCT_NVGcolor,
};

const command = new Deno.Command("clang++", {
  args: [
    "-Xclang",
    "-ast-dump=json",
    "-fsyntax-only",
    import.meta.dirname + "/../build/_deps/nanovg-src/src/nanovg.h",
  ], // Pass the script name as an argument to bash
  stdout: "piped",
  stderr: "piped",
});

const output = command.outputSync();
const decoder = new TextDecoder();
const ast = JSON.parse(decoder.decode(output.stdout));

console.log(ast);
ast.inner
  .flatMap((decl) => decl.inner)
  .filter((decl) => decl.kind === "FunctionDecl")
  // .flatMap(crd => crd.inner)
  .forEach((decl) => {
    // console.log(
    //   `${decl.type.qualType} ${decl.name} (${
    //     decl.inner?.map((p) => p.name).join(", ")
    //   })`,
    // );

    const returnType = (decl.type.qualType as string)
      .match(/(\S+\s?\*?)\(/)?.[1]
      .trim();

    const result = returnType?.includes("*")
      ? "pointer"
      : conversionTable[returnType];

    const parameters = decl.inner
      // .filter((p) => p.type === "ParmVarDecl");
      .map((p) =>
        p.type.qualType?.includes("*")
          ? "pointer"
          : conversionTable[p.type.qualType]
      );

    if (parameters.includes(undefined)) {
      console.log(decl);
    }

    symbols[decl.name] = {
      parameters,
      result,
    };
  });

Deno.writeFileSync(
  import.meta.dirname + "/nanovgSymbols.ts",
  new TextEncoder().encode(
    `export const NANOVG_SYMBOLS: Deno.ForeignLibraryInterface = ${JSON.stringify(
      symbols,
      null,
      2
    )} as const;`
  )
);
