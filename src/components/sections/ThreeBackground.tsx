import { useEffect, useRef } from 'react';

const vertexShader = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0, 1);
}
`;

const fragmentShader = `
precision mediump float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform sampler2D originalImage;
uniform sampler2D depthImage;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv.y = 1.0 - uv.y;
  
  // Oversized image - scale UV from center
  uv = (uv - 0.5) * 0.9 + 0.5;
  
  // Blur depth map for smoother displacement
  vec2 texelSize = 1.0 / resolution;
  vec4 depth = texture2D(depthImage, uv);
  depth += texture2D(depthImage, uv + vec2(texelSize.x, 0.0));
  depth += texture2D(depthImage, uv + vec2(-texelSize.x, 0.0));
  depth += texture2D(depthImage, uv + vec2(0.0, texelSize.y));
  depth += texture2D(depthImage, uv + vec2(0.0, -texelSize.y));
  depth /= 10.0;
  
  gl_FragColor = texture2D(originalImage, uv + mouse * depth.r * 0.1);
}
`;

class Uniform {
  name: string;
  suffix: string;
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  location: WebGLUniformLocation | null;

  constructor(name: string, suffix: string, program: WebGLProgram, gl: WebGLRenderingContext) {
    this.name = name;
    this.suffix = suffix;
    this.gl = gl;
    this.program = program;
    this.location = gl.getUniformLocation(program, name);
  }

  set(...values: number[]) {
    const method = 'uniform' + this.suffix as keyof WebGLRenderingContext;
    const args = [this.location, ...values];
    (this.gl[method] as any).apply(this.gl, args);
  }
}

class Rect {
  static verts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

  constructor(gl: WebGLRenderingContext) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, Rect.verts, gl.STATIC_DRAW);
  }

  render(gl: WebGLRenderingContext) {
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    mountRef.current.appendChild(canvas);
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const ratio = 1;
    let mouseX = 0, mouseY = 0, mouseTargetX = 0, mouseTargetY = 0;

    const addShader = (source: string, type: number, program: WebGLProgram) => {
      const shader = gl.createShader(type);
      if (!shader) return;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error('Shader compile error: ' + gl.getShaderInfoLog(shader));
      }
      gl.attachShader(program, shader);
    };

    const program = gl.createProgram();
    if (!program) return;

    addShader(vertexShader, gl.VERTEX_SHADER, program);
    addShader(fragmentShader, gl.FRAGMENT_SHADER, program);
    gl.linkProgram(program);
    gl.useProgram(program);

    const uResolution = new Uniform('resolution', '2f', program, gl);
    const uMouse = new Uniform('mouse', '2f', program, gl);

    const billboard = new Rect(gl);
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const loadImage = (url: string): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => resolve(image);
        image.src = url;
      });
    };


    Promise.all([loadImage('/bg.jpg'), loadImage('/bgdepth.png')]).then((images) => {
      
      const textures: WebGLTexture[] = [];
      images.forEach((image) => {
        const texture = gl.createTexture();
        if (!texture) return;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        textures.push(texture);
      });

      const u_image0Location = gl.getUniformLocation(program, 'originalImage');
      const u_image1Location = gl.getUniformLocation(program, 'depthImage');
      gl.uniform1i(u_image0Location, 0);
      gl.uniform1i(u_image1Location, 1);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[0]);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, textures[1]);

      resize();
      render();
    });

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      
      uResolution.set(width, height);
      gl.viewport(0, 0, width * ratio, height * ratio);
    };

    const render = () => {
      mouseX += (mouseTargetX - mouseX) * 0.02;
      mouseY += (mouseTargetY - mouseY) * 0.02;
      uMouse.set(mouseX, mouseY);
      
      billboard.render(gl);
      requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const halfX = window.innerWidth / 2;
      const halfY = window.innerHeight / 2;
      const edgeThreshold = 0.1;
      
      let targetX = (halfX - e.clientX) / halfX;
      let targetY = (halfY - e.clientY) / halfY;
      
      // Reduce displacement near edges
      const distanceFromEdgeX = Math.min(e.clientX / window.innerWidth, (window.innerWidth - e.clientX) / window.innerWidth);
      const distanceFromEdgeY = Math.min(e.clientY / window.innerHeight, (window.innerHeight - e.clientY) / window.innerHeight);
      const edgeFactor = Math.min(distanceFromEdgeX, distanceFromEdgeY) / edgeThreshold;
      const dampening = Math.min(1.0, edgeFactor);
      
      mouseTargetX = targetX * dampening;
      mouseTargetY = targetY * dampening;
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      const maxTilt = 15;
      const y = e.gamma || 0;
      const x = e.beta || 0;
      mouseTargetY = Math.max(-1, Math.min(1, x / maxTilt));
      mouseTargetX = -Math.max(-1, Math.min(1, y / maxTilt));
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleDeviceOrientation);
    window.addEventListener('resize', resize);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      window.removeEventListener('resize', resize);
      mountRef.current?.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
}
