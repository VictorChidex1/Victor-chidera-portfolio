import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Utility to generate random points in a sphere
const randomInSphere = (count: number, radius: number) => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = Math.cbrt(Math.random()) * radius;
    const sinPhi = Math.sin(phi);
    
    positions[i * 3] = r * sinPhi * Math.cos(theta);
    positions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
};

const ParticleField = () => {
  const ref = useRef<THREE.Points>(null);
  
  // Create 5000 particles within a radius of 1.5
  const sphere = useMemo(() => randomInSphere(5000, 1.5), []);
  
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Slow continuous rotation
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;

    // Smoothly interpolate towards the mouse target
    const targetX = (state.pointer.x * Math.PI) / 4;
    const targetY = (state.pointer.y * Math.PI) / 4;
    
    mouse.current.x += (targetX - mouse.current.x) * 0.05;
    mouse.current.y += (targetY - mouse.current.y) * 0.05;
    
    // Apply parallax
    ref.current.rotation.x += mouse.current.y * delta * 5;
    ref.current.rotation.y += mouse.current.x * delta * 5;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#f97316"
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

const StarBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ParticleField />
      </Canvas>
    </div>
  );
};

export default StarBackground;
