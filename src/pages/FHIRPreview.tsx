import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  User, 
  Activity, 
  Eye, 
  MessageSquare, 
  Package, 
  Shield,
  CheckCircle,
  Copy,
  Send,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';

const fhirSections = [
  { id: 'patient', label: 'Patient', icon: User },
  { id: 'condition', label: 'Condition', icon: AlertCircle },
  { id: 'observation', label: 'Observation', icon: Eye },
  { id: 'encounter', label: 'Encounter', icon: MessageSquare },
  { id: 'bundle', label: 'Bundle', icon: Package },
  { id: 'consent', label: 'Consent', icon: Shield },
];

export default function FHIRPreview() {
  const location = useLocation();
  const { toast } = useToast();
  const { patientData, selectedDisease } = location.state || {};

  const [activeSection, setActiveSection] = useState('patient');
  const [validationStatus, setValidationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [consentStatus, setConsentStatus] = useState<'pending' | 'requesting' | 'granted'>('pending');
  const [serverStatus, setServerStatus] = useState<'pending' | 'success'>('pending');

  const generateFHIRData = (section: string) => {
    const baseData = {
      resourceType: section === 'patient' ? 'Patient' : 
                   section === 'condition' ? 'Condition' :
                   section === 'observation' ? 'Observation' :
                   section === 'encounter' ? 'Encounter' :
                   section === 'bundle' ? 'Bundle' : 'Consent',
      id: `${section}-${Date.now()}`,
      meta: {
        versionId: "1",
        lastUpdated: new Date().toISOString(),
        profile: [`http://hl7.org/fhir/StructureDefinition/${section === 'patient' ? 'Patient' : section}`]
      }
    };

    switch (section) {
      case 'patient':
        return {
          ...baseData,
          identifier: [
            {
              use: "usual",
              type: {
                coding: [{
                  system: "http://terminology.hl7.org/CodeSystem/v2-0203",
                  code: "ABHA",
                  display: "ABHA ID"
                }]
              },
              value: patientData?.abhaId || "12345678901234"
            }
          ],
          name: [{
            use: "official",
            text: patientData?.patientName || "John Doe",
            family: patientData?.patientName?.split(' ').pop() || "Doe",
            given: [patientData?.patientName?.split(' ')[0] || "John"]
          }],
          gender: patientData?.gender?.toLowerCase() || "male",
          birthDate: patientData?.dateOfBirth || "1990-01-01",
          telecom: [
            {
              system: "phone",
              value: patientData?.phone || "+91 98765 43210",
              use: "mobile"
            },
            {
              system: "email", 
              value: patientData?.email || "john.doe@example.com",
              use: "home"
            }
          ],
          address: [{
            use: "home",
            text: patientData?.address || "123 Health Street, Medical City, IN 110001",
            line: [patientData?.address || "123 Health Street"],
            city: "Medical City",
            state: "Delhi",
            postalCode: "110001",
            country: "IN"
          }]
        };

      case 'condition':
        return {
          ...baseData,
          clinicalStatus: {
            coding: [{
              system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
              code: "active"
            }]
          },
          verificationStatus: {
            coding: [{
              system: "http://terminology.hl7.org/CodeSystem/condition-ver-status", 
              code: "confirmed"
            }]
          },
          code: {
            coding: [
              {
                system: "http://hl7.org/fhir/sid/icd-11",
                code: selectedDisease?.icd11TM2Code || "BA00",
                display: selectedDisease?.icd11TM2Name || "Essential hypertension"
              },
              {
                system: "http://namaste.gov.in/codes",
                code: selectedDisease?.namasteCode || "NAM001", 
                display: selectedDisease?.name || "Hypertension"
              }
            ]
          },
          subject: {
            reference: "Patient/patient-123",
            display: patientData?.patientName || "John Doe"
          },
          encounter: {
            reference: "Encounter/encounter-123"
          },
          recordedDate: new Date().toISOString()
        };

      case 'observation':
        return {
          ...baseData,
          status: "final",
          category: [{
            coding: [{
              system: "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "vital-signs",
              display: "Vital Signs"
            }]
          }],
          code: {
            coding: [{
              system: "http://loinc.org",
              code: "29463-7",
              display: "Body Weight"
            }]
          },
          subject: {
            reference: "Patient/patient-123",
            display: patientData?.patientName || "John Doe"
          },
          valueQuantity: {
            value: parseFloat(patientData?.weight) || 70,
            unit: "kg",
            system: "http://unitsofmeasure.org",
            code: "kg"
          },
          effectiveDateTime: new Date().toISOString()
        };

      case 'encounter':
        return {
          ...baseData,
          status: "finished",
          class: {
            system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
            code: "AMB",
            display: "ambulatory"
          },
          subject: {
            reference: "Patient/patient-123",
            display: patientData?.patientName || "John Doe"
          },
          participant: [{
            individual: {
              reference: "Practitioner/dr-sarah-johnson",
              display: "Dr. Sarah Johnson"
            }
          }],
          period: {
            start: new Date().toISOString(),
            end: new Date().toISOString()
          },
          reasonCode: [{
            coding: [{
              system: "http://namaste.gov.in/codes",
              code: selectedDisease?.namasteCode || "NAM001",
              display: selectedDisease?.name || "Hypertension"
            }]
          }]
        };

      case 'bundle':
        return {
          ...baseData,
          type: "collection",
          timestamp: new Date().toISOString(),
          entry: [
            {
              fullUrl: "Patient/patient-123",
              resource: generateFHIRData('patient')
            },
            {
              fullUrl: "Condition/condition-123", 
              resource: generateFHIRData('condition')
            },
            {
              fullUrl: "Observation/observation-123",
              resource: generateFHIRData('observation')
            },
            {
              fullUrl: "Encounter/encounter-123",
              resource: generateFHIRData('encounter')
            }
          ]
        };

      case 'consent':
        return {
          ...baseData,
          status: "active",
          scope: {
            coding: [{
              system: "http://terminology.hl7.org/CodeSystem/consentscope",
              code: "patient-privacy"
            }]
          },
          category: [{
            coding: [{
              system: "http://terminology.hl7.org/CodeSystem/consentcategorycodes",
              code: "idscl"
            }]
          }],
          patient: {
            reference: "Patient/patient-123",
            display: patientData?.patientName || "John Doe"
          },
          dateTime: new Date().toISOString(),
          policy: [{
            uri: "http://example.org/consent-policy"
          }]
        };

      default:
        return baseData;
    }
  };

  const handleValidateFHIR = () => {
    setValidationStatus('success');
    toast({
      title: "Validation Complete",
      description: "FHIR validated successfully ✅",
      variant: "default"
    });
  };

  const handleRequestConsent = () => {
    setConsentStatus('requesting');
    toast({
      title: "Consent Request Sent",
      description: "Request sent to patient. Waiting for consent…",
      variant: "default"
    });

    // Simulate consent approval after 10 seconds
    setTimeout(() => {
      setConsentStatus('granted');
      toast({
        title: "Consent Granted",
        description: "Consent granted ✅",
        variant: "default"
      });
    }, 10000);
  };

  const handleSendToServer = () => {
    setServerStatus('success');
    toast({
      title: "Success",
      description: "FHIR Bundle sent to server 🎉",
      variant: "default"
    });
  };

  const copyToClipboard = () => {
    const fhirData = generateFHIRData(activeSection);
    navigator.clipboard.writeText(JSON.stringify(fhirData, null, 2));
    toast({
      title: "Copied",
      description: "FHIR data copied to clipboard",
      variant: "default"
    });
  };

  if (!patientData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">No Patient Data Found</h2>
          <p className="text-muted-foreground">Please add a patient first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">FHIR Bundle Preview</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Navigation */}
        <Card className="card-elevated p-4">
          <h2 className="font-semibold text-foreground mb-4">FHIR Resources</h2>
          <nav className="space-y-1">
            {fhirSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <section.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </Card>

        {/* FHIR Data Viewer */}
        <Card className="lg:col-span-3 card-elevated">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground capitalize">
              {activeSection} Resource
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </Button>
          </div>
          
          <div className="p-4">
            <pre className="bg-muted/30 p-4 rounded-lg overflow-auto text-xs font-mono max-h-96 border">
              {JSON.stringify(generateFHIRData(activeSection), null, 2)}
            </pre>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card className="card-elevated p-6">
        <div className="flex justify-end space-x-4">
          <Button
            onClick={handleValidateFHIR}
            variant={validationStatus === 'success' ? 'default' : 'outline'}
            className="flex items-center space-x-2"
            disabled={validationStatus === 'success'}
          >
            {validationStatus === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>
              {validationStatus === 'success' ? 'FHIR Validated' : 'Validate FHIR'}
            </span>
          </Button>

          <Button
            onClick={handleRequestConsent}
            variant={consentStatus === 'granted' ? 'default' : 'outline'}
            className="flex items-center space-x-2"
            disabled={validationStatus !== 'success' || consentStatus === 'granted'}
          >
            {consentStatus === 'requesting' ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : consentStatus === 'granted' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Shield className="w-4 h-4" />
            )}
            <span>
              {consentStatus === 'requesting' ? 'Waiting for Consent...' :
               consentStatus === 'granted' ? 'Consent Granted' :
               'Request Consent'}
            </span>
          </Button>

          <Button
            onClick={handleSendToServer}
            className="btn-primary flex items-center space-x-2"
            disabled={consentStatus !== 'granted' || serverStatus === 'success'}
          >
            {serverStatus === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>
              {serverStatus === 'success' ? 'Sent to Server' : 'Send to Server'}
            </span>
          </Button>
        </div>
      </Card>

      {/* Consent Modal */}
      {consentStatus === 'requesting' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="card-elevated p-6 max-w-md mx-4">
            <div className="text-center space-y-4">
              <Clock className="w-12 h-12 text-warning mx-auto animate-pulse" />
              <h3 className="text-lg font-semibold">Requesting Patient Consent</h3>
              <p className="text-muted-foreground">
                A consent request has been sent to the patient. Please wait for approval...
              </p>
              <div className="text-sm text-muted-foreground">
                This may take up to 1 minute
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}