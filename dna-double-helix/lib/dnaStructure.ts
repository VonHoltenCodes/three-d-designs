import * as THREE from 'three';

export interface BasePair {
  type: 'AT' | 'TA' | 'GC' | 'CG';
  position: THREE.Vector3;
  rotation: number;
}

export interface Nucleotide {
  base: 'A' | 'T' | 'G' | 'C';
  color: string;
  complement: 'T' | 'A' | 'C' | 'G';
}

export const nucleotides: Record<string, Nucleotide> = {
  A: { base: 'A', color: '#0080FF', complement: 'T' }, // Blue
  T: { base: 'T', color: '#FFD700', complement: 'A' }, // Yellow
  G: { base: 'G', color: '#00FF00', complement: 'C' }, // Green
  C: { base: 'C', color: '#FF0000', complement: 'G' }, // Red
};

// DNA helix parameters (in nanometers, scaled for visualization)
export const helixParams = {
  radius: 1,           // Helix radius
  pitch: 3.4,         // Height per complete turn (3.4 nm)
  basePairsPerTurn: 10.5,
  risePerBasePair: 0.34, // 0.34 nm
  helixHeight: 20,    // Total height of visualization
};

export function generateDNASequence(length: number): string {
  const bases = ['A', 'T', 'G', 'C'];
  let sequence = '';
  for (let i = 0; i < length; i++) {
    sequence += bases[Math.floor(Math.random() * bases.length)];
  }
  return sequence;
}

export function generateHelixPositions(sequence: string): BasePair[] {
  const basePairs: BasePair[] = [];
  const { radius, risePerBasePair, basePairsPerTurn } = helixParams;
  
  for (let i = 0; i < sequence.length; i++) {
    const base = sequence[i];
    const complement = nucleotides[base].complement;
    const pairType = `${base}${complement}` as 'AT' | 'TA' | 'GC' | 'CG';
    
    // Calculate position along helix
    const height = (i - sequence.length / 2) * risePerBasePair;
    const angle = (i / basePairsPerTurn) * Math.PI * 2;
    
    basePairs.push({
      type: pairType,
      position: new THREE.Vector3(0, height, 0),
      rotation: angle,
    });
  }
  
  return basePairs;
}

// Generate positions for water molecules around the helix
export function generateWaterMolecules(count: number, helixHeight: number): THREE.Vector3[] {
  const positions: THREE.Vector3[] = [];
  
  for (let i = 0; i < count; i++) {
    const radius = 2 + Math.random() * 3; // Between 2-5 units from center
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * helixHeight;
    
    positions.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    ));
  }
  
  return positions;
}

// Generate floating nucleotide letters for assembly animation
export function generateFloatingNucleotides(sequence: string): Array<{
  base: string;
  startPosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
  color: string;
}> {
  const floating = [];
  const basePairs = generateHelixPositions(sequence);
  
  for (let i = 0; i < sequence.length; i++) {
    const base = sequence[i];
    const complement = nucleotides[base].complement;
    const pair = basePairs[i];
    
    // Random start position in a sphere around the helix
    const randomRadius = 5 + Math.random() * 5;
    const randomAngle = Math.random() * Math.PI * 2;
    const randomHeight = (Math.random() - 0.5) * helixParams.helixHeight * 1.5;
    
    // Base nucleotide
    floating.push({
      base,
      startPosition: new THREE.Vector3(
        Math.cos(randomAngle) * randomRadius,
        randomHeight,
        Math.sin(randomAngle) * randomRadius
      ),
      targetPosition: new THREE.Vector3(
        Math.cos(pair.rotation) * helixParams.radius,
        pair.position.y,
        Math.sin(pair.rotation) * helixParams.radius
      ),
      color: nucleotides[base].color,
    });
    
    // Complement nucleotide
    floating.push({
      base: complement,
      startPosition: new THREE.Vector3(
        Math.cos(randomAngle + Math.PI) * randomRadius,
        randomHeight,
        Math.sin(randomAngle + Math.PI) * randomRadius
      ),
      targetPosition: new THREE.Vector3(
        Math.cos(pair.rotation + Math.PI) * helixParams.radius,
        pair.position.y,
        Math.sin(pair.rotation + Math.PI) * helixParams.radius
      ),
      color: nucleotides[complement].color,
    });
  }
  
  return floating;
}