import type {
  User,
  Conversation,
  Message,
  SystemStatistics,
} from '../types/index';

// Hard-coded mock users
export const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@saungvibe.com',
    role: 'ADMIN',
    chatLimit: 100,
    totalChats: 5,
    totalMessages: 45,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-05-10T00:00:00Z',
  },
  {
    id: 2,
    username: 'testuser',
    email: 'test@example.com',
    role: 'USER',
    chatLimit: 10,
    totalChats: 3,
    totalMessages: 28,
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-05-10T00:00:00Z',
  },
  {
    id: 3,
    username: 'johndoe',
    email: 'john@example.com',
    role: 'USER',
    chatLimit: 10,
    totalChats: 2,
    totalMessages: 12,
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-05-10T00:00:00Z',
  },
  {
    id: 4,
    username: 'janedoe',
    email: 'jane@example.com',
    role: 'USER',
    chatLimit: 10,
    totalChats: 1,
    totalMessages: 5,
    createdAt: '2026-04-10T00:00:00Z',
    updatedAt: '2026-05-10T00:00:00Z',
  },
];

// Hard-coded mock conversations
export const mockConversations: Conversation[] = [
  {
    id: 1,
    userId: 2,
    title: 'Programming Tips',
    messageCount: 8,
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-05-09T15:30:00Z',
  },
  {
    id: 2,
    userId: 2,
    title: 'Web Development Discussion',
    messageCount: 12,
    createdAt: '2026-04-28T14:20:00Z',
    updatedAt: '2026-05-08T09:15:00Z',
  },
  {
    id: 3,
    userId: 2,
    title: 'React Questions',
    messageCount: 8,
    createdAt: '2026-04-20T08:45:00Z',
    updatedAt: '2026-05-06T16:00:00Z',
  },
  {
    id: 4,
    userId: 1,
    title: 'Admin Tasks',
    messageCount: 15,
    createdAt: '2026-05-05T11:30:00Z',
    updatedAt: '2026-05-09T13:45:00Z',
  },
  {
    id: 5,
    userId: 1,
    title: 'System Architecture',
    messageCount: 20,
    createdAt: '2026-04-15T09:00:00Z',
    updatedAt: '2026-05-07T10:20:00Z',
  },
];

// Hard-coded mock messages
export const mockMessages: Message[] = [
  {
    id: 1,
    conversationId: 1,
    sender: 'user',
    content: 'Apa itu REST API?',
    createdAt: '2026-05-01T10:05:00Z',
  },
  {
    id: 2,
    conversationId: 1,
    sender: 'ai',
    content:
      'REST API (Representational State Transfer Application Programming Interface) adalah arsitektur web yang menggunakan HTTP methods (GET, POST, PUT, DELETE) untuk melakukan operasi CRUD pada resources. Setiap resource diidentifikasi dengan URI unik, dan komunikasi dilakukan melalui standard HTTP protocols.',
    createdAt: '2026-05-01T10:06:00Z',
  },
  {
    id: 3,
    conversationId: 1,
    sender: 'user',
    content: 'Berapa perbedaan antara REST dan GraphQL?',
    createdAt: '2026-05-01T10:10:00Z',
  },
  {
    id: 4,
    conversationId: 1,
    sender: 'ai',
    content:
      'REST menggunakan multiple endpoints untuk berbagai resources, sementara GraphQL menggunakan single endpoint dan memungkinkan client untuk request exactly data yang diperlukan. GraphQL lebih efficient untuk data fetching kompleks, namun REST lebih simple dan cache-friendly.',
    createdAt: '2026-05-01T10:11:00Z',
  },
  {
    id: 5,
    conversationId: 2,
    sender: 'user',
    content: 'Bagaimana cara membuat responsive website?',
    createdAt: '2026-04-28T14:25:00Z',
  },
  {
    id: 6,
    conversationId: 2,
    sender: 'ai',
    content:
      'Untuk membuat responsive website, gunakan: 1) Viewport meta tag, 2) Flexible layouts dengan CSS Grid/Flexbox, 3) Media queries untuk different screen sizes, 4) Responsive images, 5) Mobile-first approach. Framework seperti Tailwind CSS dapat memudahkan proses ini.',
    createdAt: '2026-04-28T14:26:00Z',
  },
  {
    id: 7,
    conversationId: 3,
    sender: 'user',
    content: 'Apa itu React hooks?',
    createdAt: '2026-04-20T08:50:00Z',
  },
  {
    id: 8,
    conversationId: 3,
    sender: 'ai',
    content:
      'React Hooks adalah functions yang memungkinkan Anda untuk menggunakan state dan features lain dari React tanpa menulis class components. Beberapa hooks populer: useState untuk state management, useEffect untuk side effects, useContext untuk prop drilling, dan useReducer untuk complex state logic.',
    createdAt: '2026-04-20T08:51:00Z',
  },
];

