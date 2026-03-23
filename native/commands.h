#pragma once

#include <cstdint>

#include "nvg.h"
#include "nvg/image.h"
#include "nvg/rect.h"
#include "nvg/text.h"

enum Command {
  ARC                        = 0,
  ARC_TO                     = 1,
  BEGIN_PATH                 = 2,
  BEZIER_TO                  = 3,
  CLOSE_PATH                 = 4,
  FILL                       = 5,
  FILL_COLOR                 = 6,
  FONT_FACE_ID               = 7,
  FONT_SIZE                  = 8,
  GLOBAL_ALPHA               = 9,
  GLOBAL_COMPOSITE_OPERATION = 10,
  LINE_CAP                   = 11,
  LINE_JOIN                  = 12,
  LINE_TO                    = 13,
  MITER_LIMIT                = 14,
  MOVE_TO                    = 15,
  QUAD_TO                    = 16,
  RECT                       = 17,
  RESTORE                    = 18,
  ROTATE                     = 19,
  ROUNDED_RECT               = 20,
  SAVE                       = 21,
  SCALE                      = 22,
  STROKE                     = 23,
  STROKE_COLOR               = 24,
  STROKE_WIDTH               = 25,
  TEXT_ALIGN                 = 26,
  TEXT_LETTER_SPACING        = 27,
  TRANSFORM                  = 28,
  TRANSLATE                  = 29,

  // Custom commands
  CLEAR_RECT                   = 100,
  DRAW_IMAGE                   = 101,
  DRAW_IMAGE_WITH_DEAFULT_SIZE = 102,
  TEXT                         = 103
};

typedef void (*NVGCmd)(NVGcontext*, const float*, const uint8_t*);
NVGCmd nvg_dispatcher[256] = {};

void init_commands() {
  nvg_dispatcher[ARC]                        = nvg::arc;
  nvg_dispatcher[ARC_TO]                     = nvg::arc_to;
  nvg_dispatcher[BEGIN_PATH]                 = nvg::begin_path;
  nvg_dispatcher[BEZIER_TO]                  = nvg::bezier_to;
  nvg_dispatcher[CLOSE_PATH]                 = nvg::close_path;
  nvg_dispatcher[FILL]                       = nvg::fill;
  nvg_dispatcher[FILL_COLOR]                 = nvg::fill_color;
  nvg_dispatcher[FONT_FACE_ID]               = nvg::font_face_id;
  nvg_dispatcher[FONT_SIZE]                  = nvg::font_size;
  nvg_dispatcher[GLOBAL_ALPHA]               = nvg::global_alpha;
  nvg_dispatcher[GLOBAL_COMPOSITE_OPERATION] = nvg::global_composite_operation;
  nvg_dispatcher[LINE_CAP]                   = nvg::line_cap;
  nvg_dispatcher[LINE_JOIN]                  = nvg::line_join;
  nvg_dispatcher[LINE_TO]                    = nvg::line_to;
  nvg_dispatcher[MITER_LIMIT]                = nvg::miter_limit;
  nvg_dispatcher[MOVE_TO]                    = nvg::move_to;
  nvg_dispatcher[QUAD_TO]                    = nvg::quad_to;
  nvg_dispatcher[RECT]                       = nvg::rect;
  nvg_dispatcher[RESTORE]                    = nvg::restore;
  nvg_dispatcher[ROTATE]                     = nvg::rotate;
  nvg_dispatcher[ROUNDED_RECT]               = nvg::rounded_rect;
  nvg_dispatcher[SAVE]                       = nvg::save;
  nvg_dispatcher[SCALE]                      = nvg::scale;
  nvg_dispatcher[STROKE]                     = nvg::stroke;
  nvg_dispatcher[STROKE_COLOR]               = nvg::stroke_color;
  nvg_dispatcher[STROKE_WIDTH]               = nvg::stroke_width;
  nvg_dispatcher[TEXT_ALIGN]                 = nvg::text_align;
  nvg_dispatcher[TEXT_LETTER_SPACING]        = nvg::text_letter_spacing;
  nvg_dispatcher[TRANSFORM]                  = nvg::transform;
  nvg_dispatcher[TRANSLATE]                  = nvg::translate;

  // Custom commands
  nvg_dispatcher[CLEAR_RECT] = nvg::clear_rect;
  nvg_dispatcher[TEXT]       = nvg::text;
  nvg_dispatcher[DRAW_IMAGE] = nvg::draw_image;
  nvg_dispatcher[DRAW_IMAGE_WITH_DEAFULT_SIZE] =
      nvg::draw_image_with_deafult_size;
}
