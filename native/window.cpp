#include "window.h"

#include <atomic>
#include <cstring>
#include <future>
#include <thread>

#include "sdl3_nvg_setup.h"

// Local headers
#include "dispatcher/dispatcher.h"
#include "dispatcher/dispatcher_sync.h"
#include "events/event_queue.h"
#include "window_state.h"

CN_EXPORT void* create_window(int width, int height, const char* title) {
  SDL_Init(SDL_INIT_VIDEO);

  SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 3);
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 3);
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_CORE);
  SDL_GL_SetAttribute(SDL_GL_STENCIL_SIZE, 8);

  // Enable GL resource sharing between contexts
  SDL_GL_SetAttribute(SDL_GL_SHARE_WITH_CURRENT_CONTEXT, 1);

  window_state.width  = width;
  window_state.height = height;
  window_state.window =
      SDL_CreateWindow(title, width, height, SDL_WINDOW_OPENGL);

  // Create main context first; dispatcher_ctx shares its resources
  window_state.main_ctx       = SDL_GL_CreateContext(window_state.window);
  window_state.dispatcher_ctx = SDL_GL_CreateContext(window_state.window);

  // Main thread keeps main_ctx current; dispatcher thread will claim
  // dispatcher_ctx
  SDL_GL_MakeCurrent(window_state.window, window_state.main_ctx);
  gladLoadGLLoader((GLADloadproc)SDL_GL_GetProcAddress);

  // Main thread only needs NVG for compositing, no stencil strokes needed
  window_state.main_nvg = nvgCreateGL3(NVG_ANTIALIAS);
  // canvas_layer must be created in the main thread so it can composite it
  window_state.canvas_layer =
      nvgluCreateFramebuffer(window_state.main_nvg, width, height, 0);

  // Spawn dispatcher thread; wait for it to finish GL+NVG init before returning
  std::promise<NVGcontext*> ready;
  auto future = ready.get_future();
  window_state.dispatcher_thread =
      std::thread(dispatcher_main, std::move(ready));

  // Block until dispatcher thread has created its NVG context
  future.wait();

  return window_state.dispatcher_nvg;
}

void composite_canvas_frame() {
  nvgluBindFramebuffer(NULL);
  glViewport(0, 0, window_state.width, window_state.height);
  glClearColor(1.0f, 1.0f, 1.0f, 1.0f);
  glClear(GL_COLOR_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);

  nvgBeginFrame(window_state.main_nvg, window_state.width, window_state.height,
                1.0f);
  glEnable(GL_BLEND);
  glBlendFunc(GL_ONE, GL_ONE_MINUS_SRC_ALPHA);

  auto canvas_frame = nvgImagePattern(
      window_state.main_nvg, 0, 0, window_state.width, window_state.height, 0,
      window_state.canvas_layer->image, 1.0f);
  nvgBeginPath(window_state.main_nvg);
  nvgRect(window_state.main_nvg, 0, 0, window_state.width, window_state.height);
  nvgFillPaint(window_state.main_nvg, canvas_frame);
  nvgFill(window_state.main_nvg);
  nvgEndFrame(window_state.main_nvg);
}

static uint8_t sdl_mod_to_cn(SDL_Keymod mod) {
  uint8_t r = 0;
  if (mod & SDL_KMOD_SHIFT) r |= MOD_SHIFT;
  if (mod & SDL_KMOD_CTRL)  r |= MOD_CTRL;
  if (mod & SDL_KMOD_ALT)   r |= MOD_ALT;
  if (mod & SDL_KMOD_GUI)   r |= MOD_META;
  if (mod & SDL_KMOD_CAPS)  r |= MOD_CAPS;
  if (mod & SDL_KMOD_NUM)   r |= MOD_NUM;
  return r;
}

CN_EXPORT int32_t poll_events(uint8_t* out_buf, int32_t max_events) {
  auto events = drain_events();
  int32_t count = (int32_t)(events.size() / CN_EVENT_SIZE);
  if (count > max_events) count = max_events;
  if (count > 0) {
    memcpy(out_buf, events.data(), (size_t)count * CN_EVENT_SIZE);
  }
  return count;
}

