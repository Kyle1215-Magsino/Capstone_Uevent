import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Calendar from 'expo-calendar';
import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function EventDetailsModal({ visible, event, onClose, formatDate, formatTime }) {
  const { colors } = useTheme();
  
  if (!event) return null;

  const addToCalendar = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Calendar permission is needed to add events.');
        return;
      }

      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCalendar = calendars.find(cal => cal.isPrimary) || calendars[0];

      if (!defaultCalendar) {
        Alert.alert('Error', 'No calendar found on your device.');
        return;
      }

      // Parse date and time
      const eventDate = new Date(event.event_date);
      const [startHour, startMin] = event.start_time.split(':');
      const [endHour, endMin] = event.end_time.split(':');
      
      const startDate = new Date(eventDate);
      startDate.setHours(parseInt(startHour), parseInt(startMin), 0);
      
      const endDate = new Date(eventDate);
      endDate.setHours(parseInt(endHour), parseInt(endMin), 0);

      await Calendar.createEventAsync(defaultCalendar.id, {
        title: event.event_name,
        startDate: startDate,
        endDate: endDate,
        location: event.venue,
        notes: event.description || 'USG Event',
        timeZone: 'Asia/Manila',
      });

      Alert.alert('Success', 'Event added to your calendar!');
    } catch (error) {
      console.log('Calendar error:', error);
      Alert.alert('Error', 'Failed to add event to calendar.');
    }
  };

  const shareEvent = async () => {
    try {
      const message = `📅 ${event.event_name}\n\n` +
        `📍 ${event.venue}\n` +
        `🗓️ ${formatDate(event.event_date)}\n` +
        `🕐 ${formatTime(event.start_time)} - ${formatTime(event.end_time)}\n\n` +
        `${event.description || 'Join us at this USG event!'}`;

      await Share.share({
        message: message,
        title: event.event_name,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const getStatusColor = () => {
    switch (event.status) {
      case 'upcoming': return { bg: '#dcfce7', text: '#16a34a' };
      case 'ongoing': return { bg: '#dbeafe', text: '#2563eb' };
      case 'completed': return { bg: '#f3f4f6', text: '#6b7280' };
      case 'cancelled': return { bg: '#fee2e2', text: '#dc2626' };
      default: return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  const statusColor = getStatusColor();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.headerLeft}>
              <Ionicons name="calendar" size={24} color="#10b981" />
              <Text style={[styles.headerTitle, { color: colors.text }]}>Event Details</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.borderLight }]}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Event Name */}
            <Text style={[styles.eventName, { color: colors.text }]}>{event.event_name}</Text>

            {/* Status Badge */}
            <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
              <Text style={[styles.statusText, { color: statusColor.text }]}>
                {event.status.toUpperCase()}
              </Text>
            </View>

            {/* Description */}
            {event.description && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Description</Text>
                <Text style={[styles.description, { color: colors.text }]}>{event.description}</Text>
              </View>
            )}

            {/* Event Details */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Event Information</Text>
              
              <View style={[styles.detailRow, { borderBottomColor: colors.borderLight }]}>
                <View style={styles.detailIcon}>
                  <Ionicons name="calendar-outline" size={20} color="#10b981" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Date</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{formatDate(event.event_date)}</Text>
                </View>
              </View>

              <View style={[styles.detailRow, { borderBottomColor: colors.borderLight }]}>
                <View style={styles.detailIcon}>
                  <Ionicons name="time-outline" size={20} color="#10b981" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Time</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {formatTime(event.start_time)} - {formatTime(event.end_time)}
                  </Text>
                </View>
              </View>

              <View style={[styles.detailRow, { borderBottomColor: colors.borderLight }]}>
                <View style={styles.detailIcon}>
                  <Ionicons name="location-outline" size={20} color="#10b981" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Venue</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{event.venue}</Text>
                </View>
              </View>
            </View>

            {/* Attendance Info (if checked in) */}
            {event.checked_in && (
              <View style={styles.checkedInCard}>
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                <Text style={styles.checkedInText}>You're checked in to this event</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton} onPress={addToCalendar}>
                <Ionicons name="calendar-outline" size={20} color="#10b981" />
                <Text style={styles.actionButtonText}>Add to Calendar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={shareEvent}>
                <Ionicons name="share-social-outline" size={20} color="#10b981" />
                <Text style={styles.actionButtonText}>Share Event</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    lineHeight: 32,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  checkedInCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  checkedInText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
    flex: 1,
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#16a34a',
  },
});
