#pragma once

#ifdef _WIN32
#define CN_EXPORT extern "C" __declspec(dllexport)
#else
#define CN_EXPORT extern "C"
#endif
