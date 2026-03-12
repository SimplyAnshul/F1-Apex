import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Procedural low-poly F1 car built from Three.js primitives.
 * Each part is a separate mesh so it can be individually clicked/highlighted/exploded.
 */

interface F1PartProps {
  id: string;
  isSelected: boolean;
  isHighlighted: boolean;
  explodedOffset: [number, number, number];
  isExploded: boolean;
  baseColor: string;
  highlightColor: string;
  onClick: (id: string) => void;
  onPointerEnter: (id: string) => void;
  onPointerLeave: () => void;
  children: React.ReactNode;
  position: [number, number, number];
}

const F1Part = ({
  id, isSelected, isHighlighted, explodedOffset, isExploded,
  baseColor, highlightColor, onClick, onPointerEnter, onPointerLeave,
  children, position,
}: F1PartProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetPos = useMemo(() => {
    if (isExploded) {
      return new THREE.Vector3(
        position[0] + explodedOffset[0],
        position[1] + explodedOffset[1],
        position[2] + explodedOffset[2]
      );
    }
    return new THREE.Vector3(...position);
  }, [isExploded, position, explodedOffset]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.lerp(targetPos, 0.06);
    }
  });

  const color = useMemo(() => {
    if (isSelected) return `hsl(${highlightColor})`;
    if (isHighlighted) return `hsl(${highlightColor})`;
    return `hsl(${baseColor})`;
  }, [isSelected, isHighlighted, baseColor, highlightColor]);

  const emissiveIntensity = isSelected ? 0.4 : isHighlighted ? 0.2 : 0;

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(id); }}
      onPointerEnter={(e) => { e.stopPropagation(); onPointerEnter(id); document.body.style.cursor = "pointer"; }}
      onPointerLeave={() => { onPointerLeave(); document.body.style.cursor = "default"; }}
    >
      {/* Wrap children and apply material override */}
      <group>
        {children}
      </group>
      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.55, 32]} />
          <meshBasicMaterial color={`hsl(${highlightColor})`} transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
};

// ─── Individual car parts ───────────────────────────────────────

const PartMaterial = ({ color, emissiveIntensity = 0 }: { color: string; emissiveIntensity?: number }) => (
  <meshStandardMaterial
    color={color}
    emissive={color}
    emissiveIntensity={emissiveIntensity}
    metalness={0.6}
    roughness={0.3}
  />
);

// Car body (monocoque)
const Monocoque = ({ color, ei }: { color: string; ei: number }) => (
  <>
    {/* Main body */}
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1.2, 0.45, 3.8]} />
      <PartMaterial color={color} emissiveIntensity={ei} />
    </mesh>
    {/* Nose cone */}
    <mesh position={[0, -0.05, 2.0]}>
      <boxGeometry args={[0.6, 0.3, 1.0]} />
      <PartMaterial color={color} emissiveIntensity={ei} />
    </mesh>
    {/* Cockpit opening */}
    <mesh position={[0, 0.35, 0.4]}>
      <boxGeometry args={[0.5, 0.15, 0.9]} />
      <meshStandardMaterial color="hsl(0 0% 8%)" metalness={0.8} roughness={0.2} />
    </mesh>
  </>
);

interface CarPartCommonProps {
  color: string;
  ei: number;
}

const FrontWing = ({ color, ei }: CarPartCommonProps) => (
  <>
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[2.0, 0.04, 0.5]} />
      <PartMaterial color={color} emissiveIntensity={ei} />
    </mesh>
    {/* Endplates */}
    <mesh position={[1.0, 0.08, 0]}>
      <boxGeometry args={[0.04, 0.2, 0.5]} />
      <PartMaterial color={color} emissiveIntensity={ei} />
    </mesh>
    <mesh position={[-1.0, 0.08, 0]}>
      <boxGeometry args={[0.04, 0.2, 0.5]} />
      <PartMaterial color={color} emissiveIntensity={ei} />
    </mesh>
  </>
);

