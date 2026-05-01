import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../config/api';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    course: '',
    year_level: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);

  const courses = ['BSEED', 'BSIT', 'BSCPE', 'BSFI', 'BSHM', 'BSCRIM', 'BSPOLSCI'];
  const yearLevels = [1, 2, 3, 4];

  const handleRegister = async () => {
    // Validation
    if (!formData.student_id || !formData.first_name || !formData.last_name || 
        !formData.email || !formData.course || !formData.year_level || 
        !formData.password || !formData.password_confirmation) {
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
      const response = await api.post('/register/student', formData);
      setLoading(false);
      
      Alert.alert(
        'Success',
        'Your account has been created! You can now sign in.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Registration failed';
      Alert.alert('Registration Failed', message);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>📅</Text>
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Register as a student</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Student ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your student ID"
              value={formData.student_id}
              onChangeText={(text) => setFormData({...formData, student_id: text})}
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              value={formData.first_name}
              onChangeText={(text) => setFormData({...formData, first_name: text})}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              value={formData.last_name}
              onChangeText={(text) => setFormData({...formData, last_name: text})}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@minsu.edu.ph"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Course</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.course}
                onValueChange={(value) => setFormData({...formData, course: value})}
                style={styles.picker}
                enabled={!loading}
              >
                <Picker.Item label="Select your course" value="" />
                {courses.map((course) => (
                  <Picker.Item key={course} label={course} value={course} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Year Level</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.year_level}
                onValueChange={(value) => setFormData({...formData, year_level: value})}
                style={styles.picker}
                enabled={!loading}
              >
                <Picker.Item label="Select your year level" value="" />
                {yearLevels.map((year) => (
                  <Picker.Item key={year} label={`Year ${year}`} value={year} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="At least 6 characters"
              value={formData.password}
              onChangeText={(text) => setFormData({...formData, password: text})}
              secureTextEntry
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter your password"
              value={formData.password_confirmation}
              onChangeText={(text) => setFormData({...formData, password_confirmation: text})}
              secureTextEntry
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={styles.linkText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#f9fafb',
  },
  backIcon: {
    fontSize: 24,
    color: '#10b981',
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: '#10b981',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  form: {
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    padding: 12,
    marginTop: 8,
  },
  linkText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '600',
  },
});
