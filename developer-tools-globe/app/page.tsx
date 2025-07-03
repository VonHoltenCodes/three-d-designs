import { Globe3D } from '@/components/Globe3D'
import { PerformanceMonitor } from '@/components/PerformanceMonitor'

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      <Globe3D />
      
      {/* Overlay UI */}
      <div className="absolute top-0 left-0 right-0 p-8 pointer-events-none">
        <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-4">
          Developer Tools Globe
        </h1>
        <p className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mx-auto">
          An interactive 3D showcase of modern development technologies
        </p>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-0 left-0 right-0 p-8 pointer-events-none">
        <p className="text-sm text-gray-400 text-center">
          Drag to rotate • Scroll to zoom • Click logos to explore
        </p>
      </div>
      
      {/* Performance monitor in dev mode */}
      <PerformanceMonitor />
    </main>
  )
}