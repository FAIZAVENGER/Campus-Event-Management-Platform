// Campus Event Management Platform - Prototype Implementation
// This is a Node.js/Express backend with PostgreSQL

// ===== PACKAGE.JSON =====
/*
{
  "name": "campus-event-management",
  "version": "1.0.0",
  "description": "Event management platform for Dayananda Sagar University",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "init-db": "node scripts/init-database.js",
    "seed": "node scripts/seed-data.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "pg": "^8.8.0",
    "cors": "^2.8.5",
    "helmet": "^6.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "joi": "^17.7.0",
    "dotenv": "^16.0.0",
    "multer": "^1.4.5"
  },
  "devDependencies": {
    "nodemon": "^2.0.0"
  }
}
*/

// ===== SERVER.JS =====
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Database connection
const { Pool } = require('pg');
const db = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'campus_events',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Routes
app.use('/api/v1/events', require('./routes/events'));
app.use('/api/v1/students', require('./routes/students'));
app.use('/api/v1/reports', require('./routes/reports'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ===== DATABASE INITIALIZATION SCRIPT =====
// scripts/init-database.js
const { Pool } = require('pg');

const initDatabase = async () => {
  const db = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'campus_events',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
  });

  try {
    // Create tables
    await db.query(`
      CREATE TABLE IF NOT EXISTS colleges (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(10) UNIQUE NOT NULL,
        domain VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS event_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        event_id VARCHAR(20) UNIQUE NOT NULL,
        college_id INTEGER REFERENCES colleges(id),
        category_id INTEGER REFERENCES event_categories(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        venue VARCHAR(255),
        event_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        capacity INTEGER DEFAULT 100,
        registration_deadline TIMESTAMP,
        image_url VARCHAR(500),
        created_by INTEGER,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        college_id INTEGER REFERENCES colleges(id),
        student_id VARCHAR(20) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(15),
        year_of_study INTEGER,
        department VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS event_registrations (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id),
        student_id INTEGER REFERENCES students(id),
        registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'registered',
        UNIQUE(event_id, student_id)
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS event_attendance (
        id SERIAL PRIMARY KEY,
        registration_id INTEGER REFERENCES event_registrations(id),
        check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        check_in_method VARCHAR(20) DEFAULT 'manual',
        verified_by INTEGER,
        UNIQUE(registration_id)
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS event_feedback (
        id SERIAL PRIMARY KEY,
        registration_id INTEGER REFERENCES event_registrations(id),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(registration_id)
      );
    `);

    // Create indexes
    await db.query('CREATE INDEX IF NOT EXISTS idx_events_college_date ON events(college_id, event_date);');
    await db.query('CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);');
    await db.query('CREATE INDEX IF NOT EXISTS idx_registrations_event ON event_registrations(event_id);');

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Database initialization failed:', error);
  } finally {
    await db.end();
  }
};

if (require.main === module) {
  initDatabase();
}

