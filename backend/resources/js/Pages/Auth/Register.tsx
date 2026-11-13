import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/Card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    GraduationCap,
    Users,
    School,
    Mail,
    Lock,
    Phone,
    User as UserIcon,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Building2,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface SchoolItem {
    id: number;
    name: string;
    slug: string;
    city?: string;
}

interface RegisterProps {
    schools?: SchoolItem[];
}

type UserRole = 'student' | 'parent' | 'teacher';

export default function Register({ schools = [] }: RegisterProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedRole, setSelectedRole] = useState<UserRole>('student');

    // Role-specific supplemental data
    const [extraData, setExtraData] = useState({
        studentId: '',
        gradeLevel: 'Form 1',
        dob: '',
        gender: 'Male',
        parentRelationship: 'Father',
        childNameOrId: '',
        residentialCity: '',
        staffId: '',
        department: 'Sciences',
        agreeTerms: false,
    });

    const form = useForm({
        name: '',
        email: '',
        phone: '',
        school_id: schools.length > 0 ? String(schools[0].id) : '',
        role: 'student' as UserRole,
        password: '',
        password_confirmation: '',
    });

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
        form.setData('role', role);
    };

    const validateStep1 = () => {
        if (!selectedRole) {
            toast.error('Please select your role to proceed.');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!form.data.name.trim()) {
            toast.error('Please enter your full name.');
            return false;
        }
        if (!form.data.email.trim()) {
            toast.error('Please enter a valid email address.');
            return false;
        }
        if (selectedRole === 'student' && !extraData.studentId.trim()) {
            toast.error('Please enter your student admission or ID number.');
            return false;
        }
        if (selectedRole === 'parent' && !extraData.childNameOrId.trim()) {
            toast.error("Please enter your student's name or admission number.");
            return false;
        }
        if (selectedRole === 'teacher' && !extraData.staffId.trim()) {
            toast.error('Please enter your staff or employee ID.');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        } else if (step === 2 && validateStep2()) {
            setStep(3);
        }
    };

    const handleBack = () => {
        if (step === 3) setStep(2);
        else if (step === 2) setStep(1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!extraData.agreeTerms) {
            toast.error('Please agree to the School Code of Conduct and Terms of Service.');
            return;
        }

        if (form.data.password.length < 8) {
            toast.error('Password must be at least 8 characters long.');
            return;
        }

        if (form.data.password !== form.data.password_confirmation) {
            toast.error('Password confirmation does not match.');
            return;
        }

        form.post(route('register'), {
            onFinish: () => form.reset('password', 'password_confirmation'),
            onError: (err: Record<string, string>) => {
                const firstErr = Object.values(err)[0] || 'Registration failed. Please review your details.';
                toast.error(firstErr);
            },
            onSuccess: () => {
                toast.success('Registration successful! Welcome to NextGen Schools.');
            },
        });
    };

    const roleCards: {
        role: UserRole;
        title: string;
        tag: string;
        description: string;
        icon: typeof GraduationCap;
    }[] = [
        {
            role: 'student',
            title: 'Student',
            tag: 'Enrolled Learner',
            description: 'Access class timetables, online assignments, attendance, and term report cards.',
            icon: GraduationCap,
        },
        {
            role: 'parent',
            title: 'Parent / Guardian',
            tag: 'Family Portal',
            description: "Track your child's academic progress, attendance alerts, and manage digital school fee payments.",
            icon: Users,
        },
        {
            role: 'teacher',
            title: 'Teacher / Staff',
            tag: 'Academic Faculty',
            description: 'Record marks, manage classrooms, track daily attendance, and compile student performance.',
            icon: School,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="School Portal Registration - NextGen" />
            <Toaster position="top-right" />

            <Card className="w-full max-w-[540px] p-8 sm:p-10 shadow-lg shadow-slate-200/50 border border-slate-300 bg-white rounded-lg">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-14 h-14 bg-gradient-to-b from-[#2563eb] to-[#1d4ed8] rounded-lg flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-500/20 text-white">
                            <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            School Portal Registration
                        </h1>
                        <p className="text-slate-500 mt-1 text-sm">
                            Step {step} of 3: {step === 1 ? 'Select Your Role' : step === 2 ? 'Profile Information' : 'Account Security'}
                        </p>
                    </div>

                    {/* Stepper Indicator */}
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div className="flex items-center gap-2">
                            <span
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                                    step >= 1
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'border-slate-300 text-slate-400 bg-white'
                                }`}
                            >
                                1
                            </span>
                            <span className={`text-xs font-semibold ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>
                                Role
                            </span>
                        </div>
                        <div className={`flex-1 h-0.5 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                        <div className="flex items-center gap-2">
                            <span
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                                    step >= 2
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'border-slate-300 text-slate-400 bg-white'
                                }`}
                            >
                                2
                            </span>
                            <span className={`text-xs font-semibold ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>
                                Details
                            </span>
                        </div>
                        <div className={`flex-1 h-0.5 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                        <div className="flex items-center gap-2">
                            <span
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                                    step === 3
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'border-slate-300 text-slate-400 bg-white'
                                }`}
                            >
                                3
                            </span>
                            <span className={`text-xs font-semibold ${step === 3 ? 'text-slate-900' : 'text-slate-400'}`}>
                                Security
                            </span>
                        </div>
                    </div>

                    {/* Step 1: Role Selection */}
                    {step === 1 && (
                        <div className="space-y-3.5">
                            <p className="text-sm font-semibold text-slate-700 mb-2">
                                Choose who you are registering as:
                            </p>
                            {roleCards.map((rc) => {
                                const Icon = rc.icon;
                                const isSelected = selectedRole === rc.role;
                                return (
                                    <button
                                        key={rc.role}
                                        type="button"
                                        onClick={() => handleRoleSelect(rc.role)}
                                        className={`w-full text-left p-4 rounded-md border transition-all flex items-start gap-4 ${
                                            isSelected
                                                ? 'border-2 border-blue-600 bg-blue-50/50 shadow-sm'
                                                : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50/50'
                                        }`}
                                    >
                                        <div
                                            className={`w-11 h-11 rounded-md flex items-center justify-center shrink-0 border ${
                                                isSelected
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                            }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-base font-bold text-slate-900">{rc.title}</h3>
                                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                                    {rc.tag}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                {rc.description}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}

                            <div className="pt-4">
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-full h-11 bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-semibold rounded-md border border-blue-600 shadow-sm text-sm flex items-center justify-center gap-2"
                                >
                                    Continue as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Role-Specific Details */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="p-3 rounded-md bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                                <span>
                                    Registering as <strong>{selectedRole.toUpperCase()}</strong>. Inputs have adapted to your role.
                                </span>
                            </div>

                            {/* Common: Full Name */}
                            <div>
                                <Label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    {selectedRole === 'parent' ? 'Parent / Guardian Full Name' : selectedRole === 'teacher' ? 'Staff Full Name' : 'Student Full Name'} *
                                </Label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="name"
                                        type="text"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        required
                                        placeholder="e.g. Kondwani Phiri"
                                        className="pl-10 h-11 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-lg text-slate-800 bg-white"
                                    />
                                </div>
                            </div>

                            {/* Student-specific inputs */}
                            {selectedRole === 'student' && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div>
                                            <Label htmlFor="studentId" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                Student / Admission No. *
                                            </Label>
                                            <Input
                                                id="studentId"
                                                type="text"
                                                value={extraData.studentId}
                                                onChange={(e) => setExtraData({ ...extraData, studentId: e.target.value })}
                                                placeholder="e.g. STU-2026-0145"
                                                className="h-11 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-lg bg-white"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="gradeLevel" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                Class / Grade Level
                                            </Label>
                                            <select
                                                id="gradeLevel"
                                                value={extraData.gradeLevel}
                                                onChange={(e) => setExtraData({ ...extraData, gradeLevel: e.target.value })}
                                                className="w-full h-11 px-3 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-lg text-sm text-slate-800 bg-white"
                                            >
                                                <option value="Form 1">Form 1 (Grade 9)</option>
                                                <option value="Form 2">Form 2 (Grade 10)</option>
                                                <option value="Form 3">Form 3 (Grade 11)</option>
                                                <option value="Form 4">Form 4 (Grade 12)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div>
                                            <Label htmlFor="dob" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                Date of Birth
                                            </Label>
                                            <Input
                                                id="dob"
                                                type="date"
                                                value={extraData.dob}
                                                onChange={(e) => setExtraData({ ...extraData, dob: e.target.value })}
                                                className="h-11 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-lg bg-white"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="gender" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                Gender
                                            </Label>
                                            <select
                                                id="gender"
                                                value={extraData.gender}
                                                onChange={(e) => setExtraData({ ...extraData, gender: e.target.value })}
                                                className="w-full h-11 px-3 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-lg text-sm text-slate-800 bg-white"
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Parent-specific inputs */}
                            {selectedRole === 'parent' && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div>
                                            <Label htmlFor="parentRelationship" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                Relationship to Student
                                            </Label>
                                            <select
                                                id="parentRelationship"
                                                value={extraData.parentRelationship}
                                                onChange={(e) => setExtraData({ ...extraData, parentRelationship: e.target.value })}
                                                className="w-full h-11 px-3 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-lg text-sm text-slate-800 bg-white"
                                            >
                                                <option value="Father">Father</option>
                                                <option value="Mother">Mother</option>
                                                <option value="Guardian">Legal Guardian</option>
                                                <option value="Sponsor">Sponsor</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label htmlFor="childNameOrId" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                Child's Admission No. / Name *
                                            </Label>
                                            <Input
                                                id="childNameOrId"
                                                type="text"
                                                value={extraData.childNameOrId}
                                                onChange={(e) => setExtraData({ ...extraData, childNameOrId: e.target.value })}
                                                placeholder="e.g. STU-2026-0145"
                                                className="h-11 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-lg bg-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="residentialCity" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                            Town / City of Residence
                                        </Label>
                                        <Input
                                            id="residentialCity"
                                            type="text"
                                            value={extraData.residentialCity}
                                            onChange={(e) => setExtraData({ ...extraData, residentialCity: e.target.value })}
                                            placeholder="e.g. Lilongwe / Blantyre"
                                            className="h-11 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-lg bg-white"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Teacher-specific inputs */}
                            {selectedRole === 'teacher' && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div>
                                            <Label htmlFor="staffId" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                Employee / Staff ID *
                                            </Label>
                                            <Input
                                                id="staffId"
                                                type="text"
                                                value={extraData.staffId}
                                                onChange={(e) => setExtraData({ ...extraData, staffId: e.target.value })}
                                                placeholder="e.g. EMP-TEA-042"
                                                className="h-11 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-lg bg-white"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="department" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                Department / Specialty
                                            </Label>
                                            <select
                                                id="department"
                                                value={extraData.department}
                                                onChange={(e) => setExtraData({ ...extraData, department: e.target.value })}
                                                className="w-full h-11 px-3 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-lg text-sm text-slate-800 bg-white"
                                            >
                                                <option value="Sciences">Sciences (Physics, Chem, Bio)</option>
                                                <option value="Mathematics">Mathematics</option>
                                                <option value="Languages">Languages & Literature</option>
                                                <option value="Humanities">Humanities & Social Studies</option>
                                                <option value="Commercials">Commercials & Accounting</option>
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* School Selection */}
                            {schools.length > 0 && (
                                <div>
                                    <Label htmlFor="school_id" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        School Institution *
                                    </Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <select
                                            id="school_id"
                                            value={form.data.school_id}
                                            onChange={(e) => form.setData('school_id', e.target.value)}
                                            className="w-full h-11 pl-10 pr-3 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-lg text-sm text-slate-800 bg-white"
                                        >
                                            {schools.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name} {s.city ? `(${s.city})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Email & Phone */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <Label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Email Address *
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={form.data.email}
                                            onChange={(e) => form.setData('email', e.target.value)}
                                            required
                                            placeholder="your@email.com"
                                            className="pl-10 h-11 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-lg text-slate-800 bg-white"
                                        />
                                    </div>
                                    {form.errors.email && (
                                        <p className="mt-1 text-xs text-red-500">{form.errors.email}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Phone Number (SMS/Airtel)
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={form.data.phone}
                                            onChange={(e) => form.setData('phone', e.target.value)}
                                            placeholder="+265 991 000 000"
                                            className="pl-10 h-11 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-lg text-slate-800 bg-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBack}
                                    className="w-1/3 h-11 border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-semibold rounded-lg text-sm flex items-center justify-center gap-1.5"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-2/3 h-11 bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-semibold rounded-lg border border-blue-600 shadow-sm text-sm flex items-center justify-center gap-2"
                                >
                                    Next: Security
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Account Security & Confirmation */}
                    {step === 3 && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Summary Badge */}
                            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                                <div>
                                    <span className="text-slate-500">Registering for:</span>
                                    <p className="font-bold text-slate-900 capitalize text-sm">{selectedRole} Portal</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-slate-500">Name:</span>
                                    <p className="font-bold text-slate-900 text-sm truncate max-w-[180px]">{form.data.name}</p>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Create Password *
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        value={form.data.password}
                                        onChange={(e) => form.setData('password', e.target.value)}
                                        required
                                        placeholder="At least 8 characters"
                                        className="pl-10 h-11 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-lg text-slate-800 bg-white"
                                        autoComplete="new-password"
                                    />
                                </div>
                                {form.errors.password && (
                                    <p className="mt-1 text-xs text-red-500">{form.errors.password}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="password_confirmation" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Confirm Password *
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={form.data.password_confirmation}
                                        onChange={(e) => form.setData('password_confirmation', e.target.value)}
                                        required
                                        placeholder="Repeat your password"
                                        className="pl-10 h-11 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-lg text-slate-800 bg-white"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
                                    <input
                                        type="checkbox"
                                        checked={extraData.agreeTerms}
                                        onChange={(e) => setExtraData({ ...extraData, agreeTerms: e.target.checked })}
                                        className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>
                                        I certify that the information provided is correct and agree to the school's code of conduct and NextGen portal policies.
                                    </span>
                                </label>
                            </div>

                            <div className="flex items-center gap-3 pt-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBack}
                                    className="w-1/3 h-11 border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-semibold rounded-lg text-sm flex items-center justify-center gap-1.5"
                                    disabled={form.processing}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    className="w-2/3 h-11 bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-semibold rounded-lg border border-blue-600 shadow-sm text-sm flex items-center justify-center gap-2"
                                    disabled={form.processing}
                                >
                                    {form.processing ? 'Submitting...' : 'Complete Registration'}
                                    <CheckCircle2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Bottom Back to Sign In Link */}
                    <div className="mt-8 pt-4 border-t border-slate-200 text-center text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link
                            href={route('login')}
                            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Sign in to your portal
                        </Link>
                    </div>
                </Card>
        </div>
    );
}
