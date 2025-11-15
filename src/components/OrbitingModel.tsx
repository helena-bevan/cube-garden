import { useRef, useState, useEffect } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useGLTF, Html } from '@react-three/drei'
import { Group, SpotLight, PointLight, Mesh, BufferGeometry, BufferAttribute } from 'three'

interface InteractiveModelProps {
  path: string
  position: [number, number, number]
  name?: string
  onClick?: () => void
  label?: string
  glowColor?: [number, number, number] // RGB color for glow
}

export function InteractiveModel({
  path,
  position,
  onClick,
  label,
  glowColor = [138, 43, 226], // Default purple
}: InteractiveModelProps) {
  const { scene } = useGLTF(path)
  const groupRef = useRef<Group>(null)
  const spotLightRef = useRef<SpotLight>(null)
  const pointLightRef = useRef<PointLight>(null)
  const glowIntensityRef = useRef(0)

  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const previousMouse = useRef({ x: 0, y: 0 })
  const rotationRef = useRef({ x: 0, y: 0 }) // Store current rotation
  const dragDistance = useRef(0) // Track how far the mouse moved during drag

  // Clone the scene to avoid mutating the original
  const clonedScene = scene.clone()

  // Scale the object to half its original size
  clonedScene.scale.set(0.5, 0.5, 0.5)

  // Smooth geometry to create rounded, organic edges
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof Mesh && child.geometry instanceof BufferGeometry) {
        const geometry = child.geometry
        
        // Compute smooth vertex normals for more rounded, organic edges
        // This creates a smoother appearance by blending normals
        geometry.computeVertexNormals()
        
        // Apply additional smoothing by modifying normals to be more rounded
        if (geometry.attributes.normal && geometry.attributes.position) {
          const normals = geometry.attributes.normal.array as Float32Array
          const positions = geometry.attributes.position.array as Float32Array
          const vertexCount = positions.length / 3
          
          // Create smoother normals by blending with neighboring normals
          const smoothNormals = new Float32Array(normals.length)
          const smoothingRadius = 0.05 // Adjust this to control roundness
          
          for (let i = 0; i < vertexCount; i++) {
            const i3 = i * 3
            let nx = normals[i3]
            let ny = normals[i3 + 1]
            let nz = normals[i3 + 2]
            let weight = 1.0
            
            const px = positions[i3]
            const py = positions[i3 + 1]
            const pz = positions[i3 + 2]
            
            // Blend with nearby vertices for smoother transitions
            for (let j = 0; j < vertexCount; j++) {
              if (i === j) continue
              
              const j3 = j * 3
              const dx = positions[j3] - px
              const dy = positions[j3 + 1] - py
              const dz = positions[j3 + 2] - pz
              const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
              
              if (dist < smoothingRadius && dist > 0.001) {
                const w = 1.0 - (dist / smoothingRadius)
                nx += normals[j3] * w
                ny += normals[j3 + 1] * w
                nz += normals[j3 + 2] * w
                weight += w
              }
            }
            
            // Normalize the blended normal
            const len = Math.sqrt(nx * nx + ny * ny + nz * nz)
            if (len > 0.0001) {
              smoothNormals[i3] = nx / weight / len
              smoothNormals[i3 + 1] = ny / weight / len
              smoothNormals[i3 + 2] = nz / weight / len
            } else {
              smoothNormals[i3] = normals[i3]
              smoothNormals[i3 + 1] = normals[i3 + 1]
              smoothNormals[i3 + 2] = normals[i3 + 2]
            }
          }
          
          geometry.setAttribute('normal', new BufferAttribute(smoothNormals, 3))
        }
        
        // Recompute bounding box and sphere
        geometry.computeBoundingBox()
        geometry.computeBoundingSphere()
      }
    })
  }, [clonedScene])

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setIsDragging(true)
    dragDistance.current = 0
    // Store initial mouse position when dragging starts
    previousMouse.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging) return
    e.stopPropagation()

    // Calculate the difference in mouse position (delta)
    const deltaX = e.clientX - previousMouse.current.x
    const deltaY = e.clientY - previousMouse.current.y

    // Track total drag distance
    dragDistance.current += Math.abs(deltaX) + Math.abs(deltaY)

    // Apply rotation based on the delta values
    if (groupRef.current) {
      // Rotate on Y axis (horizontal movement)
      rotationRef.current.y += deltaX * 0.005 // Control sensitivity
      // Rotate on X axis (vertical movement)
      rotationRef.current.x -= deltaY * 0.005 // Control sensitivity

      // Apply the new rotation values to the group
      groupRef.current.rotation.set(rotationRef.current.x, rotationRef.current.y, 0)
    }

    // Update previous mouse position for the next move
    previousMouse.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    
    // Only trigger click if we were actually dragging (pointer was down) and it wasn't a drag
    if (isDragging && dragDistance.current < 5 && onClick) {
      setIsClicked(true)
      onClick()
      // Reset click animation after a short delay
      setTimeout(() => setIsClicked(false), 200)
    }
    
    setIsDragging(false)
    dragDistance.current = 0
  }

  useFrame(() => {
    if (groupRef.current) {
      // Hover effect: scale up slightly
      const targetScale = isHovered ? 1.1 : 1.0
      // Click effect: scale down briefly
      const clickScale = isClicked ? 0.9 : 1.0
      
      const currentScale = groupRef.current.scale.x
      const newScale = currentScale + (targetScale * clickScale - currentScale) * 0.1
      groupRef.current.scale.set(newScale, newScale, newScale)
    }

    // Update spotlight glow intensity smoothly
    const targetIntensity = isHovered ? 4 : 0
    const targetPointIntensity = isHovered ? 2 : 0
    glowIntensityRef.current += (targetIntensity - glowIntensityRef.current) * 0.15
    
    if (spotLightRef.current) {
      spotLightRef.current.intensity = glowIntensityRef.current
      spotLightRef.current.power = glowIntensityRef.current * 2
      // Make spotlight look at the center of the object
      spotLightRef.current.target.position.set(0, 0, 0)
      spotLightRef.current.target.updateMatrixWorld()
    }
    
    if (pointLightRef.current) {
      const currentPointIntensity = pointLightRef.current.intensity
      const newPointIntensity = currentPointIntensity + (targetPointIntensity - currentPointIntensity) * 0.15
      pointLightRef.current.intensity = newPointIntensity
    }
  })

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => {
        // Reset dragging state when pointer leaves, but don't trigger click
        setIsDragging(false)
        dragDistance.current = 0
        setIsHovered(false)
      }}
      onPointerEnter={() => {
        setIsHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setIsHovered(false)
        document.body.style.cursor = 'default'
      }}
    >
      {/* Spotlight for outer glow effect */}
      <spotLight
        ref={spotLightRef}
        position={[0, 4, 3]}
        angle={1.2}
        penumbra={0.8}
        intensity={0}
        distance={15}
        decay={1.5}
        color={`rgb(${glowColor[0]}, ${glowColor[1]}, ${glowColor[2]})`}
        castShadow={false}
      />
      {/* Additional point light for softer outer glow */}
      <pointLight
        ref={pointLightRef}
        position={[0, 0, 0]}
        intensity={0}
        distance={8}
        decay={2}
        color={`rgb(${glowColor[0]}, ${glowColor[1]}, ${glowColor[2]})`}
      />
      <primitive object={clonedScene} />
      {label && isHovered && (
        <Html
          position={[1.5, 0, 0]}
          center
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div
            className="hover-label"
            style={{
              fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
              fontSize: '1.2rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              padding: '0.5rem 1rem',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
            }}
          >
            {label}
          </div>
        </Html>
      )}
    </group>
  )
}
