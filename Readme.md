# Sejam Bem-vindos ao meu Portfólio!

Este sistema foi desenvolvido para facilitar o acompanhamento das atividades dos estudantes no laboratório de informática, garantindo organização, eficiência e praticidade no controle de uso dos recursos disponíveis. Os estudantes podem ser cadastrados rapidamente, com detalhes como matrícula, nome e horário de entrada. O sistema mantém um histórico detalhado de todas as visitas. Além disso, a interface foi projetada para registrar a entrada e saída dos estudantes de forma prática e dinâmica, utilizando botões intuitivos que geram relatórios completos sobre frequência e uso.

## Tecnologias e Ferramentas Utilizadas 🔧

Este projeto foi construído utilizando as seguintes tecnologias:

- **HTML5**: Estruturação da página web. Mais detalhes sobre a especificação HTML podem ser encontrados [aqui](https://developer.mozilla.org/pt-BR/docs/Web/HTML).
- **CSS3**: Estilização da página e layout responsivo. Mais informações sobre CSS3 estão [aqui](https://developer.mozilla.org/pt-BR/docs/Web/CSS).
- **JavaScript**: Interatividade da aplicação. Para aprender mais sobre JavaScript, consulte [a documentação oficial](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript).

![HTML5](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg)
![CSS3](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg)
![JavaScript](https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg)

### SweetAlert2

Utilizado para mostrar alertas interativas e personalizadas, o **SweetAlert2** permite que as mensagens no sistema sejam mais dinâmicas e visualmente agradáveis. Para integrar o SweetAlert2, adicione o seguinte código ao seu arquivo HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
```

### Node.js

**Node.js** foi utilizado para executar o servidor de desenvolvimento, permitindo a construção de uma aplicação web robusta e eficiente. Para mais informações, consulte a documentação oficial do [Node.js](https://nodejs.org/en/).

### JSON-Server

Para simular uma API e persistir dados no formato JSON, utilizamos o **json-server**. Isso facilita a criação de um servidor fake para gerenciar os dados da aplicação.

Para instalar o **json-server**, utilize o seguinte comando:

```bash
npm install json-server
```

**Documentação do JSON-Server**: [json-server GitHub](https://github.com/typicode/json-server).

## Executando o Projeto ⏳

Para executar o projeto localmente, siga os passos abaixo:

### Editor de Código

Escolha um editor de código de sua preferência. Algumas opções populares incluem:

- **[Visual Studio Code](https://code.visualstudio.com/)**: Excelente editor para desenvolvimento web.
- **Sublime Text**: Leve e eficiente.
- **Atom**: Código aberto e altamente personalizável.

Baixe o Visual Studio Code [aqui](https://code.visualstudio.com/).

### Clone do Repositório

- Verifique se o **Git** está instalado em sua máquina. Caso não tenha, você pode baixá-lo [aqui](https://git-scm.com/).
- Clone o repositório com o seguinte comando:

```bash
git clone https://github.com/prsousa8/lab_management.git
```

### Execução do Projeto

- Abra o terminal e navegue até a pasta do projeto.
- Para iniciar o banco de dados em JSON, execute:

```bash
json-server --watch db.json --port 3000
```

- Abra a pasta do projeto no editor de código.
- Caso utilize o **Visual Studio Code**, você pode instalar a extensão **Live Server** para uma execução automática do projeto.
- Como alternativa, abra o arquivo **index.html** diretamente no navegador de sua escolha para visualizar o portfólio.