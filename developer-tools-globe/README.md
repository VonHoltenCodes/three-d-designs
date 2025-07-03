# 🌐 Developer Tools Globe

An interactive 3D globe showcasing 35+ modern development technologies with stunning visual effects and smooth animations.

![Version](https://img.shields.io/badge/version-REV1-green.svg)
![Status](https://img.shields.io/badge/status-production-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

- **35+ Technology Logos**: Comprehensive collection of modern development tools
- **Interactive 3D Controls**: 
  - 🖱️ Mouse drag to rotate
  - 📱 Touch gestures supported
  - 🔍 Scroll to zoom
- **Visual Effects**:
  - 🌟 Particle trail assembly animation
  - 💚 Atomic green wireframe grid
  - 🟠 Counter-rotating orange core
  - ✨ Bloom post-processing effects
- **Responsive Design**: Optimized for all devices
- **High Performance**: 60 FPS on modern hardware

## 🎯 Live Demo

[View Live Demo](#) | [Screenshots](../screenshots/)

<p align="center">
  <img src="../screenshots/REV1-animation-optimized.gif" alt="Developer Tools Globe Animation" width="600">
</p>

## 🛠️ Technology Stack

- **Framework**: Next.js 15.3.4 with TypeScript
- **3D Engine**: Three.js + React Three Fiber
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS v4
- **Post-processing**: @react-three/postprocessing
- **Build Tool**: Turbopack

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/VonHoltenCodes/three-d-designs.git

# Navigate to the globe project
cd three-d-designs/developer-tools-globe

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🏗️ Project Structure

```
developer-tools-globe/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main page component
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Globe3D.tsx        # Main 3D scene container
│   ├── LogoSphere.tsx     # Sphere with logo positioning
│   ├── LogoHTML.tsx       # Individual logo component
│   ├── RotatingCore.tsx   # Animated core element
│   ├── ParticleTrail.tsx  # Assembly animation trails
│   ├── GlobeControls.tsx  # Interaction controls
│   └── LoadingScreen.tsx  # Loading state
├── hooks/                 # Custom React hooks
│   └── useGlobeControls.ts # Mouse/touch controls
├── lib/                   # Utilities and data
│   └── logos.ts           # Logo definitions and positioning
├── public/
│   └── logos/            # SVG logo files (35+ icons)
└── scripts/              # Build and utility scripts
```

## 🎨 Featured Technologies

The globe displays logos for:

**Languages**: JavaScript, TypeScript, Python, Rust, Go, Java, C++, Ruby, PHP, Swift

**Frontend**: React, Next.js, Vue.js, Angular, Svelte

**Backend & Cloud**: Node.js, AWS, Google Cloud, Azure, Vercel, Netlify, Cloudflare

**Tools**: Claude/Anthropic, GitHub, Git, Docker, Kubernetes, VS Code, Vim

**Databases**: PostgreSQL, MongoDB, Redis, GraphQL, REST API

## 🔧 Configuration

### Camera Settings
- Initial position: `[0, 0, 8]`
- Zoom range: 4 to 20 units
- Field of view: 75°

### Globe Properties
- Radius: 2.5 units
- Grid subdivisions: 24x24
- Logo scale: 0.4
- Idle rotation speed: 0.08 rad/s

### Performance
- Particle count: 15 per trail
- Bloom intensity: 0.3
- Target FPS: 60

## 📝 Development

### Adding New Logos

1. Add logo definition to `lib/logos.ts`:
```typescript
{
  id: 'newtech',
  name: 'New Technology',
  category: 'tool',
  color: '#FF0000',
  description: 'Description',
  url: 'https://example.com'
}
```

2. Add SVG file to `public/logos/newtech.svg`

### Customizing Effects

- **Grid Color**: Edit `LogoSphere.tsx` line 33
- **Core Speed**: Edit `RotatingCore.tsx` lines 15-17
- **Zoom Sensitivity**: Edit `useGlobeControls.ts` line 72

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Static Export
```bash
npm run build
npm run export
```

## 📊 Performance Metrics

- **Initial Load**: < 3s on 4G
- **Time to Interactive**: < 4s
- **Bundle Size**: ~500KB gzipped
- **Memory Usage**: ~150MB average

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 👤 Author

**VonHoltenCodes**
- GitHub: [@VonHoltenCodes](https://github.com/VonHoltenCodes)
- Project: [three-d-designs](https://github.com/VonHoltenCodes/three-d-designs)

## 🙏 Acknowledgments

- **[Claude by Anthropic](https://claude.ai)** - AI-assisted development and code generation
- **[Three.js](https://threejs.org/)** - 3D graphics library
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** - React renderer for Three.js
- **[Simple Icons](https://simpleicons.org/)** - Technology logo resources
- **[DevIcons](https://devicon.dev/)** - Additional developer icons

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🔮 Future Plans

- [ ] REV2: Search/filter functionality for logos
- [ ] REV3: Logo categories with color coding
- [ ] REV4: Information panels on logo click
- [ ] REV5: Multiple globe themes

---

<p align="center">
  <strong>Developer Tools Globe - REV1</strong><br>
  Part of the <a href="https://github.com/VonHoltenCodes/three-d-designs">3D Designs Collection</a>
</p>