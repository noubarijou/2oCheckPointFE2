const pronto = document.querySelector('#pronto');
const naumPronto = document.querySelector('#naumPronto');
const voltar = document.querySelector('#voltar');



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


voltar.addEventListener('click', (e) => {
    window.location.href = 'index.html';
})