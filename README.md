# Megasnem — Sistema de Análise e Backup de Mensagens SMS (Next.js Edition)

<div align="center">
  <img src="/samc_logo.jpg" alt="Megasnem Logo" width="120" style="border-radius: 50%;" />
  <p><strong>Aplicação Web Next.js 15+ com arquitetura dupla: mensageiro camuflado com estilo Google Mensagens (Material Design 3) e painel forense SAMC de backup e monitoramento de mensagens com IA (Google Gemini).</strong></p>
</div>

---

## 📌 1. Visão Geral do Projeto

O **Megasnem (SAMC)** é uma solução de auditoria e preservação de mensagens SMS reescrita nativamente para o ecossistema Web moderno com **Next.js 15 (App Router)**, **TypeScript** e **Tailwind CSS**. A aplicação reproduz fielmente a arquitetura dupla do projeto original:

1. **Modo Camuflado (Google Messages Experience - Padrão):**
   * Interface visual e paleta Material 3 idêntica ao Google Mensagens (dark theme com detalhes em pêssego `#F59F7A`).
   * Barra de pesquisa com logótipo oficial 4-cores da Google e avatar de utilizador.
   * Filtros de categoria (*Todas*, *Não lidas*, *Pessoais*, *Transações*).
   * Ecrã de Conversa com bolhas de chat SMS/RCS, assistente de escrita com IA, 3 respostas rápidas inteligentes contextuais (com agrupamento de mensagens picotadas), consultor conversacional, ditado por voz e eliminação puramente cosmética.
   * Navegação completa por sub-ecrãs: *Novo chat*, *Pesquisar*, *Chats RCS*, *Definições*, *Ações de deslize*, *Notificações*, *Avançadas*, *Arquivadas* e *Spam e bloqueadas*.
   * Ponto de acesso oculto protegido por PIN para o cofre forense.

2. **Modo Administrativo e Forense (Painel SAMC):**
   * Desbloqueado através de PIN de segurança (PIN padrão: `1234`).
   * **Mensagens (Recentes):** Filtragem por tipo (*Recebidas*, *Enviadas*, *Rascunhos*, *Preservadas*), seleção múltipla e exclusão em lote.
   * **Contactos:** Agrupamento por remetente/destinatário com volume e acesso direto à conversa.
   * **Backup:** Monitorização 24/7, exportação estruturada em JSON e TXT, varredura de mensagens, inspeção de código JSON em tempo real e log de deteção contínua.
   * **Anti-Spam:** Algoritmo heurístico para deteção de fraudes, pontuação de risco e parecer pericial com Google Gemini.
   * **Chat IA:** Assistente pericial com suporte a tabelas Markdown, resumos de volume, códigos bancários (M-Pesa) e ditado por voz.
   * **Enviar:** Emulador de envio de SMS com cálculo de partes (160 caracteres) e gravação instantânea em backup.
   * **Termux & Info:** Relatório de independência e acionador de rotinas bash.

---

## 🚀 2. Como Executar o Projeto

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (Porta 3000)
npm run dev

# Compilar para produção
npm run build
npm start
```

---

## 🔒 3. Acesso de Segurança Forense

* **Modo Camuflado Ativo:** A app abre por defeito na interface do Google Mensagens.
* **Desbloqueio:** Toque no menu de 3 pontos (ou em *Definições > Acesso de Segurança Forense*) e introduza o PIN `1234`.
* **Bloqueio Rápido:** No painel SAMC, toque no ícone de cadeado no topo para regressar instantaneamente ao modo camuflado.
