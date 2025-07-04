'use client';

import { Html } from '@react-three/drei';

export default function LoadingScreen() {
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-white text-lg">Loading DNA Structure...</p>
      </div>
    </Html>
  );
}