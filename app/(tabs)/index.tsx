import Card from '@/components/ui/Card';
import Header from '@/components/ui/Header';
import { useAuth } from '@/contexts/AuthContext';
import {
  Activity,
  AlertCircle,
  Calendar,
  Clock,
  FileText,
  Plus,
  TrendingUp,
  Users
} from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const mockStats = {
  receptionist: {
    totalPatients: 156,
    todayAppointments: 12,
    pendingReports: 8,
    newRegistrations: 5,
  },
  doctor: {
    todayPatients: 8,
    pendingPrescriptions: 3,
    completedConsultations: 15,
    criticalAlerts: 2,
  },
  patient: {
    upcomingAppointments: 1,
    activePrescriptions: 2,
    labReports: 4,
    lastVisit: '2 days ago',
  },
};

const recentActivities = {
  receptionist: [
    { id: 1, action: 'New patient registered', patient: 'John Doe', time: '10 min ago' },
    { id: 2, action: 'Lab report uploaded', patient: 'Sarah Wilson', time: '25 min ago' },
    { id: 3, action: 'Appointment scheduled', patient: 'Mike Johnson', time: '1 hour ago' },
  ],
  doctor: [
    { id: 1, action: 'Prescription issued', patient: 'Emma Davis', time: '15 min ago' },
    { id: 2, action: 'Consultation completed', patient: 'Robert Brown', time: '45 min ago' },
    { id: 3, action: 'Lab results reviewed', patient: 'Lisa Anderson', time: '2 hours ago' },
  ],
  patient: [
    { id: 1, action: 'Prescription refilled', doctor: 'Dr. Smith', time: '1 day ago' },
    { id: 2, action: 'Lab report available', doctor: 'Dr. Johnson', time: '3 days ago' },
    { id: 3, action: 'Appointment confirmed', doctor: 'Dr. Smith', time: '1 week ago' },
  ],
};

export default function DashboardScreen() {
  const { user } = useAuth();

  if (!user) return null;

  const stats = mockStats[user.role];
  const activities = recentActivities[user.role];

  const renderStatsCards = () => {
    switch (user.role) {
      case 'receptionist':
        return (
          <View style={styles.statsGrid}>
            <Card style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
              <Users size={24} color="#1976D2" />
              <Text style={styles.statNumber}>{stats.totalPatients}</Text>
              <Text style={styles.statLabel}>Total Patients</Text>
            </Card>
            <Card style={[styles.statCard, { backgroundColor: '#E8F5E8' }]}>
              <Calendar size={24} color="#2E7D32" />
              <Text style={styles.statNumber}>{stats.todayAppointments}</Text>
              <Text style={styles.statLabel}>Today's Appointments</Text>
            </Card>
            <Card style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
              <FileText size={24} color="#F57C00" />
              <Text style={styles.statNumber}>{stats.pendingReports}</Text>
              <Text style={styles.statLabel}>Pending Reports</Text>
            </Card>
            <Card style={[styles.statCard, { backgroundColor: '#F3E5F5' }]}>
              <TrendingUp size={24} color="#7B1FA2" />
              <Text style={styles.statNumber}>{stats.newRegistrations}</Text>
              <Text style={styles.statLabel}>New Registrations</Text>
            </Card>
          </View>
        );
      case 'doctor':
        return (
          <View style={styles.statsGrid}>
            <Card style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
              <Users size={24} color="#1976D2" />
              <Text style={styles.statNumber}>{stats.todayPatients}</Text>
              <Text style={styles.statLabel}>Today's Patients</Text>
            </Card>
            <Card style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
              <FileText size={24} color="#F57C00" />
              <Text style={styles.statNumber}>{stats.pendingPrescriptions}</Text>
              <Text style={styles.statLabel}>Pending Prescriptions</Text>
            </Card>
            <Card style={[styles.statCard, { backgroundColor: '#E8F5E8' }]}>
              <Activity size={24} color="#2E7D32" />
              <Text style={styles.statNumber}>{stats.completedConsultations}</Text>
              <Text style={styles.statLabel}>Completed Today</Text>
            </Card>
            <Card style={[styles.statCard, { backgroundColor: '#FFEBEE' }]}>
              <AlertCircle size={24} color="#D32F2F" />
              <Text style={styles.statNumber}>{stats.criticalAlerts}</Text>
              <Text style={styles.statLabel}>Critical Alerts</Text>
            </Card>
          </View>
        );
      case 'patient':
        return (
          <View style={styles.statsGrid}>
            <Card style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
              <Calendar size={24} color="#1976D2" />
              <Text style={styles.statNumber}>{stats.upcomingAppointments}</Text>
              <Text style={styles.statLabel}>Upcoming Appointments</Text>
            </Card>
            <Card style={[styles.statCard, { backgroundColor: '#E8F5E8' }]}>
              <FileText size={24} color="#2E7D32" />
              <Text style={styles.statNumber}>{stats.activePrescriptions}</Text>
              <Text style={styles.statLabel}>Active Prescriptions</Text>
            </Card>
            <Card style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
              <FileText size={24} color="#F57C00" />
              <Text style={styles.statNumber}>{stats.labReports}</Text>
              <Text style={styles.statLabel}>Lab Reports</Text>
            </Card>
            <Card style={[styles.statCard, { backgroundColor: '#F3E5F5' }]}>
              <Clock size={24} color="#7B1FA2" />
              <Text style={styles.statText}>{stats.lastVisit}</Text>
              <Text style={styles.statLabel}>Last Visit</Text>
            </Card>
          </View>
        );
    }
  };

  const getQuickActions = () => {
    switch (user.role) {
      case 'receptionist':
        return [
          { title: 'Add Patient', icon: Plus, color: '#1976D2' },
          { title: 'Upload Report', icon: FileText, color: '#2E7D32' },
          { title: 'Schedule Appointment', icon: Calendar, color: '#F57C00' },
        ];
      case 'doctor':
        return [
          { title: 'New Prescription', icon: Plus, color: '#1976D2' },
          { title: 'View Patients', icon: Users, color: '#2E7D32' },
          { title: 'Review Reports', icon: FileText, color: '#F57C00' },
        ];
      case 'patient':
        return [
          { title: 'Book Appointment', icon: Calendar, color: '#1976D2' },
          { title: 'View Prescriptions', icon: FileText, color: '#2E7D32' },
          { title: 'Lab Reports', icon: FileText, color: '#F57C00' },
        ];
      default:
        return [];
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title={`Welcome, ${user.name.split(' ')[0]}`}
        subtitle={`${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard`}
        showNotification
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStatsCards()}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {getQuickActions().map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickAction}>
                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                  <action.icon size={24} color={action.color} />
                </View>
                <Text style={styles.actionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Card style={styles.activityCard}>
            {activities.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityDot} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                  <Text style={styles.activityDetail}>
                    {user.role === 'patient' ? activity.doctor : activity.patient}
                  </Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#1a1a1a',
    marginTop: 8,
    marginBottom: 4,
  },
  statText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#1a1a1a',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  activityCard: {
    padding: 0,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1976D2',
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  activityDetail: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: '#999',
  },
});