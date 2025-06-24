import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Header from '@/components/ui/Header';
import Input from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { loadPatients, savePatients, Patient, initializeStorage } from '@/utils/storage';
import {
    Calendar,
    Edit,
    Eye,
    Mail,
    MapPin,
    Phone,
    Plus,
    Search,
    User,
    Heart,
    AlertTriangle
} from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Picker,
} from 'react-native';

export default function PatientsScreen() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    phone: '',
    email: '',
    address: '',
    condition: '',
    bloodGroup: '',
    emergencyContact: '',
    allergies: '',
  });

  useEffect(() => {
    loadPatientsData();
  }, []);

  const loadPatientsData = async () => {
    await initializeStorage();
    const patientsData = await loadPatients();
    setPatients(patientsData);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  );

  const handleAddPatient = async () => {
    if (!newPatient.name || !newPatient.age || !newPatient.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const patient: Patient = {
      id: Date.now().toString(),
      name: newPatient.name,
      age: parseInt(newPatient.age),
      gender: newPatient.gender,
      phone: newPatient.phone,
      email: newPatient.email,
      address: newPatient.address,
      condition: newPatient.condition,
      lastVisit: new Date().toISOString().split('T')[0],
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      bloodGroup: newPatient.bloodGroup,
      emergencyContact: newPatient.emergencyContact,
      allergies: newPatient.allergies ? newPatient.allergies.split(',').map(a => a.trim()) : []
    };

    const updatedPatients = [...patients, patient];
    setPatients(updatedPatients);
    await savePatients(updatedPatients);
    
    setNewPatient({
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      email: '',
      address: '',
      condition: '',
      bloodGroup: '',
      emergencyContact: '',
      allergies: '',
    });
    setShowAddModal(false);
    Alert.alert('Success', 'Patient added successfully');
  };

  const handleEditPatient = async () => {
    if (!editingPatient || !editingPatient.name || !editingPatient.age || !editingPatient.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const updatedPatients = patients.map(p => 
      p.id === editingPatient.id ? {
        ...editingPatient,
        allergies: typeof editingPatient.allergies === 'string' 
          ? editingPatient.allergies.split(',').map(a => a.trim())
          : editingPatient.allergies
      } : p
    );
    
    setPatients(updatedPatients);
    await savePatients(updatedPatients);
    setShowEditModal(false);
    setEditingPatient(null);
    Alert.alert('Success', 'Patient updated successfully');
  };

  const openEditModal = (patient: Patient) => {
    setEditingPatient({
      ...patient,
      allergies: Array.isArray(patient.allergies) ? patient.allergies.join(', ') : patient.allergies || ''
    });
    setShowEditModal(true);
  };

  const canEdit = user?.role === 'receptionist';
  const canView = user?.role === 'doctor' || user?.role === 'receptionist';

  return (
    <View style={styles.container}>
      <Header 
        title="Patients" 
        subtitle={`${filteredPatients.length} patients`}
        rightComponent={
          canEdit ? (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          ) : null
        }
      />

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView style={styles.patientsList} showsVerticalScrollIndicator={false}>
          {filteredPatients.map((patient) => (
            <Card key={patient.id} style={styles.patientCard}>
              <View style={styles.patientHeader}>
                <View style={styles.patientInfo}>
                  <View style={styles.avatar}>
                    <User size={24} color="#1976D2" />
                  </View>
                  <View style={styles.patientDetails}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <Text style={styles.patientMeta}>
                      {patient.age} years • {patient.gender}
                    </Text>
                    <Text style={styles.patientCondition}>{patient.condition}</Text>
                    {patient.bloodGroup && (
                      <View style={styles.bloodGroupContainer}>
                        <Heart size={12} color="#D32F2F" />
                        <Text style={styles.bloodGroup}>{patient.bloodGroup}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.patientActions}>
                  {canView && (
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => setSelectedPatient(patient)}
                    >
                      <Eye size={18} color="#1976D2" />
                    </TouchableOpacity>
                  )}
                  {canEdit && (
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => openEditModal(patient)}
                    >
                      <Edit size={18} color="#666" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              <View style={styles.patientContact}>
                <View style={styles.contactItem}>
                  <Phone size={14} color="#666" />
                  <Text style={styles.contactText}>{patient.phone}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Calendar size={14} color="#666" />
                  <Text style={styles.contactText}>Last visit: {patient.lastVisit}</Text>
                </View>
              </View>
            </Card>
          ))}
        </ScrollView>
      </View>

      {/* Add Patient Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Patient</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Input
              placeholder="Full Name *"
              value={newPatient.name}
              onChangeText={(text) => setNewPatient({...newPatient, name: text})}
            />
            <Input
              placeholder="Age *"
              value={newPatient.age}
              onChangeText={(text) => setNewPatient({...newPatient, age: text})}
              keyboardType="numeric"
            />
            <Input
              placeholder="Phone Number *"
              value={newPatient.phone}
              onChangeText={(text) => setNewPatient({...newPatient, phone: text})}
              keyboardType="phone-pad"
            />
            <Input
              placeholder="Email Address"
              value={newPatient.email}
              onChangeText={(text) => setNewPatient({...newPatient, email: text})}
              keyboardType="email-address"
            />
            <Input
              placeholder="Address"
              value={newPatient.address}
              onChangeText={(text) => setNewPatient({...newPatient, address: text})}
              multiline
            />
            <Input
              placeholder="Medical Condition"
              value={newPatient.condition}
              onChangeText={(text) => setNewPatient({...newPatient, condition: text})}
            />
            <Input
              placeholder="Blood Group (e.g., A+, B-, O+)"
              value={newPatient.bloodGroup}
              onChangeText={(text) => setNewPatient({...newPatient, bloodGroup: text})}
            />
            <Input
              placeholder="Emergency Contact"
              value={newPatient.emergencyContact}
              onChangeText={(text) => setNewPatient({...newPatient, emergencyContact: text})}
              keyboardType="phone-pad"
            />
            <Input
              placeholder="Allergies (comma separated)"
              value={newPatient.allergies}
              onChangeText={(text) => setNewPatient({...newPatient, allergies: text})}
              multiline
            />
            
            <Button
              title="Add Patient"
              onPress={handleAddPatient}
              style={styles.addPatientButton}
            />
          </ScrollView>
        </View>
      </Modal>

      {/* Edit Patient Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {editingPatient && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Patient</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Input
                placeholder="Full Name *"
                value={editingPatient.name}
                onChangeText={(text) => setEditingPatient({...editingPatient, name: text})}
              />
              <Input
                placeholder="Age *"
                value={editingPatient.age.toString()}
                onChangeText={(text) => setEditingPatient({...editingPatient, age: parseInt(text) || 0})}
                keyboardType="numeric"
              />
              <Input
                placeholder="Phone Number *"
                value={editingPatient.phone}
                onChangeText={(text) => setEditingPatient({...editingPatient, phone: text})}
                keyboardType="phone-pad"
              />
              <Input
                placeholder="Email Address"
                value={editingPatient.email}
                onChangeText={(text) => setEditingPatient({...editingPatient, email: text})}
                keyboardType="email-address"
              />
              <Input
                placeholder="Address"
                value={editingPatient.address}
                onChangeText={(text) => setEditingPatient({...editingPatient, address: text})}
                multiline
              />
              <Input
                placeholder="Medical Condition"
                value={editingPatient.condition}
                onChangeText={(text) => setEditingPatient({...editingPatient, condition: text})}
              />
              <Input
                placeholder="Blood Group (e.g., A+, B-, O+)"
                value={editingPatient.bloodGroup || ''}
                onChangeText={(text) => setEditingPatient({...editingPatient, bloodGroup: text})}
              />
              <Input
                placeholder="Emergency Contact"
                value={editingPatient.emergencyContact || ''}
                onChangeText={(text) => setEditingPatient({...editingPatient, emergencyContact: text})}
                keyboardType="phone-pad"
              />
              <Input
                placeholder="Allergies (comma separated)"
                value={typeof editingPatient.allergies === 'string' ? editingPatient.allergies : editingPatient.allergies?.join(', ') || ''}
                onChangeText={(text) => setEditingPatient({...editingPatient, allergies: text})}
                multiline
              />
              
              <Button
                title="Update Patient"
                onPress={handleEditPatient}
                style={styles.addPatientButton}
              />
            </ScrollView>
          </View>
        )}
      </Modal>

      {/* Patient Details Modal */}
      <Modal
        visible={!!selectedPatient}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedPatient && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Patient Details</Text>
              <TouchableOpacity onPress={() => setSelectedPatient(null)}>
                <Text style={styles.cancelButton}>Close</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.patientProfile}>
                <View style={styles.profileAvatar}>
                  <User size={40} color="#1976D2" />
                </View>
                <Text style={styles.profileName}>{selectedPatient.name}</Text>
                <Text style={styles.profileMeta}>
                  {selectedPatient.age} years • {selectedPatient.gender}
                </Text>
                {selectedPatient.bloodGroup && (
                  <View style={styles.bloodGroupContainer}>
                    <Heart size={16} color="#D32F2F" />
                    <Text style={styles.profileBloodGroup}>{selectedPatient.bloodGroup}</Text>
                  </View>
                )}
              </View>

              <View style={styles.detailsSection}>
                <View style={styles.detailItem}>
                  <Phone size={20} color="#666" />
                  <Text style={styles.detailText}>{selectedPatient.phone}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Mail size={20} color="#666" />
                  <Text style={styles.detailText}>{selectedPatient.email}</Text>
                </View>
                <View style={styles.detailItem}>
                  <MapPin size={20} color="#666" />
                  <Text style={styles.detailText}>{selectedPatient.address}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Calendar size={20} color="#666" />
                  <Text style={styles.detailText}>Last visit: {selectedPatient.lastVisit}</Text>
                </View>
                {selectedPatient.emergencyContact && (
                  <View style={styles.detailItem}>
                    <Phone size={20} color="#D32F2F" />
                    <Text style={styles.detailText}>Emergency: {selectedPatient.emergencyContact}</Text>
                  </View>
                )}
              </View>

              <Card style={styles.conditionCard}>
                <Text style={styles.conditionTitle}>Medical Condition</Text>
                <Text style={styles.conditionText}>{selectedPatient.condition}</Text>
              </Card>

              {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                <Card style={styles.allergiesCard}>
                  <View style={styles.allergiesHeader}>
                    <AlertTriangle size={20} color="#F57C00" />
                    <Text style={styles.allergiesTitle}>Allergies</Text>
                  </View>
                  <View style={styles.allergiesList}>
                    {selectedPatient.allergies.map((allergy, index) => (
                      <View key={index} style={styles.allergyItem}>
                        <Text style={styles.allergyText}>{allergy}</Text>
                      </View>
                    ))}
                  </View>
                </Card>
              )}
            </ScrollView>
          </View>
        )}
      </Modal>
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
  addButton: {
    backgroundColor: '#1976D2',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#1a1a1a',
  },
  patientsList: {
    flex: 1,
  },
  patientCard: {
    marginBottom: 12,
    padding: 16,
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  patientMeta: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    marginBottom: 4,
  },
  patientCondition: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    color: '#1976D2',
    marginBottom: 4,
  },
  bloodGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bloodGroup: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    color: '#D32F2F',
    marginLeft: 4,
  },
  patientActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  patientContact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    marginLeft: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#1a1a1a',
  },
  cancelButton: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#1976D2',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  addPatientButton: {
    marginTop: 24,
    marginBottom: 32,
  },
  patientProfile: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  profileMeta: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    marginBottom: 8,
  },
  profileBloodGroup: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#D32F2F',
    marginLeft: 8,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#1a1a1a',
    marginLeft: 16,
  },
  conditionCard: {
    backgroundColor: '#E3F2FD',
    marginBottom: 16,
  },
  conditionTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  conditionText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#1a1a1a',
  },
  allergiesCard: {
    backgroundColor: '#FFF3E0',
    marginBottom: 32,
  },
  allergiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  allergiesTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#F57C00',
    marginLeft: 8,
  },
  allergiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  allergyItem: {
    backgroundColor: '#FFE0B2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  allergyText: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    color: '#E65100',
  },
});