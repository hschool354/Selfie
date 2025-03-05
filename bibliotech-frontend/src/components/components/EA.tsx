import React, { useRef, useState } from 'react';
import { PresentationControls, Shadow, CameraControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Spo } from '../3D/Spo';

const Ea: React.FC = () => {
  const objectRef = useRef<THREE.Group>(null);
  const cameraControlsRef = useRef<CameraControls>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  useFrame(({ clock }) => {
    if (autoRotate && cameraControlsRef.current) {
      const elapsedTime = clock.getElapsedTime();
      const radius = 5;
      const speed = 0.3;
      const targetX = radius * Math.sin(elapsedTime * speed);
      const targetZ = radius * Math.cos(elapsedTime * speed);
      cameraControlsRef.current.setLookAt(targetX, 2, targetZ, 0, 0, 0, true);
    }
  });

  const handlePointerEnter = () => setAutoRotate(false);
  const handlePointerLeave = () => setAutoRotate(true);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <PresentationControls
        global
        config={{ mass: 2, tension: 500 }}
        snap={{ mass: 4, tension: 300 }}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        <group ref={objectRef} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}>
          <Spo position={[0, 0, 0]} scale={[1, 1, 1]} />
          <Shadow position={[0, -0.5, 0]} scale={[1, 1, 1]} opacity={0.3} />
        </group>
      </PresentationControls>
      <CameraControls ref={cameraControlsRef} />
    </>
  );
};

export default Ea;