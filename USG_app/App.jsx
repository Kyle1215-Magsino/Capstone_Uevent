import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Modal, TextInput, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import axios from 'axios';
import { styles } from './styles';

const API_URL = 'http://192.168.1.15:8000/api';

// Dashboard Tab Component
function DashboardTab({ dashboardData, greeting, attendanceRate, streak, nextEvent, recentCheckins, formatDate }) {
  return (
    <>
      {/* Next Event Banner */}
      {nextEvent && (
        <View style={styles.nextEventBanner}>
          <View style={styles.nextEventIconBox}>
            <Ionicons name="notifications" size={20} color="#fff" />
          </View>
          <View style={styles.nextEventInfo}>
            <Text style={styles.nextEventLabel}>Next Upcoming Event</Text>
            <Text style={styles.nextEventName}>{nextEvent.event_name}</Text>
            <Text style={styles.nextEventDetails}>
              {nextEvent.event_date} • {nextEvent.start_time}–{nextEvent.end_time}
            </Text>
          </View>
        </View>
      )}

      {/* Stats Grid */}
      <View style={styles.statsContainer}>
        {[
          { label: 'Events Attended', value: dashboardData.attendedEvents, icon: 'calendar', color: '#10b981', bg: '#dcfce7' },
          { label: 'Present', value: dashboardData.totalPresent, icon: 'checkmark-circle', color: '#059669', bg: '#d1fae5' },
          { label: 'Late', value: dashboardData.totalLate, icon: 'time', color: '#f59e0b', bg: '#fef3c7' },
          { label: 'Streak', value: `${streak}`, icon: 'flame', color: '#f97316', bg: '#fed7aa' },
        ].map((stat, index) => (
          <View key={stat.label} style={styles.statCard}>
            <View style={styles.statCardInner}>
              <View style={[styles.statIconBox, { backgroundColor: stat.bg }]}>
                <Ionicons name={stat.icon} size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Attendance Rate */}
      <View style={styles.attendanceCard}>
        <View style={styles.attendanceCircle}>
          <Text style={styles.attendancePercent}>{attendanceRate}%</Text>
        </View>
        <View style={styles.attendanceInfo}>
          <Text style={styles.attendanceTitle}>Attendance Rate</Text>
          <Text style={styles.attendanceSubtitle}>
            {dashboardData.attendedEvents} of {dashboardData.totalEvents} events
          </Text>
        </View>
      </View>

      {/* Recent Check-ins */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="time" size={20} color="#10b981" />
          <Text style={styles.sectionTitle}>Recent Check-ins</Text>
        </View>
        {recentCheckins.length > 0 ? (
          recentCheckins.map((rec, idx) => (
            <View key={rec.id || idx} style={styles.checkinItem}>
              <View style={[
                styles.checkinIconBox,
                { backgroundColor: rec.status === 'present' ? '#dcfce7' : '#fef3c7' }
              ]}>
                <Ionicons 
                  name={rec.status === 'present' ? 'checkmark' : 'time'} 
                  size={16} 
                  color={rec.status === 'present' ? '#16a34a' : '#f59e0b'} 
                />
              </View>
              <View style={styles.checkinInfo}>
                <Text style={styles.checkinEventName}>{rec.event?.event_name}</Text>
                <Text style={styles.checkinTime}>
                  {formatDate(rec.check_in_time)} • {rec.status}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No check-ins yet</Text>
        )}
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="calendar" size={20} color="#10b981" />
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
        </View>
        {dashboardData.upcomingEvents.map(e => (
          <View key={e.id} style={styles.eventItem}>
            <View style={styles.eventIconBox}>
              <Ionicons name="calendar-outline" size={20} color="#10b981" />
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventName}>{e.event_name}</Text>
              <Text style={styles.eventDetails}>{e.event_date} • {e.venue}</Text>
            </View>
            <View style={styles.eventBadge}>
              <Text style={styles.eventBadgeText}>{e.status}</Text>
            </View>
          </View>
        ))}
        {dashboardData.upcomingEvents.length === 0 && (
          <Text style={styles.emptyText}>No upcoming events</Text>
        )}
      </View>
    </>
  );
}

// Events Tab Component
function EventsTab({ dashboardData, formatDate }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/student-events`)
      .then(res => setEvents(res.data || []))
      .catch(err => console.log('Error:', err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading && events.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <Ionicons name="calendar" size={20} color="#10b981" />
        <Text style={styles.sectionTitle}>Available Events</Text>
      </View>
      {events.map(e => (
        <View key={e.id} style={styles.eventCard}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: e.status === 'ongoing' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: e.status === 'ongoing' ? '#10b981' : '#3b82f6' }
            ]}>
              {e.status.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.eventCardName}>{e.event_name}</Text>
          {e.description && (
            <Text style={styles.eventDescription} numberOfLines={2}>
              {e.description}
            </Text>
          )}
          <View style={styles.eventDetailRow}>
            <Ionicons name="calendar-outline" size={14} color="#6b7280" />
            <Text style={styles.eventDetailText}>{e.event_date}</Text>
          </View>
          {e.venue && (
            <View style={styles.eventDetailRow}>
              <Ionicons name="location-outline" size={14} color="#6b7280" />
              <Text style={styles.eventDetailText}>{e.venue}</Text>
            </View>
          )}
          {e.checked_in && (
            <View style={styles.checkedInBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.checkedInText}>Checked In</Text>
            </View>
          )}
        </View>
      ))}
      {events.length === 0 && (
        <Text style={styles.emptyText}>No events available</Text>
      )}
    </View>
  );
}

// Attendance Tab Component
function AttendanceTab({ dashboardData, formatDate }) {
  const [tab, setTab] = useState('all');
  const records = dashboardData.attendanceRecords || [];
  const absentEvents = dashboardData.allPastEvents?.filter(e => 
    !records.find(r => r.event_id === e.id)
  ) || [];

  const filtered = tab === 'all' ? records : 
                   tab === 'absent' ? absentEvents :
                   records.filter(r => r.status === tab);

  const counts = {
    all: records.length,
    present: records.filter(r => r.status === 'present').length,
    late: records.filter(r => r.status === 'late').length,
    absent: absentEvents.length,
  };

  return (
    <>
      {/* Tabs */}
      <View style={styles.attendanceTabs}>
        {[
          { key: 'all', label: 'All' },
          { key: 'present', label: 'Present' },
          { key: 'late', label: 'Late' },
          { key: 'absent', label: 'Absent' },
        ].map(t => (
          <TouchableOpacity
            key={t.key}
            style={[
              styles.attendanceTab,
              tab === t.key && (t.key === 'absent' ? styles.attendanceTabActiveRed : styles.attendanceTabActive)
            ]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[
              styles.attendanceTabText,
              tab === t.key && styles.attendanceTabTextActive
            ]}>
              {t.label} ({counts[t.key]})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="clipboard" size={20} color="#10b981" />
          <Text style={styles.sectionTitle}>My Attendance</Text>
        </View>
        
        {tab === 'absent' ? (
          absentEvents.length > 0 ? (
            absentEvents.map(e => (
              <View key={e.id} style={styles.absentEventCard}>
                <View style={styles.absentEventInfo}>
                  <Text style={styles.absentEventName}>{e.event_name}</Text>
                  <Text style={styles.absentEventDetails}>
                    {e.event_date} • {e.start_time}–{e.end_time}
                  </Text>
                </View>
                <View style={styles.absentBadge}>
                  <Text style={styles.absentBadgeText}>Absent</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyStateGood}>
              <Ionicons name="checkmark-circle" size={48} color="#10b981" />
              <Text style={styles.emptyStateGoodText}>No absences!</Text>
              <Text style={styles.emptyStateGoodSubtext}>You attended all completed events</Text>
            </View>
          )
        ) : (
          filtered.length > 0 ? (
            filtered.map((rec, idx) => (
              <View key={rec.id || idx} style={styles.attendanceRecordCard}>
                <View style={[
                  styles.attendanceRecordIcon,
                  { backgroundColor: rec.status === 'present' ? '#dcfce7' : '#fef3c7' }
                ]}>
                  <Ionicons 
                    name={rec.status === 'present' ? 'checkmark' : 'time'} 
                    size={20} 
                    color={rec.status === 'present' ? '#16a34a' : '#f59e0b'} 
                  />
                </View>
                <View style={styles.attendanceRecordInfo}>
                  <Text style={styles.attendanceRecordEvent}>{rec.event?.event_name}</Text>
                  <Text style={styles.attendanceRecordDetails}>
                    {formatDate(rec.check_in_time)} • {new Date(rec.check_in_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </Text>
                  <View style={styles.attendanceRecordMeta}>
                    <View style={[
                      styles.attendanceRecordBadge,
                      { backgroundColor: rec.status === 'present' ? '#dcfce7' : '#fef3c7' }
                    ]}>
                      <Text style={[
                        styles.attendanceRecordBadgeText,
                        { color: rec.status === 'present' ? '#16a34a' : '#f59e0b' }
                      ]}>
                        {rec.status}
                      </Text>
                    </View>
                    <Text style={styles.attendanceRecordMethod}>{rec.verification_method}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No records found</Text>
          )
        )}
      </View>
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [annIdx, setAnnIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchPublicData = async () => {
    try {
      const [announcementsRes, eventsRes] = await Promise.all([
        axios.get(`${API_URL}/announcements/public`),
        axios.get(`${API_URL}/events/active`)
      ]);
      
      setAnnouncements(announcementsRes.data || []);
      setEvents(eventsRes.data || []);
    } catch (error) {
      console.log('Error fetching public data:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchDashboard = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/student-dashboard`);
      setDashboardData(response.data);
    } catch (error) {
      console.log('Error fetching dashboard:', error.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPublicData();
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setAnnIdx(i => (i + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements]);

  useEffect(() => {
    if (user && token) {
      fetchDashboard();
    }
  }, [user, token]);

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/mobile/login`, {
        email: email.trim(),
        password: password,
      });

      if (response.data.user && response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        return { success: true, user: response.data.user };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            setToken(null);
            setUser(null);
            setDashboardData(null);
            delete axios.defaults.headers.common['Authorization'];
            Alert.alert('Success', 'You have been logged out successfully');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (user && token) {
      await fetchDashboard();
    } else {
      await fetchPublicData();
    }
  };

  const getTagColor = (tag) => {
    const colors = {
      Event: { bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981' },
      Reminder: { bg: 'rgba(245, 158, 11, 0.2)', text: '#f59e0b' },
      Info: { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' },
      Update: { bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981' },
      Alert: { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' },
    };
    return colors[tag] || { bg: 'rgba(107, 114, 128, 0.2)', text: '#6b7280' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const current = announcements.length > 0 && announcements[annIdx] 
    ? announcements[annIdx] 
    : { tag: 'Info', text: 'Welcome to U-EventTrack' };
  const tagColor = getTagColor(current.tag);

  // If logged in, show dashboard with tabs
  if (user && dashboardData) {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const attendanceRate = dashboardData.totalEvents > 0 ? Math.round((dashboardData.attendedEvents / dashboardData.totalEvents) * 100) : 0;
    const streak = dashboardData.streak || 0;
    const nextEvent = dashboardData.nextEvent || null;

    const recentCheckins = (dashboardData.attendanceRecords || [])
      .sort((a, b) => new Date(b.check_in_time) - new Date(a.check_in_time))
      .slice(0, 5);

    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        
        {/* Dashboard Header */}
        <View style={styles.dashboardHeader}>
          <View style={styles.headerRow}>
            <View style={styles.profileSection}>
              <View style={styles.profileInitials}>
                <Text style={styles.profileInitialsText}>
                  {dashboardData.student?.first_name?.charAt(0)}{dashboardData.student?.last_name?.charAt(0)}
                </Text>
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.dashboardGreeting}>{greeting}, {dashboardData.student?.first_name}!</Text>
                <Text style={styles.dashboardDate}>{today}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <View style={styles.buttonRow}>
                <Ionicons name="log-out-outline" size={16} color="#dc2626" />
                <Text style={styles.logoutText}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Content */}
        <ScrollView 
          style={styles.dashboardContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10b981']} />
          }
        >
          {activeTab === 'dashboard' && <DashboardTab dashboardData={dashboardData} greeting={greeting} attendanceRate={attendanceRate} streak={streak} nextEvent={nextEvent} recentCheckins={recentCheckins} formatDate={formatDate} />}
          {activeTab === 'events' && <EventsTab dashboardData={dashboardData} formatDate={formatDate} />}
          {activeTab === 'attendance' && <AttendanceTab dashboardData={dashboardData} formatDate={formatDate} />}
        </ScrollView>

        {/* Bottom Tab Navigation */}
        <View style={styles.bottomTabs}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'dashboard' && styles.tabActive]}
            onPress={() => setActiveTab('dashboard')}
          >
            <Ionicons name={activeTab === 'dashboard' ? 'home' : 'home-outline'} size={24} color={activeTab === 'dashboard' ? '#10b981' : '#6b7280'} />
            <Text style={[styles.tabText, activeTab === 'dashboard' && styles.tabTextActive]}>Dashboard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'events' && styles.tabActive]}
            onPress={() => setActiveTab('events')}
          >
            <Ionicons name={activeTab === 'events' ? 'calendar' : 'calendar-outline'} size={24} color={activeTab === 'events' ? '#10b981' : '#6b7280'} />
            <Text style={[styles.tabText, activeTab === 'events' && styles.tabTextActive]}>Events</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'attendance' && styles.tabActive]}
            onPress={() => setActiveTab('attendance')}
          >
            <Ionicons name={activeTab === 'attendance' ? 'clipboard' : 'clipboard-outline'} size={24} color={activeTab === 'attendance' ? '#10b981' : '#6b7280'} />
            <Text style={[styles.tabText, activeTab === 'attendance' && styles.tabTextActive]}>Attendance</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Home screen (not logged in)
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={{ marginTop: 12, color: '#6b7280' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Navbar */}
      <View style={styles.navbar}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Image 
              source={require('./assets/usg-logo.png')} 
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>
          <View>
            <Text style={styles.title}>U-EventTrack</Text>
            <Text style={styles.subtitle}>MinSU Bongabong</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.signInBtn} onPress={() => setShowLoginModal(true)}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* Announcement Ticker with Events */}
      <View style={styles.announcementBanner}>
        <View style={styles.announcementContent}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.announcementTextContainer}>
            {events.length > 0 ? (
              <>
                <View style={styles.announcementTag}>
                  <Ionicons name="calendar" size={10} color="#fff" />
                  <Text style={styles.announcementTagText}>EVENT</Text>
                </View>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.eventTickerScroll}
                >
                  {events.map((event, index) => (
                    <View key={event.id} style={styles.eventTickerItem}>
                      <Text style={styles.eventTickerText}>
                        {event.event_name} • {event.event_date} • {event.venue}
                      </Text>
                      {index < events.length - 1 && (
                        <View style={styles.eventTickerDivider} />
                      )}
                    </View>
                  ))}
                </ScrollView>
              </>
            ) : (
              <>
                <View style={[styles.announcementTag, { backgroundColor: tagColor.bg }]}>
                  <Text style={[styles.announcementTagText, { color: tagColor.text }]}>
                    {current.tag.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.announcementText} numberOfLines={2}>{current.text}</Text>
              </>
            )}
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10b981']} />
        }
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <View style={styles.heroBadgeDot} />
            <Text style={styles.heroBadgeText}>Mindoro State University — Bongabong Campus</Text>
          </View>
          
          {/* Large Logo */}
          <View style={styles.heroLogoContainer}>
            <Image 
              source={require('./assets/usg-logo.png')} 
              style={styles.heroLogo}
              resizeMode="cover"
            />
          </View>
          
          <Text style={styles.heroTitle}>
            Smart{'\n'}
            <Text style={styles.heroTitleGradient}>Attendance</Text>{'\n'}
            for USG Events
          </Text>
          <Text style={styles.heroSubtitle}>
            Streamline event attendance with RFID, facial recognition, and GPS-based check-in — all tracked in real time.
          </Text>
          
          <TouchableOpacity style={styles.primaryButton} onPress={() => setShowLoginModal(true)}>
            <View style={styles.buttonRow}>
              <Ionicons name="lock-closed" size={16} color="#fff" />
              <Text style={styles.primaryButtonText}>Sign In</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setShowRegisterModal(true)}>
            <View style={styles.buttonRow}>
              <Text style={styles.secondaryButtonText}>Register as Student</Text>
              <Ionicons name="arrow-forward" size={16} color="#059669" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats Strip */}
        <View style={styles.statsStrip}>
          {[
            { value: '3+', label: 'Check-in Methods', icon: 'checkmark-circle' },
            { value: '100%', label: 'Digital Records', icon: 'document-text' },
            { value: 'Live', label: 'Real-Time Updates', icon: 'flash' },
            { value: 'GPS', label: 'Location Verified', icon: 'location' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statStripCard}>
              <View style={styles.statStripIconBox}>
                <Ionicons name={stat.icon} size={20} color="#fff" />
              </View>
              <View>
                <Text style={styles.statStripValue}>{stat.value}</Text>
                <Text style={styles.statStripLabel}>{stat.label}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="sparkles" size={24} color="#10b981" />
            <Text style={styles.sectionTitle}>Everything You Need</Text>
          </View>
          {[
            { title: 'Multi-Method Check-In', desc: 'RFID scanning, facial recognition, and manual entry', icon: 'checkmark-circle', color: '#10b981' },
            { title: 'Real-Time Monitoring', desc: 'Live attendance dashboard with instant updates', icon: 'flash', color: '#3b82f6' },
            { title: 'GPS Verification', desc: 'Location-based validation ensures physical presence', icon: 'location', color: '#f97316' },
            { title: 'Analytics & Reports', desc: 'Comprehensive reports with charts and graphs', icon: 'bar-chart', color: '#8b5cf6' },
          ].map((feature) => (
            <View key={feature.title} style={styles.featureCard}>
              <View style={[styles.featureIconBox, { backgroundColor: feature.color + '20' }]}>
                <Ionicons name={feature.icon} size={24} color={feature.color} />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          ))}
        </View>

        {/* CTA Banner */}
        <View style={styles.ctaBanner}>
          <Text style={styles.ctaTitle}>Join U-EventTrack Today</Text>
          <Text style={styles.ctaSubtitle}>
            Join Mindoro State University's digital attendance system for USG events.
          </Text>
          <TouchableOpacity style={styles.ctaPrimaryButton} onPress={() => setShowRegisterModal(true)}>
            <View style={styles.buttonRow}>
              <Text style={styles.ctaPrimaryButtonText}>Register as Student</Text>
              <Ionicons name="arrow-forward" size={16} color="#059669" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaSecondaryButton} onPress={() => setShowLoginModal(true)}>
            <Text style={styles.ctaSecondaryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} Mindoro State University — Bongabong Campus
          </Text>
          <Text style={styles.footerTech}>RFID · Face ID · GPS</Text>
        </View>
      </ScrollView>

      {/* Login Modal */}
      <LoginModal 
        visible={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onSuccess={(userData) => {
          setShowLoginModal(false);
          Alert.alert('Success', `Welcome back, ${userData.name}!`);
        }}
      />

      {/* Register Modal */}
      <RegisterModal 
        visible={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)}
        onSuccess={() => {
          setShowRegisterModal(false);
          Alert.alert('Success', 'Account created! Please sign in.');
          setShowLoginModal(true);
        }}
      />
    </View>
  );
}


// Login Modal Component
function LoginModal({ visible, onClose, onLogin, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    const result = await onLogin(email, password);
    setLoading(false);

    if (result.success) {
      onSuccess(result.user);
      setEmail('');
      setPassword('');
    } else {
      Alert.alert('Login Failed', result.message);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView 
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sign In</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your.email@minsu.edu.ph"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <TouchableOpacity 
              style={[styles.modalButton, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.modalButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// Register Modal Component
function RegisterModal({ visible, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    course: '',
    year_level: '1',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!formData.student_id || !formData.first_name || !formData.last_name || 
        !formData.email || !formData.course || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/register-student`, {
        student_id: formData.student_id.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        course: formData.course.trim(),
        year_level: parseInt(formData.year_level),
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });

      onSuccess();
      setFormData({
        student_id: '',
        first_name: '',
        last_name: '',
        email: '',
        course: '',
        year_level: '1',
        password: '',
        password_confirmation: '',
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      const errors = error.response?.data?.errors;
      
      if (errors) {
        const errorMessages = Object.values(errors).flat().join('\n');
        Alert.alert('Registration Failed', errorMessages);
      } else {
        Alert.alert('Registration Failed', message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView 
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.modalContent, styles.modalContentLarge]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Register as Student</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Student ID</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 2021-00123"
                value={formData.student_id}
                onChangeText={(val) => updateField('student_id', val)}
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Juan"
                value={formData.first_name}
                onChangeText={(val) => updateField('first_name', val)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Dela Cruz"
                value={formData.last_name}
                onChangeText={(val) => updateField('last_name', val)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="juan.delacruz@minsu.edu.ph"
                value={formData.email}
                onChangeText={(val) => updateField('email', val)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Course</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., BSIT, BSCS, BSBA"
                value={formData.course}
                onChangeText={(val) => updateField('course', val)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Year Level</Text>
              <View style={styles.yearLevelContainer}>
                {['1', '2', '3', '4'].map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.yearButton,
                      formData.year_level === year && styles.yearButtonActive
                    ]}
                    onPress={() => updateField('year_level', year)}
                    disabled={loading}
                  >
                    <Text style={[
                      styles.yearButtonText,
                      formData.year_level === year && styles.yearButtonTextActive
                    ]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="At least 6 characters"
                value={formData.password}
                onChangeText={(val) => updateField('password', val)}
                secureTextEntry
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter password"
                value={formData.password_confirmation}
                onChangeText={(val) => updateField('password_confirmation', val)}
                secureTextEntry
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <TouchableOpacity 
              style={[styles.modalButton, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.modalButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
