cmake_minimum_required(VERSION 3.29)
project(untitled)

set(CMAKE_CXX_STANDARD 20)

# Find OpenGL
find_package(OpenGL REQUIRED)

# Include directories
include_directories(include)

# Add glad
add_library(glad STATIC src/glad.c)
target_include_directories(glad PUBLIC include)

# Add the executable
add_executable(untitled src/main.cpp)

# Link libraries
target_link_libraries(untitled PRIVATE OpenGL::GL glfw glad)

