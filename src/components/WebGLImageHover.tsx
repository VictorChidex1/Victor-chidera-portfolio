import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uHoverState;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  // Distance from current pixel to mouse
  float dist = distance(uv, uMouse);
  
  // Ripple/bulge math
  float bulge = sin(dist * 10.0 - uHoverState * 5.0) * 0.02 * uHoverState;
  vec2 distortedUv = uv + (uv - uMouse) * bulge * exp(-dist * 5.0);
  
  // RGB shift
  float shift = 0.03 * uHoverState * exp(-dist * 4.0);
  
  float r = texture2D(uTexture, distortedUv + vec2(shift, 0.0)).r;
  float g = texture2D(uTexture, distortedUv).g;
  float b = texture2D(uTexture, distortedUv - vec2(shift, 0.0)).b;
  
  gl_FragColor = vec4(r, g, b, 1.0);
}
`;

const ImagePlane = ({ src }: { src: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const texture = useTexture(src);
  
  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uHoverState: { value: 0.0 }
  }), [texture]);

  const targetHoverState = useRef(0.0);

  useFrame((state, delta) => {
    if (materialRef.current) {
      // Smoothly interpolate mouse
      // Normalize pointer from [-1, 1] to [0, 1]
      const targetX = (state.pointer.x + 1.0) / 2.0;
      const targetY = (state.pointer.y + 1.0) / 2.0;
      
      const uMouse = materialRef.current.uniforms.uMouse.value;
      uMouse.x += (targetX - uMouse.x) * 0.1;
      uMouse.y += (targetY - uMouse.y) * 0.1;
      
      // Smoothly interpolate hover state
      const currentHover = materialRef.current.uniforms.uHoverState.value;
      materialRef.current.uniforms.uHoverState.value = THREE.MathUtils.damp(
        currentHover,
        targetHoverState.current,
        5.0, // speed
        delta
      );
    }
  });

  const handlePointerOver = () => {
    targetHoverState.current = 1.0;
  };

  const handlePointerOut = () => {
    targetHoverState.current = 0.0;
  };

  return (
    <mesh
      ref={meshRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

interface WebGLImageHoverProps {
  src: string;
  className?: string;
  alt?: string;
}

const WebGLImageHover = ({ src, className, alt }: WebGLImageHoverProps) => {
  return (
    <div className={`relative overflow-hidden w-full h-full ${className || ''}`}>
      {/* Fallback image */}
      <img src={src} alt={alt || ''} className="absolute inset-0 w-full h-full object-cover opacity-0" />
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], left: -0.5, right: 0.5, top: 0.5, bottom: -0.5, zoom: 1 }}
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        gl={{ alpha: true }}
      >
        <React.Suspense fallback={null}>
          <ImagePlane src={src} />
        </React.Suspense>
      </Canvas>
    </div>
  );
};

export default WebGLImageHover;
