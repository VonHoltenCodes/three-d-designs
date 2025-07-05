# Luxury Aviation Hero - REV1

A stunning, photorealistic 3D hero section for luxury private aviation companies featuring a Boeing 737-800 with interactive mouse controls and HDRI environment lighting.

![Luxury Aviation Hero Screenshot](./luxury-aviation-hero-REV1.png)

## Features

- **Photorealistic Boeing 737-800**: High-quality 3D model with metallic materials
- **Interactive Mouse Controls**: 
  - Move mouse horizontally for banking (roll)
  - Move mouse vertically for pitch control
  - Smooth, realistic aircraft movements
- **Multi-layer Cloud System**: Procedural clouds with parallax scrolling
- **HDRI Environment**: Professional "Kloppenheim 06" sunset lighting
- **Premium UI**: Glass-morphism CTA button with elegant typography
- **Optimized Performance**: 60fps target with efficient rendering

## Technologies

- **Next.js 15.3.5** with App Router
- **Three.js** + **React Three Fiber**
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Simplex Noise** for procedural clouds

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit http://localhost:3000 to see the hero section.

## Project Structure

```
luxury-aviation-hero/
├── app/
│   └── page.tsx          # Main hero component
├── public/
│   ├── models/
│   │   └── boeing-737-800.glb  # Aircraft model
│   └── hdri/
│       └── kloppenheim_06_8k.exr  # Environment map
```

## Customization

### Hero Text
Edit the hero text in `app/page.tsx`:
```tsx
<h1>Fly Beyond Limits</h1>
<p>Experience luxury aviation redefined</p>
```

### Aircraft Behavior
Adjust mouse sensitivity and movement:
```tsx
const targetRotationZ = mouse.x * 0.15  // Banking sensitivity
const targetRotationX = -mouse.y * 0.1  // Pitch sensitivity
```

### Cloud Layers
Modify cloud properties:
```tsx
<CloudLayer y={-5} speed={0.02} opacity={0.6} />
```

## Performance Optimization

- Model is scaled down (`scale={0.01}`) for optimal size
- Clouds use instanced rendering
- HDRI provides realistic lighting without heavy computation
- Fog adds depth while hiding distant objects

## Assets Credits

- **Boeing 737-800 Model**: Downloaded from Sketchfab (free license)
- **HDRI Environment**: Poly Haven - Kloppenheim 06 (CC0 license)

## Future Enhancements

- [ ] Multiple aircraft models to choose from
- [ ] Weather effects (rain, lightning)
- [ ] Time of day transitions
- [ ] Mobile touch controls
- [ ] Sound effects (engine, wind)

## License

MIT License - Feel free to use for commercial projects

---

Built with ❤️ using Three.js and React Three Fiber
