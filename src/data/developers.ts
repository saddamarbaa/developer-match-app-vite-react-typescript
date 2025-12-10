import { Developer } from '@/types/developer';
import dev1 from '@/assets/dev-1.jpg';
import dev2 from '@/assets/dev-2.jpg';
import dev3 from '@/assets/dev-3.jpg';
import dev4 from '@/assets/dev-4.jpg';

export const developers: Developer[] = [
  {
    id: '1',
    name: 'Alex Chen',
    age: 28,
    avatar: dev1,
    title: 'Full Stack Developer',
    bio: 'Building scalable web apps by day, contributing to OSS by night. Currently obsessed with Rust and WebAssembly. Always down for a hackathon!',
    location: 'San Francisco, CA',
    experience: 5,
    skills: ['React', 'TypeScript', 'Node.js', 'Rust', 'PostgreSQL', 'AWS'],
    lookingFor: 'collaborator',
    github: 'alexchen',
    availability: 'weekends',
  },
  {
    id: '2',
    name: 'Sarah Kim',
    age: 26,
    avatar: dev2,
    title: 'ML Engineer',
    bio: 'Turning data into magic ✨ Former startup founder. Love teaching and building AI tools that actually help people.',
    location: 'New York, NY',
    experience: 4,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'FastAPI', 'Docker', 'Kubernetes'],
    lookingFor: 'cofounder',
    github: 'sarahkim',
    availability: 'part-time',
  },
  {
    id: '3',
    name: 'Marcus Johnson',
    age: 35,
    avatar: dev3,
    title: 'Senior Backend Engineer',
    bio: '15 years of shipping code. I love mentoring junior devs and building bulletproof systems. Ask me about distributed systems!',
    location: 'Austin, TX',
    experience: 15,
    skills: ['Go', 'Kubernetes', 'gRPC', 'Redis', 'Kafka', 'Terraform'],
    lookingFor: 'mentor',
    github: 'marcusj',
    availability: 'flexible',
  },
  {
    id: '4',
    name: 'Emma Tanaka',
    age: 24,
    avatar: dev4,
    title: 'Frontend Developer',
    bio: 'Design systems enthusiast. I believe beautiful interfaces should be accessible to everyone. Currently learning Three.js!',
    location: 'Seattle, WA',
    experience: 2,
    skills: ['React', 'Vue', 'CSS', 'Figma', 'Three.js', 'Framer Motion'],
    lookingFor: 'mentee',
    github: 'emmatanaka',
    availability: 'full-time',
  },
];
