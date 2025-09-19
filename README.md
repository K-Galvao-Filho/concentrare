# EstudoFOCADO - Pomodoro Produtivo 🍅

Um temporizador Pomodoro moderno, completo e instalável, com lista de tarefas, relatórios e temas. Projetado para ajudar a manter o foco e aumentar a produtividade, com uma interface limpa e agradável inspirada no Pomofocus.

*(Sugestão: substitua o link acima por uma captura de tela da sua própria aplicação em funcionamento)*

## ✨ Funcionalidades

  * **Temporizador Pomodoro Completo**: Modos de Foco (Pomodoro), Pausa Curta e Pausa Longa.
  * **Totalmente Configurável**: Ajuste a duração de cada modo, a quantidade de pomodoros por ciclo e o número total de ciclos através de um modal de configurações.
  * **Lista de Tarefas (To-Do List)**: Adicione, conclua e delete tarefas para cada sessão. Seus dados são salvos localmente no navegador.
  * **Relatórios e Estatísticas**: Acompanhe sua produtividade com um relatório simples de pomodoros concluídos hoje e no total.
  * **Progressive Web App (PWA)**: Instale a aplicação no seu desktop ou celular e use-a offline, como um aplicativo nativo.
  * **Temas Claro e Escuro**: Alterne entre os temas para melhor conforto visual. Sua preferência é salva.
  * **Acessibilidade (a11y)**: Suporte a leitores de tela com `aria-labels` e anúncios de status via `aria-live`.
  * **Notificações e Sons**: Receba notificações do navegador ao final de cada ciclo e escolha entre diferentes sons de alarme.
  * **Favicon Dinâmico**: O ícone na aba do navegador muda para refletir o estado atual do timer (rodando, pausado ou parado).
  * **Atalhos de Teclado**: Controle o timer de forma rápida usando o teclado (`Espaço` para iniciar/pausar, etc.).
  * **Design Responsivo**: Funciona perfeitamente em desktops, tablets e celulares.

## 🛠️ Tecnologias Utilizadas

  * **HTML5**: Estrutura semântica e acessível.
  * **CSS3**: Estilização moderna com Variáveis CSS para temas e layout Flexbox.
  * **JavaScript (ES6+)**: Toda a lógica da aplicação, manipulação do DOM e gerenciamento de estado.
  * **Bootstrap 5**: Utilizado para os componentes de Modal e o sistema de Ícones.
  * **Service Worker**: Para cache e funcionalidades offline do PWA.

## 🚀 Como Executar o Projeto

Para executar este projeto localmente, você precisará de um servidor web simples. A forma mais fácil é usando a extensão **Live Server** no Visual Studio Code.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    ```
2.  **Navegue até a pasta do projeto:**
    ```bash
    cd seu-repositorio
    ```
3.  **Abra com o Live Server:**
      * Se você tem a extensão Live Server no VS Code, clique com o botão direito no arquivo `index.html` e selecione "Open with Live Server".

## 📁 Estrutura de Pastas

O projeto está organizado da seguinte forma para facilitar a manutenção:

```
pomodoro-app/
│
├── 📄 index.html         # Arquivo principal da aplicação
├── 📄 manifest.json     # Configurações do PWA
├── 📄 sw.js              # Service Worker para funcionamento offline
│
├── 📁 assets/
│   ├── 📁 images/         # Ícones do PWA (ícone-192x192.png, etc.)
│   └── 📁 sounds/         # Arquivos de som do alarme (notification.mp3, etc.)
│
├── 📁 css/
│   └── 📄 style.css       # Estilos customizados
│
└── 📁 js/
    └── 📄 script.js       # Lógica principal da aplicação
```

## 🔮 Futuras Melhorias

  * Integração de um player de música ambiente (Lo-fi) para as sessões de foco.
  * Sincronização de tarefas e configurações entre dispositivos com um backend simples.
  * Gráficos mais detalhados nos relatórios de produtividade.

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

## 🙏 Agradecimentos

  * Ícones fornecidos pelo [Bootstrap Icons](https://icons.getbootstrap.com/).
  * Sons de notificação do [Mixkit](https://mixkit.co/).