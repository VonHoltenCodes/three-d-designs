'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import * as THREE from 'three'

interface PerformanceMonitorProps {
  onQualityChange?: (quality: 'low' | 'medium' | 'high') => void
}

export default function PerformanceMonitor({ onQualityChange }: PerformanceMonitorProps) {
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const fps = useRef(60)
  const quality = useRef<'low' | 'medium' | 'high'>('high')
  const lowFpsCount = useRef(0)
  const { gl } = useThree()
  
  useFrame(() => {
    frameCount.current++
    const currentTime = performance.now()
    
    // Calculate FPS every second
    if (currentTime >= lastTime.current + 1000) {
      fps.current = (frameCount.current * 1000) / (currentTime - lastTime.current)
      frameCount.current = 0
      lastTime.current = currentTime
      
      // Only reduce quality if FPS is consistently low
      if (fps.current < 25) {
        lowFpsCount.current++
      } else if (fps.current > 40) {
        lowFpsCount.current = 0
      }
      
      // Adjust quality based on FPS with higher thresholds
      const targetQuality = fps.current < 20 ? 'low' : fps.current < 30 ? 'medium' : 'high'
      
      // Only change quality after 3 seconds of consistent low FPS
      if (targetQuality !== quality.current && (targetQuality === 'high' || lowFpsCount.current > 3)) {
        quality.current = targetQuality
        lowFpsCount.current = 0
        
        // Adjust renderer settings based on quality
        switch (targetQuality) {
          case 'low':
            gl.setPixelRatio(1)
            gl.shadowMap.enabled = false
            break
          case 'medium':
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
            gl.shadowMap.enabled = true
            gl.shadowMap.type = THREE.PCFShadowMap
            break
          case 'high':
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            gl.shadowMap.enabled = true
            gl.shadowMap.type = THREE.PCFSoftShadowMap
            break
        }
        
        onQualityChange?.(newQuality)
      }
    }
  })
  
  // Show stats in development
  if (process.env.NODE_ENV === 'development') {
    return <Stats className="!left-auto !right-0" />
  }
  
  return null
}