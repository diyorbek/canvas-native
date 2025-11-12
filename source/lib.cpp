#include <cctype>
#include <vector>

#include "raylib.h"

int hexCharToValue(char hex_char) {
  hex_char =
      std::toupper(hex_char);  // Convert to uppercase for consistent handling

  if (hex_char >= '0' && hex_char <= '9') {
    return (hex_char - '0') * 17;
  }

  if (hex_char >= 'A' && hex_char <= 'F') {
    return (hex_char - 'A' + 10) * 17;
  }

  return -1;  // Indicate an invalid hex character
}

extern "C" Color StrokeStyleToColor(char* text) {
  unsigned char red = hexCharToValue(text[1]);
  unsigned char green = hexCharToValue(text[2]);
  unsigned char blue = hexCharToValue(text[3]);

  return Color{red, green, blue, 0xFF};
}

extern "C" void CreateWindow(int width, int height, const char* title) {
  InitWindow(width, height, title);

  while (!WindowShouldClose()) {
    BeginDrawing();
    ClearBackground(WHITE);
    EndDrawing();
  }

  CloseWindow();
}

extern "C" void StrokeRect(float posX, float posY, float width, float height,
                           char* color, float lineThick) {
  DrawRectangleLinesEx({posX, posY, width, height}, lineThick,
                       StrokeStyleToColor(color));
}

extern "C" void FillRect(float posX, float posY, float width, float height,
                         char* color) {
  DrawRectangle(posX, posY, width, height, StrokeStyleToColor(color));
}
