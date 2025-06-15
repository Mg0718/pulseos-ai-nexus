
import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, MeshWobbleMaterial, Sphere, Box, Octahedron, Text, Environment } from "@react-three/drei";
import { Mesh, Vector3 } from "three";
import * as THREE from "three";

// Enhanced 3D Icon Component with more complex animations
const AnimatedIcon = ({ 
  position, 
  color, 
  shape = "icosahedron",
  scale = 1 
}: { 
  position: [number, number, number];
  color: string;
  shape?: "icosahedron" | "box" | "octahedron";
  scale?: number;
}) => {
  const meshRef = useRef<Mesh>(null);
  const { viewport } = useThree();
  
  useFrame((state) => {
    if (meshRef.current && meshRef.current.rotation) {
      try {
        const time = state.clock.elapsedTime;
        meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.3;
        meshRef.current.rotation.y = Math.cos(time * 0.3) * 0.4;
        meshRef.current.rotation.z = Math.sin(time * 0.8) * 0.2;
        
        // Pulsing scale animation
        const pulseFactor = 1 + Math.sin(time * 2) * 0.1;
        meshRef.current.scale.setScalar(scale * pulseFactor);
      } catch (error) {
        console.log("Error updating mesh animation:", error);
      }
    }
  });

  const GeometryComponent = useMemo(() => {
    switch (shape) {
      case "box":
        return <boxGeometry args={[1, 1, 1]} />;
      case "octahedron":
        return <octahedronGeometry args={[1]} />;
      default:
        return <icosahedronGeometry args={[1, 2]} />;
    }
  }, [shape]);

  return (
    <Float
      speed={2}
      rotationIntensity={2}
      floatIntensity={3}
      position={position}
    >
      <mesh ref={meshRef}>
        {GeometryComponent}
        <MeshWobbleMaterial 
          color={color} 
          factor={0.8} 
          speed={3}
          roughness={0.1}
          metalness={0.9}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Glowing core */}
      <Sphere args={[0.3]} position={[0, 0, 0]}>
        <meshBasicMaterial 
          color={color} 
          opacity={0.6} 
          transparent 
        />
      </Sphere>

      {/* Orbiting particles */}
      <group>
        {[...Array(3)].map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 3) * Math.PI * 2) * 2,
              Math.sin((i / 3) * Math.PI * 2) * 2,
              0
            ]}
          >
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color={color} />
          </mesh>
        ))}
      </group>
    </Float>
  );
};

// Enhanced floating particles with more sophisticated behavior
const FloatingParticles = () => {
  const particlesRef = useRef<(Mesh | null)[]>([]);
  const { viewport } = useThree();

  useFrame((state) => {
    if (particlesRef.current && Array.isArray(particlesRef.current)) {
      particlesRef.current.forEach((particle, i) => {
        if (particle && particle.position && particle.rotation) {
          try {
            const time = state.clock.elapsedTime;
            const speed = 0.5 + (i % 3) * 0.2;
            
            particle.position.y = Math.sin(time * speed + i) * 2;
            particle.position.x = Math.cos(time * speed * 0.7 + i) * 3;
            particle.position.z = Math.sin(time * speed * 0.5 + i) * 1.5;
            
            particle.rotation.x = time * speed * 0.5;
            particle.rotation.y = time * speed * 0.3;
            particle.rotation.z = time * speed * 0.8;

            // Scale animation
            const scaleFactor = 1 + Math.sin(time * 2 + i) * 0.3;
            particle.scale.setScalar(scaleFactor);
          } catch (error) {
            console.log("Error updating particle:", error);
          }
        }
      });
    }
  });

  return (
    <>
      {[...Array(20)].map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (particlesRef.current) {
              particlesRef.current[i] = el;
            }
          }}
          position={[
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 10,
          ]}
        >
          <sphereGeometry args={[0.03 + Math.random() * 0.05, 8, 8]} />
          <meshBasicMaterial 
            color={`hsl(${250 + Math.random() * 60}, 70%, 70%)`}
            opacity={0.8} 
            transparent 
          />
        </mesh>
      ))}
    </>
  );
};

// Animated background geometry
const BackgroundGeometry = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]}>
      <torusGeometry args={[15, 0.5, 16, 100]} />
      <meshBasicMaterial 
        color="#6F2DBD" 
        opacity={0.05} 
        transparent 
        wireframe 
      />
    </mesh>
  );
};

// Error Boundary Component for Three.js
const ThreeErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<div className="absolute inset-0" />}>
      {children}
    </Suspense>
  );
};

// Enhanced 3D Scene Component
export const ThreeJSScene = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <ThreeErrorBoundary>
        <Canvas 
          camera={{ position: [0, 0, 12], fov: 60 }}
          dpr={[1, 2]}
          onCreated={({ gl }) => {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.25;
          }}
        >
          <Suspense fallback={null}>
            {/* Enhanced lighting setup */}
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#B9FAF8" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#6F2DBD" />
            <pointLight position={[0, 10, -5]} intensity={1.5} color="#A663CC" />
            <spotLight 
              position={[0, 15, 0]} 
              angle={0.4} 
              penumbra={1} 
              intensity={2}
              color="#B298DC"
              castShadow
            />
            
            {/* Environment for reflections */}
            <Environment preset="night" />
            
            {/* Background animated geometry */}
            <BackgroundGeometry />
            
            {/* Enhanced 3D Icons with different shapes */}
            <AnimatedIcon position={[-6, 3, 0]} color="#6F2DBD" shape="icosahedron" scale={1.2} />
            <AnimatedIcon position={[6, -3, 0]} color="#A663CC" shape="box" scale={1} />
            <AnimatedIcon position={[0, 0, -3]} color="#B298DC" shape="octahedron" scale={0.8} />
            <AnimatedIcon position={[-3, -4, 2]} color="#B9FAF8" shape="icosahedron" scale={0.6} />
            <AnimatedIcon position={[4, 4, 1]} color="#6F2DBD" shape="box" scale={0.9} />
            
            {/* Enhanced floating particles */}
            <FloatingParticles />
            
            {/* Smooth orbit controls */}
            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
              autoRotate 
              autoRotateSpeed={0.3}
              dampingFactor={0.05}
              enableDamping
              maxPolarAngle={Math.PI / 1.5}
              minPolarAngle={Math.PI / 3}
            />
          </Suspense>
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
};
