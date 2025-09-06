# WebGL着色器编程入门

WebGL着色器是运行在GPU上的小程序，用于处理图形渲染的各个阶段。本文将从零开始介绍WebGL着色器编程的基础知识。

## 什么是着色器

着色器（Shader）是一种运行在图形处理单元（GPU）上的程序，主要用于处理图形渲染管线中的特定阶段。在WebGL中，主要有两种类型的着色器：

- **顶点着色器（Vertex Shader）**：处理顶点数据
- **片段着色器（Fragment Shader）**：处理像素颜色

## 顶点着色器

顶点着色器负责处理每个顶点的位置、颜色、纹理坐标等属性：

```glsl
attribute vec4 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_matrix;

varying vec2 v_texCoord;

void main() {
  gl_Position = u_matrix * a_position;
  v_texCoord = a_texCoord;
}
```

## 片段着色器

片段着色器决定每个像素的最终颜色：

```glsl
precision mediump float;

uniform sampler2D u_texture;
varying vec2 v_texCoord;

void main() {
  gl_FragColor = texture2D(u_texture, v_texCoord);
}
```

## GLSL语法基础

GLSL（OpenGL Shading Language）是着色器的编程语言，具有以下特点：

### 数据类型

```glsl
// 标量类型
float a = 1.0;
int b = 1;
bool c = true;

// 向量类型
vec2 position = vec2(1.0, 2.0);
vec3 color = vec3(1.0, 0.0, 0.0);
vec4 vertex = vec4(0.0, 0.0, 0.0, 1.0);

// 矩阵类型
mat3 transform3 = mat3(1.0);
mat4 transform4 = mat4(1.0);
```

### 限定符

```glsl
// attribute: 顶点着色器输入
attribute vec4 a_position;

// uniform: 全局常量
uniform mat4 u_matrix;

// varying: 顶点着色器到片段着色器的数据传递
varying vec2 v_texCoord;
```

## 创建着色器程序

在JavaScript中创建和使用着色器：

```javascript
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  
  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  
  return program;
}
```

## 实际应用示例

创建一个简单的彩色三角形：

```javascript
// 顶点数据
const vertices = new Float32Array([
  0.0,  0.5, 1.0, 0.0, 0.0,  // 顶点1: 位置 + 颜色
 -0.5, -0.5, 0.0, 1.0, 0.0,  // 顶点2: 位置 + 颜色
  0.5, -0.5, 0.0, 0.0, 1.0   // 顶点3: 位置 + 颜色
]);

// 创建缓冲区
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// 设置属性
const positionLocation = gl.getAttribLocation(program, 'a_position');
const colorLocation = gl.getAttribLocation(program, 'a_color');

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 20, 0);

gl.enableVertexAttribArray(colorLocation);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 20, 8);

// 绘制
gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);
```

## 调试技巧

1. **检查编译错误**：始终检查着色器编译状态
2. **使用简单颜色**：调试时使用固定颜色输出
3. **逐步构建**：从简单效果开始，逐步添加复杂性
4. **工具辅助**：使用WebGL Inspector等调试工具

## 总结

WebGL着色器编程虽然有一定的学习曲线，但掌握基础概念后，就能创造出令人惊艳的视觉效果。关键是要理解GPU的并行处理特性，以及顶点着色器和片段着色器的不同职责。
