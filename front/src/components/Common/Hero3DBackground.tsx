import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function FloatingShape({ position, color, scale = 1, speed = 1 }: { position: [number, number, number]; color: string; scale?: number; speed?: number }) {
  return (
    <Float speed={speed} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          distort={0.35}
          speed={1.5}
          roughness={0.4}
          metalness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const count = 180;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.04;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#16A34A" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export default function Hero3DBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, -2, 2]} intensity={0.3} color="#86EFAC" />

      <ParticleField />

      <FloatingShape position={[-3.2, 1.2, -1]} color="#86EFAC" scale={0.7} speed={0.8} />
      <FloatingShape position={[3.5, -0.8, -1.5]} color="#22C55E" scale={0.9} speed={1.1} />
      <FloatingShape position={[-2.5, -1.5, 0]} color="#16A34A" scale={0.5} speed={1.4} />
      <FloatingShape position={[2.8, 1.5, -2]} color="#4ADE80" scale={0.6} speed={0.9} />
      <FloatingShape position={[0, 0.3, -3]} color="#15803D" scale={1.2} speed={0.7} />
    </Canvas>
  );
}
