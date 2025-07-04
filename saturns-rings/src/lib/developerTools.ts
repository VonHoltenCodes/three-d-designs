export interface DeveloperTool {
  id: string
  name: string
  category: 'language' | 'frontend' | 'backend' | 'cloud' | 'tool' | 'database'
  color: string
  ringIndex: number // Which ring this tool belongs to (0-2)
}

// Developer tools distributed across three rings
export const developerTools: DeveloperTool[] = [
  // Inner Ring - Programming Languages
  { id: 'javascript', name: 'JavaScript', category: 'language', color: '#F7DF1E', ringIndex: 0 },
  { id: 'typescript', name: 'TypeScript', category: 'language', color: '#3178C6', ringIndex: 0 },
  { id: 'python', name: 'Python', category: 'language', color: '#3776AB', ringIndex: 0 },
  { id: 'rust', name: 'Rust', category: 'language', color: '#000000', ringIndex: 0 },
  { id: 'go', name: 'Go', category: 'language', color: '#00ADD8', ringIndex: 0 },
  { id: 'java', name: 'Java', category: 'language', color: '#007396', ringIndex: 0 },
  { id: 'cpp', name: 'C++', category: 'language', color: '#00599C', ringIndex: 0 },
  { id: 'ruby', name: 'Ruby', category: 'language', color: '#CC342D', ringIndex: 0 },
  { id: 'php', name: 'PHP', category: 'language', color: '#777BB4', ringIndex: 0 },
  { id: 'swift', name: 'Swift', category: 'language', color: '#FA7343', ringIndex: 0 },
  
  // Middle Ring - Frameworks & Tools
  { id: 'react', name: 'React', category: 'frontend', color: '#61DAFB', ringIndex: 1 },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', color: '#000000', ringIndex: 1 },
  { id: 'vue', name: 'Vue.js', category: 'frontend', color: '#4FC08D', ringIndex: 1 },
  { id: 'angular', name: 'Angular', category: 'frontend', color: '#DD0031', ringIndex: 1 },
  { id: 'svelte', name: 'Svelte', category: 'frontend', color: '#FF3E00', ringIndex: 1 },
  { id: 'nodejs', name: 'Node.js', category: 'backend', color: '#339933', ringIndex: 1 },
  { id: 'claude', name: 'Claude', category: 'tool', color: '#D97706', ringIndex: 1 },
  { id: 'github', name: 'GitHub', category: 'tool', color: '#181717', ringIndex: 1 },
  { id: 'git', name: 'Git', category: 'tool', color: '#F05032', ringIndex: 1 },
  { id: 'docker', name: 'Docker', category: 'tool', color: '#2496ED', ringIndex: 1 },
  { id: 'kubernetes', name: 'Kubernetes', category: 'tool', color: '#326CE5', ringIndex: 1 },
  { id: 'vscode', name: 'VS Code', category: 'tool', color: '#007ACC', ringIndex: 1 },
  { id: 'vim', name: 'Vim', category: 'tool', color: '#019733', ringIndex: 1 },
  
  // Outer Ring - Cloud & Databases
  { id: 'aws', name: 'AWS', category: 'cloud', color: '#FF9900', ringIndex: 2 },
  { id: 'gcp', name: 'Google Cloud', category: 'cloud', color: '#4285F4', ringIndex: 2 },
  { id: 'azure', name: 'Azure', category: 'cloud', color: '#0078D4', ringIndex: 2 },
  { id: 'vercel', name: 'Vercel', category: 'cloud', color: '#000000', ringIndex: 2 },
  { id: 'netlify', name: 'Netlify', category: 'cloud', color: '#00D9FF', ringIndex: 2 },
  { id: 'cloudflare', name: 'Cloudflare', category: 'cloud', color: '#F38020', ringIndex: 2 },
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', color: '#4169E1', ringIndex: 2 },
  { id: 'mongodb', name: 'MongoDB', category: 'database', color: '#47A248', ringIndex: 2 },
  { id: 'redis', name: 'Redis', category: 'database', color: '#DC382D', ringIndex: 2 },
  { id: 'graphql', name: 'GraphQL', category: 'backend', color: '#E10098', ringIndex: 2 },
  { id: 'rest', name: 'REST API', category: 'backend', color: '#008000', ringIndex: 2 },
]

// Ring configuration
export const ringConfigs = [
  { 
    innerRadius: 4.5, 
    outerRadius: 5.5, 
    particles: 200000,
    rotationSpeed: 0.015,
    opacity: 0.9,
    name: 'Inner Ring - Languages'
  },
  { 
    innerRadius: 6.0, 
    outerRadius: 7.5, 
    particles: 350000,
    rotationSpeed: 0.012,
    opacity: 0.85,
    name: 'Middle Ring - Frameworks'
  },
  { 
    innerRadius: 8.0, 
    outerRadius: 10.0, 
    particles: 500000,
    rotationSpeed: 0.008,
    opacity: 0.8,
    name: 'Outer Ring - Cloud & Data'
  },
]