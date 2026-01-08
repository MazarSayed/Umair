import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// AUTH BASE URL (Keeping DummyJSON for Auth)
const AUTH_BASE_URL = 'https://dummyjson.com';

const MOCK_INSTRUCTORS = [
  { 
    id: 1, 
    name: 'Dr. Angela Yu', 
    credentials: 'iOS/Web Expert', 
    profile_path: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=50', 
    bio: 'Expert developer and lead instructor at London App Brewery. She has helped hundreds of thousands of students learn to code and change their lives.', 
    experience: '10+ years in Full Stack Development',
    skills: ['React Native', 'Swift', 'Node.js', 'Python'],
    students: '1.2M+', 
    courses_count: 15, 
    rating: 4.9 
  },
  { 
    id: 2, 
    name: 'Jose Portilla', 
    credentials: 'Data Science Head', 
    profile_path: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=50', 
    bio: 'Head of Data Science at Pierian Training. Jose has a BS and MS in Engineering from Santa Clara University and years of experience.', 
    experience: '12 years in Data Analytics',
    skills: ['Python', 'Machine Learning', 'SQL', 'Tableau'],
    students: '2.5M+', 
    courses_count: 22, 
    rating: 4.8 
  },
  { 
    id: 3, 
    name: 'Maximilian Schwarzmüller', 
    credentials: 'Senior Developer', 
    profile_path: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=50', 
    bio: 'Professional Web Developer and Instructor. Max has taught millions of students about React, Vue, Angular, and more through Academind.', 
    experience: '8 years in Frontend Development',
    skills: ['React', 'Angular', 'Vue', 'Next.js'],
    students: '3M+', 
    courses_count: 35, 
    rating: 4.9 
  },
  { 
    id: 4, 
    name: 'Kent C. Dodds', 
    credentials: 'JavaScript Specialist', 
    profile_path: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=50', 
    bio: 'JavaScript expert and educator. Creator of EpicReact.Dev and TestingJavaScript.com. Kent is passionate about teaching software engineering.', 
    experience: '9 years in JS Ecosystem',
    skills: ['Testing', 'React', 'Remix', 'TypeScript'],
    students: '500K+', 
    courses_count: 8, 
    rating: 4.9 
  },
  { 
    id: 5, 
    name: 'Seth Godin', 
    credentials: 'Marketing Legend', 
    profile_path: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=50', 
    bio: 'Bestselling author and marketing pioneer. Seth has spent 30 years teaching millions of people how to see, how to lead, and how to create change.', 
    experience: '30+ years in Marketing',
    skills: ['Strategy', 'Leadership', 'Branding', 'Storytelling'],
    students: '1M+', 
    courses_count: 12, 
    rating: 4.7 
  },
  { 
    id: 6, 
    name: 'Kelly Wearstler', 
    credentials: 'Interior Designer', 
    profile_path: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=50', 
    bio: 'World-renowned interior designer. Kelly is known for her soulful, multi-layered design aesthetic and her work on high-end projects.', 
    experience: '20+ years in Luxury Design',
    skills: ['Space Planning', 'Aesthetics', 'Color Theory', 'Furniture Design'],
    students: '200K+', 
    courses_count: 5, 
    rating: 4.8 
  },
  { 
    id: 7, 
    name: 'Martin Scorsese', 
    credentials: 'Cinema Master', 
    profile_path: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&q=50', 
    bio: 'Academy Award-winning director. Scorsese is one of the most influential filmmakers in cinematic history.', 
    experience: '50+ years in Filmmaking',
    skills: ['Directing', 'Editing', 'Cinematography', 'Screenwriting'],
    students: '400K+', 
    courses_count: 3, 
    rating: 4.9 
  },
  { 
    id: 8, 
    name: 'Gordon Ramsay', 
    credentials: 'World Class Chef', 
    profile_path: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=50', 
    bio: 'Michelin-starred chef and restaurateur. Gordon has opened restaurants around the world and hosted numerous hit shows.', 
    experience: '35+ years in Culinary Arts',
    skills: ['French Cuisine', 'Kitchen Management', 'Pastry', 'Grilling'],
    students: '1.5M+', 
    courses_count: 6, 
    rating: 4.9 
  },
  { 
    id: 9, 
    name: 'Dr. Andrew Huberman', 
    credentials: 'Neuroscientist', 
    profile_path: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=50', 
    bio: 'Professor of Neurobiology at Stanford University. Andrew is dedicated to sharing science-based tools for everyday life.', 
    experience: '20 years in Neuroscience',
    skills: ['Neurobiology', 'Optics', 'Behavioral Science', 'Biohacking'],
    students: '2M+', 
    courses_count: 10, 
    rating: 4.9 
  },
  { 
    id: 10, 
    name: 'Neil Patel', 
    credentials: 'Digital Marketer', 
    profile_path: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=150&q=50', 
    bio: 'Co-founder of NP Digital. Neil is a New York Times bestselling author and one of the top influencers on the web.', 
    experience: '15+ years in Digital Growth',
    skills: ['SEO', 'Content Marketing', 'Analytics', 'Conversion Optimization'],
    students: '800K+', 
    courses_count: 18, 
    rating: 4.6 
  },
];

