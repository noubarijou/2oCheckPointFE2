//anteriormente ao início do bimestre, como preparação, fiz esse projeto em um curso da Udemy
//pelo visual simplista e direto, tenho ele como preferência ao criado para o projeto, assim resolvi incluir



//define as variaveis da interface do usuario
const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-task');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');

//carrega todos os event listeners

loadEventListeners();

function loadEventListeners() {
    //evento de carregamento do DOM
    document.addEventListener('DOMContentLoaded', getTasks);
    //evento de adicionar tarefa
    form.addEventListener('submit', addTask);
    //evento de remover tarefa
    taskList.addEventListener('click', removeTask);
    //evento de remover todas as tarefas
    clearBtn.addEventListener('click', clearTasks);
    //eventro de filtrar tarefas
    filter.addEventListener('keyup', filterTasks);
}

//puxar tarefas do local storage
function getTasks() {
    let tasks;
    if(localStorage.getItem('tasks') === null) {
        tasks = [];
    }else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.forEach(function(task) {
        const li = document.createElement('li');
        li.className = 'collection-item';
        li.appendChild(document.createTextNode(task));
        const link = document.createElement('a');
        link.className = 'delete-item secondary-content';
        link.innerHTML = '<i class="fa fa-remove"></i>';
        li.appendChild(link);
        taskList.appendChild(li);
    });
}

//adicionar tarefas

function addTask(e) {
    if(taskInput.value === '') {
        alert('Please add a task');
        return;
    }

    //criar li
    const li = document.createElement('li');
    //adicionar classe
    li.className = 'collection-item';
    //criar text node e dar append no li
    li.appendChild(document.createTextNode(taskInput.value));
    //criar novo elemento link
    const link = document.createElement('a');
    //adicionar classe
    link.className = 'delete-item secondary-content';
    //adiciona icone ao link de remoçao individual de tarefas
    link.innerHTML = '<i class="fa fa-remove"></i>';
    //faz append do link no li
    li.appendChild(link);
    //faz append do li no ul
    taskList.appendChild(li);
    //guarda no  Local Storage
    storeTaskInLocalStorage(taskInput.value);
    //limpa o  input
    taskInput.value = '';




    e.preventDefault();
}

//guardar tarefa
function storeTaskInLocalStorage(task) {
    let tasks;
    if(localStorage.getItem('tasks') === null){
        tasks = [];
    }else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//remover tarefa
function removeTask(e) {
    if(e.target.parentElement.classList.contains('delete-item')) {
        if(confirm('Are you sure you want to delete the task?')) {
            e.target.parentElement.parentElement.remove();

            //remove from LocalStorage
            removeTaskFromLocalStorage(e.target.parentElement.parentElement);
        }
    }
}

//remover tarefa do local storage
function removeTaskFromLocalStorage(taskItem) {
    let tasks;
    if(localStorage.getItem('tasks') === null) {
        tasks = [];
    }else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.forEach(function(task, index) {
        if(taskItem.textContent === task) {
            tasks.splice(index, 1);
        }
    });
    localStorage.setItem('tasks', JSON.stringfy(tasks));
}


//remover todas tarefas
function clearTasks() {
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }
    //remove do local Storage
    clearTasksFromLocalStorage();
}
//remove as  tarefas do local Storage
function clearTasksFromLocalStorage() {
    localStorage.clear();
}


//filtra tarefas
function filterTasks(e) {
    const text = e.target.value.toLowerCase();

    document.querySelectorAll('.collection-item').forEach(function(task) {
        const item = task.firstChild.textContent;
        if(item.toLowerCase().indexOf(text) != -1) {
            task.style.display = 'block';
        }else {
            task.style.display = 'none';
        }
    });
}