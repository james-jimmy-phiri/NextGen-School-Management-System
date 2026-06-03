export interface SharedSchool {
    id: number;
    name: string;
    slug?: string | null;
    logo_path?: string | null;
    timezone?: string;
    locale?: string;
    settings?: Record<string, unknown> | null;
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string | null;
    school_id?: number | null;
    roles: string[];
    permissions?: string[];
    preferences?: Record<string, unknown> | null;
    school?: SharedSchool | null;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: AuthUser | null;
    };
    capabilities?: Record<string, boolean>;
    flash?: {
        status?: string | null;
        success?: string | null;
        error?: string | null;
        reference_number?: string | null;
    };
    portal?: {
        children: { id: number; first_name: string; last_name: string; photo_path?: string | null }[];
        activeStudentId: number | null;
    } | null;
};

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface LaravelPagination<TItem> {
    data: TItem[];
    links: PaginationLink[];
    meta?: {
        links: PaginationLink[];
        [key: string]: any;
    };
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface MetricsCard {
    label: string;
    value: string | number;
    hint?: string;
}
