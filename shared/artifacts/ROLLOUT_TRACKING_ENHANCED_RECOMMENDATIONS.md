# Enhanced Rollout Tracking Recommendations

**Based on Toast Rollout Tracker analysis**  
**Date:** December 31, 2025

---

## Key Insights from Toast Rollout Tracker

The Toast Rollout Tracker (97 stores, 15 active projects) uses a much more sophisticated tracking system with:

### 1. Project Health Indicators
- **On Track** - No issues
- **Some Risk** - Minor concerns
- **At Risk** - Major blockers

### 2. Project Status Stages
- Configuration
- Training
- Live
- On Hold (with reason tracking)

### 3. Install Types
- **Onsite** - Full on-site installation
- **Remote** - Remote installation
- **Self Install** - Store self-installs

### 4. Service Appointment Tracking
Multiple service types per store:
- Remote Install
- Onsite Install
- Remote Staff Training
- Onsite Combined Training
- Onsite Go Live Support (35 appointments)
- Remote Go-Live Support (4 appointments)
- Remote Manager Training

### 5. Hardware Order Management
- Order Number
- Order Status (Shipped / Open - Activated)
- Tracking Number
- Customer Requested Delivery Date

### 6. Owner/Coordinator Assignment
- Each project has assigned owner (e.g., "Tiana Awerbuch")
- Enables accountability and workload tracking

---

## Recommended Enhancements to Unified Template

### Enhanced Rollout Calendar Columns

**Current columns (12):**
1. Stores Complete
2. Week #
3. Go-Live Date
4. Day
5. Franchise Group
6. Location / Store Code
7. Toast Onsite Day-of
8. Toast Onsite Friday
9. Toast Onsite Saturday
10. Status
11. Primary Contact
12. Notes

**Recommended additions (8 new columns):**

13. **Project Health** (Dropdown: On Track / Some Risk / At Risk)
14. **Project Status** (Dropdown: Planning / Configuration / Training / Live / On Hold)
15. **Install Type** (Dropdown: Onsite / Remote / Self Install)
16. **Project Owner** (Text: Assigned coordinator)
17. **Hold Reason** (Text: Why delayed, if applicable)
18. **Hardware Order #** (Text: Toast order number)
19. **Hardware Status** (Dropdown: Not Ordered / Ordered / Shipped / Delivered)
20. **Hardware Tracking #** (Text: Shipping tracking number)

**Total: 20 columns** (comprehensive project management)

---

## Enhanced Service Appointments Tracking

### New Sheet: Service Appointments

Track all service appointments separately from main calendar:

| Column | Purpose | Example |
|--------|---------|---------|
| **Store Code** | Link to main calendar | 62644-LAUDERHILL, FL |
| **Franchise Group** | Group name | Atlanta Restaurant Partners, LLC [Jackmont] |
| **Service Type** | Type of appointment | Onsite Go Live Support |
| **Scheduled Date** | When scheduled | 1/20/2026 |
| **Duration** | Hours | 8 hours |
| **Service Provider** | Who's doing it | Toast Contractor / Internal Team |
| **Status** | Appointment status | Scheduled / Completed / Cancelled |
| **Notes** | Additional info | |

**Service Types to track:**
- Remote Install
- Onsite Install
- Remote Staff Training
- Onsite Combined Training
- Onsite Go Live Support (Day-of)
- Remote Go-Live Support
- Remote Manager Training
- Follow-up Support

---

## Enhanced Hardware Tracking

### New Sheet: Hardware Orders

Separate sheet for hardware order management:

| Column | Purpose | Example |
|--------|---------|---------|
| **Store Code** | Link to main calendar | 62644-LAUDERHILL, FL |
| **Franchise Group** | Group name | Atlanta Restaurant Partners, LLC [Jackmont] |
| **Order Number** | Toast order # | 13337558 |
| **Order Date** | When ordered | 7/15/2025 |
| **Order Status** | Current status | Shipped |
| **Payment Method** | How paid | ACH on Shipping |
| **Tracking Number** | Shipping tracking | 391755428377 |
| **Requested Delivery Date** | Target date | 8/5/2025 |
| **Actual Delivery Date** | When received | 8/6/2025 |
| **Hardware Items** | What was ordered | 5x Handhelds, 2x Terminals, 1x KDS |

---

## Conditional Formatting Enhancements

### Project Health Color Coding
- **On Track**: Green background
- **Some Risk**: Yellow background
- **At Risk**: Red background

### Project Status Color Coding
- **Planning**: Light blue
- **Configuration**: Light yellow
- **Training**: Light orange
- **Live**: Light green
- **On Hold**: Light red

### Hardware Status Alerts
- **Not Ordered** (< 30 days to go-live): Red text
- **Ordered** (< 14 days to go-live): Yellow highlight
- **Shipped**: No color
- **Delivered**: Green text

---

## Updated Template Structure

### Sheet 1: Rollout Calendar (20 columns)
Main project tracking with enhanced status, health, and hardware tracking

### Sheet 2: Restaurants Master List (7 columns)
Store directory with contact information

### Sheet 3: Franchise Group Go-Live Order (6 columns)
Group-level rollout sequencing

### Sheet 4: Service Appointments (8 columns) **NEW**
Detailed service appointment tracking

### Sheet 5: Hardware Orders (10 columns) **NEW**
Hardware procurement and delivery tracking

---

## Implementation Priority

### Phase 1: Critical Enhancements (Do Now)
1. Add **Project Health** column to Rollout Calendar
2. Add **Project Status** column to Rollout Calendar
3. Add **Project Owner** column to Rollout Calendar
4. Update conditional formatting for health/status

### Phase 2: Hardware Tracking (Next Week)
1. Create Hardware Orders sheet
2. Populate with known order data
3. Link to Rollout Calendar

### Phase 3: Service Appointments (Week 2)
1. Create Service Appointments sheet
2. Map out all service types needed per store
3. Schedule appointments based on go-live dates

---

## Questions for Becky

1. Do we want to track project health at this level of detail?
2. Who will be the project owners/coordinators for each franchisee group?
3. Do we need to track hardware orders separately or is this handled by Toast?
4. Should we track multiple service appointment types per store?
5. Do we need to track post-go-live support appointments (30/60/90 day check-ins)?

---

## Next Steps

1. **Review with Becky** - Determine which enhancements to implement
2. **Update unified template** - Add approved columns/sheets
3. **Populate enhanced data** - Fill in project health, owners, hardware status
4. **Train operations team** - Show how to use enhanced tracking
5. **Set up weekly update process** - Define who updates what and when
