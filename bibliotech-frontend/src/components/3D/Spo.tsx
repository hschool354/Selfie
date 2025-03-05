import React from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface SpoProps {
  position?: [number, number, number];
  scale?: [number, number, number];
}

export const Spo: React.FC<SpoProps> = (props) => {
  const { nodes, materials } = useGLTF('/book.glb') as any; // Tạm dùng any, sẽ giải thích bên dưới

  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.405}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <group rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Cover_Book_Cover_0.geometry}
              material={materials.Book_Cover}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Paper_Paper_0.geometry}
              material={materials.Paper}
              position={[0, 0, 0.015]}
            />
          </group>
          <group position={[7.48, 13.659, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Letters_Material001_0.geometry}
              material={materials['Material.001']}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Letters_Material001_0_1.geometry}
              material={materials['Material.001']}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Letters_Material001_0_2.geometry}
              material={materials['Material.001']}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Letters_Material001_0_3.geometry}
              material={materials['Material.001']}
            />
          </group>
        </group>
      </group>
    </group>
  );
};

useGLTF.preload('/book.glb');