// Mock data for Educational Courses with Highly Optimized (Low-Res) Images and Verified Videos
const MOCK_COURSES = [
  { 
    key: '1', 
    title: 'Complete Web Development Bootcamp', 
    instructorId: 1, 
    instructor: 'Dr. Angela Yu', 
    duration: '65h 12m', 
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&q=50', 
    rating: 4.8, 
    previewVideoId: 'zOtQUlxhHww', // freeCodeCamp
    overview: 'Become a full-stack web developer with just one course. HTML, CSS, Javascript, Node, React, MongoDB and more!',
    what_you_will_learn: ['Build 16 projects', 'Master HTML, CSS, JS', 'React, Node, MongoDB', 'Deployment'],
    subject: 'Coding', 
    lessons_count: 450 
  },
  { 
    key: '2', 
    title: 'UX/UI Design Fundamentals', 
    instructorId: 3, 
    instructor: 'Maximilian Schwarzmüller', 
    duration: '12h 45m', 
    thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563ec4c?w=300&q=50', 
    rating: 4.7, 
    previewVideoId: 'c9Wg6A_zE_8', // DesignCourse
    overview: 'Learn the core principles of User Experience and User Interface design.',
    what_you_will_learn: ['UX Research', 'UI Design in Figma', 'Prototyping', 'User Testing'],
    subject: 'Design', 
    lessons_count: 85 
  },
  { 
    key: '3', 
    title: 'Digital Marketing Masterclass', 
    instructorId: 10, 
    instructor: 'Neil Patel', 
    duration: '22h 30m', 
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&q=50', 
    rating: 4.5, 
    previewVideoId: 'nU-IIXBWZS4', // HubSpot
    overview: 'Market yourself or your business using social media, SEO, and paid advertising.',
    what_you_will_learn: ['SEO Strategies', 'Content Marketing', 'Social Media Ads', 'Email Marketing'],
    subject: 'Marketing', 
    lessons_count: 120 
  },
  { 
    key: '4', 
    title: 'Advanced Data Science with Python', 
    instructorId: 2, 
    instructor: 'Jose Portilla', 
    duration: '35h 00m', 
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bbdac8626ad1?w=300&q=50', 
    rating: 4.9, 
    previewVideoId: 'ua-CiDNNj30', // freeCodeCamp Data Science
    overview: 'Analyze big data, build machine learning models, and visualize complex datasets using Python.',
    what_you_will_learn: ['Pandas & NumPy', 'Matplotlib & Seaborn', 'Scikit-Learn', 'Neural Networks'],
    subject: 'Coding', 
    lessons_count: 210 
  },
  { 
    key: '5', 
    title: 'Business Strategy & Leadership', 
    instructorId: 5, 
    instructor: 'Seth Godin', 
    duration: '8h 15m', 
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&q=50', 
    rating: 4.6, 
    previewVideoId: 'grnhX46_Z_Q', // Harvard Business Review
    overview: 'Learn how to lead teams, build sustainable business models, and create a lasting impact.',
    what_you_will_learn: ['Strategic Planning', 'Leadership Mindset', 'Team Management', 'Innovation'],
    subject: 'Business', 
    lessons_count: 45 
  },
  { 
    key: '6', 
    title: 'Introduction to Quantum Physics', 
    instructorId: 9, 
    instructor: 'Dr. Andrew Huberman', 
    duration: '40h 20m', 
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&q=50', 
    rating: 4.9, 
    previewVideoId: 'fis26HvvDII', // Kurzgesagt
    overview: 'Explore the strange world of quantum mechanics, from wave-particle duality to entanglement.',
    what_you_will_learn: ['Atomic Theory', 'Quantum Entanglement', 'Wave Functions', 'Schrodinger\'s Cat'],
    subject: 'Science', 
    lessons_count: 180 
  },
  { 
    key: '7', 
    title: 'Modern Interior Design', 
    instructorId: 6, 
    instructor: 'Kelly Wearstler', 
    duration: '15h 10m', 
    thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300&q=50', 
    rating: 4.7, 
    previewVideoId: 'z3HKu6Sh9_M', // Architectural Digest
    overview: 'Transform spaces into beautiful, functional environments using lighting, color, and texture.',
    what_you_will_learn: ['Color Theory', 'Lighting Design', 'Material Selection', 'Space Planning'],
    subject: 'Design', 
    lessons_count: 65 
  },
  { 
    key: '8', 
    title: 'Financial Intelligence for Everyone', 
    instructorId: 5, 
    instructor: 'Seth Godin', 
    duration: '10h 45m', 
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&q=50', 
    rating: 4.4, 
    previewVideoId: 'pk7ESz6vtyA', // Graham Stephan
    overview: 'Master your personal finances, understand assets vs liabilities, and build long-term wealth.',
     what_you_will_learn: ['Budgeting', 'Investment Basics', 'Credit Management', 'Wealth Building'],
    subject: 'Business', 
    lessons_count: 55 
  },
  { 
    key: '9', 
    title: 'Professional Photography Masterclass', 
    instructorId: 7, 
    instructor: 'Martin Scorsese', 
    duration: '18h 30m', 
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=50', 
    rating: 4.8, 
    previewVideoId: 'qZ66In9gnkg', // Peter McKinnon
    overview: 'Learn how to take professional-grade photos using manual settings, lighting, and composition.',
    what_you_will_learn: ['Camera Settings', 'Composition', 'Lighting', 'Photo Editing'],
    subject: 'Arts', 
    lessons_count: 95 
  },
  { 
    key: '10', 
    title: 'Artificial Intelligence & Ethics', 
    instructorId: 9, 
    instructor: 'Dr. Andrew Huberman', 
    duration: '14h 20m', 
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&q=50', 
    rating: 4.7, 
    previewVideoId: '7_7NoZ6_OfA', // TED-Ed
    overview: 'Understand how AI works and the ethical implications of automated decision-making systems.',
    what_you_will_learn: ['AI History', 'Ethical Frameworks', 'Bias in Algorithms', 'Future of AI'],
    subject: 'Science', 
    lessons_count: 75 
  },
  { 
    key: '11', 
    title: 'Public Speaking for Leaders', 
    instructorId: 5, 
    instructor: 'Seth Godin', 
    duration: '6h 50m', 
    thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74dea327912?w=300&q=50', 
    rating: 4.9, 
    previewVideoId: '8h_ZIDmx8vY', // TED Talks
    overview: 'Overcome stage fright and deliver powerful, inspiring presentations that move people to action.',
    what_you_will_learn: ['Storytelling', 'Vocal Variety', 'Body Language', 'Overcoming Fear'],
    subject: 'Business', 
    lessons_count: 35 
  },
  { 
    key: '12', 
    title: 'The Art of Creative Writing', 
    instructorId: 7, 
    instructor: 'Martin Scorsese', 
    duration: '11h 15m', 
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&q=50', 
    rating: 4.8, 
    previewVideoId: 'mDR8S_ZST_U', // Reedsy
    overview: 'Discover your unique voice, develop compelling characters, and write stories that resonate.',
    what_you_will_learn: ['Character Building', 'Plot Construction', 'Style & Voice', 'Editing'],
    subject: 'Arts', 
    lessons_count: 60 
  },
  { 
    key: '13', 
    title: 'Cybersecurity Analyst Training', 
    instructorId: 3, 
    instructor: 'Maximilian Schwarzmüller', 
    duration: '45h 00m', 
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&q=50', 
    rating: 4.7, 
    previewVideoId: 'BRT7qrAb9_A', // freeCodeCamp Security
    overview: 'Protect networks and systems from cyber threats. Learn ethical hacking and risk management.',
    what_you_will_learn: ['Networking Basics', 'Ethical Hacking', 'Risk Assessment', 'Security Tools'],
    subject: 'Coding', 
    lessons_count: 280 
  },
  { 
    key: '14', 
    title: 'Emotional Intelligence at Work', 
    instructorId: 5, 
    instructor: 'Seth Godin', 
    duration: '9h 30m', 
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&q=50', 
    rating: 4.6, 
    previewVideoId: 'i5mYphUoOCs', // The School of Life
    overview: 'Build better relationships, manage stress, and increase your workplace productivity.',
    what_you_will_learn: ['Self-Awareness', 'Empathy', 'Communication', 'Conflict Resolution'],
    subject: 'Business', 
    lessons_count: 40 
  },
  { 
    key: '15', 
    title: 'Nutrition & Healthy Living', 
    instructorId: 9, 
    instructor: 'Dr. Andrew Huberman', 
    duration: '16h 45m', 
    thumbnail: 'https://images.unsplash.com/photo-1490818387583-1baba5e6382b?w=300&q=50', 
    rating: 4.5, 
    previewVideoId: 'Gy7FclH-Vao', // Huberman Lab
    overview: 'Understand the science of nutrition and how to fuel your body for optimal health.',
    what_you_will_learn: ['Metabolism', 'Nutrient Density', 'Meal Planning', 'Habit Building'],
    subject: 'Science', 
    lessons_count: 80 
  },
  {
    key: '16',
    title: 'iOS App Development with Swift',
    instructorId: 1,
    instructor: 'Dr. Angela Yu',
    duration: '55h 30m',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&q=50',
    rating: 4.9,
    previewVideoId: 'nzZkKoREStw', // Stanford University
    overview: 'Master Swift and SwiftUI to build beautiful, high-performance apps for iPhone and iPad.',
    what_you_will_learn: ['SwiftUI Basics', 'State Management', 'Core Data', 'App Store Guidelines'],
    subject: 'Coding',
    lessons_count: 350
  },
  {
    key: '17',
    title: 'Graphic Design Specialization',
    instructorId: 6,
    instructor: 'Kelly Wearstler',
    duration: '28h 15m',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&q=50',
    rating: 4.7,
    previewVideoId: '7Qv0ottIk8Y', // Flux Academy
    overview: 'Learn typography, branding, and layout design using Adobe Creative Cloud.',
    what_you_will_learn: ['Photoshop Masterclass', 'Illustrator Techniques', 'Logo Design', 'Visual Hierarchy'],
    subject: 'Design',
    lessons_count: 150
  },
  {
    key: '18',
    title: 'Stock Market Investing for Beginners',
    instructorId: 5,
    instructor: 'Seth Godin',
    duration: '12h 00m',
    thumbnail: 'https://images.unsplash.com/photo-1611974714851-483213374730?w=300&q=50',
    rating: 4.8,
    previewVideoId: 'xyQY8a-ng6g', // Andrei Jikh
    overview: 'Understand market trends, analyze company financials, and start building your portfolio.',
    what_you_will_learn: ['Fundamental Analysis', 'Technical Analysis', 'Risk Management', 'Portfolio Diversification'],
    subject: 'Business',
    lessons_count: 70
  },
  {
    key: '19',
    title: 'History of Modern Architecture',
    instructorId: 6,
    instructor: 'Kelly Wearstler',
    duration: '20h 45m',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=50',
    rating: 4.6,
    previewVideoId: '09TeuxS8X_8', // The B1M
    overview: 'Explore the evolution of architecture from the Industrial Revolution to the present day.',
     what_you_will_learn: ['Architectural Eras', 'Major Architects', 'Sustainable Design', 'Urban Planning'],
    subject: 'Design',
    lessons_count: 110
  },
  {
    key: '20',
    title: 'Blockchain & Cryptography',
    instructorId: 3,
    instructor: 'Maximilian Schwarzmüller',
    duration: '32h 20m',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&q=50',
    rating: 4.7,
    previewVideoId: 'WonL8WkS_3M', // Whiteboard Crypto
    overview: 'Deep dive into Bitcoin, Ethereum, and the future of decentralized finance.',
    what_you_will_learn: ['Cryptographic Principles', 'Smart Contracts', 'Web3 Development', 'DeFi Ecosystem'],
    subject: 'Coding',
    lessons_count: 190
  },
  {
    key: '21',
    title: 'Mindfulness & Meditation',
    instructorId: 9,
    instructor: 'Dr. Andrew Huberman',
    duration: '10h 15m',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&q=50',
    rating: 4.9,
    previewVideoId: 'v8U2iWq_0W8', // Headspace
    overview: 'Reduce anxiety and increase focus through evidence-based mindfulness techniques.',
    what_you_will_learn: ['Breathwork', 'Guided Meditation', 'Stress Physiology', 'Daily Habits'],
    subject: 'Science',
    lessons_count: 50
  },
  {
    key: '22',
    title: 'Social Media Management 2026',
    instructorId: 10,
    instructor: 'Neil Patel',
    duration: '14h 50m',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&q=50',
    rating: 4.5,
    previewVideoId: 'U_z2rW6y6-M', // Social Media Examiner
    overview: 'Master TikTok, Instagram, and LinkedIn marketing strategies for the modern era.',
    what_you_will_learn: ['Platform Algorithms', 'Content Strategy', 'Influencer Marketing', 'Analytics'],
    subject: 'Marketing',
    lessons_count: 85
  },
  {
    key: '23',
    title: 'Game Development with Unreal Engine 5',
    instructorId: 3,
    instructor: 'Maximilian Schwarzmüller',
    duration: '75h 00m',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&q=50',
    rating: 4.9,
    previewVideoId: 'SSo_EIwHSd4', // Unreal Engine
    overview: 'Build AAA-quality games using C++ and Blueprints in Unreal Engine 5.',
    what_you_will_learn: ['UE5 Interface', 'Blueprint Scripting', 'C++ for Games', 'Level Design'],
    subject: 'Coding',
    lessons_count: 520
  },
  {
    key: '24',
    title: 'The Science of Well-Being',
    instructorId: 9,
    instructor: 'Dr. Andrew Huberman',
    duration: '19h 30m',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&q=50',
    rating: 4.9,
    previewVideoId: 'w_f8fG_m1uE', // Huberman Lab
    overview: 'Yale\'s most popular course ever. Learn what truly makes us happy according to science.',
    what_you_will_learn: ['Happiness Metrics', 'Positive Psychology', 'Gratitude Practice', 'Social Connection'],
    subject: 'Science',
    lessons_count: 100
  },
  {
    key: '25',
    title: 'High-Performance Python',
    instructorId: 2,
    instructor: 'Jose Portilla',
    duration: '24h 10m',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&q=50',
    rating: 4.8,
    previewVideoId: 'yF-b3E9w1Dk', // mCoding
    overview: 'Optimize your Python code for speed and memory efficiency. Advanced NumPy and Pandas.',
    what_you_will_learn: ['Profiling Code', 'Memory Optimization', 'Parallel Processing', 'Fast NumPy'],
    subject: 'Coding',
    lessons_count: 140
  },
  {
    key: '26',
    title: 'Filmmaking Masterclass',
    instructorId: 7,
    instructor: 'Martin Scorsese',
    duration: '26h 40m',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&q=50',
    rating: 4.9,
    previewVideoId: 'gQy_b-D_20Q', // StudioBinder
    overview: 'Learn the craft of storytelling, directing, and editing from a cinema legend.',
    what_you_will_learn: ['Directing Actors', 'Camera Movement', 'Editing Rhythms', 'Story Structure'],
    subject: 'Arts',
    lessons_count: 130
  },
  {
    key: '27',
    title: 'Product Management Fundamentals',
    instructorId: 1,
    instructor: 'Dr. Angela Yu',
    duration: '15h 55m',
    thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&q=50',
    rating: 4.7,
    previewVideoId: 'kjHXPVWbq_Q', // Product School
    overview: 'Learn how to define products, work with engineers, and drive successful launches.',
    what_you_will_learn: ['Product Vision', 'Agile Workflow', 'Market Research', 'Launch Strategy'],
    subject: 'Business',
    lessons_count: 90
  },
  {
    key: '28',
    title: 'Introduction to Philosophy',
    instructorId: 7,
    instructor: 'Martin Scorsese',
    duration: '30h 10m',
    thumbnail: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=300&q=50',
    rating: 4.6,
    previewVideoId: 'Zgz8_MT_07U', // Wireless Philosophy
    overview: 'Explore the big questions about life, ethics, and reality through historical thinkers.',
    what_you_will_learn: ['Metaphysics', 'Ethics', 'Epistemology', 'Modern Thought'],
    subject: 'Arts',
    lessons_count: 160
  },
  {
    key: '29',
    title: 'Machine Learning A-Z',
    instructorId: 2,
    instructor: 'Jose Portilla',
    duration: '42h 30m',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&q=50',
    rating: 4.8,
    previewVideoId: 'qz0aGYMCzl0', // StatQuest
    overview: 'Master Machine Learning on Python & R from two Data Science experts.',
    what_you_will_learn: ['Regression Models', 'Clustering', 'Reinforcement Learning', 'NLP'],
    subject: 'Coding',
    lessons_count: 290
  },
  {
    key: '30',
    title: 'Guitar Masterclass',
    instructorId: 7,
    instructor: 'Martin Scorsese',
    duration: '35h 15m',
    thumbnail: 'https://images.unsplash.com/photo-1510915363646-e625079129bf?w=300&q=50',
    rating: 4.9,
    previewVideoId: 'SqcY0GlETPk', // JustinGuitar
    overview: 'Go from absolute beginner to advanced guitar player. Blues, Rock, and Fingerstyle.',
    what_you_will_learn: ['Chords & Scales', 'Strumming Patterns', 'Music Theory', 'Performance'],
    subject: 'Arts',
    lessons_count: 240
  },
];