const RearWing = ({ color, ei }: CarPartCommonProps) => (
  <>
    {/* Main plane */}
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1.0, 0.04, 0.35]} />
      <PartMaterial color={color} emissiveIntensity={ei} />
    </mesh>
    {/* DRS flap */}
    <mesh position={[0, 0.12, -0.05]}>
      <boxGeometry args={[1.0, 0.04, 0.25]} />
      <PartMaterial color={color} emissiveIntensity={ei} />
    </mesh>
    {/* Endplates */}
    <mesh position={[0.5, 0.06, 0]}>
      <boxGeometry args={[0.04, 0.35, 0.4]} />
      <PartMaterial color={color} emissiveIntensity={ei} />
    </mesh>
    <mesh position={[-0.5, 0.06, 0]}>
      <boxGeometry args={[0.04, 0.35, 0.4]} />
      <PartMaterial color={color} emissiveIntensity={ei} />
    </mesh>
  </>
);

const Halo = ({ color, ei }: CarPartCommonProps) => (
  <>
    {/* Central pillar */}
    <mesh position={[0, 0, 0.15]}>
      <boxGeometry args={[0.08, 0.06, 0.5]} />
      <PartMaterial color={color} emissiveIntensity={ei} />
    </mesh>
    {/* Curved top (approximated) */}
    <mesh position={[0, 0.03, -0.15]}>
      <torusGeometry args={[0.25, 0.03, 8, 16, Math.PI]} />
      <PartMaterial color={color} emissiveIntensity={ei} />
    </mesh>
  </>
);

const Sidepod = ({ color, ei, side }: CarPartCommonProps & { side: 1 | -1 }) => (
  <mesh position={[side * 0.75, 0, 0]}>
    <boxGeometry args={[0.5, 0.4, 1.8]} />
    <PartMaterial color={color} emissiveIntensity={ei} />
  </mesh>
);

const Diffuser = ({ color, ei }: CarPartCommonProps) => (
  <>
    {[...Array(5)].map((_, i) => (
      <mesh key={i} position={[(i - 2) * 0.22, 0, 0]}>
        <boxGeometry args={[0.15, 0.3, 0.4]} />
        <PartMaterial color={color} emissiveIntensity={ei} />
      </mesh>
    ))}
  </>
);

const Floor = ({ color, ei }: CarPartCommonProps) => (
  <mesh position={[0, 0, 0]}>
    <boxGeometry args={[1.8, 0.05, 4.5]} />
    <PartMaterial color={color} emissiveIntensity={ei} />
  </mesh>
);

const Suspension = ({ color, ei }: CarPartCommonProps) => (
  <>
    {/* Front left wishbones */}
    {[-1, 1].map((side) => (
      <group key={side}>
        <mesh position={[side * 0.7, 0, 0.3]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
          <PartMaterial color={color} emissiveIntensity={ei} />
        </mesh>
        <mesh position={[side * 0.7, 0, -0.3]} rotation={[0, 0, Math.PI / 6 * side]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
          <PartMaterial color={color} emissiveIntensity={ei} />
        </mesh>
      </group>
    ))}
  </>
);

const Tyre = ({ color, ei, px, pz }: CarPartCommonProps & { px: number; pz: number }) => (
  <group position={[px, 0, pz]}>
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <torusGeometry args={[0.25, 0.12, 12, 24]} />
      <PartMaterial color={color} emissiveIntensity={ei} />
    </mesh>
    {/* Rim */}
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
      <meshStandardMaterial color="hsl(0 0% 60%)" metalness={0.9} roughness={0.1} />
    </mesh>
  </group>
);

const Engine = ({ color, ei }: CarPartCommonProps) => (
  <>
    {/* Engine block */}
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[0.6, 0.4, 0.8]} />
      <PartMaterial color={color} emissiveIntensity={ei} />
    </mesh>
    {/* Turbo */}
    <mesh position={[0, 0.15, 0.3]}>
      <cylinderGeometry args={[0.1, 0.1, 0.15, 12]} />
      <PartMaterial color={color} emissiveIntensity={ei} />
    </mesh>
  </>
);

const ERS = ({ color, ei }: CarPartCommonProps) => (
  <>
    {/* Battery pack */}
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[0.4, 0.2, 0.5]} />
      <PartMaterial color={color} emissiveIntensity={ei} />
    </mesh>
    {/* MGU-K */}
    <mesh position={[0.25, 0, 0.2]}>
      <cylinderGeometry args={[0.08, 0.08, 0.2, 10]} />
      <PartMaterial color={color} emissiveIntensity={ei} />
    </mesh>
    {/* MGU-H */}
    <mesh position={[-0.25, 0, 0.2]}>
      <cylinderGeometry args={[0.08, 0.08, 0.2, 10]} />
      <PartMaterial color={color} emissiveIntensity={ei} />
    </mesh>
  </>
);

