//define variaveis que utlizam valores do dom
const btnAdd = document.getElementById("btn-add");
let tarefaInput = document.getElementById("tarefa");
let dataCriacaoInput = document.getElementById("data-criacao");
let dataFinalInput = document.getElementById("data-final");
let tempoInput;
let small = document.getElementById("erroUm");
let small2 = document.getElementById("erroDois");
let footer = document.querySelector("footer");
let barraProgresso = document.querySelector("#barraProgresso");
let progressoFeito = document.querySelector("#progressoFeito");
//puxa items guardados no local storage
let dados = localStorage.getItem("todoList")
  ? JSON.parse(localStorage.getItem("todoList"))
  : {
      todo: [],
      completed: [],
    };

//define a função da barra de progresso
function barraDeProgresso() {
  let tarefasPraFazer = dados.todo.length;
  let tarefasFeitas = dados.completed.length;
  let totalTarefas = tarefasPraFazer + tarefasFeitas;

  porcentagemCompleta = (tarefasFeitas * 100) / totalTarefas;
  console.log(progressoFeito);
  porcentagemCompleta.toFixed(2);
  console.log(porcentagemCompleta);
  console.log(tarefasFeitas);
  if (tarefasFeitas == 0) {
    progressoFeito.innerText = "0%";
    progressoFeito.style.width = "0%";
  } else if (porcentagemCompleta !== NaN) {
    progressoFeito.innerText = parseInt(porcentagemCompleta) + "%";
    progressoFeito.style.width = porcentagemCompleta + "%";
    progressoFeito.style.backgroundColor = "#f55";
  }
}
//seta data do dia para criaçao da tarefa
(window.onload = () => {
  tempoInput = setInterval(() => {
    let now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    dataCriacaoInput.value = now.toISOString().slice(0, -14);
  }, 200);
}),
  carregarToDoNoDOM();
//event listener do botão de criar tarefas valida requisitos dos campos
btnAdd.addEventListener("click", () => {
  if (tarefaInput.value === "") {
    small.textContent = "Por favor complete a descrição da tarefa";
    small.style.color = "#f55";
  }
  if (dataFinalInput.value === "") {
    small2.textContent = "Por favor preencha a data de término da tarefa";
    small2.style.color = "#f55";
  }
  if (dataFinalInput.value < dataCriacaoInput.value) {
    small2.textContent =
      "A data de término da tarefa não pode ser anterior à data de criação";
    small2.style.color = "#f55";
    return;
  }
  if (
    tarefaInput.value !== "" &&
    dataCriacaoInput.value !== "" &&
    dataFinalInput.value !== ""
  ) {
    addTarefa(
      tarefaInput.value,
      dataCriacaoInput.value.replace(/-/g, "/"),
      dataFinalInput.value.replace(/-/g, "/")
    );
  }
});
//função acrescenta tarefas no array do local storage e na tela
function addTarefa(tarefaValue, dataCriacaoValue, dataFinalValue) {
  addTarefaNoDOM(tarefaValue, dataCriacaoValue, dataFinalValue);

  dados.todo.push({
    tarefa: tarefaValue,
    dataCriacao: dataCriacaoValue,
    dataFinal: dataFinalValue,
  });

  localStorage.setItem("todoList", JSON.stringify(dados));

  tarefaInput.value = "";

  tarefaInput.focus();
}

//função remove tarefas do dom e do local storage, com uso do sweet alert
function removerTarefa() {
  Swal.fire({
    title: "Tem certeza que quer apagar a tarefa?",
    text: "Não é possível desfazer essa ação!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim, pode apagar!",
  }).then((result) => {
    if (result.isConfirmed) {
      let item = this.parentNode.parentNode;
      let parent = item.parentNode;
      let id = parent.id;

      let tarefaTxt = item.firstChild.textContent;
      let dataCriacaoTxt = item.children[1].children[0].textContent;
      let dataFinalTxt = item.children[1].children[1].textContent;

      let value = {
        tarefa: tarefaTxt,
        dataCriacao: dataCriacaoTxt,
        dataFinal: dataFinalTxt,
      };

      let todo = dados.todo;
      let completed = dados.completed;

      if (id === "todo") {
        dados.todo.splice(
          todo.findIndex((a) => {
            return a.tarefa === value.tarefa;
          }),
          1
        );
      } else {
        dados.completed.splice(
          completed.findIndex((a) => {
            return a.tarefa === value.tarefa;
          }),
          1
        );
      }

      localStorage.setItem("todoList", JSON.stringify(dados));

      parent.removeChild(item);
    }
  });
  barraDeProgresso();
}

//função marca tarefas como completadas no dom e no local storage
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
    dataFinal: dataFinalTxt,
  };

  if (id === "todo") {
    dados.todo.splice(
      dados.todo.findIndex((a) => {
        return a.tarefa === value.tarefa;
      }),
      1
    );
    dados.completed.push(value);
  } else {
    dados.completed.splice(
      dados.completed.findIndex((a) => {
        return a.tarefa === value.tarefa;
      }),
      1
    );
    dados.todo.push(value);
  }

  localStorage.setItem("todoList", JSON.stringify(dados));

  let itemAlvo =
    id === "todo"
      ? document.getElementById("completed")
      : document.getElementById("todo");

  parent.removeChild(item);
  itemAlvo.insertBefore(item, itemAlvo.childNodes[0]);
  barraDeProgresso();
}

//funcao cria tarefa e imprime na tela
function addTarefaNoDOM(
  tarefaValue,
  dataCriacaoValue,
  dataFinalValue,
  isCompleted
) {
  let list = isCompleted
    ? document.getElementById("completed")
    : document.getElementById("todo");

  let item = document.createElement("div");
  item.classList.add("to-do-div");
  item.innerHTML = `<h4>${tarefaValue}</h4>
        <div>
        <p>Início: <span>${dataCriacaoValue}</span></p>
        <p>Final: <span>${dataFinalValue}</span></p>
        </div>
        `;

  let buttons = document.createElement("div");
  buttons.classList.add("buttons");

  let remover = document.createElement("button");
  remover.classList.add("remover");
  remover.innerHTML = `<span class="fa-stack fa-1x">
        <i class="fas fa-circle fa-stack-2x"></i>
        <i class="fas fa-trash fa-stack-1x fa-inverse"></i>
        </span>`;

  remover.addEventListener("click", removerTarefa);

  let completar = document.createElement("button");
  completar.classList.add("completar");
  completar.innerHTML = `<span class="fa-stack fa-1x">
        <i class="fas fa-circle fa-stack-2x"></i>
        <i class="fas fa-check fa-stack-1x fa-inverse"></i>
        </span>`;

  completar.addEventListener("click", completarTarefa);

  buttons.appendChild(remover);
  buttons.appendChild(completar);
  item.appendChild(buttons);

  list.insertBefore(item, list.childNodes[0]);
  barraDeProgresso();
}
//funcao carrega tarefas no dom
function carregarToDoNoDOM() {
  if (!dados.todo.length && !dados.completed.length) return;

  for (let i = 0; i < dados.todo.length; i++) {
    let valueToDo = dados.todo[i];
    addTarefaNoDOM(
      valueToDo.tarefa,
      valueToDo.dataCriacao,
      valueToDo.dataFinal
    );
  }

  for (let j = 0; j < dados.completed.length; j++) {
    let valueCompleted = dados.completed[j];
    addTarefaNoDOM(
      valueCompleted.tarefa,
      valueCompleted.dataCriacao,
      valueCompleted.dataFinal,
      true
    );
  }
}