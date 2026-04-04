#include "draw_commands.h"

#include "../nvg/image.h"
#include "../nvg/nvg.h"
#include "../nvg/rect.h"
#include "../nvg/text.h"

DispatchFunc draw_cmd_map[DRAW_COMMANDS_SIZE] = {};

void init_draw_commands() {
  draw_cmd_map[static_cast<int>(DrawCommand::ARC)]          = nvg::arc;
  draw_cmd_map[static_cast<int>(DrawCommand::ARC_TO)]       = nvg::arc_to;
  draw_cmd_map[static_cast<int>(DrawCommand::BEGIN_PATH)]   = nvg::begin_path;
  draw_cmd_map[static_cast<int>(DrawCommand::BEZIER_TO)]    = nvg::bezier_to;
  draw_cmd_map[static_cast<int>(DrawCommand::CLOSE_PATH)]   = nvg::close_path;
  draw_cmd_map[static_cast<int>(DrawCommand::FILL)]         = nvg::fill;
  draw_cmd_map[static_cast<int>(DrawCommand::FILL_COLOR)]   = nvg::fill_color;
  draw_cmd_map[static_cast<int>(DrawCommand::FONT_FACE_ID)] = nvg::font_face_id;
  draw_cmd_map[static_cast<int>(DrawCommand::FONT_SIZE)]    = nvg::font_size;
  draw_cmd_map[static_cast<int>(DrawCommand::GLOBAL_ALPHA)] = nvg::global_alpha;
  draw_cmd_map[static_cast<int>(DrawCommand::GLOBAL_COMPOSITE_OPERATION)] =
      nvg::global_composite_operation;
  draw_cmd_map[static_cast<int>(DrawCommand::LINE_CAP)]     = nvg::line_cap;
  draw_cmd_map[static_cast<int>(DrawCommand::LINE_JOIN)]    = nvg::line_join;
  draw_cmd_map[static_cast<int>(DrawCommand::LINE_TO)]      = nvg::line_to;
  draw_cmd_map[static_cast<int>(DrawCommand::MITER_LIMIT)]  = nvg::miter_limit;
  draw_cmd_map[static_cast<int>(DrawCommand::MOVE_TO)]      = nvg::move_to;
  draw_cmd_map[static_cast<int>(DrawCommand::QUAD_TO)]      = nvg::quad_to;
  draw_cmd_map[static_cast<int>(DrawCommand::RECT)]         = nvg::rect;
  draw_cmd_map[static_cast<int>(DrawCommand::RESTORE)]      = nvg::restore;
  draw_cmd_map[static_cast<int>(DrawCommand::ROTATE)]       = nvg::rotate;
  draw_cmd_map[static_cast<int>(DrawCommand::ROUNDED_RECT)] = nvg::rounded_rect;
  draw_cmd_map[static_cast<int>(DrawCommand::SAVE)]         = nvg::save;
  draw_cmd_map[static_cast<int>(DrawCommand::SCALE)]        = nvg::scale;
  draw_cmd_map[static_cast<int>(DrawCommand::STROKE)]       = nvg::stroke;
  draw_cmd_map[static_cast<int>(DrawCommand::STROKE_COLOR)] = nvg::stroke_color;
  draw_cmd_map[static_cast<int>(DrawCommand::STROKE_WIDTH)] = nvg::stroke_width;
  draw_cmd_map[static_cast<int>(DrawCommand::TEXT_ALIGN)]   = nvg::text_align;
  draw_cmd_map[static_cast<int>(DrawCommand::TEXT_LETTER_SPACING)] =
      nvg::text_letter_spacing;
  draw_cmd_map[static_cast<int>(DrawCommand::TRANSFORM)] = nvg::transform;
  draw_cmd_map[static_cast<int>(DrawCommand::TRANSLATE)] = nvg::translate;

  // Custom commands
  draw_cmd_map[static_cast<int>(DrawCommand::CLEAR_RECT)] = nvg::clear_rect;
  draw_cmd_map[static_cast<int>(DrawCommand::TEXT)]       = nvg::text;
  draw_cmd_map[static_cast<int>(DrawCommand::DRAW_IMAGE)] = nvg::draw_image;
  draw_cmd_map[static_cast<int>(DrawCommand::DRAW_IMAGE_WITH_DEAFULT_SIZE)] =
      nvg::draw_image_with_deafult_size;
}
