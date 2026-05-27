export interface User {
    id: string;
    name: string;
    email: string;
    hashPassword: string;
}

export interface Remind {
    id: string;
    userId: string;
    title: string;
    creationDate: Date;
    limitDate?: Date;
    description?: string;
}

export type CreateRemindInput  = Omit<Remind, 'id' | 'userId' | 'creationDate'>;
export type EditRemindInput = Partial<Omit<Remind, 'id' | 'userId' | 'creationDate'>>;

// Utilização de tuplas
export type Credencials = [string, string, string]
export type ResponseOperation = [boolean, string]
