import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero3DBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0x86efac, 1);
    dir.position.set(5, 5, 5);
    scene.add(dir);
    const point = new THREE.PointLight(0x22c55e, 0.5, 20);
    point.position.set(-3, -2, 2);
    scene.add(point);

    // Floating icosahedra
    const shapes: { mesh: THREE.Mesh; speed: number; offset: number }[] = [];
    const shapeConfigs: [THREE.Vector3, string, number, number][] = [
      [new THREE.Vector3(-3.2, 1.2, -1),  '#86EFAC', 0.7, 0.8],
      [new THREE.Vector3(3.5, -0.8, -1.5), '#22C55E', 0.9, 1.1],
      [new THREE.Vector3(-2.5, -1.5, 0),  '#16A34A', 0.5, 1.4],
      [new THREE.Vector3(2.8, 1.5, -2),   '#4ADE80', 0.6, 0.9],
      [new THREE.Vector3(0, 0.3, -3),     '#15803D', 1.2, 0.7],
    ];

    shapeConfigs.forEach(([pos, color, scale, speed]) => {
      const geo = new THREE.IcosahedronGeometry(scale, 1);
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.4,
        metalness: 0.15,
        transparent: true,
        opacity: 0.82,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      scene.add(mesh);
      shapes.push({ mesh, speed, offset: Math.random() * Math.PI * 2 });
    });

    // Particles
    const count = 200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 7;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ size: 0.04, color: '#16A34A', transparent: true, opacity: 0.55 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Resize
    const handleResize = () => {
      if (!el) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation
    let animId: number;
    const clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      shapes.forEach(({ mesh, speed, offset }) => {
        mesh.rotation.x += 0.004 * speed;
        mesh.rotation.y += 0.006 * speed;
        mesh.position.y += Math.sin(t * speed + offset) * 0.002;
      });
      particles.rotation.y = t * 0.04;
      particles.rotation.x = Math.sin(t * 0.1) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  );
}

