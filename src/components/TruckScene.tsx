import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef } from "react";
import * as THREE from "three";

// Cloud Animation Component
function Clouds() {
  const cloudRef = useRef<THREE.Mesh>(null!);

  // Animation to move clouds from left to right
  useFrame(() => {
    if (cloudRef.current) {
      cloudRef.current.position.x += 0.02; // Adjust speed by changing the value
      if (cloudRef.current.position.x > 15) {
        cloudRef.current.position.x = -15; // Reset position after crossing screen
      }
    }
  });

  return (
    <mesh ref={cloudRef} position={[-9, 8, -4]}>
      {/* Cloud geometry (sphere with opacity for softness) */}
      <sphereGeometry args={[5, 32, 32]} />
      <meshBasicMaterial color={"#ffffff"} opacity={0.6} transparent={true} />
    </mesh>
  );
}

// Sun Placement (top-left)
function GlowingSun() {
  return (
    <mesh position={[-11, 6, -8]} rotation={[Math.PI / 3, 0, 0]}>
      {/* Sun geometry (simple sphere for a glowing effect) */}
      <sphereGeometry args={[3, 32, 32]} />
      <meshBasicMaterial color={"#FFD700"} />
    </mesh>
  );
}

export default function TruckScene() {
  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none" style={{ height: '100vh' }}>
      <Canvas camera={{ position: [0, 3, 12], fov: 50 }}>
        {/* Ambient light for general lighting */}
        <ambientLight intensity={0.6} />
        {/* Directional light for shadows and more dramatic lighting */}
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* OrbitControls allow you to move and zoom around the scene */}
        <OrbitControls enableZoom={false} />
        
        {/* Clouds - Adjust cloud speed by modifying the `position.x` change value */}
        <Clouds />

        {/* Glowing Sun - Positioned on the top-left, adjusted for camera view */}
        <GlowingSun />

        {/* Post-processing Bloom effect for a glowing effect */}
        <EffectComposer>
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.7} intensity={3} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
