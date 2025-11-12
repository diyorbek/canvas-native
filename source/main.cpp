#include <cctype>

#include "raylib.h"
#include "stdio.h"

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

int main() {
  InitWindow(800, 600, "Basic Window");

  while (!WindowShouldClose()) {
    BeginDrawing();
    // DrawText("Hello WORLD!!!!!", 300, 200, 40, WHITE);
    DrawRectangleLines(75, 140, 150, 110, BLACK);
    ClearBackground(StrokeStyleToColor("#fff"));
    EndDrawing();
  }

  CloseWindow();

  return 0;
}
