import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { PageProps } from '@/types';
import { AlertCircle, CheckCircle2, ChevronRight, FileUp, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdmissionFormData {
    student_first_name: string;
    student_middle_name: string;
    student_last_name: string;
    gender: string;
    date_of_birth: string;
    place_of_birth: string;
    nationality: string;
    religion: string;
    birth_certificate_number: string;
    
    previous_school_name: string;
    previous_grade: string;
    transfer_reason: string;
    
    boarding_type: string;
    
    parent_name: string;
    parent_relationship: string;
    parent_phone: string;
    parent_email: string;
    parent_occupation: string;
    parent_address: string;

    birth_certificate: File | null;
    school_reports: File | null;
    transfer_letter: File | null;
    passport_photo: File | null;
}

const DRAFT_KEY = 'admission_form_draft';

export default function Create({ school, flash }: PageProps<{ school: any, flash: any }>) {
    const [step, setStep] = useState(1);
    const [draftSaved, setDraftSaved] = useState(false);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm<AdmissionFormData>({
        student_first_name: '',
        student_middle_name: '',
        student_last_name: '',
        gender: 'male',
        date_of_birth: '',
        place_of_birth: '',
        nationality: '',
        religion: '',
        birth_certificate_number: '',
        
        previous_school_name: '',
        previous_grade: '',
        transfer_reason: '',
        
        boarding_type: 'day',
        
        parent_name: '',
        parent_relationship: 'Parent',
        parent_phone: '',
        parent_email: '',
        parent_occupation: '',
        parent_address: '',

        birth_certificate: null,
        school_reports: null,
        transfer_letter: null,
        passport_photo: null,
    });

    // Load draft on mount
    useEffect(() => {
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                // Files can't be restored from JSON, so exclude them
                const { birth_certificate, school_reports, transfer_letter, passport_photo, ...textData } = parsed;
                setData(prev => ({ ...prev, ...textData }));
            } catch (e) {
                console.error("Could not parse draft");
            }
        }
    }, []);

    // Save draft periodically or on change
    useEffect(() => {
        const timer = setTimeout(() => {
            const { birth_certificate, school_reports, transfer_letter, passport_photo, ...textData } = data;
            localStorage.setItem(DRAFT_KEY, JSON.stringify(textData));
            setDraftSaved(true);
            setTimeout(() => setDraftSaved(false), 2000);
        }, 1000);

        return () => clearTimeout(timer);
    }, [data]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('public.admissions.store'), {
            onSuccess: () => {
                localStorage.removeItem(DRAFT_KEY);
            }
        });
    };

    const nextStep = () => setStep((s) => Math.min(s + 1, 4));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    if (flash?.success) {
        return (
            <GuestLayout>
                <Head title="Application Submitted" />
                <div className="py-12 text-center">
                    <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Successful</h2>
                    <p className="text-gray-600 mb-6">{flash.success}</p>
                    <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 inline-block">
                        <span className="block text-sm uppercase tracking-wide font-semibold mb-1">Your Reference Number</span>
                        <span className="text-2xl font-mono font-bold tracking-widest">{flash.reference_number}</span>
                    </div>
                </div>
            </GuestLayout>
        );
    }

    return (
        <GuestLayout>
            <Head title="Student Admission Application" />

            <div className="max-w-3xl mx-auto py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Student Application</h1>
                    <p className="text-gray-500 mt-2">Join {school?.name || 'our school'} for the upcoming academic year.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Stepper Header */}
                    <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
                        <div className="flex items-center justify-between">
                            {[
                                { num: 1, label: 'Student Info' },
                                { num: 2, label: 'Academic' },
                                { num: 3, label: 'Parent/Guardian' },
                                { num: 4, label: 'Documents' },
                            ].map((s, idx) => (
                                <React.Fragment key={s.num}>
                                    <div className={cn("flex flex-col items-center", step >= s.num ? "text-primary" : "text-gray-400")}>
                                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors", 
                                            step >= s.num ? "border-primary bg-primary/10" : "border-gray-200 bg-white"
                                        )}>
                                            {s.num}
                                        </div>
                                        <span className="text-[10px] uppercase tracking-wider font-semibold mt-2 hidden sm:block">{s.label}</span>
                                    </div>
                                    {idx < 3 && (
                                        <div className={cn("flex-1 h-0.5 mx-2 sm:mx-4 transition-colors", step > s.num ? "bg-primary" : "bg-gray-200")} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={submit} className="p-6 sm:p-8">
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Personal Information</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <InputLabel htmlFor="student_first_name" value="First Name *" />
                                        <TextInput id="student_first_name" type="text" className="mt-1 block w-full" value={data.student_first_name} onChange={e => setData('student_first_name', e.target.value)} required />
                                        <InputError message={errors.student_first_name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="student_middle_name" value="Middle Name" />
                                        <TextInput id="student_middle_name" type="text" className="mt-1 block w-full" value={data.student_middle_name} onChange={e => setData('student_middle_name', e.target.value)} />
                                        <InputError message={errors.student_middle_name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="student_last_name" value="Last Name *" />
                                        <TextInput id="student_last_name" type="text" className="mt-1 block w-full" value={data.student_last_name} onChange={e => setData('student_last_name', e.target.value)} required />
                                        <InputError message={errors.student_last_name} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="gender" value="Gender *" />
                                        <select id="gender" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" value={data.gender} onChange={e => setData('gender', e.target.value)}>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <InputError message={errors.gender} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="date_of_birth" value="Date of Birth *" />
                                        <TextInput id="date_of_birth" type="date" className="mt-1 block w-full" value={data.date_of_birth} onChange={e => setData('date_of_birth', e.target.value)} required />
                                        <InputError message={errors.date_of_birth} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="nationality" value="Nationality" />
                                        <TextInput id="nationality" type="text" className="mt-1 block w-full" value={data.nationality} onChange={e => setData('nationality', e.target.value)} />
                                        <InputError message={errors.nationality} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="religion" value="Religion" />
                                        <TextInput id="religion" type="text" className="mt-1 block w-full" value={data.religion} onChange={e => setData('religion', e.target.value)} />
                                        <InputError message={errors.religion} className="mt-2" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="birth_certificate_number" value="Birth Certificate / National ID Number" />
                                        <TextInput id="birth_certificate_number" type="text" className="mt-1 block w-full" value={data.birth_certificate_number} onChange={e => setData('birth_certificate_number', e.target.value)} />
                                        <InputError message={errors.birth_certificate_number} className="mt-2" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Academic Background & Preferences</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="previous_school_name" value="Previous School Name" />
                                        <TextInput id="previous_school_name" type="text" className="mt-1 block w-full" value={data.previous_school_name} onChange={e => setData('previous_school_name', e.target.value)} placeholder="If transferring from another school" />
                                        <InputError message={errors.previous_school_name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="previous_grade" value="Previous Grade/Class" />
                                        <TextInput id="previous_grade" type="text" className="mt-1 block w-full" value={data.previous_grade} onChange={e => setData('previous_grade', e.target.value)} />
                                        <InputError message={errors.previous_grade} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="transfer_reason" value="Reason for Transfer" />
                                        <TextInput id="transfer_reason" type="text" className="mt-1 block w-full" value={data.transfer_reason} onChange={e => setData('transfer_reason', e.target.value)} />
                                        <InputError message={errors.transfer_reason} className="mt-2" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="boarding_type" value="Boarding Preference *" />
                                        <select id="boarding_type" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" value={data.boarding_type} onChange={e => setData('boarding_type', e.target.value)}>
                                            <option value="day">Day Scholar</option>
                                            <option value="boarding">Boarding</option>
                                        </select>
                                        <InputError message={errors.boarding_type} className="mt-2" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Parent / Guardian Information</h3>
                                    <p className="text-sm text-gray-500 mb-4">This person will be the primary contact for the student.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="parent_name" value="Full Name *" />
                                        <TextInput id="parent_name" type="text" className="mt-1 block w-full" value={data.parent_name} onChange={e => setData('parent_name', e.target.value)} required />
                                        <InputError message={errors.parent_name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="parent_relationship" value="Relationship to Student *" />
                                        <TextInput id="parent_relationship" type="text" className="mt-1 block w-full" value={data.parent_relationship} onChange={e => setData('parent_relationship', e.target.value)} placeholder="e.g. Mother, Father, Uncle" required />
                                        <InputError message={errors.parent_relationship} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="parent_phone" value="Phone Number *" />
                                        <TextInput id="parent_phone" type="tel" className="mt-1 block w-full" value={data.parent_phone} onChange={e => setData('parent_phone', e.target.value)} required />
                                        <InputError message={errors.parent_phone} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="parent_email" value="Email Address *" />
                                        <TextInput id="parent_email" type="email" className="mt-1 block w-full" value={data.parent_email} onChange={e => setData('parent_email', e.target.value)} required />
                                        <InputError message={errors.parent_email} className="mt-2" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="parent_occupation" value="Occupation" />
                                        <TextInput id="parent_occupation" type="text" className="mt-1 block w-full" value={data.parent_occupation} onChange={e => setData('parent_occupation', e.target.value)} />
                                        <InputError message={errors.parent_occupation} className="mt-2" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="parent_address" value="Physical Address *" />
                                        <textarea id="parent_address" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" rows={3} value={data.parent_address} onChange={e => setData('parent_address', e.target.value)} required />
                                        <InputError message={errors.parent_address} className="mt-2" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Required Documents</h3>
                                    <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4 flex gap-3 text-sm">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <p>Please upload clear, legible copies of the documents below. Max size per file is 5MB. Files are not saved to drafts until you submit.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <InputLabel htmlFor="passport_photo" value="Passport Photo" className="mb-2 font-semibold text-gray-800" />
                                        <input type="file" id="passport_photo" className="text-sm w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" onChange={e => setData('passport_photo', e.target.files?.[0] || null)} accept="image/*" />
                                        <InputError message={errors.passport_photo} className="mt-2" />
                                    </div>
                                    <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <InputLabel htmlFor="birth_certificate" value="Birth Certificate" className="mb-2 font-semibold text-gray-800" />
                                        <input type="file" id="birth_certificate" className="text-sm w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" onChange={e => setData('birth_certificate', e.target.files?.[0] || null)} accept=".pdf,image/*" />
                                        <InputError message={errors.birth_certificate} className="mt-2" />
                                    </div>
                                    <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <InputLabel htmlFor="school_reports" value="Previous School Reports" className="mb-2 font-semibold text-gray-800" />
                                        <input type="file" id="school_reports" className="text-sm w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" onChange={e => setData('school_reports', e.target.files?.[0] || null)} accept=".pdf,image/*" />
                                        <InputError message={errors.school_reports} className="mt-2" />
                                    </div>
                                    <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <InputLabel htmlFor="transfer_letter" value="Transfer Letter (Optional)" className="mb-2 font-semibold text-gray-800" />
                                        <input type="file" id="transfer_letter" className="text-sm w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" onChange={e => setData('transfer_letter', e.target.files?.[0] || null)} accept=".pdf,image/*" />
                                        <InputError message={errors.transfer_letter} className="mt-2" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center text-gray-400 text-sm">
                                {draftSaved ? (
                                    <span className="flex items-center text-emerald-600 gap-1"><Save className="w-4 h-4" /> Draft saved</span>
                                ) : (
                                    <span>Auto-saving draft...</span>
                                )}
                            </div>
                            <div className="flex gap-3">
                                {step > 1 && (
                                    <SecondaryButton type="button" onClick={prevStep}>
                                        Back
                                    </SecondaryButton>
                                )}
                                {step < 4 ? (
                                    <PrimaryButton type="button" onClick={nextStep}>
                                        Continue <ChevronRight className="w-4 h-4 ml-1" />
                                    </PrimaryButton>
                                ) : (
                                    <PrimaryButton disabled={processing} type="submit" className="bg-emerald-600 hover:bg-emerald-700 focus:bg-emerald-700 active:bg-emerald-800">
                                        {processing ? 'Submitting...' : 'Submit Application'}
                                    </PrimaryButton>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
