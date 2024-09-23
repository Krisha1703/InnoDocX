import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const PaperAnimation = () => {
  const paperRef = useRef();
  const texture = useLoader(THREE.TextureLoader, '/paper.avif'); // Load paper texture
  const foldSpeed = 1.5; // Speed of the folding/unfolding

  useEffect(() => {
    // Set the initial state of the paper: folded and positioned off-screen
    paperRef.current.position.set(0, 3, 0);
    paperRef.current.rotation.set(Math.PI / 2, 0, 0); // Initially folded up
  }, []);

  // Frame-by-frame animation: Unfold and move the paper
  useFrame((state, delta) => {
    if (paperRef.current.position.y > 0) {
      // Paper slides down into the view
      paperRef.current.position.y -= delta * foldSpeed;
    }

    if (paperRef.current.rotation.x > 0) {
      // Paper unfolds smoothly by decreasing the rotation angle
      paperRef.current.rotation.x -= delta * foldSpeed;
    }

    // Unfolding effect - scale down the width to simulate folding
    if (paperRef.current.scale.y < 1) {
      paperRef.current.scale.y += delta * foldSpeed * 0.5; // Simulate unfolding by scaling the paper height
    }
  });

  return (
    <mesh ref={paperRef} scale={[1, 0, 1]} position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[2, 3, 32, 32]} /> {/* More segments for smooth folding */}
      <meshStandardMaterial map={texture} side={THREE.DoubleSide} /> {/* Apply texture */}
    </mesh>
  );
};

export default PaperAnimation;
