# 🎮 LootTracker - Dashboard

![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=next.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

> **LootTracker** é um ecossistema de gerenciamento financeiro inteligente projetado para pessoas que precisam monitorar lucros (loots) e despesas de seus automoveis em tempo real com uma interface futurista e alta performance.

---

## ✨ Funcionalidades Core

### 🔐 Sistema de Acesso Dual
* **Modo Admin:** Controle total. Inserção de dados, exclusão de registros e atualização de saldo.
* **Modo Visitante:** Acesso seguro para visualização (Read-Only). Perfeito para visualização, permitindo que usuários vejam o sistema em funcionamento sem comprometer a integridade do banco de dados real.

### 📊 Análise de Desempenho Inteligente
* **Filtros Avançados:** Visualize dados de **Hoje, 7 Dias, 30 Dias** ou o histórico completo.
* **Gráficos Neon:** Visualização de tendências usando **Recharts**, mostrando a curva de lucros vs. despesas com áreas degradê estilizadas.
* **Cálculos Dinâmicos:** Cards de resumo que se recalculam instantaneamente baseados nos filtros de data aplicados.

### 🛠️ Gestão de Dados (CRUD)
* Registro categorizado (Gasolina, Manutenção, Lucros Diários).
* Histórico detalhado com formatação de data brasileira.
* Exclusão de registros com **Modal de Confirmação Estilizado** para evitar ações acidentais.

### 📱 Experiência Mobile (PWA)
* Totalmente responsivo e otimizado para celulares.
* Cabeçalho inteligente que adapta botões para ícones em telas pequenas.
* Pronto para ser adicionado à tela de início como um aplicativo nativo.

---

## 🚀 Tech Stack

* **Framework:** [Next.js 14/15](https://nextjs.org/) (App Router)
* **Banco de Dados:** [Supabase](https://supabase.com/) (PostgreSQL)
* **Autenticação:** Supabase Auth com persistência de sessão.
* **Estilização:** Tailwind CSS + Shadcn/UI.
* **Gráficos:** Recharts.
* **Ícones:** Lucide React.

---

## 🛠️ Configuração e Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/loottracker.git](https://github.com/bryan-fullstack/loottracker.git)
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente (.env.local):**
    ```env
    NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

---

## 🛡️ Segurança (RLS)

O projeto utiliza **Row Level Security (RLS)** no Supabase. Isso garante que, mesmo que alguém tente burlar o frontend, o banco de dados só permite escritas se o usuário estiver autenticado com o e-mail administrativo configurado. 

---

## 📸 Preview do Projeto

<div align="center">
  <table>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/a538c14e-f4f7-4995-a089-cc2786f80d09" width="250px" /></td>
      <td><img src="https://github.com/user-attachments/assets/9f04a3df-b3f6-4d7c-a6c6-650a95cc6c9b" width="250px" /></td>
      <td><img src="https://github.com/user-attachments/assets/b48ec1c8-c96c-432b-90d2-6e6c004133ea" width="250px" /></td>
    </tr>
  </table>
</div>

---

## 🚀 Live Demo

Acesse o projeto online: 🔗 [**VISITAR LOOTTRACKER**](https://loot-tracker-seven.vercel.app/dashboard)

---

## 💡 Pensamento

> "A curiosidade é o motor que impulsiona o conhecimento, mas é a execução que transforma o loot em legado." 🚀

---

## 📬 Contato

Se você gostou deste projeto ou quer trocar uma ideia sobre desenvolvimento, sinta-se à vontade para me chamar:

* **📧 Gmail:** [bryand.720@gmail.com]
* **🔗 LinkedIn:** [www.linkedin.com/in/bryan-daniel-pereira-b5a3241b7]

---

Criado com amor ❤️ por **Bryan Pereira**
