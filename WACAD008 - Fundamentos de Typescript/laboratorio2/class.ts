import { Student } from "./student";

export class Class {
    public studentsList: Student[] = [];

    constructor(
        public id: number,
        public name: string,
        private callbackUpdateUI: () => void
    ) {}

    public getQuantStudents(): number {
    return this.studentsList.length;
    }

    private meanPerKey(key: keyof Pick<Student, 'age' | 'height' | 'weight'>): number {
        if (this.getQuantStudents() === 0) return 0;
        const sum = this.studentsList.reduce((acc, student) => acc + student[key], 0);
        return sum / this.getQuantStudents()
    }

    public getMeanAge(): number { return this.meanPerKey('age'); }
    public getMeanHeight(): number { return this.meanPerKey('height'); }
    public getMeanWeight(): number { return this.meanPerKey('weight'); }

    public createStudent(student: Student): boolean {
        if (this.studentsList.some(s => s.id === student.id)) return false;
        this.studentsList.push(student)
        this.callbackUpdateUI();
        return true;
    }

    public editStudent(originalId: number, data: Student): boolean {
        const i = this.studentsList.findIndex(s => s.id === originalId);
        if (i === -1) return false;

        if (originalId !== data.id && this.studentsList.some(s => s.id === data.id)) {
            return false;
        }

        this.studentsList[i] = data
        this.callbackUpdateUI();
        return true;
    }

    public deleteStudent(id:number): void {
        this.studentsList = this.studentsList.filter(s => s.id !== id);
        this.callbackUpdateUI();
    }
}

