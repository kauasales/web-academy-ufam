import { AppManager } from './AppManager.js';
import { Credencials } from './types.js';

const app = new AppManager();

let idLembreteEmEdicao: string | null = null;

const authScreen = document.getElementById('tela-auth') as HTMLDivElement;
const mainScreen = document.getElementById('tela-principal') as HTMLDivElement;

const nameInput = document.getElementById('auth-nome') as HTMLInputElement;
const emailInput = document.getElementById('auth-email') as HTMLInputElement;
const passwordInput = document.getElementById('auth-senha') as HTMLInputElement;

const loginBtn = document.getElementById('btn-login') as HTMLButtonElement;
const registerBtn = document.getElementById('btn-cadastrar') as HTMLButtonElement;
const logoutBtn = document.getElementById('btn-logout') as HTMLButtonElement;
const welcomeTxt = document.getElementById('boas-vindas') as HTMLSpanElement;

const titleInput = document.getElementById('lemb-titulo') as HTMLInputElement;
const descriptionInput = document.getElementById('lemb-descricao') as HTMLTextAreaElement;
const limitDateInput = document.getElementById('lemb-data-limite') as HTMLInputElement;
const saveRemindBtn = document.getElementById('btn-salvar-lembrete') as HTMLButtonElement;
const cancelEditBtn = document.getElementById('btn-cancelar-edicao') as HTMLButtonElement; // Novo botão
const remindsContainer = document.getElementById('lista-lembretes') as HTMLDivElement;

function resetarFormulario() {
  idLembreteEmEdicao = null;
  titleInput.value = '';
  descriptionInput.value = '';
  limitDateInput.value = '';
  saveRemindBtn.innerText = "Adicionar Lembrete";
  saveRemindBtn.setAttribute('data-modo', 'criar');
  if (cancelEditBtn) cancelEditBtn.classList.add('hidden');
}

function updateRemindsScreen() {
  remindsContainer.innerHTML = '';
  const myReminds = app.listReminds();

  if (myReminds.length === 0) {
    remindsContainer.innerHTML = '<p class="lista-vazia">Nenhum lembrete por enquanto.</p>';
    return;
  }

  myReminds.forEach(r => {
    const div = document.createElement('div');
    div.className = 'lembrete-item';
    
    const creationDateFormatted = new Date(r.creationDate).toLocaleString('pt-BR');
    const limitDateFormatted = r.limitDate ? new Date(r.limitDate).toLocaleString('pt-BR') : 'Não definida';

    div.innerHTML = `
      <h3>${r.title}</h3>
      ${r.description ? `<p>${r.description}</p>` : ''}
      <div class="datas">
        <div>Criado em: ${creationDateFormatted}</div>
        <div>Prazo: ${limitDateFormatted}</div>
      </div>
      <div class="acoes-item">
        <button class="btn-editar" data-id="${r.id}">Editar</button>
        <button class="btn-deletar" data-id="${r.id}">Apagar</button>
      </div>
    `;

    const deleteBtn = div.querySelector('.btn-deletar') as HTMLButtonElement;
    deleteBtn.addEventListener('click', () => {
      const id = deleteBtn.getAttribute('data-id')!;
      const [success, message] = app.deleteRemind(id);
      
      if (success) {
        if (idLembreteEmEdicao === id) resetarFormulario();
        updateRemindsScreen();
      } else {
        alert(message);
      }
    });

    const editBtn = div.querySelector('.btn-editar') as HTMLButtonElement;
    editBtn.addEventListener('click', () => {
      idLembreteEmEdicao = editBtn.getAttribute('data-id')!;
      
      const lembrete = myReminds.find(item => item.id === idLembreteEmEdicao);
      
      if (lembrete) {
        titleInput.value = lembrete.title;
        descriptionInput.value = lembrete.description || '';
        
        if (lembrete.limitDate) {
          const d = new Date(lembrete.limitDate);
          const tzoffset = d.getTimezoneOffset() * 60000; // Ajuste de fuso horário local
          const localISOTime = (new Date(d.getTime() - tzoffset)).toISOString().slice(0, 16);
          limitDateInput.value = localISOTime;
        } else {
          limitDateInput.value = '';
        }

        saveRemindBtn.innerText = "Salvar Alterações";
        saveRemindBtn.setAttribute('data-modo', 'editar');
        if (cancelEditBtn) cancelEditBtn.classList.remove('hidden');
        
        titleInput.focus();
      }
    });

    remindsContainer.appendChild(div);
  });
}

if (cancelEditBtn) {
  cancelEditBtn.addEventListener('click', () => {
    resetarFormulario();
  });
}

saveRemindBtn.addEventListener('click', () => {
  try {
    if (!titleInput.value) return alert("O título é obrigatório!");

    const modo = saveRemindBtn.getAttribute('data-modo');

    const dadosLembrete = {
      title: titleInput.value,
      description: descriptionInput.value || undefined,
      limitDate: limitDateInput.value ? new Date(limitDateInput.value) : undefined
    };

    if (modo === 'editar' && idLembreteEmEdicao) {
      app.editRemind(idLembreteEmEdicao, dadosLembrete);
      alert("Lembrete atualizado com sucesso!");
    } else {
      app.createRemind(dadosLembrete);
    }

    resetarFormulario();
    updateRemindsScreen();
  } catch (err: any) {
    alert(err.message);
  }
});

registerBtn.addEventListener('click', () => {
  try {
    if (!nameInput.value || !emailInput.value || !passwordInput.value) {
      return alert("Preencha Nome, E-mail e Senha para cadastrar.");
    }
    
    const credencials: Credencials = [emailInput.value, passwordInput.value, nameInput.value];
    app.userRegister(credencials);
    
    alert("Usuário cadastrado com sucesso! Clique em 'Entrar'.");
  } catch (err: any) {
    alert(err.message);
  }
});

loginBtn.addEventListener('click', () => {
  try {
    const credencials: Credencials = [emailInput.value, passwordInput.value, nameInput.value];
    
    const logged = app.login(credencials);
    if (logged) {
      welcomeTxt.innerText = `Olá, ${logged.name}`;
      authScreen.classList.add('hidden');
      mainScreen.classList.remove('hidden');
      updateRemindsScreen();
    }
  } catch (err: any) {
    alert(err.message);
  }
});

logoutBtn.addEventListener('click', () => {
  app.logout();
  resetarFormulario();
  mainScreen.classList.add('hidden');
  authScreen.classList.remove('hidden');
});