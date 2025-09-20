import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search, Save, FileText, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';

interface Disease {
  namasteCode: string;
  name: string;
  description: string;
  category: string;
  icd11TM2Name: string;
  icd11TM2Code: string;
  icd11MMSName: string;
  icd11MMSCode: string;
}

interface PatientData {
  abhaId: string;
  patientName: string;
  hospitalId: string;
  patientId: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
}

const mockDiseases: Disease[] = [
  {
    namasteCode: 'AYU-001',
    name: 'Vata Dosha Imbalance',
    description: 'Imbalance of Vata dosha causing movement and nervous system disorders',
    category: 'ayurveda',
    icd11TM2Name: 'Traditional medicine disorders',
    icd11TM2Code: 'XM1A50',
    icd11MMSName: 'Traditional medicine conditions',
    icd11MMSCode: 'XM1A'
  },
  {
    namasteCode: 'NAM-002', 
    name: 'Diabetes Mellitus Type 2',
    description: 'Non-insulin dependent diabetes mellitus',
    category: 'modern',
    icd11TM2Name: 'Type 2 diabetes mellitus',
    icd11TM2Code: '5A11',
    icd11MMSName: 'Diabetes mellitus',
    icd11MMSCode: '5A1'
  },
  {
    namasteCode: 'NAM-003',
    name: 'Essential Hypertension',
    description: 'Primary high blood pressure without identifiable cause',
    category: 'modern',
    icd11TM2Name: 'Essential hypertension',
    icd11TM2Code: 'BA00',
    icd11MMSName: 'Hypertensive diseases',
    icd11MMSCode: '11BB'
  }
];

const mockPatientData: Record<string, PatientData> = {
  '12345678901234': {
    abhaId: '12345678901234',
    patientName: 'Raj Kumar Sharma',
    hospitalId: 'HSP-2024-001',
    patientId: 'PAT-2024-0123',
    dateOfBirth: '1985-06-15',
    gender: 'Male',
    phone: '+91 98765 43210',
    email: 'raj.sharma@email.com',
    address: '123 Gandhi Nagar, New Delhi, 110001'
  },
  '98765432109876': {
    abhaId: '98765432109876',
    patientName: 'Priya Patel',
    hospitalId: 'HSP-2024-001',
    patientId: 'PAT-2024-0124',
    dateOfBirth: '1990-03-22',
    gender: 'Female',
    phone: '+91 87654 32109',
    email: 'priya.patel@email.com',
    address: '456 MG Road, Mumbai, 400001'
  }
};

