const lib = Deno.dlopen("./build/libcanvasnative.dylib", {
  render: {
    parameters: ["i32", "i32", "buffer"],
    result: "void",
  },
});

const text = "Hello Wordldfsdfskfjds fksdfdsf!";
const textEncoder = new TextEncoder();

lib.symbols.render(600, 300, textEncoder.encode(text).buffer);
