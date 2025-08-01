# 🚀 Supabase Backend Integration Setup

## **📋 Overview**
This guide will help you set up Supabase as the backend for the Pepperoni Pizza delivery system.

## **🎯 What we're implementing:**
- ✅ Real database with PostgreSQL
- ✅ User authentication and authorization
- ✅ Real-time order updates
- ✅ Driver assignment and tracking
- ✅ Order status management
- ✅ Location-based filtering

## **🛠️ Setup Steps:**

### **1. Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Note down your project URL and anon key

### **2. Install Dependencies**
```bash
npm install @supabase/supabase-js
```

### **3. Environment Variables**
Create a `.env.local` file in your project root:
```env
VITE_SUPABASE_URL=https://upomlventbesrgpgwlxo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwb21sdmVudGJlc3JncGd3bHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMTQ3NjIsImV4cCI6MjA2OTU5MDc2Mn0.v9VfJO9OTl6s7_q3Z8VLKQEzNh54hrbBDTuqboTKthQ
```

### **4. Database Setup**
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL script

### **5. Test the Integration**
1. Start your development server: `npm run dev`
2. Test login with:
   - **Admin**: username: `admin`, password: `admin`
   - **Staff**: username: `staff`, password: `staff`
   - **Driver**: username: `driver`, password: `driver`

## **🗄️ Database Schema:**

### **Tables:**
- **`locations`** - Restaurant locations
- **`users`** - Admin, staff, and driver accounts
- **`drivers`** - Driver information and status
- **`orders`** - Order details and status
- **`order_items`** - Individual items in each order

### **Key Features:**
- **Auto-incrementing order numbers** (starting from 601)
- **Real-time subscriptions** for live updates
- **Row Level Security** for data protection
- **Foreign key relationships** for data integrity

## **🔄 Real-time Features:**
- **Live order updates** - Staff sees new orders instantly
- **Driver status changes** - Real-time availability updates
- **Order status tracking** - From "pranuar" to "perfunduar"

## **🔐 Authentication:**
Currently using simple username/password matching. For production:
1. Enable Supabase Auth
2. Implement proper password hashing
3. Add JWT token management

## **📱 API Endpoints:**
All database operations are handled through the service functions in `src/services/database.ts`:
- `authService` - User authentication
- `locationService` - Location management
- `driverService` - Driver operations
- `orderService` - Order management
- `realtimeService` - Real-time subscriptions

## **🚀 Next Steps:**
1. **Set up Supabase project** and run the schema
2. **Add environment variables**
3. **Test the integration**
4. **Deploy to production**

## **⚠️ Important Notes:**
- Keep your environment variables secure
- Never commit `.env.local` to version control
- Test thoroughly before deploying to production
- Consider implementing proper authentication for production use

## **🆘 Troubleshooting:**
- **Connection issues**: Check your Supabase URL and key
- **Data not loading**: Verify the schema was applied correctly
- **Real-time not working**: Check your Supabase project settings

---

**Ready to integrate? Let's make this delivery system fully functional! 🍕🚗** 