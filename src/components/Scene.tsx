import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { InteractiveModel } from './OrbitingModel'
import newartcube from '../assets/newartcube.glb?url'
import newartcube2 from '../assets/newartcube2.glb?url'

interface SceneProps {
  onCubeClick: (overlayType: string) => void
}

export function Scene({ onCubeClick }: SceneProps) {
  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -5]} intensity={0.6} />
      <pointLight position={[0, 10, 0]} intensity={0.8} />
      <spotLight
        position={[0, 15, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.8}
        castShadow
      />

      {/* Environment for reflections */}
      <Environment preset="sunset" />

      {/* Interactive Models - positioned statically, respond to mouse */}
      <InteractiveModel
        path={newartcube}
        position={[-2.5, 0, 0]}
        name="cube1"
        label="portfolio"
        glowColor={[138, 43, 226]} // Purple for portfolio
        onClick={() => onCubeClick('portfolio')}
      />
      <InteractiveModel
        path={newartcube2}
        position={[2.5, 0, 0]}
        name="cube2"
        label="contact"
        glowColor={[30, 144, 255]} // Blue for contact
        onClick={() => onCubeClick('contact')}
      />

      {/* Camera Controls - more flexible for interaction */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={true}
        minDistance={4}
        maxDistance={15}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
      />
    </Canvas>
  )
}

