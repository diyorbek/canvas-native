#include "raylib.h"

extern "C" int render(int width, int height, char* text) {
  InitWindow(width, height, "Basic Window");

  while (!WindowShouldClose()) {
    BeginDrawing();
    DrawText(text, width / 3, height / 3, 40, WHITE);
    ClearBackground(SKYBLUE);
    EndDrawing();
  }

  CloseWindow();

  return 0;
}
