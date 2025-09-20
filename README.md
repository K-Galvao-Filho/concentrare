# CONCENTRARE - Sistema Pomodoro 🍅

Um dashboard de produtividade completo e moderno, baseado na técnica Pomodoro. Projetado para maximizar o foco e organizar suas tarefas através de uma interface limpa, responsiva, acessível e instalável.

*(**Instrução:** Tire uma captura de tela da sua aplicação finalizada e substitua o link acima pela sua imagem.)*

## Tabela de Conteúdos

1.  Visão Geral e Filosofia do Projeto
2.  Funcionalidades Detalhadas
3.  Estrutura e Tecnologias
4.  Guia de Instalação e Execução
5.  Licença

-----

### I. Visão Geral e Filosofia do Projeto

**CONCENTRARE** é mais do que um simples timer: é um ambiente de foco completo construído com tecnologias web modernas. A aplicação combina um timer Pomodoro altamente configurável com um gerenciador de tarefas e sons de ambiente para criar um espaço de trabalho produtivo.

A arquitetura foi projetada com base em quatro pilares:

1.  **Modularidade Visual:** A interface é dividida em componentes lógicos e independentes: um `header` para navegação e configurações, e dois "cards" (`widgets`) principais para o **Timer** e as **Tarefas**.
2.  **Estado Centralizado no Cliente:** É uma **Single Page Application (SPA)** pura. Todo o estado (configurações, tarefas, tema, etc.) é gerenciado no cliente e persistido através da `localStorage API`, garantindo rapidez e continuidade entre as sessões.
3.  **Experiência Offline-First (PWA):** Como um **Progressive Web App (PWA)**, todos os recursos essenciais são armazenados em cache por um **Service Worker**, permitindo que a aplicação carregue instantaneamente e funcione perfeitamente mesmo sem conexão com a internet.
4.  **Acessibilidade (a11y) por Design:** A aplicação foi desenvolvida com acessibilidade em mente, utilizando atributos `ARIA` e regiões `aria-live` para garantir uma experiência completa para usuários que dependem de leitores de tela.

### II. Funcionalidades Detalhadas

  * **Timer Pomodoro Completo**: Modos de Foco, Pausa Curta e Pausa Longa, com um anel de progresso visual em SVG.
  * **Controles Avançados do Timer**:
      * **Início Automático de Pausas**: Uma opção nas configurações permite ativar ou desativar o início automático das pausas.
      * **Botão 'PRÓXIMO'**: Permite pular instantaneamente para a próxima fase (de foco para pausa, ou de pausa para foco) com um clique.
      * **Controles Otimizados**: Botões icônicos e de mesmo tamanho para Pausar, Parar e Pular, criando uma interface de controle mais limpa e minimalista.
  * **Altamente Configurável**: Ajuste a duração dos timers, a quantidade de pomodoros por ciclo e o número total de ciclos.
  * **Lista de Tarefas (To-Do List)**: Adicione, conclua e delete tarefas. Os dados são salvos localmente no navegador.
  * **Relatórios de Produtividade**: Acompanhe seu progresso com estatísticas de pomodoros concluídos hoje e no total.
  * **Sons de Ambiente em Loop Perfeito**: Escolha entre vários sons de fundo (Chuva, Floresta, Ruído Marrom, etc.) que tocam de forma contínua e sem delays durante as sessões de foco, graças à **Web Audio API**.
  * **Alarmes Personalizáveis**: Selecione diferentes sons de alarme para o final de cada ciclo.
  * **Progressive Web App (PWA)**:
      * **Instalável** em desktops e dispositivos móveis para uma experiência nativa.
      * Funciona **100% offline**.
  * **Temas Claro e Escuro**: Alterne entre os temas para maior conforto visual.
  * **Atalhos de Teclado**:
      * `Barra de Espaço`: Iniciar / Pausar
      * `S`: Parar o timer atual
      * `Alt + P`: Mudar para modo Pomodoro
      * `Alt + C`: Mudar para modo Pausa Curta
      * `Alt + L`: Mudar para modo Pausa Longa
  * **Favicon Dinâmico**: O ícone na aba do navegador muda para refletir o estado do timer.

### III. Estrutura e Tecnologias

#### Estrutura de Pastas

```
concentrare/
│
├── 📄 index.html
├── 📄 manifest.json
├── 📄 sw.js
├── 📄 README.md
│
├── 📁 css/
│   └── 📄 style.css
│
├── 📁 js/
│   └── 📄 script.js
│
└── 📁 assets/
    ├── 📁 images/       (ícones para o PWA)
    └── 📁 sounds/
        ├── 📁 ambient/  (sons de fundo em loop)
        └── (arquivos de alarme)
```

#### Tecnologias Utilizadas

  * **HTML5**
  * **CSS3** (Flexbox, Variáveis CSS, Media Queries)
  * **JavaScript (ES6+)** (Vanilla JS, sem frameworks)
  * **Web Audio API**
  * **Bootstrap 5** (Modals e Ícones)
  * **PWA** (Service Worker & Web App Manifest)

-----

### IV. Guia de Instalação e Execução

Para rodar este projeto localmente, é necessário um servidor web para que as funcionalidades de PWA (Service Worker) funcionem corretamente.

1.  **Pré-requisitos:**

      * Git para clonar o repositório.
      * Um editor de código (ex: VS Code).
      * A extensão **Live Server** para o VS Code (recomendado).

2.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/concentrare.git
    ```

3.  **Navegue até a pasta do projeto:**

    ```bash
    cd concentrare
    ```

4.  **Forneça os Assets:**

      * Adicione os ícones da aplicação na pasta `assets/images/`.
      * Adicione os arquivos de som de alarme e de ambiente (`.mp3`) nas pastas correspondentes em `assets/sounds/`.

5.  **Inicie um Servidor Local:**

      * No VS Code, clique com o botão direito no arquivo `index.html` e selecione "Open with Live Server".

-----

### V. Licença

Distribuído sob a Licença MIT.