// Hard-coded system statistics
export const mockStatistics: SystemStatistics = {
  totalUsers: 4,
  totalConversations: 5,
  totalMessages: 47,
  activeUsers: 3,
  averageChatsPerUser: 1.25,
  averageMessagesPerChat: 9.4,
};

// Predefined AI responses pool
export const aiResponsesPool = [
  'Itu adalah pertanyaan yang bagus! Mari kita bahas lebih lanjut.',
  'Berdasarkan pengetahuan saya, {topic} adalah konsep penting dalam programming modern.',
  'Ada beberapa cara untuk melakukan itu. Cara yang paling umum adalah menggunakan {method}.',
  'Itu tergantung pada use case spesifik Anda. Namun, generally speaking, {recommendation}.',
  'Great question! {topic} memiliki beberapa keuntungan dan kerugian yang perlu dipertimbangkan.',
  'Saya akan menjelaskan {topic} dengan contoh praktis yang mudah dipahami.',
  'Ada best practices yang harus diikuti ketika mengimplementasikan {topic}.',
  'Pertanyaan yang sangat relevan! Banyak developers menghadapi challenge yang sama dengan {topic}.',
];

// Predefined keywords mapping for AI responses
export const keywordResponses: Record<string, string> = {
  api: 'API (Application Programming Interface) adalah interface yang memungkinkan different software applications untuk berkomunikasi satu sama lain. API mendefinisikan methods dan data formats yang bisa digunakan oleh developers.',
  database: 'Database adalah organized collection dari data yang disimpan dan accessed secara efisien. Ada relational databases (SQL) dan non-relational (NoSQL). Pilihan tergantung pada struktur data dan requirements aplikasi Anda.',
  react: 'React adalah JavaScript library untuk membangun user interfaces dengan components. React menggunakan virtual DOM untuk optimasi rendering, dan mendukung state management dengan hooks modern.',
  typescript: 'TypeScript adalah superset dari JavaScript yang menambahkan static typing. Dengan TypeScript, Anda dapat catch errors sebelum runtime dan membuat code lebih maintainable dan scalable.',
  nodejs: 'Node.js adalah JavaScript runtime yang memungkinkan running JavaScript di server side. Node.js event-driven, non-blocking I/O model membuatnya ideal untuk building scalable network applications.',
  authentication: 'Authentication adalah proses verifikasi identity dari user. Common methods: username/password, tokens (JWT), OAuth, dan biometric. Penting untuk security dan privacy.',
  git: 'Git adalah version control system yang powerful untuk tracking changes dalam code. Basic commands: git add, git commit, git push, git pull. Git memudahkan collaboration antar developers.',
};

// Utility function to get appropriate AI response
export function generateAIResponse(userMessage: string): string {
  const messageLower = userMessage.toLowerCase();

  // Check if message contains keywords
  for (const [keyword, response] of Object.entries(keywordResponses)) {
    if (messageLower.includes(keyword)) {
      return response;
    }
  }

  // Return random response from pool if no keyword matched
  const randomResponse =
    aiResponsesPool[Math.floor(Math.random() * aiResponsesPool.length)];
  return randomResponse;
}
