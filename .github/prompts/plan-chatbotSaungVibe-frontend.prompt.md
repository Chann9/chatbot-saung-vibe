# Plan: Implement React Chatbot Frontend with Mock API

**TL;DR:** Create a new React + Vite + TypeScript + Tailwind CSS frontend from scratch. First, establish the project structure and mock API layer to match all 17 API endpoints from `client.http`. Implement core features: authentication (login/register), chat conversations, real-time messaging with typing                                                                                                                                                indicators, user profiles, and admin dashboard. Later, swap mock API for real backend integration.

## Implementation Steps

### 1. Initialize Vite React Project
- Create a new Vite React project with TypeScript template
- Install additional dependencies:
  - `axios` or `fetch` for HTTP client
  - `zustand` for state management
  - `react-router-dom` for routing and protected routes
  - `tailwindcss` with its dependencies
  - Development tools: `vite`, `typescript`, `@types/react`, `@types/react-dom`

### 2. Create Mock API Service Layer
- Create `src/services/api.ts` with mock implementations of all 17 endpoints
- Create `src/services/mockData.ts` with hard-coded mock data:
  - Users (admin account: `admin`/`admin123`, sample test users)
  - Conversations with messages
  - Statistics data
  - AI responses (predefined response pool)
- Simulate network latency (100-2000ms delays)
- Include realistic error responses (validation errors, auth failures, unauthorized access)

### 3. Build Authentication System
- Create `src/context/AuthContext.tsx` for global auth state management
- Create login page (`src/pages/Login.tsx`)
- Create register page (`src/pages/Register.tsx`)
- Implement JWT token storage in localStorage
- Create protected route wrapper for authenticated pages
- Implement token refresh logic
- Add logout functionality

### 4. Implement Chat Interface
- Create main chat page (`src/pages/Chat.tsx`)
- Create components:
  - `ConversationList.tsx` - sidebar showing all conversations
  - `ChatWindow.tsx` - main chat area
  - `MessageBubble.tsx` - individual message display (user vs AI styling)
  - `ChatHeader.tsx` - conversation title and options (rename, delete)
  - `MessageInput.tsx` - input field and send button
  - `TypingIndicator.tsx` - animated "AI is typing" indicator
- Implement conversation CRUD operations (create, read, list, update, delete)
- Implement messaging: send user message and receive AI response
- Add typing indicator when AI is processing
- Auto-scroll to latest messages
- Display message timestamps

### 5. Create Admin Dashboard
- Create admin layout with separate navigation
- Admin users page (`src/pages/admin/Users.tsx`):
  - List all users with pagination
  - View user details
  - Update user chat limit
  - Delete users
  - View user's conversations and message count
- Admin statistics page (`src/pages/admin/Statistics.tsx`):
  - Total users count
  - Total conversations count
  - Total messages count
  - System health status
  - User distribution charts
- Implement admin-only route protection (check role in AuthContext)

### 6. Create Core Components & Layouts
- `Layout.tsx` - main app layout with header, sidebar
- `UserMenu.tsx` - dropdown menu with profile and logout (top-right corner)
- `Sidebar.tsx` - navigation sidebar with new conversation button
- `Header.tsx` - header with branding and user info
- Error boundary component for error handling
- Toast notification component for feedback

### 7. Configure Tailwind CSS
- Create `tailwind.config.ts` with custom theme:
  - Primary color: `#a8dadc`
  - Secondary color: `#457b9d`
  - Accent colors: `#00b4d8`, `#ade8f4`
  - Light mode by default
- Create global styles in `src/index.css`
- Use consistent spacing, typography, and component styling

### 8. Implement Routing
- Create `src/Router.tsx` with routes:
  - Public routes: `/login`, `/register`
  - Protected user routes: `/`, `/chat/:id`, `/profile`
  - Protected admin routes: `/admin/users`, `/admin/statistics`
- Implement `ProtectedRoute` component to redirect unauthenticated users to login
- Implement admin-only route protection

### 9. Add State Management with Context API + useReducer
- Create `src/context/AppContext.tsx` with global app context
- Create `src/reducers/authReducer.ts` - auth state reducer (user, token, login/logout actions)
- Create `src/reducers/chatReducer.ts` - chat state reducer (conversations, messages, current conversation actions)
- Create `src/reducers/adminReducer.ts` - admin state reducer (users list, statistics actions)
- Create custom hooks:
  - `useAuth()` - access auth state and dispatch
  - `useChat()` - access chat state and dispatch
  - `useAdmin()` - access admin state and dispatch
