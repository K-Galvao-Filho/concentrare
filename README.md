# CONCENTRARE - Sistema Pomodoro 🍅

Um dashboard de produtividade completo e moderno, baseado na técnica Pomodoro. Projetado para maximizar o foco e organizar suas tarefas através de uma interface limpa, responsiva, personalizável e instalável.

## Tabela de Conteúdos

1.  Visão Geral e Filosofia do Projeto
2.  Funcionalidades Detalhadas
3.  Estrutura e Tecnologias
4.  Guia de Instalação e Execução
5.  Licença

-----

### I. Visão Geral e Filosofia do Projeto

**CONCENTRARE** é mais do que um simples timer: é um ambiente de foco completo construído com tecnologias web modernas. A aplicação combina um timer Pomodoro altamente configurável com um gerenciador de tarefas inteligente e sons de ambiente para criar um espaço de trabalho produtivo e sem distrações.

A arquitetura foi projetada com base em quatro pilares:

1.  **Modularidade:** A interface é dividida em componentes lógicos (`header`, `timer`, `tarefas`) e o código JavaScript é organizado em módulos (ES6 Modules) com responsabilidades únicas (`state`, `ui`, `timer`, `audio`, etc.), garantindo manutenibilidade e escalabilidade.
2.  **Estado Centralizado no Cliente:** É uma **Single Page Application (SPA)** pura. Todo o estado (configurações, tarefas, tema) é gerenciado no cliente e persistido através da `localStorage API`, garantindo rapidez e continuidade entre as sessões.
3.  **Experiência Offline-First (PWA):** Como um **Progressive Web App (PWA)**, todos os recursos essenciais são armazenados em cache por um **Service Worker**, permitindo que a aplicação carregue instantaneamente e funcione perfeitamente mesmo sem conexão com a internet.
4.  **Acessibilidade (a11y) por Design:** A aplicação foi desenvolvida com acessibilidade em mente, utilizando atributos `ARIA` e regiões `aria-live` para garantir uma experiência completa para usuários que dependem de leitores de tela.

### II. Funcionalidades Detalhadas

  * **Timer Pomodoro com Dois Modos de Operação**:
      * **Modo Padrão**: Segue a técnica Pomodoro tradicional com ciclos de foco e pausas curtas/longas.
      * **Modo Tarefa**: Ao selecionar uma tarefa, o timer se adapta à estimativa da tarefa, inserindo pausas de forma inteligente para manter o foco no objetivo.
  * **Sistema de Tarefas Avançado**:
      * **Estimativa de Pomodoros**: Defina quantos pomodoros cada tarefa necessita.
      * **Gerenciamento Completo**: Adicione, edite (com duplo clique), delete e marque tarefas como concluídas.
      * **Reordenação Drag & Drop**: Organize sua lista de tarefas arrastando-as.
      * **Fluxo de Trabalho Inteligente**: Reinicie tarefas concluídas ou, ao terminar uma, escolha entre iniciar a próxima ou voltar ao modo padrão através de um modal de decisão.
  * **Painel de Configurações Completo**:
      * **Automação**: Inicie pausas e/ou sessões de foco automaticamente.
      * **Modo Estrito**: Exija a seleção de uma tarefa antes de iniciar o timer para forçar o planejamento.
      * **Ação Pós-Tarefa**: Configure o que acontece ao concluir uma tarefa (perguntar, iniciar a próxima, ou voltar ao modo padrão).
      * **Controle de Áudio**: Ajuste volumes independentes para alarmes e sons de ambiente.
      * **Notificações**: Ative/desative notificações do navegador e escolha entre diferentes sons de alarme ou o modo silencioso.
  * **Relatórios Gráficos de Produtividade**:
      * Acompanhe seu progresso com estatísticas de pomodoros concluídos hoje e no total.
      * Visualize um **gráfico de barras** com sua produtividade nos últimos 7 dias. [A fazer]
  * **Sons de Ambiente e Alarmes**:
      * Escolha entre sons de fundo locais (Chuva, Floresta, etc.) ou do YouTube.
      * Opção de som de "tic-tac" para aumentar a sensação de foco.
  * **Progressive Web App (PWA)**:
      * **Instalável** em desktops e dispositivos móveis para uma experiência nativa.
      * Funciona **offline** (exceto para os sons do YouTube).
  * **Temas Claro e Escuro**: Alterne entre os temas para maior conforto visual.
  * **Atalhos de Teclado**:
      * `Barra de Espaço`: Iniciar / Pausar
      * `S`: Parar o timer atual
      * `Alt + P`: Mudar para modo Pomodoro
      * `Alt + C`: Mudar para modo Pausa Curta
      * `Alt + L`: Mudar para modo Pausa Longa

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
│   ├── 📄 style.css
│   └── (arquivos do Bootstrap)
│
├── 📁 js/
│   ├── 📄 main.js        (Controlador Principal, Eventos)
│   ├── 📄 timer.js       (Lógica do Timer e Ciclos)
│   ├── 📄 ui.js          (Manipulação do DOM e Interface)
│   ├── 📄 state.js       (Gerenciamento de Estado Central)
│   ├── 📄 dom.js         (Referências aos Elementos do DOM)
│   └── 📄 audio.js       (Controle de Áudio)
│
└── 📁 assets/
    ├── 📁 fonts/
    ├── 📁 images/
    └── 📁 sounds/
```

#### Tecnologias Utilizadas

  * **HTML5** (Semântico)
  * **CSS3** (Flexbox, Grid, Variáveis CSS, Media Queries)
  * **JavaScript (ES6+)** (Vanilla JS, Módulos)
  * **Web Audio API** (Para sons de ambiente em loop)
  * **Bootstrap 5** (Componentes de Modal e Ícones)
  * **Chart.js** (Para os gráficos de relatório)
  * **PWA** (Service Worker & Web App Manifest)

-----

### IV. Guia de Instalação e Execução

Para rodar este projeto localmente, é necessário um servidor web para que as funcionalidades de PWA (Service Worker) e os módulos ES6 funcionem corretamente.

1.  **Pré-requisitos:**

      * Git para clonar o repositório.
      * Um editor de código (ex: VS Code).
      * A extensão **Live Server** para o VS Code (recomendado).

2.  **Clone o repositório:**

    ```bash
    git clone https://github.com/kgfilho/concentrare.git
    ```

3.  **Navegue até a pasta do projeto:**

    ```bash
    cd concentrare
    ```

4.  **Forneça os Assets:**

      * Adicione os ícones da aplicação na pasta `assets/images/`.
      * Adicione os arquivos de som (`.mp3`) nas pastas correspondentes em `assets/sounds/`.
      * Garanta que os arquivos das bibliotecas (Bootstrap, Chart.js) estejam nos caminhos corretos ou use os links de CDN.

5.  **Inicie um Servidor Local:**

      * No VS Code, clique com o botão direito no arquivo `index.html` e selecione "Open with Live Server".

-----

### V. Licença

Distribuído sob a Licença MIT.