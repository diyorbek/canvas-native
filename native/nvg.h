// !!! DO NOT EDIT !!! AUTO GENERATED !!!
// clang-format off
#pragma once

#include "nanovg.h"

namespace nvg {
void arc(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgArc(ctx, args[0], args[1], args[2], args[3], args[4], args[5]);
}

void arc_to(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgArcTo(ctx, args[0], args[1], args[2], args[3], args[4]);
}

void begin_path(NVGcontext* ctx, const float*, const uint8_t*) {
  nvgBeginPath(ctx);
}

void bezier_to(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgBezierTo(ctx, args[0], args[1], args[2], args[3], args[4], args[5]);
}

void close_path(NVGcontext* ctx, const float*, const uint8_t*) {
  nvgClosePath(ctx);
}

void fill(NVGcontext* ctx, const float*, const uint8_t*) {
  nvgFill(ctx);
}

void fill_color(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgFillColor(ctx, nvgRGBAf(args[0], args[1], args[2], args[3]));
}

void font_face_id(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgFontFaceId(ctx, args[0]);
}

void font_size(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgFontSize(ctx, args[0]);
}

void global_alpha(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgGlobalAlpha(ctx, args[0]);
}

void global_composite_operation(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgGlobalCompositeOperation(ctx, args[0]);
}

void line_cap(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgLineCap(ctx, args[0]);
}

void line_join(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgLineJoin(ctx, args[0]);
}

void line_to(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgLineTo(ctx, args[0], args[1]);
}

void miter_limit(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgMiterLimit(ctx, args[0]);
}

void move_to(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgMoveTo(ctx, args[0], args[1]);
}

void quad_to(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgQuadTo(ctx, args[0], args[1], args[2], args[3]);
}

void rect(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgRect(ctx, args[0], args[1], args[2], args[3]);
}

void restore(NVGcontext* ctx, const float*, const uint8_t*) {
  nvgRestore(ctx);
}

void rotate(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgRotate(ctx, args[0]);
}

void rounded_rect(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgRoundedRect(ctx, args[0], args[1], args[2], args[3], args[4]);
}

void save(NVGcontext* ctx, const float*, const uint8_t*) {
  nvgSave(ctx);
}

void scale(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgScale(ctx, args[0], args[1]);
}

void stroke(NVGcontext* ctx, const float*, const uint8_t*) {
  nvgStroke(ctx);
}

void stroke_color(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgStrokeColor(ctx, nvgRGBAf(args[0], args[1], args[2], args[3]));
}

void stroke_width(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgStrokeWidth(ctx, args[0]);
}

void text_align(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgTextAlign(ctx, args[0]);
}

void text_letter_spacing(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgTextLetterSpacing(ctx, args[0]);
}

void transform(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgTransform(ctx, args[0], args[1], args[2], args[3], args[4], args[5]);
}

void translate(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgTranslate(ctx, args[0], args[1]);
}
} // namespace nvg