- Use `useReducer` hook for predictable state updates

### 10. Implement Error Handling & UI Feedback
- Create toast notification system
- Add error boundaries for crash handling
- Implement loading states for API calls
- Add validation for forms (login, register, chat input)
- Display appropriate error messages to users

## API Endpoints to Mock

### Authentication (4 endpoints)
1. `POST /api/auth/register` - Register new user
2. `POST /api/auth/login` - Login user
3. `GET /api/auth/profile` - Get user profile
4. `POST /api/auth/refresh-token` - Refresh JWT token

### Chat (7 endpoints)
5. `POST /api/chat` - Create new conversation
6. `GET /api/chat` - Get all conversations
7. `GET /api/chat/:id` - Get single conversation
8. `PUT /api/chat/:id` - Rename conversation
9. `POST /api/chat/:id/message` - Send message & get AI response
10. `GET /api/chat/:id/messages` - Get all messages
11. `DELETE /api/chat/:id` - Delete conversation

### Admin (5 endpoints)
12. `GET /api/admin/users` - Get all users
13. `GET /api/admin/users/:id` - Get single user
14. `PUT /api/admin/users/:id/settings` - Update user settings
15. `GET /api/admin/statistics` - Get statistics
16. `DELETE /api/admin/users/:id` - Delete user

### Health
17. `GET /api/health` - Health check

## Color Scheme & Branding

| Purpose | Color | Hex |
|---------|-------|-----|
| Primary | Seafoam | `#a8dadc` |
| Secondary | Steel Blue | `#457b9d` |
| Accent 1 | Cyan | `#00b4d8` |
| Accent 2 | Light Cyan | `#ade8f4` |

## File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ChatWindow.tsx
│   │   ├── ConversationList.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageInput.tsx
│   │   ├── ChatHeader.tsx
│   │   ├── TypingIndicator.tsx
│   │   ├── UserMenu.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── Toast.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Chat.tsx
│   │   ├── admin/
│   │   │   ├── Users.tsx
│   │   │   └── Statistics.tsx
│   ├── layouts/
│   │   ├── Layout.tsx
│   │   ├── AdminLayout.tsx
│   │   └── AuthLayout.tsx
│   ├── context/
│   │   └── AuthContext.tsx
   ├── context/
   │   ├── AppContext.tsx
   │   └── hooks.ts
   ├── reducers/
   │   ├── authReducer.ts
   │   ├── chatReducer.ts
   │   └── adminReducer.ts
│   ├── services/
│   │   ├── api.ts
│   │   └── mockData.ts
│   ├── utils/
│   │   └── validators.ts
│   ├── Router.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── types/
│       └── index.ts
├── public/
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

## Design Decisions to Clarify

1. **Mock API Behavior**
   - Should mock API randomly delay responses (100-2000ms)?
   - Should include realistic error responses?
   - Should AI responses be randomized or predefined?

2. **State Management**
   - Using Context API + useReducer for global state management
   - Action dispatching for all state changes (login, logout, send message, etc.)
   - How to handle real-time message updates (polling or immediate dispatch)?

3. **Typing Indicator**
   - Show animated dots ("...") or percentage?
   - Duration: 1-2 seconds or variable?

4. **Message Auto-scroll**
   - Auto-scroll on new messages?
   - Disable auto-scroll when user scrolls up?

5. **Error Handling**
   - Toast notifications or inline alerts?
   - Should failed requests retry automatically?

6. **Feature Priority**
   - Prioritize user chat features or include full admin dashboard in first phase?

7. **Persistence**
   - Should conversations/messages persist in localStorage (simulated cache)?
   - Or fresh mock data each session?

## Success Criteria

- ✅ Frontend project initialized with all required dependencies
- ✅ Mock API fully implements all 17 endpoints
- ✅ Users can register, login, and maintain persistent sessions
- ✅ Users can create, view, rename, and delete conversations
- ✅ Users can send messages and receive mock AI responses
- ✅ Typing indicator displays while "AI is thinking"
- ✅ Admin users can view and manage other users
- ✅ Admin users can view system statistics
- ✅ All pages use Tailwind CSS with brand colors
- ✅ Routing works with protected routes for authenticated/admin-only pages
- ✅ Error handling and user feedback is clear and helpful
- ✅ Ready for backend API integration in next phase
