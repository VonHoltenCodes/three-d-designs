'use client'

import { useEffect, useState } from 'react'

export function PerformanceMonitor() {
  const [fps, setFps] = useState(0)
  
  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    
    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)))
        frameCount = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(measureFPS)
    }
    
    const rafId = requestAnimationFrame(measureFPS)
    
    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [])
  
  if (process.env.NODE_ENV !== 'development') return null
  
  return (
    <div className="absolute top-20 left-4 bg-black/50 text-white p-2 rounded text-sm font-mono">
      FPS: {fps}
    </div>
  )
}