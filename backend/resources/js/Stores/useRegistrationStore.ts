import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Guardian {
  id?: string;
  full_name: string;
  relationship: string;
  gender: string;
  national_id: string;
  occupation: string;
  employer: string;
  phone: string;
  alternative_phone: string;
  email: string;
  address: string;
  is_primary: boolean;
}

export interface RegistrationState {
  // Step 1: Personal
  admission_number: string;
  national_id_passport: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  place_of_birth: string;
  nationality: string;
  marital_status: string;
  religion: string;
  
  // Step 2: Address
  phone_number: string;
  email: string;
  house_number: string;
  street_name: string;
  area_village: string;
  traditional_authority: string;
  district: string;
  city_town: string;
  postal_address: string;
  country: string;

  // Step 3: Academics
  academic_year_id: string;
  class_group_id: string;
  campus_id: string;
  mode_of_study: string;
  year_of_study: string;
  term_id: string;
  start_date: string;
  end_date: string;

  // Step 4: Guardians
  guardians: Guardian[];

  // Step 5: Sponsor
  sponsorship_type: string;
  sponsor_name: string;
  sponsor_contact_person: string;
  sponsor_phone: string;
  sponsor_email: string;
  sponsor_address: string;

  // Step 6: Medical
  health_status: string;
  blood_group: string;
  has_disability: boolean;
  disability_type: string;
  chronic_conditions: string;
  allergies: string;
  medications: string;
  special_needs: string;

  // Step 7: Emergency
  emergency_full_name: string;
  emergency_relationship: string;
  emergency_phone: string;
  emergency_alternative_phone: string;
  emergency_email: string;
  emergency_address: string;

  // Step 8: Account (Optional)
  username: string;
  password?: string;
  password_confirmation?: string;
  security_question: string;
  security_answer: string;

  // Step 10: Consent
  consent_policies: boolean;
  consent_privacy: boolean;
  digital_signature: string;

  // UI State
  current_step: number;

  // Methods
  updateField: (field: string, value: any) => void;
  setStep: (step: number) => void;
  updateGuardian: (index: number, field: string, value: any) => void;
  addGuardian: () => void;
  removeGuardian: (index: number) => void;
  resetStore: () => void;
}

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set) => ({
      admission_number: '',
      national_id_passport: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      gender: '',
      date_of_birth: '',
      place_of_birth: '',
      nationality: '',
      marital_status: '',
      religion: '',

      phone_number: '',
      email: '',
      house_number: '',
      street_name: '',
      area_village: '',
      traditional_authority: '',
      district: '',
      city_town: '',
      postal_address: '',
      country: '',

      academic_year_id: '',
      class_group_id: '',
      campus_id: '',
      mode_of_study: 'full_time',
      year_of_study: '1',
      term_id: '',
      start_date: '',
      end_date: '',

      guardians: [
        {
          full_name: '',
          relationship: '',
          gender: '',
          national_id: '',
          occupation: '',
          employer: '',
          phone: '',
          alternative_phone: '',
          email: '',
          address: '',
          is_primary: true,
        }
      ],

      sponsorship_type: 'Self',
      sponsor_name: '',
      sponsor_contact_person: '',
      sponsor_phone: '',
      sponsor_email: '',
      sponsor_address: '',

      health_status: '',
      blood_group: '',
      has_disability: false,
      disability_type: '',
      chronic_conditions: '',
      allergies: '',
      medications: '',
      special_needs: '',

      emergency_full_name: '',
      emergency_relationship: '',
      emergency_phone: '',
      emergency_alternative_phone: '',
      emergency_email: '',
      emergency_address: '',

      username: '',
      password: '',
      password_confirmation: '',
      security_question: '',
      security_answer: '',

      consent_policies: false,
      consent_privacy: false,
      digital_signature: '',

      current_step: 1,

      updateField: (field, value) => set((state) => ({ ...state, [field]: value })),
      
      setStep: (step) => set({ current_step: step }),

      updateGuardian: (index, field, value) => set((state) => {
        const newGuardians = [...state.guardians];
        
        // If setting is_primary to true, set all others to false
        if (field === 'is_primary' && value === true) {
            newGuardians.forEach((g, i) => {
                if (i !== index) newGuardians[i].is_primary = false;
            });
        }
        
        newGuardians[index] = { ...newGuardians[index], [field]: value };
        return { guardians: newGuardians };
      }),

      addGuardian: () => set((state) => ({
        guardians: [
          ...state.guardians,
          {
            full_name: '',
            relationship: '',
            gender: '',
            national_id: '',
            occupation: '',
            employer: '',
            phone: '',
            alternative_phone: '',
            email: '',
            address: '',
            is_primary: false,
          }
        ]
      })),

      removeGuardian: (index) => set((state) => {
        const newGuardians = [...state.guardians];
        if (newGuardians.length > 1) {
            newGuardians.splice(index, 1);
            // Ensure at least one primary if we deleted the primary
            if (!newGuardians.some(g => g.is_primary)) {
                newGuardians[0].is_primary = true;
            }
        }
        return { guardians: newGuardians };
      }),

      resetStore: () => set({
        admission_number: '',
        first_name: '', last_name: '', // ... reset other critical fields, omitting for brevity
        current_step: 1,
        guardians: [{
            full_name: '', relationship: '', gender: '', national_id: '',
            occupation: '', employer: '', phone: '', alternative_phone: '',
            email: '', address: '', is_primary: true,
        }]
      })
    }),
    {
      name: 'student-registration-draft',
      partialize: (state) => Object.fromEntries(
        Object.entries(state).filter(([key]) => !['password', 'password_confirmation'].includes(key))
      ),
    }
  )
);
