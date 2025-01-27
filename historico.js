// Corrige o evento dos botões e o uso do alunoPresenca
const apiURL = "http://localhost:3000"; // URL base do json-server


    // Renderiza a lista de presença
    async function renderizarHistorico() {
        const campoAlunos = document.querySelector("tbody");

        
        const presencaRes = await fetch(`${apiURL}/historico`);
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
        </tr>`;
        });
    }

    renderizarHistorico();