const api = axios.create({
  baseURL: AUTH_BASE_URL,
});

const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
});

const REGISTERED_USERS_KEY = '@registered_users';

export const getTrendingCourses = async () => {
  return [...MOCK_COURSES].sort(() => 0.5 - Math.random()).slice(0, 10);
};

export const searchCourses = async (query, limit = 50, subject = null) => {
  let filtered = [...MOCK_COURSES];
  
  if (subject && subject !== 'All') {
    filtered = filtered.filter(c => c.subject.toLowerCase() === subject.toLowerCase());
  }
  
  if (query && query.trim() !== '') {
    const lowerQuery = query.toLowerCase().trim();
    filtered = filtered.filter(c => 
      c.title.toLowerCase().includes(lowerQuery) || 
      c.instructor.toLowerCase().includes(lowerQuery) ||
      c.subject.toLowerCase().includes(lowerQuery)
    );
  }
  
  return filtered.slice(0, limit);
};

export const getRecommendations = async (courseIds, excludeKeys = [], limit = 10) => {
  const seenKeys = new Set([...courseIds, ...excludeKeys]);
  const recommendations = MOCK_COURSES.filter(c => !seenKeys.has(c.key));
  return recommendations.sort(() => 0.5 - Math.random()).slice(0, limit);
};

