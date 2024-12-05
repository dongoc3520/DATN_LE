import React, { useState, useEffect } from "react";
import { Canvas, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei"; // Thêm OrbitControls để xoay hình ảnh 360 độ

const VrImage360 = ({ imageUrl }) => {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const loadTexture = async () => {
      const loadedTexture = await new THREE.TextureLoader().loadAsync(imageUrl);
      setTexture(loadedTexture);
    };

    loadTexture();
  }, [imageUrl]);

  if (!texture) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls /> {/* Điều khiển xoay cho ảnh 360 */}
        {/* Sử dụng SphereGeometry để hiển thị ảnh 360 */}
        <mesh>
          <sphereGeometry args={[500, 60, 40]} />
          <meshBasicMaterial map={texture} side={THREE.BackSide} />
        </mesh>
      </Canvas>
    </div>
  );
};

export default VrImage360;
