import { cn } from '@/lib/utils';
import React, { useState } from 'react';

export interface UserAvatarProps {
    name?: string;
    src?: string | null;
    initials?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    status?: 'online' | 'offline' | 'busy' | 'active' | 'inactive';
    className?: string;
    alt?: string;
}

// Curated pastel color schemes for deterministic initials badges
const COLOR_VARIANTS = [
    {
        bg: 'bg-indigo-50 dark:bg-indigo-950/70',
        text: 'text-indigo-700 dark:text-indigo-300',
        ring: 'ring-1 ring-inset ring-indigo-500/20 dark:ring-indigo-500/30',
    },
    {
        bg: 'bg-blue-50 dark:bg-blue-950/70',
        text: 'text-blue-700 dark:text-blue-300',
        ring: 'ring-1 ring-inset ring-blue-500/20 dark:ring-blue-500/30',
    },
    {
        bg: 'bg-emerald-50 dark:bg-emerald-950/70',
        text: 'text-emerald-700 dark:text-emerald-300',
        ring: 'ring-1 ring-inset ring-emerald-500/20 dark:ring-emerald-500/30',
    },
    {
        bg: 'bg-violet-50 dark:bg-violet-950/70',
        text: 'text-violet-700 dark:text-violet-300',
        ring: 'ring-1 ring-inset ring-violet-500/20 dark:ring-violet-500/30',
    },
    {
        bg: 'bg-rose-50 dark:bg-rose-950/70',
        text: 'text-rose-700 dark:text-rose-300',
        ring: 'ring-1 ring-inset ring-rose-500/20 dark:ring-rose-500/30',
    },
    {
        bg: 'bg-amber-50 dark:bg-amber-950/70',
        text: 'text-amber-800 dark:text-amber-300',
        ring: 'ring-1 ring-inset ring-amber-500/20 dark:ring-amber-500/30',
    },
    {
        bg: 'bg-cyan-50 dark:bg-cyan-950/70',
        text: 'text-cyan-800 dark:text-cyan-300',
        ring: 'ring-1 ring-inset ring-cyan-500/20 dark:ring-cyan-500/30',
    },
    {
        bg: 'bg-teal-50 dark:bg-teal-950/70',
        text: 'text-teal-800 dark:text-teal-300',
        ring: 'ring-1 ring-inset ring-teal-500/20 dark:ring-teal-500/30',
    },
];

const SIZE_MAP = {
    xs: {
        container: 'h-6 w-6 text-[10px]',
        statusDot: 'h-1.5 w-1.5 bottom-0 right-0 ring-1',
    },
    sm: {
        container: 'h-8 w-8 text-xs',
        statusDot: 'h-2 w-2 bottom-0 right-0 ring-1.5',
    },
    md: {
        container: 'h-9 w-9 text-xs',
        statusDot: 'h-2.5 w-2.5 bottom-0 right-0 ring-2',
    },
    lg: {
        container: 'h-10 w-10 text-sm',
        statusDot: 'h-2.5 w-2.5 bottom-0 right-0 ring-2',
    },
    xl: {
        container: 'h-12 w-12 text-base',
        statusDot: 'h-3 w-3 bottom-0.5 right-0.5 ring-2',
    },
};

// Stable hash function for string to pick consistent color variant
function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

// Generate two-letter initials from name
function getInitials(name?: string, fallbackInitials?: string): string {
    if (fallbackInitials && fallbackInitials.trim()) {
        return fallbackInitials.slice(0, 2).toUpperCase();
    }
    if (!name) return '??';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '??';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Curated profile photos for demo accounts (matching reference screenshots)
const CURATED_DEMO_AVATARS: Record<string, string> = {
    'amelia roberts': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=faces',
    'michael thompson': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=faces',
    'grace williams': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces',
    'olivia rhye': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=96&h=96&fit=crop&crop=faces',
    'lana steiner': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=96&h=96&fit=crop&crop=faces',
    'james jimmy': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=faces',
    'david miller': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=faces',
    'sarah johnson': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop&crop=faces',
};

export default function UserAvatar({
    name = '',
    src,
    initials,
    size = 'sm',
    status,
    className,
    alt,
}: UserAvatarProps) {
    const [imageFailed, setImageFailed] = useState(false);
    const displayText = getInitials(name, initials);
    const paletteIndex = hashString(name || displayText) % COLOR_VARIANTS.length;
    const palette = COLOR_VARIANTS[paletteIndex];
    const sizeConfig = SIZE_MAP[size] || SIZE_MAP.sm;

    // Use explicit src if provided, or lookup curated demo photo for matching names
    const resolvedSrc = src || (!imageFailed && name ? CURATED_DEMO_AVATARS[name.toLowerCase().trim()] : undefined);
    const hasValidImage = Boolean(resolvedSrc) && !imageFailed;

    return (
        <div className={cn('relative inline-flex shrink-0 select-none items-center justify-center', className)}>
            {hasValidImage ? (
                <img
                    src={resolvedSrc as string}
                    alt={alt || name || 'User avatar'}
                    onError={() => setImageFailed(true)}
                    className={cn(
                        'rounded-full object-cover ring-1 ring-slate-900/10 shadow-2xs dark:ring-white/10',
                        sizeConfig.container,
                    )}
                    loading="lazy"
                />
            ) : (
                <span
                    className={cn(
                        'flex items-center justify-center rounded-full font-bold uppercase transition-transform',
                        sizeConfig.container,
                        palette.bg,
                        palette.text,
                        palette.ring,
                    )}
                >
                    {displayText}
                </span>
            )}

            {status && (
                <span
                    className={cn(
                        'absolute rounded-full ring-white dark:ring-card',
                        sizeConfig.statusDot,
                        status === 'online' || status === 'active'
                            ? 'bg-emerald-500'
                            : status === 'busy'
                              ? 'bg-rose-500'
                              : 'bg-slate-400',
                    )}
                />
            )}
        </div>
    );
}
