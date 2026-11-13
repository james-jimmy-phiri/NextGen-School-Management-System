import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/Card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { GraduationCap, Mail, Lock, User as UserIcon, Sparkles } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface LoginProps {
    status?: string;
    canResetPassword?: boolean;
}

export default function Login({
    status,
    canResetPassword = true,
}: LoginProps) {
    const [demoLoading, setDemoLoading] = useState(false);

    const signInForm = useForm({
        login: '',
        password: '',
        remember: false as boolean,
    });

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();

        signInForm.post(route('login'), {
            onFinish: () => signInForm.reset('password'),
            onError: (err: Record<string, string>) => {
                toast.error(err.login || err.email || 'Error signing in. Please verify your credentials.');
            },
            onSuccess: () => {
                toast.success("Welcome back! You've been successfully signed in.");
            },
        });
    };

    const handleDemoLogin = () => {
        setDemoLoading(true);
        const demoEmail = 'admin@sunrise.demo';
        const demoPassword = 'Demo#2026Pass';

        signInForm.setData({
            login: demoEmail,
            password: demoPassword,
            remember: true,
        });

        signInForm.transform((data) => ({
            ...data,
            login: demoEmail,
            password: demoPassword,
            remember: true,
        }));

        signInForm.post(route('login'), {
            onFinish: () => setDemoLoading(false),
            onError: (err: Record<string, string>) => {
                setDemoLoading(false);
                toast.error(err.login || err.email || 'Demo sign-in failed. Demo credentials populated in form.');
            },
            onSuccess: () => {
                toast.success("Welcome to NextGen Demo! Exploring with sample school data.");
            },
        });
    };

    const isBusy = signInForm.processing || demoLoading;

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Head title="Log In - NextGen School Management" />
            <Toaster position="top-right" />

            {/* Left Column: Exactly 50% Width */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-12">
                <Card className="w-full max-w-[440px] p-8 sm:p-10 shadow-lg shadow-slate-200/50 border border-slate-300 bg-white rounded-lg">
                    {status && (
                        <div className="mb-6 rounded-md bg-emerald-500/10 p-3.5 text-sm font-medium text-emerald-700 border border-emerald-500/20 text-center">
                            {status}
                        </div>
                    )}

                    {/* Logo & Heading */}
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-gradient-to-b from-[#2563eb] to-[#1d4ed8] rounded-lg flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-500/20 text-white">
                            <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Welcome to NextGen
                        </h1>
                        <p className="text-slate-500 mt-1.5 text-sm">
                            Sign in to your school dashboard
                        </p>
                    </div>

                    {/* Sign In Form */}
                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div>
                            <Label htmlFor="login" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="login"
                                    type="text"
                                    value={signInForm.data.login}
                                    onChange={(e) => signInForm.setData('login', e.target.value)}
                                    required
                                    placeholder="your@email.com"
                                    className="pl-10 h-11 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-md text-slate-800 placeholder:text-slate-400 bg-white"
                                    autoComplete="username"
                                    disabled={isBusy}
                                />
                            </div>
                            {(signInForm.errors.login || (signInForm.errors as Record<string, string | undefined>).email) && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">
                                    {signInForm.errors.login || (signInForm.errors as Record<string, string | undefined>).email}
                                </p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                                    Password
                                </Label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    value={signInForm.data.password}
                                    onChange={(e) => signInForm.setData('password', e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="pl-10 h-11 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-md text-slate-800 placeholder:text-slate-400 bg-white tracking-widest"
                                    autoComplete="current-password"
                                    disabled={isBusy}
                                />
                            </div>
                            {signInForm.errors.password && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">
                                    {signInForm.errors.password}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 select-none">
                                <input
                                    type="checkbox"
                                    checked={signInForm.data.remember}
                                    onChange={(e) => signInForm.setData('remember', e.target.checked)}
                                    className="h-4 w-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>Remember me</span>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-semibold rounded-md border border-blue-600 hover:border-blue-700 shadow-sm transition-all text-sm flex items-center justify-center"
                            disabled={isBusy}
                        >
                            {signInForm.processing ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    {/* Try Demo Button */}
                    <div className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-11 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 bg-white text-slate-700 font-semibold rounded-md shadow-xs transition-all text-sm flex items-center justify-center gap-2"
                            onClick={handleDemoLogin}
                            disabled={isBusy}
                        >
                            <UserIcon className="w-4 h-4 text-slate-500" />
                            {demoLoading ? 'Loading Demo Portal...' : 'Try Demo'}
                        </Button>
                    </div>

                    {/* Link to School Registration */}
                    <div className="mt-6 text-center text-sm text-slate-600">
                        Don't have an account?{' '}
                        <Link
                            href={route('register')}
                            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Register
                        </Link>
                    </div>
                </Card>
            </div>

            {/* Right Column: Exactly 50% Width with Catchy Statement */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950 items-center justify-center p-12">
                <img
                    src="/images/modern_school_campus.png"
                    alt="NextGen Modern School Campus"
                    className="absolute inset-0 h-full w-full object-cover object-center filter brightness-90"
                />
                {/* Rich Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-blue-950/80 to-blue-900/50" />

                <div className="relative z-10 max-w-xl text-center mx-auto text-white">


                    <h2 className="text-3xl xl:text-4xl font-extrabold mb-5 tracking-tight text-white drop-shadow-md leading-tight">
                        Smarter Schools. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-white">
                            Brighter Futures.
                        </span>
                    </h2>

                    <p className="text-lg text-blue-100/90 leading-relaxed font-normal max-w-md mx-auto drop-shadow-sm">
                        Empowering educators, inspiring learners, and connecting families through real-time academic intelligence, automated grading, and effortless digital school administration.
                    </p>
                </div>
            </div>
        </div>
    );
}
