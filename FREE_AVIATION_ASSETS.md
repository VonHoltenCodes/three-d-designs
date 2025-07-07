# Free High-Quality Aviation Assets Guide

## FREE Aircraft Models

### 1. **Sketchfab** (Best Free Option)
- **Search**: "airplane free download" + filter by "Downloadable"
- **Quality Models Available**:
  - "Boeing 737-800" by ThatJoshGuy (Free, 45k polys)
  - "Airbus A320" by Paulargia (Free, good detail)
  - "Cessna 172" by Animium (Free, very detailed)
  - "Private Jet" by various artists (search "business jet free")
- **Tip**: Sort by "Most Liked" for quality

### 2. **Free3D.com**
- "Gulfstream G650" (simplified but free)
- "Boeing 787 Dreamliner" 
- Various business jets
- Quality varies, check poly count

### 3. **NASA 3D Resources** (nasa3d.arc.nasa.gov)
- Historical aircraft models
- Space planes
- High accuracy, government quality
- Public domain

### 4. **Poly Haven** (polyhaven.com)
- Limited aircraft selection
- But excellent for other assets
- All CC0 license

### 5. **BlenderKit** (Inside Blender)
- Some free aircraft models
- Can export to GLB for Three.js
- Community contributed

## FREE Cloud Solutions

### 1. **Procedural Clouds** (Best Option - We Build It)
```javascript
// Using Three.js - Completely Free
const cloudGeometry = new THREE.BufferGeometry();
const cloudMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    opacity: { value: 0.8 }
  },
  vertexShader: cloudVertexShader,
  fragmentShader: cloudFragmentShader,
  transparent: true
});
```

### 2. **Cloud Textures** (Free Sources)
- **Textures.com**: 15 free downloads/day
  - Search "clouds alpha"
  - High resolution cloud photos
- **Pexels/Unsplash**: Free photos
  - Search "clouds sky"
  - Can be used as textures
- **OpenGameArt.org**
  - Sprite sheets
  - Alpha mapped clouds

### 3. **HDRIs with Clouds** (Poly Haven)
- "Kloppenheim 06" - Beautiful sunset clouds
- "Venice Sunset" - Golden hour sky
- "Sunflowers" - Puffy white clouds
- All 16K resolution, CC0 license

### 4. **Cloud Generators**
- **Perlin Noise**: Generate infinite clouds
- **Worley Noise**: Cellular cloud patterns
- Built into Three.js examples

## Strategy for FREE Hyper-Realistic Look

### 1. **Start with Free Model + Enhancement**
```javascript
// Take a free model and enhance it:
- Add reflective materials
- Implement PBR shading
- Add subtle animations
- Use environment mapping for reflections
```

### 2. **Procedural Cloud System**
```javascript
// Build a volumetric cloud system:
class CloudSystem {
  constructor() {
    this.clouds = [];
    this.createClouds();
  }
  
  createClouds() {
    // Use instanced meshes for performance
    // Apply noise-based textures
    // Add rim lighting for realism
  }
}
```

### 3. **Use FREE HDRIs for Lighting**
- Poly Haven has 100+ sky HDRIs
- Creates realistic reflections on aircraft
- Provides natural lighting

### 4. **Post-Processing Magic** (All Free)
```javascript
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

// Add bloom, DOF, color grading
// Makes even simple models look premium
```

## Specific FREE Asset Combinations

### Option 1: "Quick Start Package"
- **Aircraft**: Cessna Citation X (Free3D)
- **Clouds**: Procedural with Three.js
- **Sky**: "Kloppenheim 06" HDRI (Poly Haven)
- **Result**: 80% of paid quality

### Option 2: "Build Your Own"
- **Aircraft**: Basic shape + custom shaders
- **Clouds**: Particle system with sprites
- **Sky**: Gradient shader
- **Enhancement**: Heavy post-processing

### Option 3: "Hybrid Approach"
- **Aircraft**: Free model + custom textures
- **Clouds**: Mix of sprites and procedural
- **Sky**: HDRI + custom atmosphere shader

## Code Example: Free Cloud System
```javascript
// Completely free volumetric clouds
function createCloudLayer(y, speed) {
  const cloudGroup = new THREE.Group();
  
  for (let i = 0; i < 20; i++) {
    const geometry = new THREE.SphereGeometry(
      Math.random() * 10 + 10, 
      8, 
      6
    );
    
    // Distort sphere to look cloud-like
    const positions = geometry.attributes.position;
    for (let j = 0; j < positions.count; j++) {
      const noise = simplex.noise3D(
        positions.getX(j) * 0.1,
        positions.getY(j) * 0.1,
        positions.getZ(j) * 0.1
      );
      positions.setX(j, positions.getX(j) + noise * 5);
    }
    
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
      emissive: 0xffffff,
      emissiveIntensity: 0.2
    });
    
    const cloud = new THREE.Mesh(geometry, material);
    cloud.position.set(
      Math.random() * 200 - 100,
      y,
      Math.random() * 200 - 100
    );
    
    cloudGroup.add(cloud);
  }
  
  return cloudGroup;
}
```

## Converting & Optimizing Free Models

### Using Blender (Free)
1. Import model (any format)
2. Reduce polygons: Decimate modifier
3. Bake textures: Reduce texture size
4. Export as GLB for Three.js

### Command Line Tools
```bash
# Install gltf-pipeline (free)
npm install -g gltf-pipeline

# Optimize any GLTF/GLB file
gltf-pipeline -i model.gltf -o optimized.glb -d
```

## Quality Tips for Free Assets

1. **Lighting is Everything**
   - Good lighting makes cheap models look expensive
   - Use 3-point lighting setup
   - Add rim lighting for drama

2. **Post-Processing**
   - Bloom makes everything glow nicely
   - Depth of field hides imperfections
   - Color grading adds atmosphere

3. **Motion Hides Flaws**
   - Keep things moving slightly
   - Parallax layers add depth
   - Subtle animations distract from poly count

4. **Atmospheric Effects**
   - Fog hides distant LOD issues
   - Particles add life
   - Heat shimmer adds realism

## Recommended FREE Workflow

1. **Get Aircraft**: Sketchfab "business jet free"
2. **Download HDRI**: Poly Haven sunset sky
3. **Build Clouds**: Use code examples above
4. **Add Effects**: Three.js post-processing
5. **Total Cost**: $0

---
*Remember: "Premium" look comes from execution, not just assets*
*Free assets + good lighting + effects = Professional result*