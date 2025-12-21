# TGIF Project Control Dashboard - Design Guidelines

## Design Approach: Enterprise Dashboard System
**Selected Framework**: Material Design (data-heavy enterprise application)
**Justification**: Information-dense project management requiring clear hierarchy, robust data display, and operational efficiency.

## Core Design Elements

### A. Typography
- **Primary Font**: Inter or Roboto via Google Fonts CDN
- **Hierarchy**:
  - Page titles: text-2xl font-semibold
  - Section headers: text-lg font-medium
  - Card titles: text-base font-medium
  - Body text: text-sm
  - Metadata/labels: text-xs text-gray-600

### B. Layout System
**Spacing Units**: Tailwind units 2, 4, 6, 8, 12 (e.g., p-4, gap-6, m-8)
- Standard card padding: p-6
- Section spacing: space-y-8
- Grid gaps: gap-6
- Component margins: mb-6

**Structure**:
- Fixed sidebar navigation (w-64)
- Main content area with max-w-7xl container
- Responsive grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

### C. Component Library

**Navigation**:
- Left sidebar with grouped menu items (Initiatives, Workflows, Deliverables, Tracking)
- Active state with left border indicator
- Icon + label pattern

**Dashboard Cards**:
- Agent/workflow status cards with:
  - Header: Name + status badge
  - Quick metrics (3-4 key numbers)
  - Action buttons (View, Configure, Logs)
  - Last updated timestamp
- Use shadow-sm, rounded-lg, border

**Data Tables**:
- Striped rows for franchise group tracking
- Sortable columns
- Inline status badges
- Quick action icons on hover
- Pagination for large datasets

**Status Indicators**:
- Badge components: Running (green), Loaded (blue), Error (red), Pending (yellow)
- Progress bars for rollout tracking
- Health indicators with icon + text

**Control Panels**:
- Toggle switches for agent activation
- Grouped action buttons
- Configuration forms with clear labels
- Inline validation states

**Deliverables Repository**:
- File card grid layout
- Preview thumbnails
- Download/share actions
- Filter by type/date sidebar

**Issue Tracker**:
- Kanban-style columns (Open, In Progress, Resolved)
- Priority tags
- Assigned user avatars
- Expandable detail view

### D. Animations
Minimal and purposeful:
- Sidebar collapse/expand transition
- Loading spinners for data fetch
- Toast notifications for actions
- No decorative animations

## Page Structure

**Dashboard Home**:
- Stats overview row (4 metric cards)
- Agent status grid (2-3 columns)
- Recent activity timeline
- Quick access to rollout tracker

**Initiatives View**:
- Filterable list of all initiatives
- Status summary panel
- Shared sheets integration panel

**Rollout Tracker**:
- Master schedule table
- Franchise group cards with progress
- Site survey checklist
- Integration status matrix

**Deliverables**:
- Organized by category tabs
- Grid layout with search/filter
- Upload new deliverable CTA

## Images
No hero images - this is a functional dashboard. Use icons from Heroicons throughout for navigation, status, and actions. Small illustrative graphics for empty states only.