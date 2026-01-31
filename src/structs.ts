// struct Color {
//     unsigned char r;        // Color red value
//     unsigned char g;        // Color green value
//     unsigned char b;        // Color blue value
//     unsigned char a;        // Color alpha value
// };
export const STRUCT_Color: Deno.NativeStructType = {
  struct: ["u8", "u8", "u8", "u8"],
};

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

// RAYLIB Image, pixel data stored in CPU memory (RAM)
// typedef struct Image {
//     void *data;             // Image raw data
//     int width;              // Image base width
//     int height;             // Image base height
//     int mipmaps;            // Mipmap levels, 1 by default
//     int format;             // Data format (PixelFormat type)
// } Image;
export const STRUCT_Image: Deno.NativeStructType = {
  struct: ["pointer", "i32", "i32", "i32", "i32"],
};
