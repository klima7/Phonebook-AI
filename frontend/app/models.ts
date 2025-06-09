export interface User {
    username: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    password: string;
}

export interface Contact {
    id?: number;
    name: string;
    phone: string;
    created_at?: string;
    updated_at?: string;
}

export interface Conversation {
    id?: number;
    in_progress: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Message {
    id?: number;
    type: 'user' | 'assistant' | 'tool' | 'thinking';
    content: string;
    conversation_id?: number;
    created_at?: string;
    updated_at?: string;
}
