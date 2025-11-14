export const NANOVG_SYMBOLS: Deno.ForeignLibraryInterface = {
  "nvgBeginFrame": {
    "parameters": [
      "pointer",
      "f32",
      "f32",
      "f32"
    ],
    "result": "void"
  },
  "nvgCancelFrame": {
    "parameters": [
      "pointer"
    ],
    "result": "void"
  },
  "nvgEndFrame": {
    "parameters": [
      "pointer"
    ],
    "result": "void"
  },
  "nvgGlobalCompositeOperation": {
    "parameters": [
      "pointer",
      "i32"
    ],
    "result": "void"
  },
  "nvgGlobalCompositeBlendFunc": {
    "parameters": [
      "pointer",
      "i32",
      "i32"
    ],
    "result": "void"
  },
  "nvgGlobalCompositeBlendFuncSeparate": {
    "parameters": [
      "pointer",
      "i32",
      "i32",
      "i32",
      "i32"
    ],
    "result": "void"
  },
  "nvgRGB": {
    "parameters": [
      "u8",
      "u8",
      "u8"
    ],
    "result": {
      "struct": [
        "f32",
        "f32",
        "f32",
        "f32"
      ]
    }
  },
  "nvgRGBf": {
    "parameters": [
      "f32",
      "f32",
      "f32"
    ],
    "result": {
      "struct": [
        "f32",
        "f32",
        "f32",
        "f32"
      ]
    }
  },
  "nvgRGBA": {
    "parameters": [
      "u8",
      "u8",
      "u8",
      "u8"
    ],
    "result": {
      "struct": [
        "f32",
        "f32",
        "f32",
        "f32"
      ]
    }
  },
  "nvgRGBAf": {
    "parameters": [
      "f32",
      "f32",
      "f32",
      "f32"
    ],
    "result": {
      "struct": [
        "f32",
        "f32",
        "f32",
        "f32"
      ]
    }
  },
  "nvgLerpRGBA": {
    "parameters": [
      {
        "struct": [
          "f32",
          "f32",
          "f32",
          "f32"
        ]
      },
      {
        "struct": [
          "f32",
          "f32",
          "f32",
          "f32"
        ]
      },
      "f32"
    ],
    "result": {
      "struct": [
        "f32",
        "f32",
        "f32",
        "f32"
      ]
    }
  },
  "nvgTransRGBA": {
    "parameters": [
      {
        "struct": [
          "f32",
          "f32",
          "f32",
          "f32"
        ]
      },
      "u8"
    ],
    "result": {
      "struct": [
        "f32",
        "f32",
        "f32",
        "f32"
      ]
    }
  },
  "nvgTransRGBAf": {
    "parameters": [
      {
        "struct": [
          "f32",
          "f32",
          "f32",
          "f32"
        ]
      },
      "f32"
    ],
    "result": {
      "struct": [
        "f32",
        "f32",
        "f32",
        "f32"
      ]
    }
  },
  "nvgHSL": {
    "parameters": [
      "f32",
      "f32",
      "f32"
    ],
    "result": {
      "struct": [
        "f32",
        "f32",
        "f32",
        "f32"
      ]
    }
  },
  "nvgHSLA": {
    "parameters": [
      "f32",
      "f32",
      "f32",
      "u8"
    ],
    "result": {
      "struct": [
        "f32",
        "f32",
        "f32",
        "f32"
      ]
    }
  },
  "nvgSave": {
    "parameters": [
      "pointer"
    ],
    "result": "void"
  },
  "nvgRestore": {
    "parameters": [
      "pointer"
    ],
    "result": "void"
  },
  "nvgReset": {
    "parameters": [
      "pointer"
    ],
    "result": "void"
  },
  "nvgShapeAntiAlias": {
    "parameters": [
      "pointer",
      "i32"
    ],
    "result": "void"
  },
  "nvgStrokeColor": {
    "parameters": [
      "pointer",
      {
        "struct": [
          "f32",
          "f32",
          "f32",
          "f32"
        ]
      }
    ],
    "result": "void"
  },
  "nvgStrokePaint": {
    "parameters": [
      "pointer",
      {
        "struct": [
          "f32",
          "f32",
          "f32",
          "f32",
          "f32",
          "f32",
          "f32",
          "f32",
          "f32",
          "f32",
          {
            "struct": [
              "f32",
              "f32",
              "f32",
              "f32"
            ]
          },
          {
            "struct": [
              "f32",
              "f32",
              "f32",
              "f32"
            ]
          },
          "i32"
        ]
      }
    ],
    "result": "void"
  },
  "nvgFillColor": {
    "parameters": [
      "pointer",
      {
        "struct": [
          "f32",
          "f32",
          "f32",
          "f32"
        ]
      }
    ],
    "result": "void"
  },
  "nvgFillPaint": {
    "parameters": [
      "pointer",
      {
        "struct": [
          "f32",
          "f32",
          "f32",
          "f32",
          "f32",
          "f32",
          "f32",
          "f32",
          "f32",
          "f32",
          {
            "struct": [
              "f32",
              "f32",
              "f32",
              "f32"
            ]
          },
          {
            "struct": [
              "f32",
              "f32",
              "f32",
              "f32"
            ]
          },
          "i32"
        ]
      }
    ],
    "result": "void"
  },
  "nvgMiterLimit": {
    "parameters": [
      "pointer",
      "f32"
    ],
    "result": "void"
  },
  "nvgStrokeWidth": {
    "parameters": [
      "pointer",
      "f32"
    ],
    "result": "void"
  },
  "nvgLineCap": {
    "parameters": [
      "pointer",
      "i32"
    ],
    "result": "void"
  },
  "nvgLineJoin": {
    "parameters": [
      "pointer",
      "i32"
    ],
    "result": "void"
  },
  "nvgGlobalAlpha": {
    "parameters": [
      "pointer",
      "f32"
    ],
    "result": "void"
  },
  "nvgResetTransform": {
    "parameters": [
      "pointer"
    ],
    "result": "void"
  },
  "nvgTransform": {
    "parameters": [
      "pointer",
      "f32",
      "f32",
      "f32",
      "f32",
      "f32",
      "f32"
    ],
    "result": "void"
  },
  "nvgTranslate": {
    "parameters": [
      "pointer",
      "f32",
      "f32"
    ],
    "result": "void"
  },
  "nvgRotate": {
    "parameters": [
      "pointer",
      "f32"
    ],
    "result": "void"
  },
  "nvgSkewX": {
    "parameters": [
      "pointer",
      "f32"
    ],
    "result": "void"
  },
  "nvgSkewY": {
    "parameters": [
      "pointer",
      "f32"
    ],
    "result": "void"
  },
  "nvgScale": {
    "parameters": [
      "pointer",
      "f32",
      "f32"
    ],
    "result": "void"
  },
  "nvgCurrentTransform": {
    "parameters": [
      "pointer",
      "pointer"
    ],
    "result": "void"
  },
  "nvgTransformIdentity": {
    "parameters": [
      "pointer"
    ],
    "result": "void"
  },
  "nvgTransformTranslate": {
    "parameters": [
      "pointer",
      "f32",
      "f32"
    ],
    "result": "void"
  },
  "nvgTransformScale": {
    "parameters": [
      "pointer",
      "f32",
      "f32"
    ],
    "result": "void"
  },
  "nvgTransformRotate": {
    "parameters": [
      "pointer",
      "f32"
    ],
    "result": "void"
  },
  "nvgTransformSkewX": {
    "parameters": [
      "pointer",
      "f32"
    ],
    "result": "void"
  },
  "nvgTransformSkewY": {
    "parameters": [
      "pointer",
      "f32"
    ],
    "result": "void"
  },
  "nvgTransformMultiply": {
    "parameters": [
      "pointer",
      "pointer"
    ],
    "result": "void"
  },
  "nvgTransformPremultiply": {
    "parameters": [
      "pointer",
      "pointer"
    ],
    "result": "void"
  },
  "nvgTransformInverse": {
    "parameters": [
      "pointer",
      "pointer"
    ],
    "result": "i32"
  },
  "nvgTransformPoint": {
    "parameters": [
      "pointer",
      "pointer",
      "pointer",
      "f32",
      "f32"
    ],
    "result": "void"
  },
  "nvgDegToRad": {
    "parameters": [
      "f32"
    ],
    "result": "f32"
  },
  "nvgRadToDeg": {
    "parameters": [
      "f32"
    ],
    "result": "f32"
  },
  "nvgCreateImageRGBA": {
    "parameters": [
      "pointer",
      "i32",
      "i32",
      "i32",
      "pointer"
    ],
    "result": "i32"
  },
  "nvgUpdateImage": {
    "parameters": [
      "pointer",
      "i32",
      "pointer"
    ],
    "result": "void"
  },
  "nvgImageSize": {
    "parameters": [
      "pointer",
      "i32",
      "pointer",
      "pointer"
    ],
    "result": "void"
  },
  "nvgDeleteImage": {
    "parameters": [
      "pointer",
      "i32"
    ],
    "result": "void"
  },
  "nvgLinearGradient": {
    "parameters": [
      "pointer",
      "f32",
      "f32",
      "f32",
      "f32",
      {
        "struct": [
          "f32",
          "f32",
          "f32",
          "f32"
        ]
      },
      {
        "struct": [
          "f32",
          "f32",
          "f32",
          "f32"
        ]
      }
    ],
    "result": {
      "struct": [
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        {
          "struct": [
            "f32",
            "f32",
            "f32",
            "f32"
          ]
        },
        {
          "struct": [
            "f32",
            "f32",
            "f32",
            "f32"
          ]
        },
        "i32"
      ]
    }
  },
  "nvgBoxGradient": {
    "parameters": [
      "pointer",
      "f32",
      "f32",
      "f32",
      "f32",
      "f32",
      "f32",
      {
        "struct": [
          "f32",
          "f32",
          "f32",
          "f32"
        ]
      },
      {
        "struct": [
          "f32",
          "f32",
          "f32",
          "f32"
        ]
      }
    ],
    "result": {
      "struct": [
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        {
          "struct": [
            "f32",
            "f32",
            "f32",
            "f32"
          ]
        },
        {
          "struct": [
            "f32",
            "f32",
            "f32",
            "f32"
          ]
        },
        "i32"
      ]
    }
  },
  "nvgRadialGradient": {
    "parameters": [
      "pointer",
      "f32",
      "f32",
      "f32",
      "f32",
      {
        "struct": [
          "f32",
          "f32",
          "f32",
          "f32"
        ]
      },
      {
        "struct": [
          "f32",
          "f32",
          "f32",
          "f32"
        ]
      }
    ],
    "result": {
      "struct": [
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        {
          "struct": [
            "f32",
            "f32",
            "f32",
            "f32"
          ]
        },
        {
          "struct": [
            "f32",
            "f32",
            "f32",
            "f32"
          ]
        },
        "i32"
      ]
    }
  },
  "nvgImagePattern": {
    "parameters": [
      "pointer",
      "f32",
      "f32",
      "f32",
      "f32",
      "f32",
      "i32",
      "f32"
    ],
    "result": {
      "struct": [
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        "f32",
        {
          "struct": [
            "f32",
            "f32",
            "f32",
            "f32"
          ]
        },
        {
          "struct": [
            "f32",
            "f32",
            "f32",
            "f32"
          ]
        },
        "i32"
      ]
    }
  },
  "nvgScissor": {
    "parameters": [
      "pointer",
      "f32",
      "f32",
      "f32",
      "f32"
    ],
    "result": "void"
  },
  "nvgIntersectScissor": {
    "parameters": [
      "pointer",
      "f32",
      "f32",
      "f32",
      "f32"
    ],
    "result": "void"
  },
  "nvgResetScissor": {
    "parameters": [
      "pointer"
    ],
    "result": "void"
  },
  "nvgBeginPath": {
    "parameters": [
      "pointer"
    ],
    "result": "void"
  },
  "nvgMoveTo": {
    "parameters": [
      "pointer",
      "f32",
      "f32"
    ],
    "result": "void"
  },
  "nvgLineTo": {
    "parameters": [
      "pointer",
      "f32",
      "f32"
    ],
    "result": "void"
  },
  "nvgBezierTo": {
    "parameters": [
      "pointer",
      "f32",
      "f32",
      "f32",
      "f32",
      "f32",
      "f32"
    ],
    "result": "void"
  },
  "nvgQuadTo": {
    "parameters": [
      "pointer",
      "f32",
      "f32",
      "f32",
      "f32"
    ],
    "result": "void"
  },
  "nvgArcTo": {
    "parameters": [
      "pointer",
      "f32",
      "f32",
      "f32",
      "f32",
      "f32"
    ],
    "result": "void"
  },
  "nvgClosePath": {
    "parameters": [
      "pointer"
    ],
    "result": "void"
  },
  "nvgPathWinding": {
    "parameters": [
      "pointer",
      "i32"
    ],
    "result": "void"
  },
  "nvgArc": {
    "parameters": [
      "pointer",
      "f32",
      "f32",
      "f32",
      "f32",
      "f32",
      "i32"
    ],
    "result": "void"
  },
  "nvgRect": {
    "parameters": [
      "pointer",
      "f32",
      "f32",
      "f32",
      "f32"
    ],
    "result": "void"
  },
  "nvgRoundedRect": {
    "parameters": [
      "pointer",
      "f32",
      "f32",
      "f32",
      "f32",
      "f32"
    ],
    "result": "void"
  },
  "nvgRoundedRectVarying": {
    "parameters": [
      "pointer",
      "f32",
      "f32",
      "f32",
      "f32",
      "f32",
      "f32",
      "f32",
      "f32"
    ],
    "result": "void"
  },
  "nvgEllipse": {
    "parameters": [
      "pointer",
      "f32",
      "f32",
      "f32",
      "f32"
    ],
    "result": "void"
  },
  "nvgCircle": {
    "parameters": [
      "pointer",
      "f32",
      "f32",
      "f32"
    ],
    "result": "void"
  },
  "nvgFill": {
    "parameters": [
      "pointer"
    ],
    "result": "void"
  },
  "nvgStroke": {
    "parameters": [
      "pointer"
    ],
    "result": "void"
  },
  "nvgCreateFont": {
    "parameters": [
      "pointer",
      "buffer",
      "buffer"
    ],
    "result": "i32"
  },
  "nvgCreateFontAtIndex": {
    "parameters": [
      "pointer",
      "buffer",
      "buffer",
      "i32"
    ],
    "result": "i32"
  },
  "nvgCreateFontMem": {
    "parameters": [
      "pointer",
      "buffer",
      "pointer",
      "i32",
      "i32"
    ],
    "result": "i32"
  },
  "nvgCreateFontMemAtIndex": {
    "parameters": [
      "pointer",
      "buffer",
      "pointer",
      "i32",
      "i32",
      "i32"
    ],
    "result": "i32"
  },
  "nvgFindFont": {
    "parameters": [
      "pointer",
      "buffer"
    ],
    "result": "i32"
  },
  "nvgAddFallbackFontId": {
    "parameters": [
      "pointer",
      "i32",
      "i32"
    ],
    "result": "i32"
  },
  "nvgAddFallbackFont": {
    "parameters": [
      "pointer",
      "buffer",
      "buffer"
    ],
    "result": "i32"
  },
  "nvgResetFallbackFontsId": {
    "parameters": [
      "pointer",
      "i32"
    ],
    "result": "void"
  },
  "nvgResetFallbackFonts": {
    "parameters": [
      "pointer",
      "buffer"
    ],
    "result": "void"
  },
  "nvgFontSize": {
    "parameters": [
      "pointer",
      "f32"
    ],
    "result": "void"
  },
  "nvgFontBlur": {
    "parameters": [
      "pointer",
      "f32"
    ],
    "result": "void"
  },
  "nvgTextLetterSpacing": {
    "parameters": [
      "pointer",
      "f32"
    ],
    "result": "void"
  },
  "nvgTextLineHeight": {
    "parameters": [
      "pointer",
      "f32"
    ],
    "result": "void"
  },
  "nvgTextAlign": {
    "parameters": [
      "pointer",
      "i32"
    ],
    "result": "void"
  },
  "nvgFontFaceId": {
    "parameters": [
      "pointer",
      "i32"
    ],
    "result": "void"
  },
  "nvgFontFace": {
    "parameters": [
      "pointer",
      "buffer"
    ],
    "result": "void"
  },
  "nvgText": {
    "parameters": [
      "pointer",
      "f32",
      "f32",
      "buffer",
      "buffer"
    ],
    "result": "f32"
  },
  "nvgTextBox": {
    "parameters": [
      "pointer",
      "f32",
      "f32",
      "f32",
      "buffer",
      "buffer"
    ],
    "result": "void"
  },
  "nvgTextBounds": {
    "parameters": [
      "pointer",
      "f32",
      "f32",
      "buffer",
      "buffer",
      "pointer"
    ],
    "result": "f32"
  },
  "nvgTextBoxBounds": {
    "parameters": [
      "pointer",
      "f32",
      "f32",
      "f32",
      "buffer",
      "buffer",
      "pointer"
    ],
    "result": "void"
  },
  "nvgTextGlyphPositions": {
    "parameters": [
      "pointer",
      "f32",
      "f32",
      "buffer",
      "buffer",
      "pointer",
      "i32"
    ],
    "result": "i32"
  },
  "nvgTextMetrics": {
    "parameters": [
      "pointer",
      "pointer",
      "pointer",
      "pointer"
    ],
    "result": "void"
  },
  "nvgTextBreakLines": {
    "parameters": [
      "pointer",
      "buffer",
      "buffer",
      "f32",
      "pointer",
      "i32"
    ],
    "result": "i32"
  },
  "nvgCreateInternal": {
    "parameters": [
      "pointer"
    ],
    "result": "pointer"
  },
  "nvgDeleteInternal": {
    "parameters": [
      "pointer"
    ],
    "result": "void"
  },
  "nvgInternalParams": {
    "parameters": [
      "pointer"
    ],
    "result": "pointer"
  },
  "nvgDebugDumpPathCache": {
    "parameters": [
      "pointer"
    ],
    "result": "void"
  }
} as const;