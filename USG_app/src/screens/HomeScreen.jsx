import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Animated } from 'react-native';
import api from '../config/api';

const FALLBACK_ANNOUNCEMENTS = [
  { id: 1, tag: 'Event', text: 'Campus Leadership Summit — April 5, 2026 at the Main Gymnasium. All students are encouraged to attend!' },
  { id: 2, tag: 'Reminder', text: 'Face enrollment is now open. Visit the Face Enrollment page to register your biometric data.' },
  { id: 3, tag: 'Info', text: "Barcode scanners are available at the Registrar's Office. Contact admin for assistance." },
  { id: 4, tag: 'Event', text: 'General Assembly on April 12, 2026 — attendance is mandatory for all enrolled students.' },
  { id: 5, tag: 'Update', text: 'U-EventTrack v2 is live! Enjoy barcode scanning, facial recognition, and mobile app access.' },
];

export default function HomeScreen({ navigation }) {
  const [announcements, setAnnouncements] = useState(FALLBACK_ANNOUNCEMENTS);
  const [annIdx, setAnnIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/announcements/public');
      if (response.data?.length) {
        setAnnouncements(response.data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
      setTimeout(() => {
        setAnnIdx(i => (i + 1) % announcements.length);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAnnouncements();
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

  const current = announcements[annIdx];

  const tagColor = getTagColor(current.tag);

  const features = [
    { title: 'Multi-Method Check-In', desc: 'Barcode scanning, facial recognition, and manual entry', icon: '✓', color: '#10b981' },
    { title: 'Real-Time Monitoring', desc: 'Live attendance dashboard with instant updates', icon: '⚡', color: '#3b82f6' },
    { title: 'Mobile App Access', desc: 'Native Expo app for students with full dashboard', icon: '📱', color: '#f97316' },
    { title: 'Analytics & Reports', desc: 'Comprehensive reports with charts and graphs', icon: '📊', color: '#8b5cf6' },
  ];

  const stats = [
    { value: '3+', label: 'Check-in Methods', icon: '✓' },
    { value: '100%', label: 'Digital Records', icon: '📋' },
    { value: 'Live', label: 'Real-Time Updates', icon: '⚡' },
    { value: 'GPS', label: 'Location Verified', icon: '📍' },
  ];

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Navbar */}
      <View style={styles.navbar}>
        <View style={styles.navContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoIcon}>📅</Text>
            </View>
            <View>
              <Text style={styles.title}>U-EventTrack</Text>
              <Text style={styles.subtitle}>MinSU Bongabong</Text>
            </View>
          </View>
          <View style={styles.navButtons}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.signInBtn}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Announcement Ticker */}
      <View style={styles.announcementBanner}>
        <View style={styles.announcementContent}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <View style={styles.divider} />
          <Animated.View style={[styles.announcementTextContainer, { opacity: fadeAnim }]}>
            <View style={[styles.announcementTag, { backgroundColor: tagColor.bg }]}>
              <Text style={[styles.announcementTagText, { color: tagColor.text }]}>
                {current.tag.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.announcementText} numberOfLines={2}>{current.text}</Text>
          </Animated.View>
        </View>
        <View style={styles.announcementDots}>
          {announcements.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setAnnIdx(i)}
              style={[styles.dot, i === annIdx && styles.dotActive]}
            />
          ))}
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <View style={styles.heroBadgeDot} />
          <Text style={styles.heroBadgeText}>Mindoro State University — Bongabong Campus</Text>
        </View>
        <Text style={styles.heroTitle}>
          Smart{'\n'}
          <Text style={styles.heroTitleGradient}>Attendance</Text>{'\n'}
          for USG Events
        </Text>
        <Text style={styles.heroSubtitle}>
          Streamline event attendance with barcode scanning, facial recognition, and mobile app — all tracked in real time.
        </Text>
        
        <View style={styles.heroButtons}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryButtonText}>🔐 Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Events')}
          >
            <Text style={styles.secondaryButtonText}>Register as Student →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.trustBadges}>
          {['Barcode Scan', 'Face Recognition', 'Mobile App', 'Live Dashboard'].map((badge) => (
            <View key={badge} style={styles.trustBadge}>
              <Text style={styles.trustCheck}>✓</Text>
              <Text style={styles.trustText}>{badge}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stats Strip */}
      <View style={styles.statsStrip}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
            </View>
            <View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>FEATURES</Text>
          </View>
          <Text style={styles.sectionTitle}>Everything You Need</Text>
          <Text style={styles.sectionSubtitle}>
            Modern tools designed for efficient, campus-wide USG event attendance management.
          </Text>
        </View>
        
        <View style={styles.featuresGrid}>
          {features.map((feature) => (
            <View key={feature.title} style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                <Text style={[styles.featureIconText, { color: feature.color }]}>{feature.icon}</Text>
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* How It Works */}
      <View style={[styles.section, styles.sectionWhite]}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>HOW IT WORKS</Text>
          </View>
          <Text style={styles.sectionTitle}>Three Simple Steps</Text>
          <Text style={styles.sectionSubtitle}>
            From event setup to detailed attendance reports in minutes.
          </Text>
        </View>

        <View style={styles.stepsContainer}>
          {[
            { step: '01', title: 'Officers Create Events', desc: 'Set up events with location, schedule, and attendance requirements in seconds.', icon: '📅' },
            { step: '02', title: 'Students Check In', desc: 'RFID scan, face recognition, or manual entry — verified by GPS at the venue.', icon: '👁️' },
            { step: '03', title: 'View Reports', desc: 'Real-time dashboards and exportable reports give full visibility into attendance.', icon: '📊' },
          ].map((item) => (
            <View key={item.step} style={styles.stepCard}>
              <View style={styles.stepIconContainer}>
                <Text style={styles.stepIcon}>{item.icon}</Text>
                <Text style={styles.stepNumber}>{item.step}</Text>
              </View>
              <Text style={styles.stepTitle}>{item.title}</Text>
              <Text style={styles.stepDesc}>{item.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA Banner */}
      <View style={styles.ctaBanner}>
        <View style={styles.ctaBadge}>
          <View style={styles.ctaBadgeDot} />
          <Text style={styles.ctaBadgeText}>Ready to go digital?</Text>
        </View>
        <Text style={styles.ctaTitle}>Join U-EventTrack Today</Text>
        <Text style={styles.ctaSubtitle}>
          Join Mindoro State University's digital attendance system for USG events.
        </Text>
        <View style={styles.ctaButtons}>
          <TouchableOpacity style={styles.ctaPrimaryButton} onPress={() => navigation.navigate('Events')}>
            <Text style={styles.ctaPrimaryButtonText}>Register as Student →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaSecondaryButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.ctaSecondaryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerLogo}>
            <View style={styles.footerLogoIcon}>
              <Text style={styles.footerLogoIconText}>📅</Text>
            </View>
            <View>
              <Text style={styles.footerTitle}>U-EventTrack</Text>
              <Text style={styles.footerSubtitle}>MinSU Bongabong Campus</Text>
            </View>
          </View>
          <Text style={styles.footerCopyright}>
            © {new Date().getFullYear()} Mindoro State University — Bongabong Campus. All rights reserved.
          </Text>
          <Text style={styles.footerTech}>RFID · Face ID · GPS</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Navbar
  navbar: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.8)',
    paddingTop: 50,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    backgroundColor: '#10b981',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    marginRight: 12,
  },
  logoIcon: {
    fontSize: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 1,
  },
  navButtons: {
    flexDirection: 'row',
  },
  signInBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f9fafb',
    marginLeft: 8,
  },
  signInText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  // Announcement Banner
  announcementBanner: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.4)',
  },
  announcementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fbbf24',
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  announcementTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  announcementTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  announcementTagText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  announcementText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
  },
  announcementDots: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Hero Section
  hero: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 20,
  },
  heroBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    lineHeight: 46,
  },
  heroTitleGradient: {
    color: '#10b981',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 24,
  },
  heroButtons: {
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  secondaryButtonText: {
    color: '#10b981',
    fontSize: 15,
    fontWeight: '600',
  },
  trustBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 12,
  },
  trustCheck: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: 'bold',
    marginRight: 6,
  },
  trustText: {
    fontSize: 12,
    color: '#6b7280',
  },
  // Stats Strip
  statsStrip: {
    backgroundColor: '#10b981',
    paddingVertical: 24,
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    margin: 6,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statIcon: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  // Section
  section: {
    backgroundColor: '#f9fafb',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  sectionWhite: {
    backgroundColor: '#fff',
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  sectionBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  sectionBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#059669',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
  // Features
  featuresGrid: {
    paddingHorizontal: 16,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIconText: {
    fontSize: 20,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  // Steps
  stepsContainer: {
    paddingHorizontal: 20,
  },
  stepCard: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  stepIconContainer: {
    width: 72,
    height: 72,
    backgroundColor: '#10b981',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  stepIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  stepNumber: {
    fontSize: 9,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDesc: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  // CTA Banner
  ctaBanner: {
    backgroundColor: '#059669',
    paddingVertical: 48,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  ctaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 20,
  },
  ctaBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 6,
  },
  ctaBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  ctaTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    maxWidth: 300,
  },
  ctaButtons: {
    width: '100%',
  },
  ctaPrimaryButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  ctaPrimaryButtonText: {
    color: '#059669',
    fontSize: 15,
    fontWeight: '600',
  },
  ctaSecondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaSecondaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  // Footer
  footer: {
    backgroundColor: '#0a0a0a',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerContent: {
    alignItems: 'center',
  },
  footerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerLogoIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#10b981',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  footerLogoIconText: {
    fontSize: 18,
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  footerSubtitle: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
  footerCopyright: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  footerTech: {
    fontSize: 11,
    color: '#6b7280',
  },
});
