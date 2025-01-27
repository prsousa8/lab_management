// Corrige o evento dos botões e o uso do alunoPresenca
const apiURL = "http://localhost:3000"; // URL base do json-server
var computadoresDisponiveis = [];

document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch(`${apiURL}/computadoresDisponiveis?id=1`);
    const data = await res.json();
    computadoresDisponiveis = data.lista;



    // Renderiza a lista de presença
    async function renderizar() {
        const campoAlunos = document.querySelector("tbody");

        const presencaRes = await fetch(`${apiURL}/presenca`);
        const presenca = await presencaRes.json();

        campoAlunos.innerHTML = "";
        presenca.forEach(alunoPresenca => {
            campoAlunos.innerHTML += `
        <tr>
            <td>${alunoPresenca.matricula}</td>
            <td>${alunoPresenca.nome}</td>
            <td>${alunoPresenca.computador}</td>
            <td>${alunoPresenca.data}</td>
            <td>${alunoPresenca.entrada}</td>
            <td>${alunoPresenca.saida}</td>
            <td>${gerarBotaoEntradaESaida(alunoPresenca)}</td>
        </tr>`;
        });

        document.querySelectorAll(".btnRegistrar").forEach(botao => {
            botao.addEventListener("click", async (event) => {
                const matricula = botao.dataset.id;
                await alternarBooleano(matricula);
            });
        });
    }

    function gerarBotaoEntradaESaida(aluno) {
        const corBotao = aluno.booleano ? "#e0b0ff" : "#1aff1f";
        const textoBotao = aluno.booleano ? "Registrar saída" : "Remover da lista";
        return `<button class="btnRegistrar" style="background-color: ${corBotao};" data-id="${aluno.matricula}">${textoBotao}</button>`;
    }

    // Alterna entre registrar saída ou remover o aluno da lista de presença
    async function alternarBooleano(matricula) {
        const res = await fetch(`${apiURL}/presenca?matricula=${matricula}`);
        const alunoPresencaArray = await res.json();
        const alunoPresenca = alunoPresencaArray[0]; // Corrige para acessar o primeiro item

        if (alunoPresenca.booleano) {
            // Registrar saída
            const computador = alunoPresenca.computador;
            const updateData = {
                ...alunoPresenca,
                saida: new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }),
                booleano: false
            };

            await fetch(`${apiURL}/presenca/${alunoPresenca.id}`, { // Corrige o endpoint
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData)
            });

            await fetch(`${apiURL}/historico`, { // Corrige o endpoint
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData)
            });

            // Libera o computador (se não for "Livre")
            if (computador !== "Livre") {
                computadoresDisponiveis.push(computador);
                computadoresDisponiveis.sort();

                // Atualiza a lista de computadores disponíveis no servidor
                await fetch(`${apiURL}/computadoresDisponiveis?id=1`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: 1, lista: computadoresDisponiveis })
                });
            }
        } else {
            // Remove da lista de presença
            await fetch(`${apiURL}/presenca/${alunoPresenca.id}`, { method: "DELETE" });
        }

    }

    // Adiciona aluno à lista de presença
    async function adicionarPresencaDinamico(matricula) {
        const res = await fetch(`${apiURL}/alunos?matricula=${matricula}`);
        const alunoArray = await res.json();
        const aluno = alunoArray[0]; // Corrige para acessar o primeiro item

        const computadorSeletor = document.getElementById("computador-seletor");
        computadorSeletor.style.display = "block";
        console.log("Computadores disponíveis antes:", computadoresDisponiveis);
        computadorSeletor.innerHTML = '<option value="">Selecione um computador</option>';
        computadoresDisponiveis.forEach(pc => {
            computadorSeletor.innerHTML += `<option value="${pc}">${pc}</option>`;
        });

        computadorSeletor.addEventListener("change", async () => {
            const computador = computadorSeletor.value;

            if (computador) {
                const presencaData = {
                    matricula: aluno.matricula,
                    nome: aluno.nome,
                    computador: computador,
                    data: new Date().toLocaleDateString("pt-BR"),
                    entrada: new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }),
                    saida: "",
                    booleano: true
                };

                await fetch(`${apiURL}/presenca`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(presencaData)
                });

                // Verifica se o computador está na lista e o remove
                const index = computadoresDisponiveis.indexOf(computador);
                if (computador !== "Livre") {
                    computadoresDisponiveis.splice(index, 1); // Remove o computador da lista

                    // Atualiza a lista de computadores disponíveis no servidor
                    await fetch(`${apiURL}/computadoresDisponiveis?id=1`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: 1, lista: computadoresDisponiveis })
                    });
                }
                console.log("Computadores disponíveis depos:", computadoresDisponiveis);
                computadorSeletor.style.display = "none";
            }
        }, { once: true });
    }

    // Filtro de alunos no input
    document.getElementById("filtro-matricula").addEventListener("keyup", async function () {
        const keyword = this.value.toLowerCase();
        const ul = document.getElementById("filtro-alunos");

        if (keyword === "") {
            ul.innerHTML = "";
            ul.style.display = "none";
        } else {
            const resAlunos = await fetch(`${apiURL}/alunos`);
            const alunos = await resAlunos.json();

            const resPresenca = await fetch(`${apiURL}/presenca`);
            const presenca = await resPresenca.json();

            const alunosFiltrados = alunos.filter(aluno =>
                aluno.matricula.toString().includes(keyword) &&
                !presenca.some(p => p.matricula === aluno.matricula)
            );

            ul.innerHTML = "";
            alunosFiltrados.forEach(aluno => {
                ul.innerHTML += `
            <li class="aluno-item" data-id="${aluno.matricula}">
                ${aluno.matricula} - ${aluno.nome}
            </li>`;
            });

            ul.style.display = "block";

            ul.querySelectorAll(".aluno-item").forEach(item => {
                item.addEventListener("click", function () {
                    const matricula = parseInt(this.dataset.id);
                    adicionarPresencaDinamico(matricula);
                });
            });
        }
    });


    //Tratamento de erros
    const matricula = document.getElementById("matricula");
    const erroMatricula = document.getElementById("erro-matricula");

    matricula.oninput = async function (event) {
        const res = await fetch(`${apiURL}/alunos?matricula=${matricula.value}`);
        const aluno = await res.json();
        console.log(aluno[0]);
        erroMatricula.innerHTML = "";
        if (!/^\d+$/.test(matricula.value)) {
            erroMatricula.innerHTML = "A matrícula deve conter apenas números.";
        } else {
            erroMatricula.innerHTML = ""; // Limpa a mensagem de erro quando o tamanho for suficiente
        }
    };

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

    const URL_DA_IMAGEM_DE_ERRO = "assets/cancelar.png";
    const URL_DA_IMAGEM_DE_SUCESSO = "assets/sucesso.png";

    // Validação de formulário
    document.getElementById("meu-formulario").addEventListener("submit", async function (event) {
        event.preventDefault();
        const matriculaInput = document.getElementById("matricula");
        const nomeInput = document.getElementById("nome");
        const matricula = matriculaInput.value.trim();
        const nome = nomeInput.value.trim();

        if (!matricula || !nome) {
            Swal.fire({
                title: "Erro!",
                text: "Preencha todos os campos obrigatórios.",
                imageUrl: URL_DA_IMAGEM_DE_ERRO,
                imageWidth: 100,
                imageHeight: 100,
                imageAlt: "Imagem de erro",
            });
            return;
        }

        const res = await fetch(`${apiURL}/alunos`);
        const alunos = await res.json();

        if (alunos.some(a => a.matricula === parseInt(matricula))) {
            Swal.fire({
                title: "Erro!",
                text: "Matrícula já existe.",
                imageUrl: URL_DA_IMAGEM_DE_ERRO,
                imageWidth: 100,
                imageHeight: 100,
                imageAlt: "Imagem de erro",
            });
            return;
        } else if (!/^\d+$/.test(matricula)) {
            Swal.fire({
                title: "Erro!",
                text: "A matrícula deve conter apenas números.",
                imageUrl: URL_DA_IMAGEM_DE_ERRO,
                imageWidth: 100,
                imageHeight: 100,
                imageAlt: "Imagem de erro",
            });
            return;
        } else if (nome.split(" ").length < 2) {
            Swal.fire({
                title: "Erro!",
                text: "O nome deve conter pelo menos dois nomes.",
                imageUrl: URL_DA_IMAGEM_DE_ERRO,
                imageWidth: 100,
                imageHeight: 100,
                imageAlt: "Imagem de erro",
            });
            return;
        } else if (!nome.match(/^[A-Za-z\s]+$/)) {
            Swal.fire({
                title: "Erro!",
                text: "O nome deve conter apenas letras e espaços.",
                imageUrl: URL_DA_IMAGEM_DE_ERRO,
                imageWidth: 100,
                imageHeight: 100,
                imageAlt: "Imagem de erro",
            });
            return;
        } else if (nome.length > 50) {
            Swal.fire({
                title: "Erro!",
                text: "O nome deve ter no máximo 50 caracteres.",
                imageUrl: URL_DA_IMAGEM_DE_ERRO,
                imageWidth: 100,
                imageHeight: 100,
                imageAlt: "Imagem de erro",
            });
            return;
        }

        const novoAluno = { matricula, nome };

        await fetch(`${apiURL}/alunos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoAluno),
        });
        Swal.fire({
            title: "Sucesso!",
            text: "Aluno cadastrado com sucesso.",
            imageUrl: URL_DA_IMAGEM_DE_SUCESSO,
            imageWidth: 100,
            imageHeight: 100,
            imageAlt: "Imagem de sucesso",
        });
    });

    const btnLimpar = document.getElementById("limpar");
    btnLimpar.addEventListener("click", function(){
        document.getElementById("meu-formulario").reset();
    })
    renderizar();
});
