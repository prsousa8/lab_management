const alunos = [
    { matricula: 495757, nome: "Paulo Ricardo" },
    { matricula: 508979, nome: "Marco Aurélio" }
];

// Lista de presença inicial vazia
const presenca = [];

const computadoresDisponiveis = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Livre"];

const campoAlunos = document.querySelector("tbody");
const computadorSeletor = document.getElementById("computador-seletor");
const input = document.getElementById("filtro-matricula");
const ul = document.getElementById("filtro-alunos");

// Renderiza a lista de alunos presentes
function entradaESaida(aluno) {
    const corBotao = aluno.booleano ? "#e0b0ff" : "#1aff1f";
    const textoBotao = aluno.booleano ? "Registrar saída" : "Remover da lista";
    return `<button class="btnRegistrar" style="background-color: ${corBotao};" data-id="${aluno.matricula}">${textoBotao}</button>`;
}

function renderizar() {
    campoAlunos.innerHTML = "";
    presenca.forEach(alunoPresenca => {
        campoAlunos.innerHTML += `
        <tr>
            <td>${alunoPresenca.matricula}</td>  
            <td>${alunoPresenca.nome}</td>
            <td>${alunoPresenca.computador}</td>   
            <td>${alunoPresenca.data} </td>  
            <td>${alunoPresenca.entrada}</td>   
            <td>${alunoPresenca.saida}</td>  
            <td>${entradaESaida(alunoPresenca)}</td> </tr>`;
    });

    const botoes = campoAlunos.querySelectorAll(".btnRegistrar");
    botoes.forEach(botao => {
        botao.addEventListener("click", function () {
            const matricula = parseInt(this.getAttribute("data-id"));
            alternarBooleano(matricula);
        });
    });
}

function alternarBooleano(matricula) {
    const alunoPresenca = presenca.find(p => p.matricula === matricula);
    if (alunoPresenca) {
        if (alunoPresenca.booleano) {
            // Registrar saída
            alunoPresenca.saida = new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
            if (alunoPresenca.computador !== "Livre") {
                computadoresDisponiveis.push(alunoPresenca.computador);
            }
            computadoresDisponiveis.sort();
            alunoPresenca.booleano = false;
        } else {
            // Remover aluno da lista de presença
            const index = presenca.findIndex(p => p.matricula === matricula);
            if (index !== -1) presenca.splice(index, 1);
        }
        renderizar(); // Atualiza a lista renderizada
    }
}

// Adiciona aluno à lista de presença ao clicar no filtro
function adicionarPresencaDinamico(matricula) {
    if (!presenca.some(p => p.matricula === matricula)) {
        const aluno = alunos.find(a => a.matricula === matricula);
        if (aluno) {
            computadorSeletor.style.display = "block";

            // Limpa as opções do seletor antes de adicionar as novas
            computadorSeletor.innerHTML = '<option value="">Selecione um computador</option>';

            computadoresDisponiveis.forEach(pc => {
                computadorSeletor.innerHTML += `<option value="${pc}">${pc}</option>`;
            });

            // Exibir o seletor e registrar a presença após a escolha
            document.getElementById("campo-pesquisa").appendChild(computadorSeletor);

            computadorSeletor.addEventListener("change", () => {
                const computador = computadorSeletor.value;
                if (computador) {
                    presenca.push({
                        matricula: aluno.matricula,
                        nome: aluno.nome,
                        computador: computador,
                        booleano: true,
                        data: new Date().toLocaleDateString("pt-BR"),
                        entrada: new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }),
                        saida: ""
                    });

                    computadorSeletor.style.display = "none";
                    ul.style.display = "none";
                    input.value = "";
                    renderizar();

                    // Remove o computador escolhido do array apenas se não for "Livre"
                    if (computador !== "Livre") {
                        computadoresDisponiveis.splice(computadoresDisponiveis.indexOf(computador), 1);
                    }
                }
            }, { once: true }); // Adiciona o evento de mudança uma única vez
        }
    }
}


// Filtro de pesquisa e clique

input.addEventListener("keyup", function () {
    const keyword = input.value.toLowerCase();

    if (keyword === "") {
        ul.innerHTML = ""; // Limpa a lista se o campo de busca estiver vazio
    } else {
        const filteredUsers = alunos.filter(aluno =>
            aluno.matricula.toString().includes(keyword) &&
            !presenca.some(p => p.matricula === aluno.matricula) // Verifica se o aluno já não está na lista de presença
        );
        renderLists(filteredUsers); // Renderiza apenas os resultados filtrados

        ul.style.display = "block";
    }
});

