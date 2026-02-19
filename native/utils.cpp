#include <algorithm>
#include <stdexcept>
#include <string>

// Local headers
#include "utils.h"

NVGcolor HexToNVGColor(const char* hexColor) {
  std::string hex = hexColor;

  if (!hex.empty() && hex[0] == '#') {
    hex = hex.substr(1);
  }

  std::transform(hex.begin(), hex.end(), hex.begin(), ::tolower);

  // Validate length
  if (hex.length() != 3 && hex.length() != 4 && hex.length() != 6 &&
      hex.length() != 8) {
    throw std::invalid_argument("Invalid hex color format");
  }

  // Validate hex characters
  for (char c : hex) {
    if (!((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f'))) {
      throw std::invalid_argument("Invalid hex characters");
    }
  }

  // Expand short format to long format
  if (hex.length() == 3 || hex.length() == 4) {
    std::string expanded;
    for (char c : hex) {
      expanded += c;
      expanded += c;
    }
    hex = expanded;
  }

  uint8_t r = static_cast<uint8_t>(std::stoi(hex.substr(0, 2), nullptr, 16));
  uint8_t g = static_cast<uint8_t>(std::stoi(hex.substr(2, 2), nullptr, 16));
  uint8_t b = static_cast<uint8_t>(std::stoi(hex.substr(4, 2), nullptr, 16));
  uint8_t a = 255.0F;

  if (hex.length() == 8) {
    a = static_cast<uint8_t>(std::stoi(hex.substr(6, 2), nullptr, 16));
  }

  return nvgRGBA(r, g, b, a);
}
