# AgentForge: Visual AI Workflow Automations

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React Flow](https://img.shields.io/badge/React_Flow-11.11-FF0072?logo=react&logoColor=white)](https://reactflow.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&logoColor=white)](https://clerk.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](https://opensource.org/licenses/MIT)

Hey! I'm Aman. I built **AgentForge** to democratize the creation of complex AI agents. Writing boilerplate code to connect LLMs, databases, and APIs is repetitive and difficult to maintain. I engineered a visual, node-based execution engine that allows developers and creators to design, test, and deploy intelligent AI workflows entirely through a drag-and-drop canvas.

---

## 🧩 The Problem & Solution

**The Problem:** Building capable AI agents usually requires complex scripting, managing state between API calls, handling context windows, and building custom routing logic. Visualizing how data flows from a trigger to an LLM and finally to a database is highly abstract and prone to breaking.

**The Solution:** AgentForge acts as a visual IDE for AI. It features a custom-built React Flow canvas where users can visually connect Webhooks, Llama 3.1 AI models, Web Scrapers, Logic Routers, and Databases. The backend parses this visual graph into an executable JSON payload, processing the logic seamlessly and returning real-time execution logs.

---

## 🏗️ System Architecture & Data Flow

I designed the execution engine to dynamically parse UI nodes into backend logic. When an agent is triggered, the engine steps through the graph, substituting variables and handling external API calls autonomously.

```text
[Webhook / Schedule] ──(Trigger)──> [AgentForge Execution Engine]
                                          │
                                          ▼
                             [Graph Parsing & Validation]
                             ├─ 1. Variable Injection ({{trigger}})
                             └─ 2. Node Execution Routing
                                          │
        ┌─────────────────────────────────┴─────────────────────────────────┐
        ▼                                 ▼                                 ▼
 [AI & Scrapers]                   [Logic & Flow]                  [Actions & Storage]
 (Groq / Tavily)                 (If/Else, Loops)                 (Postgres / Discord)
        │                                 │                                 │
        └─────────────────────────────────┼─────────────────────────────────┘
                                          ▼
                            [Live Terminal Execution Logs]
                            (Real-time Visual Feedback)
```

---

## 📸 System in Action

### 1. The Marketing Landing Page
A high-converting, modern SaaS landing page featuring smooth scrolling, interactive marquees, and a psychological pricing layout.

![Landing Page](assets/01-landing-page.png)

### 2. Secure Authentication
Enterprise-grade, SOC2 compliant authentication powered by Clerk, ensuring user workspaces and API configurations remain completely private.

![Clerk Auth](assets/02-auth-clerk.png)

### 3. The Agents Dashboard
The central command center. Users can track total executions, monitor system status, and search, manage, or create new Agent workflows.

![Agents Dashboard](assets/03-dashboard-agents.png)

### 4. Visual Node Builder (Canvas)
The core product. A highly interactive drag-and-drop canvas with custom-designed nodes categorized by Triggers, Logic, AI, Actions, and Storage.

![Canvas Builder](assets/04-canvas-builder.png)

### 5. Advanced Node Configuration
Demonstrating the dynamic input fields, dropdowns, and variable injection (`{{trigger}}`, `{{llm}}`) that allow nodes to pass data seamlessly to one another.

![Node Configuration](assets/05-node-configuration.png)

### 6. Live Execution Terminal
A custom-built, auto-scrolling terminal modal that provides real-time, step-by-step logs of the backend execution engine. Features CSS animations that highlight nodes as they are processed.

![Execution Terminal](assets/06-live-execution-terminal.png)

### 7. AI Security Gateway
An integrated middleware node that scans inputs for Prompt Injections, PII leaks, and Toxicity before it ever reaches the LLM, enabling safe dual-path routing.

![AI Security Node](assets/07-ai-security-node.png)

---

## 📂 Project Structure

```text
agent-forge/
├── app/
│   ├── api/                   # Next.js API Routes (Agents, Execution Engine)
│   ├── builder/               # The React Flow Canvas workspace
│   ├── privacy/               # Legal & Privacy pages
│   ├── terms/                 # Terms of Service
│   ├── globals.css            # Tailwind & Custom Animation CSS
│   ├── layout.tsx             # Root layout with Clerk Provider
│   └── page.tsx               # Hybrid Landing Page & Dashboard
├── components/
│   ├── nodes/                 # Custom React Flow Node Components
│   │   ├── AISecurityNode.tsx
│   │   ├── LLMNode.tsx
│   │   ├── WebhookNode.tsx
│   │   └── ...
│   └── Sidebar.tsx            # Draggable node library
├── prisma/
│   ├── migrations/            # Database version control
│   └── schema.prisma          # PostgreSQL Schema (Users, Agents, Logs)
├── .env.example               # Template for required API keys
├── docker-compose.yml         # Local Postgres & Redis setup
├── middleware.ts              # Clerk Auth edge routing protection
├── package.json               # Project dependencies
└── README.md                  # Project documentation
```

---

## ⚖️ Architecture Tradeoffs & Design Choices

* **React Flow JSON State vs. Deep Relational Tables:** I chose to store the visual canvas state (nodes and edges) as a serialized `JSONB` block in PostgreSQL rather than breaking them down into individual relational rows. *Tradeoff:* This prevents complex cross-node SQL queries, but allows for lightning-fast reads/writes, trivial versioning, and eliminates complex table joins for UI rendering.
* **Serverless Next.js API vs. Long-Running Backend:** The execution engine runs on Next.js Edge/Serverless API routes. *Tradeoff:* This makes deployment to Vercel incredibly easy and scales infinitely from day one. However, serverless architectures have timeout limits (10s - 60s), meaning extremely long-running AI workflows would eventually require transitioning to the included BullMQ/Redis background job architecture.
* **Clerk Auth vs. Custom JWT:** Delegated authentication to Clerk middleware. *Tradeoff:* Introduces third-party dependency, but instantly grants SOC2 compliance, multi-session management, and enterprise-grade security without reinventing the wheel.

---

## 🚀 Get it Running Locally

### 1. Clone & Setup

```bash
git clone [https://github.com/iamanpathak/agent-forge.git](https://github.com/iamanpathak/agent-forge.git)
cd agent-forge

# Install dependencies
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and copy the contents from `.env.example`. You will need to provision keys for Clerk (Auth), Groq (LLM), and Tavily (Search).

### 3. Database Setup
Start the local PostgreSQL database using Docker, then push the Prisma schema:

```bash
docker-compose up -d
npx prisma db push
```

### 4. Launch the Application
Start the Next.js development server:

```bash
npm run dev
```
Navigate to `http://localhost:3000` to access AgentForge.

---

## ☁️ Deployment (Vercel)
AgentForge is fully optimized for Vercel deployment. 
1. Import the repository into Vercel.
2. Add your `.env` variables in the Vercel project settings.
3. Provision a cloud PostgreSQL database (e.g., Neon or Supabase) and update your `DATABASE_URL`.
4. Deploy!

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

<p align="center">
  Made with ❤️ by <a href="https://github.com/iamanpathak">Aman Pathak</a>
</p>