// ===== EVENT ROUTES =====
// routes/events.js
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const db = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'campus_events',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Get all events (public endpoint)
router.get('/public', async (req, res) => {
  try {
    const { college_id, category_id, date_from, limit = 20, offset = 0 } = req.query;
    
    let query = `
      SELECT e.*, c.name as college_name, cat.name as category_name,
             COUNT(er.id) as registration_count
      FROM events e
      LEFT JOIN colleges c ON e.college_id = c.id
      LEFT JOIN event_categories cat ON e.category_id = cat.id
      LEFT JOIN event_registrations er ON e.id = er.event_id AND er.status = 'registered'
      WHERE e.status = 'active'
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (college_id) {
      query += ` AND e.college_id = $${paramIndex++}`;
      params.push(college_id);
    }
    
    if (category_id) {
      query += ` AND e.category_id = $${paramIndex++}`;
      params.push(category_id);
    }
    
    if (date_from) {
      query += ` AND e.event_date >= $${paramIndex++}`;
      params.push(date_from);
    }
    
    query += ` GROUP BY e.id, c.name, cat.name ORDER BY e.event_date ASC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    res.json({
      events: result.rows,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: result.rows.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events', details: error.message });
  }
});

// Register student for event
router.post('/:event_id/register', async (req, res) => {
  try {
    const { event_id } = req.params;
    const { student_id } = req.body; // In real app, this would come from JWT token
    
    // Check event capacity
    const eventResult = await db.query(`
      SELECT e.capacity, COUNT(er.id) as current_registrations
      FROM events e
      LEFT JOIN event_registrations er ON e.id = er.event_id AND er.status = 'registered'
      WHERE e.id = $1 AND e.status = 'active'
      GROUP BY e.id, e.capacity
    `, [event_id]);
    
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found or inactive' });
    }
    
    const event = eventResult.rows[0];
    if (event.current_registrations >= event.capacity) {
      return res.status(409).json({ 
        error: 'Event is at full capacity',
        waitlist_available: true
      });
    }
    
    // Register student
    const registrationResult = await db.query(`
      INSERT INTO event_registrations (event_id, student_id)
      VALUES ($1, $2)
      RETURNING *
    `, [event_id, student_id]);
    
    res.status(201).json({
      message: 'Registration successful',
      registration: registrationResult.rows[0]
    });
    
  } catch (error) {
    if (error.constraint === 'event_registrations_event_id_student_id_key') {
      return res.status(409).json({ error: 'Already registered for this event' });
    }
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// Mark attendance
router.post('/:event_id/attendance', async (req, res) => {
  try {
    const { event_id } = req.params;
    const { student_ids, check_in_method = 'manual' } = req.body;
    
    const attendanceRecords = [];
    
    for (const student_id of student_ids) {
      // Find registration
      const registrationResult = await db.query(`
        SELECT id FROM event_registrations 
        WHERE event_id = $1 AND student_id = $2 AND status = 'registered'
      `, [event_id, student_id]);
      
      if (registrationResult.rows.length > 0) {
        const registration_id = registrationResult.rows[0].id;
        
        // Mark attendance (ignore if already marked)
        try {
          const attendanceResult = await db.query(`
            INSERT INTO event_attendance (registration_id, check_in_method)
            VALUES ($1, $2)
            RETURNING *
          `, [registration_id, check_in_method]);
          
          attendanceRecords.push({
            student_id,
            status: 'marked',
            record: attendanceResult.rows[0]
          });
        } catch (duplicateError) {
          attendanceRecords.push({
            student_id,
            status: 'already_marked'
          });
        }
      } else {
        attendanceRecords.push({
          student_id,
          status: 'not_registered'
        });
      }
    }
    
    res.json({
      message: 'Attendance processing completed',
      results: attendanceRecords
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark attendance', details: error.message });
  }
});

// Submit feedback
router.post('/:event_id/feedback', async (req, res) => {
  try {
    const { event_id } = req.params;
    const { student_id, rating, comment } = req.body;
    
    // Find registration
    const registrationResult = await db.query(`
      SELECT id FROM event_registrations 
      WHERE event_id = $1 AND student_id = $2
    `, [event_id, student_id]);
    
    if (registrationResult.rows.length === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    
    const registration_id = registrationResult.rows[0].id;
    
    // Submit feedback
    const feedbackResult = await db.query(`
      INSERT INTO event_feedback (registration_id, rating, comment)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [registration_id, rating, comment]);
    
    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: feedbackResult.rows[0]
    });
    
  } catch (error) {
    if (error.constraint === 'event_feedback_registration_id_key') {
      return res.status(409).json({ error: 'Feedback already submitted for this event' });
    }
    res.status(500).json({ error: 'Failed to submit feedback', details: error.message });
  }
});

module.exports = router;

// ===== STUDENT ROUTES =====
// routes/students.js
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const db = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'campus_events',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Get student's registrations
router.get('/:student_id/registrations', async (req, res) => {
  try {
    const { student_id } = req.params;
    
    const result = await db.query(`
      SELECT 
        e.title, e.event_date, e.start_time, e.venue,
        er.registration_date, er.status as registration_status,
        CASE WHEN ea.id IS NOT NULL THEN 'attended' ELSE 'registered' END as attendance_status,
        ea.check_in_time,
        ef.rating, ef.comment as feedback_comment
      FROM event_registrations er
      JOIN events e ON er.event_id = e.id
      LEFT JOIN event_attendance ea ON er.id = ea.registration_id
      LEFT JOIN event_feedback ef ON er.id = ef.registration_id
      WHERE er.student_id = $1
      ORDER BY e.event_date DESC
    `, [student_id]);
    
    res.json({ registrations: result.rows });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch registrations', details: error.message });
  }
});

module.exports = router;

// ===== REPORTS ROUTES =====
// routes/reports.js
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const db = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'campus_events',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Event popularity report (sorted by registrations)
router.get('/events/popularity', async (req, res) => {
  try {
    const { college_id, semester, limit = 50 } = req.query;
    
    let query = `
      SELECT 
        e.title,
        e.event_date,
        e.venue,
        cat.name as category,
        COUNT(er.id) as total_registrations,
        COUNT(ea.id) as total_attendance,
        ROUND((COUNT(ea.id)::float / NULLIF(COUNT(er.id), 0)) * 100, 2) as attendance_percentage,
        COUNT(ef.id) as feedback_count,
        ROUND(AVG(ef.rating), 2) as avg_rating
      FROM events e
      LEFT JOIN event_categories cat ON e.category_id = cat.id
      LEFT JOIN event_registrations er ON e.id = er.event_id AND er.status = 'registered'
      LEFT JOIN event_attendance ea ON er.id = ea.registration_id
      LEFT JOIN event_feedback ef ON er.id = ef.registration_id
      WHERE e.status IN ('active', 'completed')
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (college_id) {
      query += ` AND e.college_id = ${paramIndex++}`;
      params.push(college_id);
    }
    
    // Simple semester filtering (assuming format like "2024-spring")
    if (semester) {
      const [year, term] = semester.split('-');
      if (term === 'spring') {
        query += ` AND e.event_date BETWEEN '${year}-01-01' AND '${year}-05-31'`;
      } else if (term === 'fall') {
        query += ` AND e.event_date BETWEEN '${year}-08-01' AND '${year}-12-31'`;
      }
    }
    
    query += ` GROUP BY e.id, e.title, e.event_date, e.venue, cat.name
               ORDER BY total_registrations DESC 
               LIMIT ${paramIndex}`;
    params.push(limit);
    
    const result = await db.query(query, params);
    
    res.json({
      report: 'Event Popularity Report',
      generated_at: new Date().toISOString(),
      events: result.rows
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate popularity report', details: error.message });
  }
});

// Student participation report
router.get('/students/participation', async (req, res) => {
  try {
    const { student_id, college_id } = req.query;
    
    if (student_id) {
      // Individual student report
      const result = await db.query(`
        SELECT 
          s.full_name,
          s.department,
          s.year_of_study,
          COUNT(er.id) as events_registered,
          COUNT(ea.id) as events_attended,
          ROUND((COUNT(ea.id)::float / NULLIF(COUNT(er.id), 0)) * 100, 2) as attendance_rate,
          COUNT(ef.id) as feedback_given,
          ROUND(AVG(ef.rating), 2) as avg_feedback_rating
        FROM students s
        LEFT JOIN event_registrations er ON s.id = er.student_id AND er.status = 'registered'
        LEFT JOIN event_attendance ea ON er.id = ea.registration_id
        LEFT JOIN event_feedback ef ON er.id = ef.registration_id
        WHERE s.id = $1
        GROUP BY s.id, s.full_name, s.department, s.year_of_study
      `, [student_id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
      
      res.json({ student_report: result.rows[0] });
      
    } else {
      // All students participation summary
      let query = `
        SELECT 
          s.full_name,
          s.student_id,
          s.department,
          COUNT(er.id) as events_registered,
          COUNT(ea.id) as events_attended,
          ROUND((COUNT(ea.id)::float / NULLIF(COUNT(er.id), 0)) * 100, 2) as attendance_rate
        FROM students s
        LEFT JOIN event_registrations er ON s.id = er.student_id AND er.status = 'registered'
        LEFT JOIN event_attendance ea ON er.id = ea.registration_id
      `;
      
      const params = [];
      let paramIndex = 1;
      
      if (college_id) {
        query += ` WHERE s.college_id = ${paramIndex++}`;
        params.push(college_id);
      }
      
      query += ` GROUP BY s.id, s.full_name, s.student_id, s.department
                 HAVING COUNT(er.id) > 0
                 ORDER BY events_attended DESC, events_registered DESC`;
      
      const result = await db.query(query, params);
      
      res.json({
        report: 'Student Participation Report',
        total_active_students: result.rows.length,
        students: result.rows
      });
    }
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate participation report', details: error.message });
  }
});

// Top 3 most active students
router.get('/students/top-active', async (req, res) => {
  try {
    const { college_id, limit = 3 } = req.query;
    
    let query = `
      SELECT 
        s.full_name,
        s.student_id,
        s.department,
        s.year_of_study,
        COUNT(er.id) as events_registered,
        COUNT(ea.id) as events_attended,
        COUNT(ef.id) as feedback_given,
        ROUND(AVG(ef.rating), 2) as avg_feedback_rating,
        -- Activity score calculation
        (COUNT(ea.id) * 3 + COUNT(ef.id) * 2 + COUNT(er.id)) as activity_score
      FROM students s
      LEFT JOIN event_registrations er ON s.id = er.student_id AND er.status = 'registered'
      LEFT JOIN event_attendance ea ON er.id = ea.registration_id
      LEFT JOIN event_feedback ef ON er.id = ef.registration_id
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (college_id) {
      query += ` WHERE s.college_id = ${paramIndex++}`;
      params.push(college_id);
    }
    
    query += ` GROUP BY s.id, s.full_name, s.student_id, s.department, s.year_of_study
               HAVING COUNT(er.id) > 0
               ORDER BY activity_score DESC, events_attended DESC
               LIMIT ${paramIndex}`;
    params.push(limit);
    
    const result = await db.query(query, params);
    
    res.json({
      report: 'Top Most Active Students',
      criteria: 'Based on attendance (3pts) + feedback (2pts) + registration (1pt)',
      top_students: result.rows
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate top active students report', details: error.message });
  }
});

// Flexible reports with filters
router.get('/events/custom', async (req, res) => {
  try {
    const { 
      college_id, 
      event_type, 
      date_from, 
      date_to, 
      min_registrations = 0,
      format = 'json' // json or csv
    } = req.query;
    
    let query = `
      SELECT 
        e.title,
        e.event_date,
        e.venue,
        cat.name as category,
        c.name as college_name,
        e.capacity,
        COUNT(er.id) as registrations,
        COUNT(ea.id) as attendance,
        ROUND((COUNT(ea.id)::float / NULLIF(COUNT(er.id), 0)) * 100, 2) as attendance_rate,
        ROUND(AVG(ef.rating), 2) as avg_rating,
        COUNT(ef.id) as feedback_responses
      FROM events e
      JOIN colleges c ON e.college_id = c.id
      LEFT JOIN event_categories cat ON e.category_id = cat.id
      LEFT JOIN event_registrations er ON e.id = er.event_id AND er.status = 'registered'
      LEFT JOIN event_attendance ea ON er.id = ea.registration_id
      LEFT JOIN event_feedback ef ON er.id = ef.registration_id
      WHERE e.status IN ('active', 'completed')
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (college_id) {
      query += ` AND e.college_id = ${paramIndex++}`;
      params.push(college_id);
    }
    
    if (event_type) {
      query += ` AND cat.name ILIKE ${paramIndex++}`;
      params.push(`%${event_type}%`);
    }
    
    if (date_from) {
      query += ` AND e.event_date >= ${paramIndex++}`;
      params.push(date_from);
    }
    
    if (date_to) {
      query += ` AND e.event_date <= ${paramIndex++}`;
      params.push(date_to);
    }
    
    query += ` GROUP BY e.id, e.title, e.event_date, e.venue, e.capacity, cat.name, c.name
               HAVING COUNT(er.id) >= ${paramIndex++}
               ORDER BY e.event_date DESC`;
    params.push(min_registrations);
    
    const result = await db.query(query, params);
    
    if (format === 'csv') {
      // Simple CSV generation
      const csvHeaders = Object.keys(result.rows[0] || {}).join(',');
      const csvRows = result.rows.map(row => 
        Object.values(row).map(val => `"${val}"`).join(',')
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="events_report.csv"');
      res.send(`${csvHeaders}\n${csvRows}`);
    } else {
      res.json({
        report: 'Custom Events Report',
        filters_applied: req.query,
        total_events: result.rows.length,
        events: result.rows
      });
    }
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate custom report', details: error.message });
  }
});

module.exports = router;

// ===== SEED DATA SCRIPT =====
// scripts/seed-data.js
const { Pool } = require('pg');

const seedData = async () => {
  const db = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'campus_events',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
  });

  try {
    // Insert colleges
    await db.query(`
      INSERT INTO colleges (name, code, domain) VALUES
      ('Dayananda Sagar University', 'DSU', 'dsu.edu.in'),
      ('MIT Manipal', 'MIT', 'mit.edu')
      ON CONFLICT (code) DO NOTHING
    `);

    // Insert event categories
    await db.query(`
      INSERT INTO event_categories (name, description) VALUES
      ('Technical', 'Workshops, hackathons, coding competitions'),
      ('Cultural', 'Music, dance, drama performances'),
      ('Sports', 'Athletic competitions and tournaments'),
      ('Academic', 'Seminars, conferences, guest lectures')
      ON CONFLICT DO NOTHING
    `);

    // Insert sample events
    await db.query(`
      INSERT INTO events (event_id, college_id, category_id, title, description, venue, event_date, start_time, end_time, capacity) VALUES
      ('DSU_EVT_001', 1, 1, 'AI/ML Workshop', 'Hands-on machine learning workshop with industry experts', 'Auditorium A', '2024-03-15', '10:00', '16:00', 100),
      ('DSU_EVT_002', 1, 2, 'Cultural Fest 2024', 'Annual cultural celebration with music, dance and drama', 'Main Ground', '2024-03-20', '09:00', '18:00', 500),
      ('DSU_EVT_003', 1, 1, 'Hackathon 2024', '48-hour coding competition', 'Computer Lab Block', '2024-03-25', '08:00', '20:00', 150)
      ON CONFLICT (event_id) DO NOTHING
    `);

    // Insert sample students
    await db.query(`
      INSERT INTO students (college_id, student_id, email, full_name, phone, year_of_study, department) VALUES
      (1, 'DSU2023001', 'john.doe@dsu.edu.in', 'John Doe', '9876543210', 2, 'Computer Science'),
      (1, 'DSU2023002', 'jane.smith@dsu.edu.in', 'Jane Smith', '9876543211', 3, 'Information Science'),
      (1, 'DSU2023003', 'bob.wilson@dsu.edu.in', 'Bob Wilson', '9876543212', 1, 'Electronics'),
      (1, 'DSU2023004', 'alice.brown@dsu.edu.in', 'Alice Brown', '9876543213', 4, 'Computer Science'),
      (1, 'DSU2023005', 'charlie.davis@dsu.edu.in', 'Charlie Davis', '9876543214', 2, 'Information Science')
      ON CONFLICT (email) DO NOTHING
    `);

    console.log('Sample data seeded successfully!');
    
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await db.end();
  }
};

if (require.main === module) {
  seedData();
}

// ===== ENVIRONMENT VARIABLES =====
// .env file
/*
DB_HOST=localhost
DB_PORT=5432
DB_NAME=campus_events
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-secret-key-here
NODE_ENV=development
*/