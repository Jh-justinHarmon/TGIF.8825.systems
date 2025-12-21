# TGIF Project Control Dashboard

## Overview

This is an enterprise project management dashboard designed for tracking initiatives, franchise group rollouts, deliverables, and issues. The application follows Material Design principles for data-heavy enterprise applications, providing clear information hierarchy and operational efficiency for project control workflows.

The system manages:
- **Initiatives** - Agents, workflows, and integrations with status tracking
- **Franchise Groups** - Multi-location business entities with rollout progress
- **Deliverables** - Documents, spreadsheets, and reports
- **Issues** - Problem tracking with priority and status management

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query for server state, React hooks for local state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful endpoints under `/api/` prefix
- **Server**: Single HTTP server serving both API and static files

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` - shared between frontend and backend
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod
- **Current Storage**: In-memory storage implementation (`MemStorage` class)
- **Database Ready**: Schema defined for PostgreSQL, configured via `DATABASE_URL`

### Project Structure
```
client/           # React frontend application
  src/
    components/   # Reusable UI components
    components/ui/# shadcn/ui primitives
    pages/        # Route page components
    hooks/        # Custom React hooks
    lib/          # Utilities and query client
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route definitions
  storage.ts      # Data storage interface and implementation
shared/           # Shared types and schemas
  schema.ts       # Drizzle schema definitions
```

### Key Design Patterns
- **Schema-first approach**: Drizzle schemas define both database structure and TypeScript types
- **Insert schemas**: Separate Zod schemas for insert operations (omitting auto-generated fields)
- **Storage interface**: `IStorage` interface abstracts data operations, enabling easy swap between memory and database
- **Component composition**: Card-based UI components for consistent data display

## External Dependencies

### Database
- **PostgreSQL**: Primary database (configured via `DATABASE_URL` environment variable)
- **Drizzle Kit**: Database migration and push tooling

### UI Framework
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel functionality
- **React Day Picker**: Calendar/date picker

### Data & Forms
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling
- **Zod**: Schema validation

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Class Variance Authority**: Component variant management
- **tailwind-merge**: Utility class merging

### Development
- **Vite**: Development server and build tool
- **tsx**: TypeScript execution for development
- **esbuild**: Production server bundling