CN_EXPORT void start_main_loop(void (*frame_callback)()) {
  SDL_Window* window = window_state.window;

  bool quit = false;
  SDL_Event ev;

  while (!quit) {
    while (SDL_PollEvent(&ev)) {
      switch (ev.type) {
        case SDL_EVENT_QUIT:
          quit = true;
          break;

        case SDL_EVENT_KEY_DOWN:
        case SDL_EVENT_KEY_UP: {
          uint8_t buf[CN_EVENT_SIZE] = {};
          buf[0] = ev.type == SDL_EVENT_KEY_DOWN
                       ? (uint8_t)CNEventType::KEY_DOWN
                       : (uint8_t)CNEventType::KEY_UP;
          buf[1] = sdl_mod_to_cn(ev.key.mod);
          if (ev.key.repeat) buf[1] |= MOD_REPEAT;
          uint32_t keycode  = (uint32_t)ev.key.key;
          uint32_t scancode = (uint32_t)ev.key.scancode;
          memcpy(buf + 4, &keycode,  4);
          memcpy(buf + 8, &scancode, 4);
          push_event(buf);
          break;
        }

        case SDL_EVENT_MOUSE_MOTION: {
          uint8_t buf[CN_EVENT_SIZE] = {};
          buf[0] = (uint8_t)CNEventType::MOUSE_MOVE;
          memcpy(buf + 4,  &ev.motion.x,    4);
          memcpy(buf + 8,  &ev.motion.y,    4);
          memcpy(buf + 12, &ev.motion.xrel, 4);
          memcpy(buf + 16, &ev.motion.yrel, 4);
          push_event(buf);
          break;
        }

        case SDL_EVENT_MOUSE_BUTTON_DOWN:
        case SDL_EVENT_MOUSE_BUTTON_UP: {
          uint8_t buf[CN_EVENT_SIZE] = {};
          buf[0] = ev.type == SDL_EVENT_MOUSE_BUTTON_DOWN
                       ? (uint8_t)CNEventType::MOUSE_DOWN
                       : (uint8_t)CNEventType::MOUSE_UP;
          memcpy(buf + 4, &ev.button.x, 4);
          memcpy(buf + 8, &ev.button.y, 4);
          buf[12] = ev.button.button;
          buf[13] = ev.button.clicks;
          push_event(buf);
          break;
        }

        case SDL_EVENT_MOUSE_WHEEL: {
          uint8_t buf[CN_EVENT_SIZE] = {};
          buf[0] = (uint8_t)CNEventType::MOUSE_WHEEL;
          float dx =  ev.wheel.x;
          float dy = -ev.wheel.y;  // flip to match browser deltaY convention
          memcpy(buf + 4,  &dx,               4);
          memcpy(buf + 8,  &dy,               4);
          memcpy(buf + 12, &ev.wheel.mouse_x, 4);
          memcpy(buf + 16, &ev.wheel.mouse_y, 4);
          push_event(buf);
          break;
        }

        default:
          break;
      }
    }

    composite_canvas_frame();
    SDL_GL_SwapWindow(window);
    frame_callback();  // Signal JS worker: writes timestamp + increments SAB
                       // counter
  }

  // Signal dispatcher thread to stop, wake it if waiting, then join
  dispatcher_running = false;
  dispatcher_cv.notify_one();
  window_state.dispatcher_thread.join();

  // Cleanup
  nvgluDeleteFramebuffer(window_state.canvas_layer);
  nvgDeleteGL3(window_state.dispatcher_nvg);
  nvgDeleteGL3(window_state.main_nvg);
  SDL_GL_DestroyContext(window_state.dispatcher_ctx);
  SDL_GL_DestroyContext(window_state.main_ctx);
  SDL_DestroyWindow(window);
  SDL_Quit();
}
