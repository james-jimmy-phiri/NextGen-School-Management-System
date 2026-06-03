import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDown, Users } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';

// Use a subset type for the switcher
export interface SwitcherStudent {
    id: number;
    first_name: string;
    last_name: string;
    admission_number: string;
    photo_path?: string;
    school?: {
        name?: string;
    };
    enrollments?: {
        class_group?: { name?: string };
    }[];
}

interface ChildSwitcherProps {
    students: SwitcherStudent[];
    currentStudentId?: number;
    className?: string;
}

export default function ChildSwitcher({ students, currentStudentId, className }: ChildSwitcherProps) {
    const current = students.find((s) => s.id === currentStudentId) || students[0];

    if (!students || students.length === 0) {
        return (
            <div className={cn("flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground", className)}>
                <Users className="h-4 w-4" />
                <span>No linked children</span>
            </div>
        );
    }

    return (
        <Menu as="div" className={cn("relative inline-block text-left", className)}>
            <div>
                <Menu.Button className="flex w-full items-center justify-between gap-x-3 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary overflow-hidden">
                            {current?.photo_path ? (
                                <img src={`/storage/${current.photo_path}`} alt={current.first_name} className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-xs font-bold uppercase tracking-wider">{current?.first_name?.charAt(0)}{current?.last_name?.charAt(0)}</span>
                            )}
                        </div>
                        <div className="flex flex-col items-start text-left">
                            <span className="block truncate font-bold">{current?.first_name} {current?.last_name}</span>
                            <span className="block text-xs font-normal text-muted-foreground">{current?.enrollments?.[0]?.class_group?.name || 'Unassigned'}</span>
                        </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-50 mt-2 w-64 origin-top-right divide-y divide-border rounded-xl border border-border bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-3">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">Household Learners</p>
                    </div>
                    <div className="py-1">
                        {students.map((student) => (
                            <Menu.Item key={student.id}>
                                {({ active }) => (
                                    <Link
                                        href={route('portal.children.show', student.id)}
                                        className={cn(
                                            active ? 'bg-muted text-foreground' : 'text-muted-foreground',
                                            'group flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors'
                                        )}
                                    >
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary overflow-hidden">
                                            {student.photo_path ? (
                                                <img src={`/storage/${student.photo_path}`} alt={student.first_name} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-[10px] font-bold uppercase">{student.first_name.charAt(0)}{student.last_name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className={cn("truncate font-medium", currentStudentId === student.id ? "text-primary" : "text-foreground")}>
                                                {student.first_name} {student.last_name}
                                            </span>
                                            <span className="text-[11px]">{student.school?.name}</span>
                                        </div>
                                    </Link>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                    <div className="py-1">
                         <Menu.Item>
                             {({ active }) => (
                                <Link
                                    href={route('portal.parent')}
                                    className={cn(
                                        active ? 'bg-muted text-foreground' : 'text-muted-foreground',
                                        'group flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors'
                                    )}
                                >
                                    <Users className="h-4 w-4" />
                                    View All Overview
                                </Link>
                             )}
                         </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
