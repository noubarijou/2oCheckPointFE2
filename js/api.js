//define as variaveis a ser usadas com valores do dom
const pronto = document.querySelector('#pronto');
const naumPronto = document.querySelector('#naumPronto');
const voltar = document.querySelector('#voltar');

//função pega os valores puxados da api e as imprime na tela formatados

const mostrarDados = (result) => {
    for (const campo in result) {
        console.log(result[campo]);
        const card = `  <div class="card">
                        <h5>User ID: ${result[campo].userId}</h5>
                        <h5>ID Tarefa: ${result[campo].id}</h5>
                        <h4>Tarefa: ${result[campo].title}</h4>
                        </div>`
        
        if (result[campo].completed) {
            pronto.innerHTML += card;            
        } else {
            naumPronto.innerHTML += card;
        }

       
    }
} 


//funcao acessa a api e puxa os dados necessarios
function carregarApi(){
    const options = {
        method: 'GET',
        mode: 'cors',
        cache: 'default'
    }
    fetch(`https://jsonplaceholder.typicode.com/todos/`, options)
        .then(response => {response.json()
            .then(dado => mostrarDados(dado))
        })
        .catch(e => console.error('Deu erro mano! ' + e, message))
}

//event listener do botao pra voltar a pagina inicial
voltar.addEventListener('click', (e) => {
    window.location.href = 'index.html';
})