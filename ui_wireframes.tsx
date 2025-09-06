import React, { useState } from 'react';
import { Calendar, MapPin, Users, Star, BarChart3, Plus, Search, Filter, Bell, User, Home, List, TrendingUp } from 'lucide-react';

const InteractiveWireframes = () => {
  const [activeView, setActiveView] = useState('student-home');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([1]);

  // Sample data
  const events = [
    {
      id: 1,
      title: "AI/ML Workshop",
      date: "Mar 15, 2024",
      time: "10:00 AM - 4:00 PM",
      venue: "Auditorium A",
      registered: 85,
      capacity: 100,
      category: "Technical",
      description: "Hands-on machine learning workshop with industry experts",
      rating: 4.5
    },
    {
      id: 2,
      title: "Cultural Fest 2024",
      date: "Mar 20, 2024",
      time: "9:00 AM - 6:00 PM",
      venue: "Main Ground",
      registered: 450,
      capacity: 500,
      category: "Cultural",
      description: "Annual cultural celebration with music, dance and drama",
      rating: 4.2
    },
    {
      id: 3,
      title: "Hackathon 2024",
      date: "Mar 25, 2024",
      time: "8:00 AM - 8:00 PM",
      venue: "Computer Lab Block",
      registered: 120,
      capacity: 150,
      category: "Technical",
      description: "48-hour coding competition",
      rating: 4.7
    }
  ];

  const handleRegister = (eventId) => {
    if (!registeredEvents.includes(eventId)) {
      setRegisteredEvents([...registeredEvents, eventId]);
    }
  };

  const renderStudentHome = () => (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold">DSU Events</h1>
          <div className="flex gap-2">
            <Bell className="w-5 h-5" />
            <User className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          <div className="flex-1 bg-blue-500 rounded px-3 py-1 flex items-center gap-2">
            <Search className="w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search events..." 
              className="bg-transparent text-white placeholder-blue-200 text-sm outline-none flex-1"
            />
          </div>
          <Filter className="w-8 h-8 p-1 bg-blue-500 rounded" />
        </div>
      </div>

      {/* Events List */}
      <div className="p-4">
        <div className="flex gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">All</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Technical</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Cultural</span>
        </div>

        {events.map(event => (
          <div 
            key={event.id} 
            className="border rounded-lg p-3 mb-3 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              setSelectedEvent(event);
              setActiveView('event-detail');
            }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{event.title}</h3>
                <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <MapPin className="w-3 h-3" />
                  <span>{event.venue}</span>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded text-xs ${
                  event.category === 'Technical' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {event.category}
                </span>
                <div className="text-sm text-gray-600 mt-1">
                  {event.registered}/{event.capacity}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-gray-50 p-4 flex justify-around">
        <div 
          className={`flex flex-col items-center cursor-pointer ${activeView === 'student-home' ? 'text-blue-600' : 'text-gray-400'}`}
          onClick={() => setActiveView('student-home')}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs mt-1">Home</span>
        </div>
        <div 
          className={`flex flex-col items-center cursor-pointer ${activeView === 'my-events' ? 'text-blue-600' : 'text-gray-400'}`}
          onClick={() => setActiveView('my-events')}
        >
          <List className="w-5 h-5" />
          <span className="text-xs mt-1">My Events</span>
        </div>
        <div className="flex flex-col items-center text-gray-400 cursor-pointer">
          <BarChart3 className="w-5 h-5" />
          <span className="text-xs mt-1">Stats</span>
        </div>
      </div>
    </div>
  );

  const renderEventDetail = () => {
    if (!selectedEvent) {
      // Set default event if none selected
      const defaultEvent = events[0];
      setSelectedEvent(defaultEvent);
      return null;
    }

    return (
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveView('student-home')}
              className="text-white hover:text-blue-200"
            >
              ←
            </button>
            <h1 className="text-lg font-bold">Event Details</h1>
          </div>
        </div>

        <div className="p-4">
          {/* Event Image Placeholder */}
          <div className="w-full h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-white text-sm">Event Image</span>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedEvent.title}</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4" />
              <span>{selectedEvent.date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4" />
              <span>{selectedEvent.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Users className="w-4 h-4" />
              <span>{selectedEvent.registered}/{selectedEvent.capacity} registered</span>
            </div>
          </div>

          <p className="text-gray-600 mb-4">{selectedEvent.description}</p>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(selectedEvent.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({selectedEvent.rating})</span>
          </div>

          {registeredEvents.includes(selectedEvent.id) ? (
            <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium">
              ✓ Registered
            </button>
          ) : (
            <button 
              onClick={() => handleRegister(selectedEvent.id)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Register Now
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderMyEvents = () => (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-lg font-bold">My Events</h1>
      </div>

      <div className="p-4">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-blue-600">8</div>
            <div className="text-sm text-gray-600">Registered</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-green-600">6</div>
            <div className="text-sm text-gray-600">Attended</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-yellow-600">4.2</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
          {events.filter(e => registeredEvents.includes(e.id)).map(event => (
            <div key={event.id} className="border rounded-lg p-3">
              <h4 className="font-medium">{event.title}</h4>
              <div className="text-sm text-gray-600">{event.date} • {event.venue}</div>
              <div className="mt-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Registered</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-gray-50 p-4 flex justify-around">
        <div 
          className={`flex flex-col items-center cursor-pointer ${activeView === 'student-home' ? 'text-blue-600' : 'text-gray-400'}`}
          onClick={() => setActiveView('student-home')}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs mt-1">Home</span>
        </div>
        <div 
          className={`flex flex-col items-center cursor-pointer ${activeView === 'my-events' ? 'text-blue-600' : 'text-gray-400'}`}
          onClick={() => setActiveView('my-events')}
        >
          <List className="w-5 h-5" />
          <span className="text-xs mt-1">My Events</span>
        </div>
        <div className="flex flex-col items-center text-gray-400 cursor-pointer">
          <BarChart3 className="w-5 h-5" />
          <span className="text-xs mt-1">Stats</span>
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-900 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dayananda Sagar University</h1>
            <p className="text-blue-200">Event Management Portal</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" />
              Create Event
            </button>
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Events</p>
                <p className="text-2xl font-bold text-blue-900">12</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Active Students</p>
                <p className="text-2xl font-bold text-green-900">450</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Total Registrations</p>
                <p className="text-2xl font-bold text-purple-900">890</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Avg Attendance</p>
                <p className="text-2xl font-bold text-yellow-900">85%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Events */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {events.map(event => (
                <div key={event.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-600">{event.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{event.registered} registered</p>
                    <p className="text-sm text-gray-600">{event.capacity} capacity</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reports */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports & Analytics</h3>
            <div className="grid grid-cols-1 gap-3">
              <div 
                className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setActiveView('reports')}
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Event Popularity</p>
                    <p className="text-sm text-gray-600">12 events</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </div>
              
              <div 
                className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setActiveView('reports')}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Student Participation</p>
                    <p className="text-sm text-gray-600">450 students</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </div>

              <div 
                className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setActiveView('reports')}
              >
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Top Active Students</p>
                    <p className="text-sm text-gray-600">Top 10</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-blue-900 text-white p-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveView('admin-dashboard')}
            className="text-white hover:text-blue-200"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Event Popularity Chart */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Popularity</h3>
            <div className="space-y-3">
              {events.map((event, index) => (
                <div key={event.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium">{event.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{event.registered}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Students */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Active Students</h3>
            <div className="space-y-3">
              {[
                { name: "Alice Brown", events: 8, score: 35 },
                { name: "John Doe", events: 6, score: 28 },
                { name: "Jane Smith", events: 7, score: 26 }
              ].map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.events} events attended</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-yellow-600">{student.score}pts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Navigation and view switcher
  const ViewSwitcher = () => (
    <div className="mb-6 flex flex-wrap gap-2 justify-center">
      <button
        onClick={() => setActiveView('student-home')}
        className={`px-4 py-2 rounded-lg transition-colors ${
          activeView === 'student-home' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        📱 Student Home
      </button>
      <button
        onClick={() => {
          setSelectedEvent(events[0]);
          setActiveView('event-detail');
        }}
        className={`px-4 py-2 rounded-lg transition-colors ${
          activeView === 'event-detail' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        📝 Event Detail
      </button>
      <button
        onClick={() => setActiveView('my-events')}
        className={`px-4 py-2 rounded-lg transition-colors ${
          activeView === 'my-events' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        📋 My Events
      </button>
      <button
        onClick={() => setActiveView('admin-dashboard')}
        className={`px-4 py-2 rounded-lg transition-colors ${
          activeView === 'admin-dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        💻 Admin Portal
      </button>
      <button
        onClick={() => setActiveView('reports')}
        className={`px-4 py-2 rounded-lg transition-colors ${
          activeView === 'reports' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        📊 Reports
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Campus Event Management Platform
        </h1>
        <p className="text-gray-600 mb-4">Interactive UI/UX Wireframes - Dayananda Sagar University</p>
        <ViewSwitcher />
      </div>

      <div className="flex justify-center">
        {activeView === 'student-home' && renderStudentHome()}
        {activeView === 'event-detail' && renderEventDetail()}
        {activeView === 'my-events' && renderMyEvents()}
        {activeView === 'admin-dashboard' && renderAdminDashboard()}
        {activeView === 'reports' && renderReports()}
      </div>

      {/* Implementation Notes */}
      <div className="max-w-4xl mx-auto mt-12 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Implementation Notes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">🎯 Key Features Demonstrated</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Responsive mobile-first design</li>
              <li>• Event browsing and filtering</li>
              <li>• Registration workflow</li>
              <li>• Personal event dashboard</li>
              <li>• Admin analytics portal</li>
              <li>• Interactive reporting system</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">🔧 Technical Approach</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• React components for interactivity</li>
              <li>• Tailwind CSS for styling</li>
              <li>• Lucide icons for consistency</li>
              <li>• State management for user actions</li>
              <li>• Mobile-responsive layouts</li>
              <li>• Clean, modern UI patterns</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">💡 User Experience Highlights</h3>
          <p className="text-sm text-blue-800">
            The wireframes showcase a complete user journey from event discovery to registration and feedback. 
            Students can easily browse events, register with one click, and track their participation. 
            Administrators get comprehensive analytics and reporting tools to manage events effectively.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveWireframes;