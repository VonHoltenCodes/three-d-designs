import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function useGlobeControls() {
  const { camera, gl } = useThree()
  const isDragging = useRef(false)
  const previousMousePosition = useRef({ x: 0, y: 0 })
  const rotationSpeed = useRef({ x: 0, y: 0 })
  const targetRotation = useRef({ x: 0, y: 0 })
  
  useEffect(() => {
    const domElement = gl.domElement
    
    // Mouse events
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true
      previousMousePosition.current = { x: e.clientX, y: e.clientY }
      domElement.style.cursor = 'grabbing'
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      
      const deltaX = e.clientX - previousMousePosition.current.x
      const deltaY = e.clientY - previousMousePosition.current.y
      
      rotationSpeed.current.x = deltaX * 0.015
      rotationSpeed.current.y = deltaY * 0.015
      
      previousMousePosition.current = { x: e.clientX, y: e.clientY }
    }
    
    const handleMouseUp = () => {
      isDragging.current = false
      domElement.style.cursor = 'grab'
    }
    
    // Touch events
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true
        previousMousePosition.current = { 
          x: e.touches[0].clientX, 
          y: e.touches[0].clientY 
        }
      }
    }
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length !== 1) return
      
      const deltaX = e.touches[0].clientX - previousMousePosition.current.x
      const deltaY = e.touches[0].clientY - previousMousePosition.current.y
      
      rotationSpeed.current.x = deltaX * 0.015
      rotationSpeed.current.y = deltaY * 0.015
      
      previousMousePosition.current = { 
        x: e.touches[0].clientX, 
        y: e.touches[0].clientY 
      }
    }
    
    const handleTouchEnd = () => {
      isDragging.current = false
    }
    
    // Wheel event for zoom
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const zoomSpeed = 0.002
      const deltaY = e.deltaY
      
      camera.position.z = Math.max(4, Math.min(20, camera.position.z + deltaY * zoomSpeed))
    }
    
    // Add event listeners
    domElement.addEventListener('mousedown', handleMouseDown)
    domElement.addEventListener('mousemove', handleMouseMove)
    domElement.addEventListener('mouseup', handleMouseUp)
    domElement.addEventListener('mouseleave', handleMouseUp)
    domElement.addEventListener('touchstart', handleTouchStart)
    domElement.addEventListener('touchmove', handleTouchMove)
    domElement.addEventListener('touchend', handleTouchEnd)
    domElement.addEventListener('wheel', handleWheel, { passive: false })
    
    // Set initial cursor
    domElement.style.cursor = 'grab'
    
    // Cleanup
    return () => {
      domElement.removeEventListener('mousedown', handleMouseDown)
      domElement.removeEventListener('mousemove', handleMouseMove)
      domElement.removeEventListener('mouseup', handleMouseUp)
      domElement.removeEventListener('mouseleave', handleMouseUp)
      domElement.removeEventListener('touchstart', handleTouchStart)
      domElement.removeEventListener('touchmove', handleTouchMove)
      domElement.removeEventListener('touchend', handleTouchEnd)
      domElement.removeEventListener('wheel', handleWheel)
    }
  }, [camera, gl])
  
  return { rotationSpeed, targetRotation }
}