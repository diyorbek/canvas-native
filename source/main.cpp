#include "raylib.h"

int main() {
  InitWindow(800, 600, "Basic Window");

  while (!WindowShouldClose()) {
    BeginDrawing();
    DrawText("Hello WORLD!!!!!", 300, 200, 40, WHITE);
    ClearBackground(SKYBLUE);
    EndDrawing();
  }

  CloseWindow();

  return 0;
}
