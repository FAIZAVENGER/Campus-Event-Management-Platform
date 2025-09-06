
A comprehensive event management system built for Dayananda Sagar University to streamline event creation, student registration, attendance tracking, and analytics.

![Reports Dashboard](https://github.com/FAIZAVENGER/Campus-Event-Management/main/reports-dashboard.png)

## 🎯 Overview

This project solves the common problem of managing campus events efficiently. Students often miss out on events due to poor communication, and administrators struggle to track participation and generate meaningful insights. My solution provides:

- **Student Mobile App**: Easy event discovery and registration
- **Admin Portal**: Comprehensive event management and analytics
- **Real-time Reporting**: Detailed insights on event popularity and student engagement

## 🚀 Features

### For Students
- Browse upcoming events with filters
- One-click event registration
- Personal dashboard with attendance history
- Event feedback and rating system
- Mobile-responsive design

### For Administrators
- Create and manage events
- Real-time attendance tracking
- Comprehensive analytics dashboard
- Student participation reports
- Export data in CSV format

### Reports & Analytics
- Event popularity rankings
- Student participation metrics
- Top active students leaderboard
- Custom reports with flexible filters
- Attendance percentage tracking

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Frontend**: React (for wireframes/mockups)
- **Authentication**: JWT tokens
- **Styling**: Tailwind CSS

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/campus-event-management.git
   cd campus-event-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database setup**
   ```bash
   # Create PostgreSQL database
   createdb campus_events
   
   # Or using psql
   psql -U postgres
   CREATE DATABASE campus_events;
   \q
   ```

4. **Environment configuration**
   ```bash
   # Create .env file
   cp .env.example .env
   ```
   
   Update `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=campus_events
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   PORT=3000
   ```

5. **Initialize database**
   ```bash
   # Create tables and schema
   node scripts/init-database.js
   
   # Add sample data (optional)
   node scripts/seed-data.js
   ```

6. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🧪 Testing

### API Testing
```bash
# Check if server is running
curl http://localhost:3000/api/v1/events/public?college_id=1

# Test event registration
curl -X POST http://localhost:3000/api/v1/events/1/register \
  -H "Content-Type: application/json" \
  -d '{"student_id": 1}'

# Mark attendance
curl -X POST http://localhost:3000/api/v1/events/1/attendance \
  -H "Content-Type: application/json" \
  -d '{"student_ids": [1, 2], "check_in_method": "manual"}'

# Get popularity report
curl http://localhost:3000/api/v1/reports/events/popularity?college_id=1
```

## 📊 API Endpoints

### Events
- `GET /api/v1/events/public` - Browse available events
- `POST /api/v1/events/:id/register` - Register for event
- `POST /api/v1/events/:id/attendance` - Mark attendance (admin)
- `POST /api/v1/events/:id/feedback` - Submit feedback

### Students
- `GET /api/v1/students/:id/registrations` - Get student's events

### Reports
- `GET /api/v1/reports/events/popularity` - Event popularity report
- `GET /api/v1/reports/students/participation` - Student participation
- `GET /api/v1/reports/students/top-active` - Most active students
- `GET /api/v1/reports/events/custom` - Custom reports with filters

## 🗄️ Database Schema

### Key Tables
- **colleges**: University information and settings
- **events**: Event details with capacity and timing
- **students**: Student profiles linked to colleges
- **event_registrations**: Registration records with constraints
- **event_attendance**: Attendance tracking
- **event_feedback**: Ratings and comments

### Relationships
```
colleges (1) ←→ (N) events
colleges (1) ←→ (N) students
events (1) ←→ (N) event_registrations
students (1) ←→ (N) event_registrations
event_registrations (1) ←→ (1) event_attendance
event_registrations (1) ←→ (1) event_feedback
```

## 📱 UI/UX Wireframes

The project includes interactive wireframes demonstrating:
- Student mobile app interface
- Event detail and registration flow
- Personal dashboard for students
- Admin portal with analytics
- Reports and data visualization

## 🎓 Learning Outcomes

Building this project taught me:

- **Database Design**: Handling concurrent registrations and data consistency
- **API Development**: RESTful endpoint design with proper error handling
- **Complex Queries**: Writing efficient SQL for reporting and analytics
- **User Experience**: Designing intuitive interfaces for different user types
- **System Architecture**: Planning for scalability and multi-tenancy

## 🚧 Current Limitations

- Authentication system needs JWT implementation
- Email notifications are placeholders
- Image upload functionality pending
- Real-time updates require WebSocket integration
- Mobile app needs separate frontend development

## 🔮 Future Enhancements

- [ ] QR code-based check-ins
- [ ] Push notifications for mobile users
- [ ] Advanced analytics dashboard with charts
- [ ] Event waitlist management
- [ ] Integration with college email systems
- [ ] Multi-language support
- [ ] Automated report generation

## 📈 Scale & Performance

Designed to handle:
- **50+ colleges**
- **500+ students per college**
- **20+ events per semester**
- **Concurrent registrations** with proper locking
- **Real-time attendance tracking**

## 🤝 Contributing

This is an academic project, but I welcome feedback and suggestions for improvements.

## 📄 License

This project is created for educational purposes as part of university coursework.

## 👨‍💻 About

Developed by [Your Name] as part of the Database Management Systems course at Dayananda Sagar University. The project demonstrates practical application of database design, backend development, and user interface design principles.

---

**Note**: This project showcases a complete event management solution from concept to implementation, including database design, API development, and user experience design.
