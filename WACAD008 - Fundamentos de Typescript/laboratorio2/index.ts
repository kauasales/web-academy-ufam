import { Student } from "./student.js";
import { Class } from "./class.js";

const myClass = new Class(1, "Educação Física 1º Semestre", renderScreen);

const form = document.getElementById('student-form') as HTMLFormElement;
const inputIdOriginal = document.getElementById('student-id-original') as HTMLInputElement;
const inputId = document.getElementById('student-id') as HTMLInputElement;
const inputName = document.getElementById('student-name') as HTMLInputElement;
const inputAge = document.getElementById('student-age') as HTMLInputElement;
const inputHeight = document.getElementById('student-height') as HTMLInputElement;
const inputWeight = document.getElementById('student-weight') as HTMLInputElement;
const btnCancel = document.getElementById('btn-cancel') as HTMLButtonElement;
const formTitle = document.getElementById('form-title') as HTMLElement;

function renderScreen(): void {
    document.getElementById('view-class-name')!.innerText = myClass.name;
    document.getElementById('stat-total')!.innerText = myClass.getQuantStudents().toString();
    document.getElementById('stat-age')!.innerText = myClass.getMeanAge().toFixed(1);
    document.getElementById('stat-height')!.innerText = myClass.getMeanHeight().toFixed(2);
    document.getElementById('stat-weight')!.innerText = myClass.getMeanWeight().toFixed(1);

    const tbody = document.querySelector('#students-table tbody')!;
    tbody.innerHTML = '';

    myClass.studentsList.forEach(student => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${student.id}</td>
            <td>${student.fullName}</td>
            <td>${student.age}</td>
            <td>${student.height}m</td>
            <td>${student.weight}kg</td>
            <td>
                <button class="btn-edit" data-id="${student.id}">Editar</button>
                <button class="btn-delete" data-id="${student.id}">Apagar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    addButtonsEvents();
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = parseInt(inputId.value);
    const name = inputName.value;
    const age = parseInt(inputAge.value);
    const height = parseFloat(inputHeight.value);
    const weight = parseFloat(inputWeight.value);

    const newStudent = new Student(id, name, age, height, weight);
    const idOriginal = inputIdOriginal.value;

    if (idOriginal) {
        const success = myClass.editStudent(parseInt(idOriginal), newStudent);
        if (!success) {
            alert("Erro ao editar: ID já está em uso.");
        } else {
            resetForm();
        }
    } else {
        const success = myClass.createStudent(newStudent);
        if (!success) {
            alert("Erro: Já existe um aluno com este ID/Matrícula.");
        } else {
            form.reset();
        }
    }
});

function addButtonsEvents(): void {
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt((e.target as HTMLButtonElement).getAttribute('data-id')!);
            myClass.deleteStudent(id);
            resetForm();
        });
    });

    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt((e.target as HTMLButtonElement).getAttribute('data-id')!);
            const student = myClass.studentsList.find(s => s.id === id);
            
            if (student) {
                formTitle.innerText = `Editando Aluno: ${student.fullName}`;
                inputIdOriginal.value = student.id.toString();
                inputId.value = student.id.toString();
                inputName.value = student.fullName;
                inputAge.value = student.age.toString();
                inputHeight.value = student.height.toString();
                inputWeight.value = student.weight.toString();
                
                btnCancel.style.display = 'inline-block';
            }
        });
    });
}

function resetForm(): void {
    form.reset();
    formTitle.innerText = "Adicionar Novo Aluno";
    inputIdOriginal.value = '';
    btnCancel.style.display = 'none';
}

btnCancel.addEventListener('click', resetForm);

renderScreen();