// ─── Main assembled car ─────────────────────────────────────────

interface F1CarModelProps {
  selectedPart: string | null;
  hoveredPart: string | null;
  isExploded: boolean;
  onPartClick: (id: string) => void;
  onPartHover: (id: string) => void;
  onPartLeave: () => void;
  componentData: Record<string, { color: string; highlightColor: string; position: [number, number, number]; explodedOffset: [number, number, number] }>;
}

const F1CarModel = ({
  selectedPart, hoveredPart, isExploded,
  onPartClick, onPartHover, onPartLeave, componentData,
}: F1CarModelProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Slow auto-rotation when nothing is selected
  useFrame((_, delta) => {
    if (groupRef.current && !selectedPart) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  const partProps = (id: string) => {
    const data = componentData[id];
    const isSelected = selectedPart === id;
    const isHighlighted = hoveredPart === id;
    return {
      color: isSelected || isHighlighted ? `hsl(${data.highlightColor})` : `hsl(${data.color})`,
      ei: isSelected ? 0.4 : isHighlighted ? 0.2 : 0.05,
    };
  };

  const wrapPart = (id: string, children: React.ReactNode) => {
    const data = componentData[id];
    if (!data) return null;
    return (
      <F1Part
        key={id}
        id={id}
        isSelected={selectedPart === id}
        isHighlighted={hoveredPart === id}
        isExploded={isExploded}
        explodedOffset={data.explodedOffset}
        baseColor={data.color}
        highlightColor={data.highlightColor}
        onClick={onPartClick}
        onPointerEnter={onPartHover}
        onPointerLeave={onPartLeave}
        position={data.position}
      >
        {children}
      </F1Part>
    );
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Non-interactive body */}
      <group>
        <Monocoque color="hsl(0 0% 15%)" ei={0.02} />
      </group>

      {wrapPart("front-wing", <FrontWing {...partProps("front-wing")} />)}
      {wrapPart("rear-wing", <RearWing {...partProps("rear-wing")} />)}
      {wrapPart("halo", <Halo {...partProps("halo")} />)}
      {wrapPart("sidepods", <>
        <Sidepod {...partProps("sidepods")} side={1} />
        <Sidepod {...partProps("sidepods")} side={-1} />
      </>)}
      {wrapPart("diffuser", <Diffuser {...partProps("diffuser")} />)}
      {wrapPart("floor", <Floor {...partProps("floor")} />)}
      {wrapPart("suspension", <Suspension {...partProps("suspension")} />)}
      {wrapPart("tyres", <>
        <Tyre {...partProps("tyres")} px={0.85} pz={1.5} />
        <Tyre {...partProps("tyres")} px={-0.85} pz={1.5} />
        <Tyre {...partProps("tyres")} px={0.85} pz={-1.3} />
        <Tyre {...partProps("tyres")} px={-0.85} pz={-1.3} />
      </>)}
      {wrapPart("engine", <Engine {...partProps("engine")} />)}
      {wrapPart("ers", <ERS {...partProps("ers")} />)}

      {/* Reflective ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="hsl(0 0% 3%)" metalness={0.9} roughness={0.4} transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

export default F1CarModel;
