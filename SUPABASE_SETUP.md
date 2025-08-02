# Supabase Setup Guide

Complete setup guide for the Pepperoni Pizza Management System database.

## 🚀 Quick Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Database Schema
Run the complete schema from `supabase-schema.sql` in your Supabase SQL Editor.

### 3. Enable Real-time
1. Go to Database → Replication
2. Enable real-time for all tables:
   - ✅ `orders`
   - ✅ `drivers` 
   - ✅ `staff`
   - ✅ `locations`
   - ✅ `users`

### 4. Environment Variables
Add to your `.env` file:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 📊 Database Schema Overview

### Tables
- **users**: Admin users
- **locations**: Pizza locations
- **staff**: Staff members per location
- **drivers**: Delivery drivers
- **orders**: Customer orders
- **order_items**: Items in each order

### Key Features
- **Row Level Security (RLS)**: Enabled on all tables
- **Real-time subscriptions**: Live updates across dashboards
- **Automatic order numbering**: Trigger-based order numbers
- **Foreign key relationships**: Proper data integrity

## 🔒 Security Configuration

### RLS Policies
All tables have RLS enabled with appropriate policies:
- Location-based access for staff
- Role-based permissions
- Secure data access patterns

### Authentication
- Username/password authentication
- Role-based access control
- Secure session management

## 🔧 Advanced Configuration

### Performance Optimization
- Indexed foreign keys
- Optimized queries
- Efficient real-time subscriptions

### Monitoring
- Database logs enabled
- Performance metrics
- Error tracking

## 🚨 Troubleshooting

### Real-time Not Working
1. Check if replication is enabled
2. Verify environment variables
3. Check browser console for errors
4. Ensure proper table permissions

### Connection Issues
1. Verify Supabase URL and key
2. Check network connectivity
3. Review RLS policies
4. Check browser console

## 📈 Production Checklist

- [ ] Real-time enabled for all tables
- [ ] RLS policies configured
- [ ] Environment variables set
- [ ] Database backups enabled
- [ ] Monitoring configured
- [ ] Performance optimized

## 🔄 Maintenance

### Regular Tasks
- Monitor database performance
- Review access logs
- Update RLS policies as needed
- Backup data regularly

### Updates
- Keep Supabase client updated
- Monitor for security updates
- Review and update policies

---

**For support, refer to the main README.md or create an issue in the repository.** 