function renderLists(alunosFiltrados) {
    ul.innerHTML = "";
    alunosFiltrados.forEach(aluno => {
        ul.innerHTML += `
            <li class="aluno-item" data-id="${aluno.matricula}">
                Aluno: ${aluno.matricula} ${aluno.nome}
            </li>`;
    });

    // Torna os itens clicáveis
    const items = ul.querySelectorAll(".aluno-item");
    items.forEach(item => {
        item.addEventListener("click", function () {
            const matricula = parseInt(this.getAttribute("data-id"));
            adicionarPresencaDinamico(matricula);
        });
    });
}


// Tratamento de erros
const formCadastro = document.querySelector("#meu-formulario");
const camposObrigatorios = ["matricula", "nome"]; // IDs dos campos obrigatórios

const matricula = document.getElementById("matricula");
const erroMatricula = document.getElementById("erro-matricula");

matricula.oninput = function (event) {
    if (!/^\d+$/.test(matricula.value)) {
        erroMatricula.innerHTML = "A matrícula deve conter apenas números.";
    } else if (verificarMatricula(matricula.value)) {
        erroMatricula.innerHTML = "A matrícula já existe.";
    } else {
        erroMatricula.innerHTML = ""; // Limpa a mensagem de erro quando o tamanho for suficiente
    }
};

function verificarMatricula(matriculaValor) {
    return alunos.some(aluno => aluno.matricula === parseInt(matriculaValor));
}

const nome = document.getElementById("nome");
const erroNome = document.getElementById("erro-nome");

nome.oninput = function () {
    // Validação do nome
    if (nome.value.trim().split(" ").length < 2) {
        erroNome.innerHTML = "O nome deve conter pelo menos dois nomes.";
    } else if (!nome.value.match(/^[A-Za-z\s]+$/)) {
        erroNome.innerHTML = "O nome deve conter apenas letras e espaços.";
    } else if (nome.value.length > 50) {
        erroNome.innerHTML = "O nome deve ter no máximo 50 caracteres.";
    } else {
        erroNome.innerHTML = ""; // Limpa a mensagem de erro
    }
};


formCadastro.addEventListener("submit", event => {
    event.preventDefault(); // Impede o envio padrão do formulário

    let temErro = false;

    // Valida campos obrigatórios
    camposObrigatorios.forEach(campoId => {
        const campo = document.getElementById(campoId);
        const erroCampo = document.getElementById(`erro-${campoId}`);

        if (!campo.value.trim()) {
            erroCampo.innerHTML = `O campo ${campoId} é obrigatório.`;
            temErro = true;
        } else {
            erroCampo.innerHTML = ""; // Limpa mensagens de erro anteriores
        }
    });

    // Verifica se a matrícula está vazia ou já existe
    const matriculaValor = document.getElementById("matricula").value.trim();
    const erroMatricula = document.getElementById("erro-matricula");

    if (!matriculaValor) {
        erroMatricula.innerHTML = "O campo matrícula é obrigatório.";
        temErro = true;
    } else if (alunos.some(aluno => aluno.matricula === parseInt(matriculaValor))) {
        erroMatricula.innerHTML = "A matrícula já existe.";
        temErro = true;
    } else {
        erroMatricula.innerHTML = ""; // Limpa mensagem de erro se não houver problema
    }

    if (temErro) {
        Swal.fire({
            title: 'Cadastro não realizado!',
            text: `O cadastro não foi possível. Tente novamente.`,
            imageUrl: 'assets/cancelar.png', // URL da imagem
            imageWidth: 100,
            imageHeight: 100,
            imageAlt: 'Ícone personalizado',
            confirmButtonText: 'Fechar'
        });
        return; // Encerra a execução se houver erros
    }

    // Todos os campos estão preenchidos e matrícula não existe; adiciona ao array de alunos
    const data = Object.fromEntries(new FormData(event.target).entries());

    const novoAluno = {
        matricula: parseInt(data.matricula),
        nome: data.nome
    };

    alunos.push(novoAluno);
    Swal.fire({
        title: 'Cadastro realizado!',
        text: `O cadastro de ${novoAluno.nome} foi realizado com sucesso.`,
        imageUrl: 'assets/sucesso.png', // URL da imagem
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: 'Ícone personalizado',
        confirmButtonText: 'Fechar'
    });
    resetarForm(); // Limpa o formulário após o envio
    renderizar(); // Atualiza a lista, se necessário
});

const btnLimpar = document.getElementById("limpar");
btnLimpar.addEventListener("click", resetarForm);

function resetarForm(){
    formCadastro.reset();
}

// Inicializa a renderização
renderizar();