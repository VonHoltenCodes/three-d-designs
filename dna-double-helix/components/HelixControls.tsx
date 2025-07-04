'use client';

import { useState } from 'react';

export default function HelixControls() {
  const [glowIntensity, setGlowIntensity] = useState(0.3);
  const [showInfo, setShowInfo] = useState(false);
  
  return (
    <div className="absolute bottom-8 left-8 flex flex-col gap-4">
      {/* Controls Panel */}
      <div className="bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-lg p-4 text-white">
        <h3 className="text-lg font-semibold mb-3">Controls</h3>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-400">Glow Intensity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={glowIntensity}
              onChange={(e) => setGlowIntensity(parseFloat(e.target.value))}
              className="w-full mt-1"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded text-sm transition-colors"
            >
              {showInfo ? 'Hide' : 'Show'} Info
            </button>
          </div>
        </div>
      </div>
      
      {/* Info Panel */}
      {showInfo && (
        <div className="bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-lg p-4 text-white max-w-sm">
          <h3 className="text-lg font-semibold mb-2">DNA Structure Components</h3>
          <div className="text-sm space-y-2 text-gray-300">
            <div className="border-b border-cyan-500/20 pb-2">
              <p className="font-semibold text-white">Sugar-Phosphate Backbones</p>
              <p>The <span className="text-red-400">red</span> and <span className="text-blue-400">blue</span> metallic spirals forming the DNA ladder sides</p>
              <p className="text-xs italic">Like twisted antenna cables!</p>
            </div>
            <div className="border-b border-cyan-500/20 pb-2">
              <p className="font-semibold text-white">Nucleotide Base Pairs</p>
              <p>The colored spheres in the center:</p>
              <p><span className="text-blue-400">• Adenine (A)</span> pairs with <span className="text-yellow-400">Thymine (T)</span></p>
              <p><span className="text-green-400">• Guanine (G)</span> pairs with <span className="text-red-400">Cytosine (C)</span></p>
            </div>
            <div className="border-b border-cyan-500/20 pb-2">
              <p className="font-semibold text-white">Hydrogen Bonds</p>
              <p>The cyan lines connecting base pairs</p>
            </div>
            <div>
              <p className="font-semibold text-white">Helix Properties</p>
              <p>• 3.4 nm pitch (height per turn)</p>
              <p>• 10.5 base pairs per turn</p>
              <p>• 2 nm diameter</p>
              <p>• Antiparallel strands</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-lg p-3 text-white">
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div> A
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div> T
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div> G
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div> C
          </span>
        </div>
      </div>
    </div>
  );
}