# Pepperoni Pizza Management System

A modern, real-time pizza delivery management system built with React, TypeScript, and Supabase.

## 🚀 Features

- **Real-time Updates**: Live synchronization across all dashboards
- **Multi-role Access**: Admin, Staff, and Driver dashboards
- **Order Management**: Complete order lifecycle tracking
- **Driver Assignment**: Intelligent driver allocation system
- **Location-based Operations**: Multi-location support
- **Responsive Design**: Mobile-first approach

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Real-time)
- **Deployment**: Netlify
- **State Management**: Custom React Hooks + Real-time subscriptions

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/your-username/pepperoni-app.git
cd pepperoni-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
Run the schema file in your Supabase SQL editor:
```sql
-- See supabase-schema.sql for complete database setup
```

### 5. Enable Real-time
In Supabase Dashboard:
1. Go to Database → Replication
2. Enable real-time for: `orders`, `drivers`, `staff` tables

### 6. Start development server
```bash
npm run dev
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── AdminDashboard.tsx
│   ├── StaffDashboard.tsx
│   ├── DriverDashboard.tsx
│   └── ...
├── services/           # API and database services
│   └── database.ts     # Supabase integration
├── lib/               # Configuration files
│   └── supabase.ts    # Supabase client
└── assets/            # Static assets
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the schema from `supabase-schema.sql`
3. Configure Row Level Security (RLS) policies
4. Enable real-time replication for tables

### Environment Variables
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## 📱 Usage

### Admin Dashboard
- Manage all orders across locations
- Add/edit staff and drivers
- View system analytics
- Monitor real-time updates

### Staff Dashboard
- View location-specific orders
- Update order status
- Assign drivers to orders
- Real-time notifications

### Driver Dashboard
- View assigned deliveries
- Update delivery status
- Real-time order updates

## 🚀 Deployment

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🔒 Security

- Row Level Security (RLS) enabled
- Role-based access control
- Secure authentication system
- Environment variable protection

## 📊 Performance

- Optimized real-time subscriptions
- Efficient state management
- Lazy loading components
- Minimal bundle size

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@pepperoni-app.com or create an issue in the repository.

---

**Built with ❤️ for efficient pizza delivery management** 