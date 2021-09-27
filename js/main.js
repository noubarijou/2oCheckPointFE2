const btnAdd = document.getElementById('btn-add');
let tarefaInput = document.getElementById('tarefa');
let dataCriacaoInput = document.getElementById('data-criacao');
let dataFinalInput = document.getElementById('data-final');
let tempoInput;
let small = document.getElementById('erroUm');
let small2 = document.getElementById('erroDois');
/* let main = document.querySelector('main');
carregarEventListeners();

function carregarEventListeners() {
    document.addEventListener("DOMContentLoaded", carregarForm)   
   
}

function carregarForm() {
    main.innerHTML += `
    <div class="criar-tarefa">
            <div>
                <label for="tarefa">Tarefa:</label>
                <input type="tel" size="20" maxlength="12" name="tarefa" id="tarefa">
                <small id="erroUm"></small>
            </div>
            <div>
                <div>
                    <label for="data-criacao">Data de criação:</label>
                    <input type="date" name="data-criacao" id="data-criacao" disabled>
                </div>
                <div>
                    <label for="data-final">Data final:</label>
                    <input type="date" name="data-final" id="data-final">
                    <small id="erroDois"></small>
                </div>
            </div>
            <button id="btn-add"><i class="fas fa-plus fa-sm"></i></button>
        </div>

        <div class="todo-list">
            <div class="todo" id="todo"></div>

            <div class="todo" id="completed"></div>
        </div>
    `
};
 */

let dados = (localStorage.getItem('todoList')) ?
    JSON.parse(localStorage.getItem('todoList')) : {
        todo: [],
        completed: []
    };

window.onload = () => {
    tempoInput = setInterval(() => {
        let now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
        dataCriacaoInput.value = now.toISOString().slice(0, -14);
    }, 200);
}, carregarToDoNoDOM();

btnAdd.addEventListener('click', () => {
    if(tarefaInput.value === ""){
        small.textContent = "Por favor complete a descrição da tarefa";
        small.style.color = '#f55';
    }
    if(dataFinalInput.value === ""){
        small2.textContent = "Por favor preencha a data de término da tarefa";
        small2.style.color = '#f55';
    }
    if(dataFinalInput.value < dataCriacaoInput.value) {
        small2.textContent = "A data de término da tarefa não pode ser anterior à data de criação";
        small2.style.color = '#f55';
    }
    if (tarefaInput.value !== '' && dataCriacaoInput.value !== '' && dataFinalInput.value !== '') {
        addTarefa(tarefaInput.value, dataCriacaoInput.value.replace(/-/g, '/'), dataFinalInput.value.replace(/-/g, '/'))
    }
});

function addTarefa(tarefaValue, dataCriacaoValue, dataFinalValue) {

    addTarefaNoDOM(tarefaValue, dataCriacaoValue, dataFinalValue);

    dados.todo.push({
        tarefa: tarefaValue,
        dataCriacao: dataCriacaoValue,
        dataFinal: dataFinalValue
    })

    localStorage.setItem('todoList', JSON.stringify(dados));

    tarefaInput.value = '';

    tarefaInput.focus();
}



function removerTarefa() {
    if (confirm("Tem certeza? Confirme clicando em 'OK' ou pressione 'ENTER'")) {
        let item = this.parentNode.parentNode;
        let parent = item.parentNode;
        let id = parent.id;

        let tarefaTxt = item.firstChild.textContent;
        let dataCriacaoTxt = item.children[1].children[0].textContent;
        let dataFinalTxt = item.children[1].children[1].textContent;

        let value = {
            tarefa: tarefaTxt,
            dataCriacao: dataCriacaoTxt,
            dataFinal: dataFinalTxt
        }

        let todo = dados.todo;
        let completed = dados.completed;

        if (id === 'todo') {
            dados.todo.splice(todo.findIndex((a) => {
                return a.tarefa === value.tarefa;
            }), 1);
        } else {
            dados.completed.splice(completed.findIndex((a) => {
                return a.tarefa === value.tarefa;
            }), 1);
        }

        localStorage.setItem('todoList', JSON.stringify(dados));

        parent.removeChild(item);
    }
}

function completarTarefa() {
    let item = this.parentNode.parentNode;
    let parent = item.parentNode;
    let id = parent.id;

    let tarefaTxt = item.firstChild.textContent;
    let dataCriacaoTxt = item.children[1].children[0].textContent;
    let dataFinalTxt = item.children[1].children[1].textContent;

    let value = {
        tarefa: tarefaTxt,
        dataCriacao: dataCriacaoTxt,
        dataFinal: dataFinalTxt
    }

    if (id === 'todo') {
        dados.todo.splice(dados.todo.findIndex((a) => {
            return a.tarefa === value.tarefa;
        }), 1);
        dados.completed.push(value);
    } else {
        dados.completed.splice(dados.completed.findIndex((a) => {
            return a.tarefa === value.tarefa;
        }), 1);
        dados.todo.push(value);
    }

    localStorage.setItem('todoList', JSON.stringify(dados));

    let itemAlvo = (id === 'todo') ? document.getElementById('completed') : document.getElementById('todo');

    parent.removeChild(item);
    itemAlvo.insertBefore(item, itemAlvo.childNodes[0]);
}

function addTarefaNoDOM(tarefaValue, dataCriacaoValue, dataFinalValue, isCompleted) {
    let list = (isCompleted) ? document.getElementById('completed') : document.getElementById('todo');

    let item = document.createElement('div');
    item.classList.add('to-do-div');
    item.innerHTML =
        `<h4>${tarefaValue}</h4>
        <div>
        <p>Início: ${dataCriacaoValue}</p>
        <p>Final: ${dataFinalValue}</p>
        </div>
        `;

    let buttons = document.createElement('div');
    buttons.classList.add('buttons');

    let remover = document.createElement('button');
    remover.classList.add('remover');
    remover.innerHTML =
        `<span class="fa-stack fa-1x">
        <i class="fas fa-circle fa-stack-2x"></i>
        <i class="fas fa-trash fa-stack-1x fa-inverse"></i>
        </span>`;

    remover.addEventListener('click', removerTarefa)

    let completar = document.createElement('button');
    completar.classList.add('completar');
    completar.innerHTML =
        `<span class="fa-stack fa-1x">
        <i class="fas fa-circle fa-stack-2x"></i>
        <i class="fas fa-check fa-stack-1x fa-inverse"></i>
        </span>`;

    completar.addEventListener('click', completarTarefa)

    buttons.appendChild(remover);
    buttons.appendChild(completar);
    item.appendChild(buttons);

    list.insertBefore(item, list.childNodes[0]);
}

function carregarToDoNoDOM() {
    if (!dados.todo.length && !dados.completed.length) return;

    for (let i = 0; i < dados.todo.length; i++) {
        let valueToDo = dados.todo[i];
        addTarefaNoDOM(valueToDo.tarefa, valueToDo.dataCriacao, valueToDo.dataFinal);
    }

    for (let j = 0; j < dados.completed.length; j++) {
        let valueCompleted = dados.completed[j];
        addTarefaNoDOM(valueCompleted.tarefa, valueCompleted.dataCriacao, valueCompleted.dataFinal, true);
    }
}

