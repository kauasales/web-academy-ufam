import {User, Remind, CreateRemindInput, EditRemindInput, Credencials, ResponseOperation} from './types'

export class AppManager {
    private users: User[] = [];
    private reminds: Remind[] = [];
    private loggedUser: User | null = null;

    public userRegister(credencials: Credencials): User {
        const [email, password, name] = credencials;

        const existentUser = this.users.find(u => u.email === email);
        if(existentUser) throw new Error("Email já cadastrado.");

        const newUser: User = {
            id: Math.random().toString(36).substring(2, 9),
            name,
            email,
            hashPassword: `hash_${password}`
        };

        this.users.push(newUser);
        return newUser;
    }

    public login(credencials: Credencials): User {
        const [email, password, name] = credencials;

        const user = this.users.find(u => u.email === email);
        if (!user) {
            throw new Error("Usuário não cadastrado")
        }

        if (user.hashPassword !== `hash_${password}`) {
            throw new Error("Credenciais inválidas")
        }

        this.loggedUser = user
        
        return this.loggedUser;
    }

    public logout(): void {
        this.loggedUser = null;
    }

    private verifyAuthentication(): string {
        if(!this.loggedUser) {
            throw new Error("Acesso negado. Usuário não autenticado")
        }

        return this.loggedUser.id
    }

    public createRemind(dados: CreateRemindInput): Remind {
        const userId = this.verifyAuthentication();

        const newRemind: Remind = {
            ...dados,
            id: Math.random().toString(36).substring(2, 9),
            userId,
            creationDate: new Date(),
        };

        this.reminds.push(newRemind);
        return newRemind;
    }

    public listReminds(): Remind[] {
        const userId = this.verifyAuthentication();
        return this.reminds.filter(r => r.userId === userId);
    }

    public editRemind(id: string, newData: EditRemindInput): Remind {
        const userId = this.verifyAuthentication();
        const remind = this.reminds.find(r => r.id === id && r.userId === userId);

        if (!remind) {
            throw new Error("Lembrete não encontrado ou você não tem permissão");
        }

        Object.assign(remind, newData);

        return remind;
    }

    public deleteRemind(id: string): ResponseOperation {
        const userId = this.verifyAuthentication();
        const remind = this.reminds.find(r => r.id === id && r.userId === userId);
        const index = this.reminds.findIndex(r => r.id === id && r.userId === userId);

        if (index === -1) {
            return [false, "Lembrete não encontrado ou sem permissão"];
        }

        this.reminds.splice(index,  1);
        
        return  [true, `Lembrete ${remind?.title} deletado com sucesso!`]
    }
}