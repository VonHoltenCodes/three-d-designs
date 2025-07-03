export interface Logo {
  id: string
  name: string
  category: 'language' | 'frontend' | 'backend' | 'cloud' | 'tool' | 'database'
  color: string
  description: string
  url: string
}

export const developerLogos: Logo[] = [
  // Programming Languages
  { id: 'javascript', name: 'JavaScript', category: 'language', color: '#F7DF1E', description: 'Dynamic programming language', url: 'https://javascript.com' },
  { id: 'typescript', name: 'TypeScript', category: 'language', color: '#3178C6', description: 'Typed superset of JavaScript', url: 'https://www.typescriptlang.org' },
  { id: 'python', name: 'Python', category: 'language', color: '#3776AB', description: 'High-level programming language', url: 'https://www.python.org' },
  { id: 'rust', name: 'Rust', category: 'language', color: '#000000', description: 'Systems programming language', url: 'https://www.rust-lang.org' },
  { id: 'go', name: 'Go', category: 'language', color: '#00ADD8', description: 'Efficient compiled language', url: 'https://golang.org' },
  { id: 'java', name: 'Java', category: 'language', color: '#007396', description: 'Object-oriented programming language', url: 'https://www.java.com' },
  { id: 'cpp', name: 'C++', category: 'language', color: '#00599C', description: 'General-purpose programming language', url: 'https://isocpp.org' },
  { id: 'ruby', name: 'Ruby', category: 'language', color: '#CC342D', description: 'Dynamic, interpreted language', url: 'https://www.ruby-lang.org' },
  { id: 'php', name: 'PHP', category: 'language', color: '#777BB4', description: 'Server-side scripting language', url: 'https://www.php.net' },
  { id: 'swift', name: 'Swift', category: 'language', color: '#FA7343', description: 'Programming language for Apple platforms', url: 'https://swift.org' },

  // Frontend Frameworks
  { id: 'react', name: 'React', category: 'frontend', color: '#61DAFB', description: 'JavaScript library for UIs', url: 'https://react.dev' },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', color: '#000000', description: 'React framework for production', url: 'https://nextjs.org' },
  { id: 'vue', name: 'Vue.js', category: 'frontend', color: '#4FC08D', description: 'Progressive JavaScript framework', url: 'https://vuejs.org' },
  { id: 'angular', name: 'Angular', category: 'frontend', color: '#DD0031', description: 'Platform for web applications', url: 'https://angular.io' },
  { id: 'svelte', name: 'Svelte', category: 'frontend', color: '#FF3E00', description: 'Compile-time optimized framework', url: 'https://svelte.dev' },

  // Backend & Cloud
  { id: 'nodejs', name: 'Node.js', category: 'backend', color: '#339933', description: 'JavaScript runtime', url: 'https://nodejs.org' },
  { id: 'aws', name: 'AWS', category: 'cloud', color: '#FF9900', description: 'Amazon Web Services', url: 'https://aws.amazon.com' },
  { id: 'gcp', name: 'Google Cloud', category: 'cloud', color: '#4285F4', description: 'Google Cloud Platform', url: 'https://cloud.google.com' },
  { id: 'azure', name: 'Azure', category: 'cloud', color: '#0078D4', description: 'Microsoft cloud platform', url: 'https://azure.microsoft.com' },
  { id: 'vercel', name: 'Vercel', category: 'cloud', color: '#000000', description: 'Frontend cloud platform', url: 'https://vercel.com' },
  { id: 'netlify', name: 'Netlify', category: 'cloud', color: '#00D9FF', description: 'Web development platform', url: 'https://www.netlify.com' },
  { id: 'cloudflare', name: 'Cloudflare', category: 'cloud', color: '#F38020', description: 'Web performance and security', url: 'https://www.cloudflare.com' },

  // Developer Tools
  { id: 'claude', name: 'Claude', category: 'tool', color: '#D97706', description: 'AI assistant by Anthropic', url: 'https://claude.ai' },
  { id: 'github', name: 'GitHub', category: 'tool', color: '#181717', description: 'Code hosting platform', url: 'https://github.com' },
  { id: 'git', name: 'Git', category: 'tool', color: '#F05032', description: 'Version control system', url: 'https://git-scm.com' },
  { id: 'docker', name: 'Docker', category: 'tool', color: '#2496ED', description: 'Container platform', url: 'https://www.docker.com' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'tool', color: '#326CE5', description: 'Container orchestration', url: 'https://kubernetes.io' },
  { id: 'vscode', name: 'VS Code', category: 'tool', color: '#007ACC', description: 'Code editor', url: 'https://code.visualstudio.com' },
  { id: 'webstorm', name: 'WebStorm', category: 'tool', color: '#000000', description: 'JavaScript IDE', url: 'https://www.jetbrains.com/webstorm' },
  { id: 'vim', name: 'Vim', category: 'tool', color: '#019733', description: 'Text editor', url: 'https://www.vim.org' },

  // Databases & APIs
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', color: '#4169E1', description: 'Relational database', url: 'https://www.postgresql.org' },
  { id: 'mongodb', name: 'MongoDB', category: 'database', color: '#47A248', description: 'NoSQL database', url: 'https://www.mongodb.com' },
  { id: 'redis', name: 'Redis', category: 'database', color: '#DC382D', description: 'In-memory data store', url: 'https://redis.io' },
  { id: 'graphql', name: 'GraphQL', category: 'backend', color: '#E10098', description: 'Query language for APIs', url: 'https://graphql.org' },
  { id: 'rest', name: 'REST API', category: 'backend', color: '#008000', description: 'Architectural style for APIs', url: 'https://restfulapi.net' },
]

// Function to distribute logos evenly on a sphere
export function calculateSpherePositions(count: number, radius: number = 2.5) {
  const positions: { x: number; y: number; z: number }[] = []
  const goldenRatio = (1 + Math.sqrt(5)) / 2
  const angleIncrement = Math.PI * 2 * goldenRatio

  for (let i = 0; i < count; i++) {
    const t = i / count
    const inclination = Math.acos(1 - 2 * t)
    const azimuth = angleIncrement * i

    const x = Math.sin(inclination) * Math.cos(azimuth) * radius
    const y = Math.sin(inclination) * Math.sin(azimuth) * radius
    const z = Math.cos(inclination) * radius

    positions.push({ x, y, z })
  }

  return positions
}