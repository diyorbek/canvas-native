extern "C" void CreateWindow(int width, int height, const char* title,
                             void (*init_callback)(void* ctx),
                             void (*render_callback)());
