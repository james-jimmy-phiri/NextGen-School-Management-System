import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useRegistrationStore } from '@/Stores/useRegistrationStore';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

// Step imports
import Step1Personal from './Partials/RegistrationSteps/Step1Personal';
import Step2Address from './Partials/RegistrationSteps/Step2Address';
import Step3Academic from './Partials/RegistrationSteps/Step3Academic';
import Step4Guardians from './Partials/RegistrationSteps/Step4Guardians';
import Step5Sponsor from './Partials/RegistrationSteps/Step5Sponsor';
import Step6Medical from './Partials/RegistrationSteps/Step6Medical';
import Step7Emergency from './Partials/RegistrationSteps/Step7Emergency';
import Step8Account from './Partials/RegistrationSteps/Step8Account';
import Step10Consent from './Partials/RegistrationSteps/Step10Consent';

export default function Create() {
    const { props } = usePage<any>();
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [draftSaved, setDraftSaved] = useState(false);
    
    const store = useRegistrationStore();
    const step = store.current_step;
    const setStep = store.setStep;

    const totalSteps = 9;

    // Show saved indicator on state change (except initial load)
    React.useEffect(() => {
        setDraftSaved(true);
        const timer = setTimeout(() => setDraftSaved(false), 2000);
        return () => clearTimeout(timer);
    }, [store]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (step < totalSteps) {
            setStep(step + 1);
            return;
        }

        setProcessing(true);
        setErrors({});

        const payload = { ...store, school_id: props.auth.user.school_id } as any;

        router.post(route('students.store'), payload, {
            onError: (errs) => {
                setErrors(errs);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            onSuccess: () => {
                store.resetStore();
            },
            onFinish: () => setProcessing(false)
        });
    };

    const prevStep = () => setStep(Math.max(1, step - 1));

    const renderStep = () => {
        switch (step) {
            case 1: return <Step1Personal errors={errors} />;
            case 2: return <Step2Address errors={errors} />;
            case 3: return <Step3Academic errors={errors} campuses={props.campuses} academicYears={props.academicYears} terms={props.terms} classGroups={props.classGroups} />;
            case 4: return <Step4Guardians errors={errors} />;
            case 5: return <Step5Sponsor errors={errors} />;
            case 6: return <Step6Medical errors={errors} />;
            case 7: return <Step7Emergency errors={errors} />;
            case 8: return <Step8Account errors={errors} />;
            case 9: return <Step10Consent errors={errors} />;
            default: return null;
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Student Registration Wizard</h2>}>
            <Head title="Register Student" />
            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-xl sm:rounded-lg border border-gray-200">
                        <div className="p-8 text-gray-900">
                            
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-gray-500 font-medium">Please complete all steps</h3>
                                <div className="text-sm font-medium flex items-center h-6">
                                    {draftSaved ? (
                                        <span className="text-green-600 flex items-center animate-pulse">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            Draft Saved
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">All progress is auto-saved</span>
                                    )}
                                </div>
                            </div>

                            {/* Stepper Header */}
                            <div className="mb-10 flex justify-between items-center overflow-x-auto pb-4">
                                {[1,2,3,4,5,6,7,8,9].map((s) => (
                                    <div key={s} className="flex items-center flex-1 last:flex-none">
                                        <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 ${step === s ? 'border-indigo-600 bg-indigo-600 text-white shadow-md' : step > s ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-200 bg-gray-50 text-gray-400'}`}>
                                            {s}
                                        </div>
                                        {s < 9 && <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${step > s ? 'bg-indigo-600' : 'bg-gray-100'}`}></div>}
                                    </div>
                                ))}
                            </div>

                            {Object.keys(errors).length > 0 && (
                                <div className="mb-6 bg-red-50 text-red-700 p-5 rounded-lg border border-red-200 shadow-sm">
                                    <p className="font-bold flex items-center mb-2">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                                        Validation Error
                                    </p>
                                    <ul className="list-disc pl-8 text-sm space-y-1">
                                        {Object.entries(errors).slice(0, 5).map(([key, msg]) => (
                                            <li key={key}>{msg}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                {renderStep()}

                                <div className="mt-10 flex justify-between pt-6 border-t border-gray-200">
                                    {step > 1 ? (
                                        <SecondaryButton type="button" onClick={prevStep} className="px-6 py-2.5">
                                            ← Previous
                                        </SecondaryButton>
                                    ) : (<div></div>)}
                                    
                                    {step < totalSteps ? (
                                        <PrimaryButton type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700">
                                            Continue →
                                        </PrimaryButton>
                                    ) : (
                                        <PrimaryButton disabled={processing} type="submit" className="px-8 py-2.5 bg-green-600 hover:bg-green-700">
                                            {processing ? 'Submitting Application...' : 'Complete Registration'}
                                        </PrimaryButton>
                                    )}
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
