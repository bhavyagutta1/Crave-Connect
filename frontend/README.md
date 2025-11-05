# CraveConnect Frontend

React-based frontend for CraveConnect food community platform.

## 🚀 Quick Start

```bash
npm install
npm start
```

Visit: `http://localhost:3000`

## 📝 Environment Variables

Create `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000
```

## 🎨 Features

- **Responsive Design** - Mobile-first approach
- **Dark/Light Theme** - Toggle with persistent preference
- **Real-time Updates** - Socket.io integration
- **Smooth Animations** - Tailwind transitions
- **Accessibility** - ARIA labels and focus indicators

## 📁 Project Structure

```
src/
├── components/       # Reusable components
│   ├── Navbar.js
│   ├── RecipeCard.js
│   ├── LoadingSpinner.js
│   └── ProtectedRoute.js
├── context/          # React Context providers
│   ├── AuthContext.js
│   ├── ThemeContext.js
│   └── SocketContext.js
├── pages/            # Page components
│   ├── Home.js
│   ├── Login.js
│   ├── Register.js
│   ├── AllRecipes.js
│   ├── RecipeDetail.js
│   ├── PostRecipe.js
│   ├── Chat.js
│   ├── TopChefs.js
│   ├── Profile.js
│   └── AdminPanel.js
├── utils/            # Utility functions
│   └── api.js
├── App.js            # Main app component
├── index.js          # Entry point
└── index.css         # Global styles
```

## 🎨 Styling

### Tailwind CSS Configuration

Custom color palette:
- **Primary**: Vibrant Red (#f43f5e)
- **Accent**: Warm Orange (#f97316)
- **Soft**: Soft Pink (#ec4899)

### Fonts
- **Poppins** - Body text
- **Montserrat** - Headings

### Dark Mode

Toggle between light and dark themes. Preference is saved to localStorage.

## 🔐 Authentication

### Login
```javascript
const { login } = useAuth();
await login(email, password);
```

### Register
```javascript
const { register } = useAuth();
await register(username, email, password, role);
```

### Protected Routes
```javascript
<ProtectedRoute>
  <Chat />
</ProtectedRoute>

<ProtectedRoute requireChef>
  <PostRecipe />
</ProtectedRoute>

<ProtectedRoute requireAdmin>
  <AdminPanel />
</ProtectedRoute>
```

## 🔌 Real-time Features

### Socket.io Connection
```javascript
const { socket, connected, activeUsers } = useSocket();

// Send message
socket.emit('chat:message', messageData);

// Listen for messages
socket.on('chat:message', (message) => {
  // Handle message
});
```

## 📱 Pages

### Home
- Hero section
- Category browsing
- Trending recipes
- Featured recipes
- Top chefs preview

### All Recipes
- Search functionality
- Advanced filters
- Pagination
- Recipe grid

### Recipe Detail
- Full recipe view
- Ingredients & instructions
- Like & bookmark
- 5-star rating
- Comments section
- Chef info

### Post Recipe
- Rich form with validation
- Image preview
- Dynamic ingredient/instruction fields
- Tag management

### Chat
- Real-time messaging
- Active users list
- Typing indicators
- Message history

### Top Chefs
- Weekly leaderboard
- Podium display
- Points breakdown
- Badges showcase

### Profile
- User info & stats
- Recipe collection
- Bookmarks (own profile)
- Followers/Following lists
- Follow/unfollow

### Admin Panel
- Dashboard stats
- Pending recipe approvals
- User management
- Comment moderation
- Weekly points reset

## 🛠️ Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

## 📦 Dependencies

- **react** - UI library
- **react-router-dom** - Routing
- **tailwindcss** - Styling
- **axios** - HTTP client
- **socket.io-client** - Real-time communication
- **react-hot-toast** - Notifications
- **lucide-react** - Icons
- **date-fns** - Date formatting

## 🎯 API Integration

All API calls are centralized in `src/utils/api.js`:

```javascript
import { recipeAPI, userAPI, chatAPI, adminAPI } from './utils/api';

// Get recipes
const recipes = await recipeAPI.getAll({ cuisine: 'Italian' });

// Like recipe
await recipeAPI.like(recipeId);

// Follow user
await userAPI.follow(userId);
```

## 🌐 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Push to GitHub
2. Import project in Vercel
3. Set environment variable: `REACT_APP_API_URL`
4. Deploy

### Deploy to Netlify
1. Build project: `npm run build`
2. Drag `build` folder to Netlify
3. Set environment variable in Netlify dashboard

## 🎨 Customization

### Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: { ... },
  accent: { ... },
  soft: { ... }
}
```

### Fonts
Edit `public/index.html` Google Fonts link and `tailwind.config.js`

## 🐛 Troubleshooting

### Styles not loading
- Clear browser cache
- Restart dev server
- Check Tailwind config

### API connection failed
- Verify backend is running
- Check `.env` file
- Verify CORS settings

### Socket.io not connecting
- Check backend Socket.io server
- Verify API URL in `.env`
- Check browser console

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## ♿ Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Screen reader support

## 🎉 Features Showcase

Try these features:
- ✅ Search recipes
- ✅ Filter by cuisine/category
- ✅ Like and bookmark
- ✅ Rate recipes
- ✅ Real-time chat
- ✅ Follow users
- ✅ Dark mode toggle
- ✅ Responsive design
