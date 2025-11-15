// struct NVGcolor {
//   float r,g,b,a;
// };

export const STRUCT_NVGcolor: Deno.NativeStructType = {
  struct: ["f32", "f32", "f32", "f32"],
};

// struct NVGpaint {
// 	float xform[6];
// 	float extent[2];
// 	float radius;
// 	float feather;
// 	NVGcolor innerColor;
// 	NVGcolor outerColor;
// 	int image;
// };

export const STRUCT_NVGpaint = {
  struct: [
    ...["f32", "f32", "f32", "f32", "f32", "f32"], // xform[6]
    ...["f32", "f32"], // extent[2]
    "f32", // radius
    "f32", // feather
    STRUCT_NVGcolor, // innerColor
    STRUCT_NVGcolor, // outerColor
    "i32", // image
  ],
};