export const getCoursePreview = async (courseId) => {
  const course = MOCK_COURSES.find(c => c.key === courseId);
  return course?.previewVideoId || 'rfscVS0vtbw';
};

export const getCourseInstructors = async (courseId) => {
  const course = MOCK_COURSES.find(c => c.key === courseId);
  if (!course) return [];
  return MOCK_INSTRUCTORS.filter(i => i.id === course.instructorId);
};

export const getInstructorDetails = async (instructorId) => {
  return MOCK_INSTRUCTORS.find(i => i.id === instructorId);
};

export const getInstructorCourses = async (instructorId) => {
  return MOCK_COURSES.filter(c => c.instructorId === instructorId);
};

const MOCK_REVIEWS = [
  { id: 1, userName: 'Alice Smith', rating: 5, comment: 'Fantastic course! The instructor explains everything so clearly.', date: '2025-12-10', avatar: 'https://i.pravatar.cc/80?u=alice' },
  { id: 2, userName: 'Bob Johnson', rating: 4, comment: 'Really good content, but some parts are a bit fast-paced.', date: '2025-11-28', avatar: 'https://i.pravatar.cc/80?u=bob' },
  { id: 3, userName: 'Charlie Davis', rating: 5, comment: 'The best coding course I have ever taken. Highly recommend!', date: '2025-12-05', avatar: 'https://i.pravatar.cc/80?u=charlie' },
  { id: 4, userName: 'Diana Prince', rating: 4, comment: 'Great overview of the subject. Looking forward to more!', date: '2025-11-15', avatar: 'https://i.pravatar.cc/80?u=diana' },
  { id: 5, userName: 'Evan Wright', rating: 3, comment: 'Good information, but could use more practical exercises.', date: '2025-10-20', avatar: 'https://i.pravatar.cc/80?u=evan' },
];

