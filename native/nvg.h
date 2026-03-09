// !!! DO NOT EDIT !!! AUTO GENERATED !!!
// clang-format off
#pragma once

#include "nanovg.h"

namespace nvg {
void arc(NVGcontext* ctx, const float* args) {
  nvgArc(ctx, args[0], args[1], args[2], args[3], args[4], args[5]);
}

void arc_to(NVGcontext* ctx, const float* args) {
  nvgArcTo(ctx, args[0], args[1], args[2], args[3], args[4]);
}

void begin_path(NVGcontext* ctx, const float* args) {
  nvgBeginPath(ctx);
}

void bezier_to(NVGcontext* ctx, const float* args) {
  nvgBezierTo(ctx, args[0], args[1], args[2], args[3], args[4], args[5]);
}

void close_path(NVGcontext* ctx, const float* args) {
  nvgClosePath(ctx);
}

void fill(NVGcontext* ctx, const float* args) {
  nvgFill(ctx);
}

void fill_color(NVGcontext* ctx, const float* args) {
  nvgFillColor(ctx, nvgRGBAf(args[0], args[1], args[2], args[3]));
}

void font_face_id(NVGcontext* ctx, const float* args) {
  nvgFontFaceId(ctx, args[0]);
}

void font_size(NVGcontext* ctx, const float* args) {
  nvgFontSize(ctx, args[0]);
}

void global_alpha(NVGcontext* ctx, const float* args) {
  nvgGlobalAlpha(ctx, args[0]);
}

void global_composite_operation(NVGcontext* ctx, const float* args) {
  nvgGlobalCompositeOperation(ctx, args[0]);
}

void line_cap(NVGcontext* ctx, const float* args) {
  nvgLineCap(ctx, args[0]);
}

void line_join(NVGcontext* ctx, const float* args) {
  nvgLineJoin(ctx, args[0]);
}

void line_to(NVGcontext* ctx, const float* args) {
  nvgLineTo(ctx, args[0], args[1]);
}

void miter_limit(NVGcontext* ctx, const float* args) {
  nvgMiterLimit(ctx, args[0]);
}

void move_to(NVGcontext* ctx, const float* args) {
  nvgMoveTo(ctx, args[0], args[1]);
}

void quad_to(NVGcontext* ctx, const float* args) {
  nvgQuadTo(ctx, args[0], args[1], args[2], args[3]);
}

void rect(NVGcontext* ctx, const float* args) {
  nvgRect(ctx, args[0], args[1], args[2], args[3]);
}

void restore(NVGcontext* ctx, const float* args) {
  nvgRestore(ctx);
}

void rotate(NVGcontext* ctx, const float* args) {
  nvgRotate(ctx, args[0]);
}

void rounded_rect(NVGcontext* ctx, const float* args) {
  nvgRoundedRect(ctx, args[0], args[1], args[2], args[3], args[4]);
}

void save(NVGcontext* ctx, const float* args) {
  nvgSave(ctx);
}

void scale(NVGcontext* ctx, const float* args) {
  nvgScale(ctx, args[0], args[1]);
}

void stroke(NVGcontext* ctx, const float* args) {
  nvgStroke(ctx);
}

void stroke_color(NVGcontext* ctx, const float* args) {
  nvgStrokeColor(ctx, nvgRGBAf(args[0], args[1], args[2], args[3]));
}

void stroke_width(NVGcontext* ctx, const float* args) {
  nvgStrokeWidth(ctx, args[0]);
}

void text_align(NVGcontext* ctx, const float* args) {
  nvgTextAlign(ctx, args[0]);
}

void text_letter_spacing(NVGcontext* ctx, const float* args) {
  nvgTextLetterSpacing(ctx, args[0]);
}

void transform(NVGcontext* ctx, const float* args) {
  nvgTransform(ctx, args[0], args[1], args[2], args[3], args[4], args[5]);
}

void translate(NVGcontext* ctx, const float* args) {
  nvgTranslate(ctx, args[0], args[1]);
}
} // namespace nvg
