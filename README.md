# CONCENTRARE - Sistema Pomodoro 🍅

Um dashboard de produtividade completo e moderno, baseado na técnica Pomodoro. Projetado para maximizar o foco e organizar suas tarefas através de uma interface limpa, responsiva, acessível e instalável.

### I. Visão Geral e Filosofia do Projeto

**CONCENTRARE** foi concebido para ser mais do que um simples timer: é um ambiente de foco completo. A aplicação foi desenvolvida com base em quatro pilares arquitetônicos:

1.  **Modularidade Visual:** A interface é dividida em componentes lógicos e independentes: um `header` para navegação e configurações, e dois "cards" (`widgets`) principais para o **Timer** e as **Tarefas**. Essa separação clara de responsabilidades resulta em uma experiência de usuário mais limpa e organizada, especialmente em telas maiores.

2.  **Estado Centralizado no Cliente:** A aplicação opera como uma **Single Page Application (SPA)** pura, sem a necessidade de um backend. Todo o estado — configurações, tarefas, tema visual, histórico — é gerenciado por variáveis JavaScript e persistido de forma segura no navegador do usuário através da `localStorage API`. Isso garante que a aplicação seja extremamente rápida e que os dados do usuário sejam mantidos entre as sessões.

3.  **Experiência Offline-First (PWA):** O CONCENTRARE é um **Progressive Web App (PWA)**. Através de um **Service Worker**, todos os recursos essenciais (arquivos, estilos, sons) são armazenados em cache local. Isso significa que, após a primeira visita, a aplicação carrega instantaneamente e **funciona perfeitamente mesmo sem conexão com a internet**, garantindo que a produtividade do usuário nunca seja interrompida.

4.  **Acessibilidade (a11y) por Design:** A acessibilidade foi um requisito central. O uso de atributos `aria-label` para controles visuais e uma região `aria-live` para anunciar mudanças de estado dinamicamente garante que usuários que dependem de leitores de tela possam interagir com todas as funcionalidades da aplicação de forma plena e eficaz.

### II. Funcionalidades Detalhadas

Cada funcionalidade foi implementada com foco em robustez, performance e experiência do usuário.

#### O Temporizador (Núcleo)

O coração da aplicação é um timer preciso e visualmente informativo.

  * **Lógica de Controle:** A contagem é gerenciada por `setInterval`, garantindo eficiência ao ser criada apenas quando o timer está ativo (`startTimer`) e destruída (`clearInterval`) ao ser pausado, parado ou ao trocar de modo.
  * **Progresso Visual:** O anel de progresso é uma animação SVG fluida. A cada segundo, a propriedade CSS `stroke-dashoffset` do círculo é recalculada com base na porcentagem de tempo decorrido, oferecendo um feedback visual intuitivo.

#### Sistema de Áudio Híbrido

Para oferecer a melhor experiência sonora, a aplicação utiliza duas tecnologias de áudio distintas:

  * **Alarmes (One-Shot):** Para os alertas de fim de ciclo, que são sons curtos e únicos, são utilizadas tags `<audio>` padrão do HTML pela sua simplicidade e confiabilidade.
  * **Sons de Ambiente (Loop Contínuo):** Para os sons de fundo, que exigem um loop perfeito, foi implementada a **Web Audio API**. Este sistema avançado carrega os sons na memória (`AudioBuffer`), permitindo que sejam tocados em um loop **matematicamente preciso e sem nenhum "engasgo" ou delay**, algo que a tag `<audio>` sozinha não consegue garantir.

#### Gerenciador de Tarefas

  * **Baseado em Estado:** As tarefas são mantidas em um array de objetos `tasks`. A interface é uma representação direta desse array, sendo completamente reconstruída pela função `renderTasks` sempre que o estado muda.
  * **Interatividade Eficiente:** Para evitar a sobrecarga de múltiplos `event listeners`, a aplicação utiliza **delegação de eventos**. Um único listener é anexado à lista `<ul>`, gerenciando cliques em checkboxes e botões de exclusão de qualquer tarefa, presente ou futura.
  * **Código Defensivo:** A função `loadTasks` que carrega os dados do `localStorage` foi programada para "sanitizar" os dados, filtrando e removendo quaisquer tarefas corrompidas ou malformadas de versões antigas da aplicação, prevenindo bugs.

#### Progressive Web App (PWA)

  * **`manifest.json`**: Fornece a "identidade" da aplicação (nome, ícones, cores), permitindo que o navegador ofereça a opção de **instalação** no desktop ou celular.
  * **`sw.js` (Service Worker)**: Atua como um proxy de rede. No evento `install`, ele proativamente armazena em cache todos os arquivos vitais. No evento `fetch`, ele intercepta as requisições e serve os arquivos diretamente do cache, garantindo o funcionamento offline.

-----

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
    ├── 📁 images/
    └── 📁 sounds/
        ├── 📁 ambient/
        └── (arquivos de alarme)
```

#### Tecnologias Utilizadas

  * **HTML5**
  * **CSS3** (Flexbox, Variáveis CSS, Media Queries)
  * **JavaScript (ES6+)** (Vanilla JS, sem frameworks)
  * **Web Audio API**
  * **Bootstrap 5** (Modals e Ícones)
  * **PWA** (Service Worker & Manifest)

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

      * Adicione os ícones da aplicação (`icon-192x192.png`, `icon-512x512.png`) na pasta `assets/images/`.
      * Adicione os arquivos de som de alarme e de ambiente (`.mp3`) nas pastas correspondentes em `assets/sounds/`.

5.  **Inicie o Servidor Local:**

      * No VS Code, clique com o botão direito no arquivo `index.html` e selecione "Open with Live Server".

-----

### V. Licença

Este projeto está sob a Licença MIT.