export default function AddPatient() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    abhaId: '',
    patientName: '',
    hospitalId: 'HSP-2024-001',
    patientId: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    followUpDate: '',
    notes: '',
    complaint: ''
  });

  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredDiseases, setFilteredDiseases] = useState<Disease[]>([]);
  const [patientSaved, setPatientSaved] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  const handleAbhaIdChange = (value: string) => {
    setFormData({ ...formData, abhaId: value });
    
    // Auto-fill patient data if ABHA ID exists in mock data
    if (value.length === 14 && mockPatientData[value]) {
      const patientData = mockPatientData[value];
      setFormData({
        ...formData,
        abhaId: value,
        patientName: patientData.patientName,
        hospitalId: patientData.hospitalId,
        patientId: patientData.patientId,
        dateOfBirth: patientData.dateOfBirth,
        gender: patientData.gender,
        phone: patientData.phone,
        email: patientData.email,
        address: patientData.address,
      });
      setIsAutoFilled(true);
      toast({
        title: "Patient Data Auto-filled",
        description: "Patient information loaded from ABHA ID",
        variant: "default"
      });
    } else {
      setIsAutoFilled(false);
    }
  };

  const handleComplaintChange = (value: string) => {
    setFormData({ ...formData, complaint: value });
    if (value.length > 2) {
      const filtered = mockDiseases.filter(disease => 
        disease.name.toLowerCase().includes(value.toLowerCase()) ||
        disease.namasteCode.toLowerCase().includes(value.toLowerCase()) ||
        disease.description.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDiseases(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectDisease = (disease: Disease) => {
    setSelectedDisease(disease);
    setFormData({ ...formData, complaint: disease.name });
    setShowSuggestions(false);
  };

  const handleSavePatient = () => {
    // Validate required fields
    if (!formData.abhaId || !formData.patientName || !formData.dateOfBirth || !formData.gender) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Simulate saving
    setTimeout(() => {
      setPatientSaved(true);
      toast({
        title: "Success",
        description: "✅ Patient saved to hospital EMR database.",
        variant: "default"
      });
    }, 500);
  };

  const handleGenerateFHIR = () => {
    navigate('/fhir-preview', { state: { patientData: formData, selectedDisease } });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h1 className="text-3xl font-bold text-foreground">Add New Patient</h1>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <Card className="card-elevated p-6 max-w-4xl mx-auto">
          {/* Patient Information Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Patient Information
            </h2>

            {/* ABHA ID - Primary Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                ABHA ID <span className="text-error">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="14-digit ABHA ID"
                maxLength={14}
                value={formData.abhaId}
                onChange={(e) => handleAbhaIdChange(e.target.value)}
              />
              {isAutoFilled && (
                <p className="text-xs text-success mt-1">✅ Patient data auto-filled from ABHA ID</p>
              )}
            </div>

            {/* Hospital ID and Patient ID Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Hospital ID
                </label>
                <input
                  type="text"
                  className="form-input bg-muted"
                  value={formData.hospitalId}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Patient ID
                </label>
                <input
                  type="text"
                  className="form-input bg-muted"
                  value={formData.patientId}
                  readOnly
                  placeholder="Will be auto-generated"
                />
              </div>
            </div>

            {/* Patient Details */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Patient Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                className={`form-input ${isAutoFilled ? 'bg-muted' : ''}`}
                placeholder="Enter patient name"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                readOnly={isAutoFilled}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date of Birth <span className="text-error">*</span>
                </label>
                <input
                  type="date"
                  className={`form-input ${isAutoFilled ? 'bg-muted' : ''}`}
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  readOnly={isAutoFilled}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Gender <span className="text-error">*</span>
                </label>
                <div className="flex space-x-6 mt-2">
                  {['Male', 'Female', 'Other'].map((gender) => (
                    <label key={gender} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="text-primary focus:ring-primary"
                        disabled={isAutoFilled}
                      />
                      <span className="text-sm text-foreground">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className={`form-input ${isAutoFilled ? 'bg-muted' : ''}`}
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  readOnly={isAutoFilled}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className={`form-input ${isAutoFilled ? 'bg-muted' : ''}`}
                  placeholder="patient@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  readOnly={isAutoFilled}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Address
              </label>
              <textarea
                className={`form-input ${isAutoFilled ? 'bg-muted' : ''}`}
                rows={3}
                placeholder="Enter patient address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                readOnly={isAutoFilled}
              />
            </div>
          </div>

          {/* Medical Information Section */}
          <div className="space-y-6 mt-8">
            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Medical Information
            </h2>

            {/* Doctor Name and Encounter Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Doctor Name</label>
                <input type="text" className="form-input bg-muted" value="Dr. Sarah Johnson" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Encounter Date & Time</label>
                <input type="text" className="form-input bg-muted" value={new Date().toLocaleString()} readOnly />
              </div>
            </div>

            {/* Follow-up Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Follow-Up Date (Optional)</label>
              <input
                type="date"
                className="form-input"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
              />
            </div>

            {/* Notes and Observation */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Notes / Observation</label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Additional notes or observations..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            {/* Disease Selection Section */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-foreground">Disease / Condition</h3>
              
              <div className="relative">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Primary Complaint / Disease
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    className="form-input pl-10"
                    placeholder="Search for disease or condition..."
                    value={formData.complaint}
                    onChange={(e) => handleComplaintChange(e.target.value)}
                    onFocus={() => formData.complaint.length > 2 && setShowSuggestions(true)}
                  />
                </div>
                
                {showSuggestions && filteredDiseases.length > 0 && (
                  <Card className="absolute z-10 w-full mt-1 bg-card border border-border shadow-lg">
                    {filteredDiseases.map((disease) => (
                      <div
                        key={disease.namasteCode}
                        className="suggestion-item"
                        onClick={() => selectDisease(disease)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            disease.category === 'ayurveda' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {disease.category}
                          </span>
                          <span className="font-medium text-sm">{disease.namasteCode}</span>
                        </div>
                        <div className="font-medium text-sm">{disease.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{disease.description}</div>
                      </div>
                    ))}
                  </Card>
                )}
              </div>

              {selectedDisease && (
                <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">NAMASTE Code</label>
                    <input type="text" className="form-input bg-card" value={selectedDisease.namasteCode} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">ICD-11 TM2 Name</label>
                    <input type="text" className="form-input bg-card" value={selectedDisease.icd11TM2Name} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">ICD-11 TM2 Code</label>
                    <input type="text" className="form-input bg-card" value={selectedDisease.icd11TM2Code} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">ICD-11 MMS Name</label>
                    <input type="text" className="form-input bg-card" value={selectedDisease.icd11MMSName} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">ICD-11 MMS Code</label>
                    <input type="text" className="form-input bg-card" value={selectedDisease.icd11MMSCode} readOnly />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4 pt-6 border-t border-border">
            <Button
              onClick={handleSavePatient}
              className="btn-primary flex items-center space-x-2"
              disabled={patientSaved}
            >
              {patientSaved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{patientSaved ? 'Patient Saved' : 'Save Patient'}</span>
            </Button>
            
            <Button
              onClick={handleGenerateFHIR}
              className="btn-secondary flex items-center space-x-2"
              disabled={!patientSaved}
            >
              <FileText className="w-4 h-4" />
              <span>Generate FHIR Bundle</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}