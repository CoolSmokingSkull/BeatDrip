// modules/utils.js

export function initializeBackgroundAnimation() {
    const canvas = document.getElementById('background-canvas');
    const gl = canvas.getContext('webgl');
  
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
  
    // Set canvas size
    resizeCanvasToDisplaySize(gl.canvas);
  
    // Vertex shader
    const vertexShaderSource = `
      attribute vec4 a_position;
      void main() {
        gl_Position = a_position;
      }
    `;
  
    // Fragment shader (Simplex noise shader for lava lamp effect)
    const fragmentShaderSource = `
      precision mediump float;
      uniform float u_time;
      void main() {
        vec2 uv = gl_FragCoord.xy / vec2(${gl.canvas.width.toFixed(1)}, ${gl.canvas.height.toFixed(1)});
        float color = 0.5 + 0.5 * sin(uv.x * 10.0 + u_time) * cos(uv.y * 10.0 + u_time);
        gl_FragColor = vec4(vec3(color), 1.0);
      }
    `;
  
    // Compile shaders and link program
    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
  
    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
  
    // Create buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
    // Set rectangle covering the entire canvas
    const positions = [
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
    function render(time) {
      time *= 0.001; // Convert to seconds
  
      // Resize canvas if necessary
      resizeCanvasToDisplaySize(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
      // Clear canvas
      gl.clear(gl.COLOR_BUFFER_BIT);
  
      // Use program
      gl.useProgram(program);
  
      // Enable attribute
      gl.enableVertexAttribArray(positionLocation);
  
      // Bind position buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
      // Tell attribute how to get data out of positionBuffer
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  
      // Set time uniform
      gl.uniform1f(timeLocation, time);
  
      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, 6);
  
      requestAnimationFrame(render);
    }
  
    requestAnimationFrame(render);
  }
  
  function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
  
    // Check program link status
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program failed to link:', gl.getProgramInfoLog(program));
      return null;
    }
  
    return program;
  }
  
  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
  
    // Check shader compile status
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader failed to compile:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
  
    return shader;
  }
  
  function resizeCanvasToDisplaySize(canvas) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }
  