export const getCourseReviews = async (courseKey) => {
  return MOCK_REVIEWS.sort(() => 0.5 - Math.random()).slice(0, 3);
};

export const getPosterUrl = (path) => {
  if (!path) return null;
  return path;
};

export const PLACEHOLDER_POSTER = 'https://via.placeholder.com/500x750?text=Learning+Pulse';

export const prefetchImages = async (urls) => {
  if (!urls || urls.length === 0) return;
};

// --- AUTH SERVICES ---
const getRegisteredUsers = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : {};
  } catch (e) {
    return {};
  }
};

const saveRegisteredUser = async (email, userData) => {
  try {
    const users = await getRegisteredUsers();
    users[email.toLowerCase()] = userData;
    await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save registered user', e);
  }
};

export const loginUser = async (emailOrUsername, password) => {
  const registeredUsers = await getRegisteredUsers();
  const userKey = emailOrUsername.toLowerCase();

  if (registeredUsers[userKey]) {
    const localUser = registeredUsers[userKey];
    if (localUser.password === password) {
      return localUser;
    } else {
      throw new Error('Invalid email/username or password');
    }
  }

  try {
    const response = await authApi.post('/auth/login', {
      username: emailOrUsername,
      password: password,
    });

    if (response.data && (response.data.accessToken || response.data.token)) {
      return {
        ...response.data,
        name: `${response.data.firstName} ${response.data.lastName}`,
        token: response.data.accessToken || response.data.token,
      };
    }
    throw new Error('Invalid response from server');
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (name, email, password) => {
  const registeredUsers = await getRegisteredUsers();
  const userKey = email.toLowerCase();

  if (registeredUsers[userKey]) {
    throw new Error('Email already exists');
  }

  const userId = Date.now();
  const user = {
    id: userId,
    name: name,
    email: email.toLowerCase(),
    username: email.toLowerCase(),
    password: password,
    token: `mock-token-${userId}-${Date.now()}`,
  };

  await saveRegisteredUser(email, user);
  return user;
};
