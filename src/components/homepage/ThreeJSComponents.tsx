
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, MeshWobbleMaterial, Sphere } from "@react-three/drei";
import { Mesh } from "three";

// Enhanced 3D Icon Component with rotation and floating
const ThreeJSIcon = ({ position, color }: { position: [number, number, number], color: string }) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={1}
      floatIntensity={2}
      position={position}
    >
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshWobbleMaterial 
          color={color} 
          factor={0.6} 
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      
      {/* Glowing sphere inside */}
      <Sphere args={[0.3]} position={[0, 0, 0]}>
        <meshBasicMaterial color={color} opacity={0.8} transparent />
      </Sphere>
    </Float>
  );
};

// Floating particles around the icons
const FloatingParticles = () => {
  const particlesRef = useRef<Mesh[]>([]);
  
  useFrame((state) => {
    particlesRef.current.forEach((particle, i) => {
      if (particle) {
        particle.position.y = Math.sin(state.clock.elapsedTime + i) * 0.5;
        particle.position.x = Math.cos(state.clock.elapsedTime * 0.5 + i) * 0.3;
        particle.rotation.x = state.clock.elapsedTime * 0.5;
        particle.rotation.y = state.clock.elapsedTime * 0.3;
      }
    });
  });

  return (
    <>
      {[...Array(12)].map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) particlesRef.current[i] = el;
          }}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#ffffff" opacity={0.6} transparent />
        </mesh>
      ))}
    </>
  );
};

// 3D Scene Component with enhanced lighting and effects
export const ThreeJSScene = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {/* Enhanced lighting setup */}
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#B9FAF8" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6F2DBD" />
          <spotLight 
            position={[0, 10, 0]} 
            angle={0.3} 
            penumbra={1} 
            intensity={1}
            color="#A663CC"
          />
          
          {/* 3D Icons */}
          <ThreeJSIcon position={[-4, 2, 0]} color="#6F2DBD" />
          <ThreeJSIcon position={[4, -2, 0]} color="#A663CC" />
          <ThreeJSIcon position={[0, 0, -2]} color="#B298DC" />
          
          {/* Floating particles */}
          <FloatingParticles />
          
          {/* Orbit controls with smooth damping */}
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.5}
            dampingFactor={0.1}
            enableDamping
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
