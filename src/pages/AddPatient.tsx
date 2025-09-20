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
  icd11TM2Name: string;
  icd11TM2Code: string;
  icd11MMSName: string;
  icd11MMSCode: string;
}

const mockDiseases: Disease[] = [
  {
    namasteCode: 'NAM001',
    name: 'Hypertension',
    description: 'High blood pressure condition',
    icd11TM2Name: 'Essential hypertension',
    icd11TM2Code: 'BA00',
    icd11MMSName: 'Hypertensive diseases',
    icd11MMSCode: '11BB'
  },
  {
    namasteCode: 'NAM002', 
    name: 'Diabetes Mellitus Type 2',
    description: 'Non-insulin dependent diabetes',
    icd11TM2Name: 'Type 2 diabetes mellitus',
    icd11TM2Code: '5A11',
    icd11MMSName: 'Diabetes mellitus',
    icd11MMSCode: '5A1'
  },
  {
    namasteCode: 'NAM003',
    name: 'Asthma',
    description: 'Chronic respiratory condition',
    icd11TM2Name: 'Asthma',
    icd11TM2Code: 'CA23',
    icd11MMSName: 'Asthma',
    icd11MMSCode: 'CA23'
  }
];

export default function AddPatient() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientName: '',
    hospitalId: 'HSP-2024-001',
    abhaId: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    complaint: '',
    weight: '',
    height: '',
    bloodPressure: '',
    followUpDate: '',
    notes: ''
  });

  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredDiseases, setFilteredDiseases] = useState<Disease[]>([]);
  const [patientSaved, setPatientSaved] = useState(false);

  const handleComplaintChange = (value: string) => {
    setFormData({ ...formData, complaint: value });
    if (value.length > 2) {
      const filtered = mockDiseases.filter(disease => 
        disease.name.toLowerCase().includes(value.toLowerCase()) ||
        disease.namasteCode.toLowerCase().includes(value.toLowerCase())
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
    if (!formData.patientName || !formData.abhaId || !formData.dateOfBirth || !formData.gender) {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Add New Patient</h1>
      </div>

      <Card className="card-elevated p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Patient Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Patient Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter patient name"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                />
              </div>

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
                  ABHA ID <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="14-digit ABHA ID"
                  maxLength={14}
                  value={formData.abhaId}
                  onChange={(e) => setFormData({ ...formData, abhaId: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date of Birth <span className="text-error">*</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Gender <span className="text-error">*</span>
                </label>
                <div className="flex space-x-6">
                  {['Male', 'Female', 'Other'].map((gender) => (
                    <label key={gender} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="patient@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Address
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Enter patient address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Medical Information
            </h2>

            <div className="space-y-4">
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
                        <div className="font-medium text-sm">{disease.namasteCode} - {disease.name}</div>
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
                    <label className="block text-sm font-medium text-foreground mb-1">ICD-11 TM2 Name + Code</label>
                    <input type="text" className="form-input bg-card" value={`${selectedDisease.icd11TM2Name} (${selectedDisease.icd11TM2Code})`} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">ICD-11 MMS Name + Code</label>
                    <input type="text" className="form-input bg-card" value={`${selectedDisease.icd11MMSName} (${selectedDisease.icd11MMSCode})`} readOnly />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Doctor Name</label>
                <input type="text" className="form-input bg-muted" value="Dr. Sarah Johnson" readOnly />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Encounter Date & Time</label>
                <input type="text" className="form-input bg-muted" value={new Date().toLocaleString()} readOnly />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Vitals</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      className="form-input text-sm"
                      placeholder="70"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Height (cm)</label>
                    <input
                      type="number"
                      className="form-input text-sm"
                      placeholder="175"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">BP (mmHg)</label>
                    <input
                      type="text"
                      className="form-input text-sm"
                      placeholder="120/80"
                      value={formData.bloodPressure}
                      onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Follow-Up Date (Optional)</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                />
              </div>

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
            </div>
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
  );
}