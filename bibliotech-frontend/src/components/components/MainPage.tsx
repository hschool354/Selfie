import React, { Suspense } from 'react';
import EA from './EA';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export const MainPage: React.FC = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 5], fov: 50, near: 0.1, far: 1000 }} // Tinh chỉnh camera
      style={{ background: 'transparent' }} 
    >
      <Suspense fallback={null}>
        {/* Đảm bảo EA nằm ở trung tâm */}
        <group position={[0, 0, 0]}>
          <EA />
        </group>
      </Suspense>
      {/* Thêm ánh sáng để đảm bảo đối tượng 3D hiển thị rõ */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>
  );
};