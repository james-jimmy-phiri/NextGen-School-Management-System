import { Head, useForm } from '@inertiajs/react';
import PortalLayout from '@/Layouts/PortalLayout';
import SectionHeader from '@/Components/Portal/SectionHeader';
import { Settings2, Save, UserCircle, KeyRound, BellRing } from 'lucide-react';
import type { PageProps } from '@/types';

export default function PortalProfile({ auth, profile }: PageProps<{ profile: any }>) {
    const { data: profileData, setData: setProfileData, patch: patchProfile, processing: profileProcessing, errors: profileErrors } = useForm({
        name: profile.name,
        email: profile.email,
        phone: profile.guardians?.[0]?.phone || '',
        address: profile.guardians?.[0]?.address || '',
    });

    const submitProfile = (e: React.FormEvent) => {
        e.preventDefault();
        patchProfile(route('portal.profile.update'));
    };

    return (
        <PortalLayout>
            <Head title="My Profile" />

            <SectionHeader 
                title="Account Settings" 
                subtitle="Manage your personal details and preferences"
                icon={Settings2}
            />

            <div className="flex flex-col gap-8 max-w-4xl">
                {/* Profile Information */}
                <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
                    <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center gap-2">
                        <UserCircle className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-foreground">Personal Details</h3>
                    </div>
                    <form onSubmit={submitProfile} className="p-6 sm:p-8 flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="w-full sm:w-1/2 flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-foreground">Full Name</label>
                                <input 
                                    type="text" 
                                    className="rounded-xl border-border bg-background px-4 py-2 text-sm focus:border-primary focus:ring-primary shadow-sm"
                                    value={profileData.name}
                                    onChange={e => setProfileData('name', e.target.value)}
                                />
                                {profileErrors.name && <p className="text-xs text-red-600">{profileErrors.name}</p>}
                            </div>
                            <div className="w-full sm:w-1/2 flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-foreground">Email Address</label>
                                <input 
                                    type="email" 
                                    className="rounded-xl border-border bg-background px-4 py-2 text-sm focus:border-primary focus:ring-primary shadow-sm disabled:opacity-50"
                                    value={profileData.email}
                                    onChange={e => setProfileData('email', e.target.value)}
                                    disabled
                                />
                                <span className="text-[10px] text-muted-foreground">Email cannot be changed directly. Contact support.</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="w-full sm:w-1/2 flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-foreground">Phone Number</label>
                                <input 
                                    type="text" 
                                    className="rounded-xl border-border bg-background px-4 py-2 text-sm focus:border-primary focus:ring-primary shadow-sm"
                                    value={profileData.phone}
                                    onChange={e => setProfileData('phone', e.target.value)}
                                    placeholder="+265..."
                                />
                            </div>
                            <div className="w-full sm:w-1/2 flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-foreground">Physical Address</label>
                                <input 
                                    type="text" 
                                    className="rounded-xl border-border bg-background px-4 py-2 text-sm focus:border-primary focus:ring-primary shadow-sm"
                                    value={profileData.address}
                                    onChange={e => setProfileData('address', e.target.value)}
                                    placeholder="Area / City"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-border mt-2">
                            <button 
                                type="submit" 
                                disabled={profileProcessing}
                                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                            >
                                <Save className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                {/* Notifications & Security */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
                        <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center gap-2">
                            <BellRing className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-foreground">Preferences</h3>
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm font-medium text-foreground">Email Notifications</span>
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="relative w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm font-medium text-foreground">SMS Alerts (Fees & Attendance)</span>
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="relative w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm font-medium text-foreground">Weekly Academic Summary</span>
                                <input type="checkbox" className="sr-only peer" />
                                <div className="relative w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
                        <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center gap-2">
                            <KeyRound className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-foreground">Security</h3>
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                            <p className="text-sm text-muted-foreground mb-2">Update your password to keep your account secure.</p>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-foreground">Current Password</label>
                                <input type="password" placeholder="••••••••" className="rounded-xl border-border bg-background px-3 py-1.5 text-sm" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-foreground">New Password</label>
                                <input type="password" placeholder="••••••••" className="rounded-xl border-border bg-background px-3 py-1.5 text-sm" />
                            </div>
                            <button className="mt-2 w-fit rounded-xl bg-muted px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/80 transition-colors">
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
}
