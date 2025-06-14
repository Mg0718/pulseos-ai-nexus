
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, MeshWobbleMaterial } from "@react-three/drei";
import { Brain, Users, BarChart3 } from "lucide-react";

// 3D Icon Component
const ThreeJSIcon = ({ icon: IconComponent, position, color }: { icon: any, position: [number, number, number], color: string }) => {
  return (
    <Float
      speed={2}
      rotationIntensity={1}
      floatIntensity={2}
      position={position}
    >
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <MeshWobbleMaterial color={color} factor={0.6} speed={2} />
      </mesh>
    </Float>
  );
};

// 3D Scene Component
export const ThreeJSScene = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <ThreeJSIcon icon={Brain} position={[-4, 2, 0]} color="#6F2DBD" />
          <ThreeJSIcon icon={Users} position={[4, -2, 0]} color="#A663CC" />
          <ThreeJSIcon icon={BarChart3} position={[0, 0, -2]} color="#B298DC" />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
};
