# Galaxy - AI-Powered Workflow Automation

Galaxy is a modern, enterprise-grade workflow automation platform built with **Next.js 16**, **Tailwind CSS** , **Transloadit** and **Trigger.dev**. It empowers users to build, manage, and execute complex workflows with seamless AI integration and robust background task processing.

## 🚀 Key Features

- **Visual Workflow Builder**: A powerful drag-and-drop interface powered by [XYFlow](https://xyflow.com/), designed for high performance and customizability.
- **Native AI Integration**: Out-of-the-box support for **Google Gemini AI** for intelligent data processing, visual analysis, and automated decision-making.
- **Robust Execution Engine**: Powered by [Trigger.dev](https://trigger.dev/v3), supporting long-running background tasks, retries, and complex job orchestration.
- **Media Processing Capabilities**: Integrated support for **FFmpeg** and **Transloadit** for video and image manipulation directly within workflows.
- **Hierarchical Organization**: Organized asset management with a nested folder system and intuitive dashboard.
- **Full Execution History**: Detailed tracking of every workflow run, including node-level status, input/output data, and error logs.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Runtime**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Prisma](https://www.prisma.io/) with [PostgreSQL](https://www.postgresql.org/)
- **Background Jobs**: [Trigger.dev v3](https://trigger.dev/)
- **AI Engine**: [Google Generative AI (Gemini)](https://ai.google.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Notifications**: [Sonner](https://sonner.stevenly.me/)

## 📂 Project Structure

- `src/app/`: Next.js App Router (Layouts, Pages, and API routes).
- `src/components/`:
  - `dashboard/`: Components for workflow and folder management.
  - `workflow/`: Core components for the visual builder (nodes, primitives, panels).
  - `ui/`: Shared Shadcn-based UI components.
- `src/trigger/`: Trigger.dev task definitions (LLM tasks, image/video processing).
- `src/lib/`: Core utilities (API client, Database client, DAG execution logic).
- `src/stores/`: Zustand stores for workflow state and persistence.
- `prisma/`: Database schema and generated Prisma client.

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js**: latest LTS
- **pnpm**: Required (Project strictly uses pnpm)
- **PostgreSQL**: Local or hosted instance

### 1. Installation
```bash
pnpm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory and configure according to project


### 3. Database Initialization
This project uses a custom output path for the Prisma client.
```bash
pnpm prisma generate
pnpm prisma db push
```

### 4. Running Development Server
```bash
pnpm dev
```

The application will be accessible at `http://localhost:3000`.



## 🧩 Important Notes

- **Custom Prisma Path**: The Prisma client is generated into `prisma/generated/prisma`. Ensure all imports use this path.
- **Trigger.dev Tasks**: Background tasks are defined in `src/trigger` and must be synced with Trigger.dev for remote execution.
- **Bleeding Edge**: This project uses Next.js 16 and React 19, taking advantage of the latest web features and performance optimizations.

---

Built with precision and power. 🌌

