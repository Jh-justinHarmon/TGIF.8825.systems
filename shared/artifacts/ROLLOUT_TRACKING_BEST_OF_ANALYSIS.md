# Rollout Tracking "Best Of" Analysis

**Date:** December 31, 2025  
**Purpose:** Combine strengths of two rollout tracking templates into unified template for TGIF Phase 2

---

## Template Comparison

### Template A: Generic 2026 TGIF Go-Live Rollout
- **Rows:** 61 stores
- **Sheets:** 3 (Rollout Calendar, Restaurants, Franchise Group Go-Live Order)
- **Data Status:** Placeholder/template (all "TBD")
- **Structure:** Multi-sheet with reference data

### Template B: Jackmont 2026 TGIF Go-Live Rollout
- **Rows:** 19 stores (Jackmont group only)
- **Sheets:** 2 (Rollout Calendar, Sheet4)
- **Data Status:** Populated with real Jackmont data
- **Structure:** Single franchisee group focus

---

## Column Structure (Identical in Both)

Both templates use the same 10 columns:

1. **Stores Complete** — Running count of stores completed
2. **Week #** — Rollout week number
3. **Go-Live Date** — Actual go-live date
4. **Day** — Day of week (Tue/Wed)
5. **Franchise Group** — Franchisee group name
6. **Location / Store Code** — Store identifier with location
7. **Toast Onsite Day-of** — Toast support on go-live day
8. **Toast Onsite Friday** — Toast support on Friday
9. **Toast Onsite Saturday** — Toast support on Saturday
10. **Notes** — Additional notes/comments

---

## Key Differences

### Template A Strengths
✅ **Multi-sheet structure:**
- **Restaurants sheet:** Master list of all 61 stores with franchisee group assignments
- **Franchise Group Go-Live Order sheet:** Defines rollout sequence by franchisee group
- **Better for planning:** Can reference master data and maintain rollout order

✅ **Comprehensive scope:** Covers all franchisee groups (61 stores total)

✅ **Template-ready:** Clean placeholder structure ready for data population

### Template B Strengths
✅ **Real data example:** Shows actual implementation with Jackmont group
- Specific store codes (e.g., "62644-LAUDERHILL, FL")
- Full franchisee group name format: "Atlanta Restaurant Partners, LLC [Jackmont]"
- Realistic date progression

✅ **Proven structure:** Already in use, validated by operations team

✅ **Focused execution:** Single-group view makes it easier to track specific rollout

---

## Recommended "Best Of" Structure

### Primary Sheet: Rollout Calendar

**Columns (Enhanced):**

| Column | Data Type | Purpose | Example | Source |
|--------|-----------|---------|---------|--------|
| **Stores Complete** | Number | Running count | 14 | Both |
| **Week #** | Number | Rollout week | 1 | Both |
| **Go-Live Date** | Date | Store go-live | 1/20/2026 | Both |
| **Day** | Text | Day of week | Tue | Both |
| **Franchise Group** | Text | Full group name | Atlanta Restaurant Partners, LLC [Jackmont] | Template B format |
| **Location / Store Code** | Text | Store ID + location | 62644-LAUDERHILL, FL | Template B format |
| **Toast Onsite Day-of** | Date | Support on go-live | 1/20/2026 | Both |
| **Toast Onsite Friday** | Date | Support Friday | 1/23/2026 | Both |
| **Toast Onsite Saturday** | Date | Support Saturday | 1/24/2026 | Both |
| **Status** | Dropdown | Rollout status | Scheduled / In Progress / Complete / Delayed | **NEW** |
| **Primary Contact** | Text | Store/GM contact | John Smith | **NEW** |
| **Notes** | Text | Additional info | Any | Both |

**New Columns Rationale:**
- **Status:** Track progress beyond just dates (critical for weekly coordination)
- **Primary Contact:** Quick reference for store-level coordination

### Reference Sheet: Restaurants (Master List)

Keep Template A's structure with enhancements:

| Column | Purpose | Example |
|--------|---------|---------|
| **Franchise Group** | Group name | Atlanta Restaurant Partners, LLC [Jackmont] |
| **Location / Store Code** | Store identifier | 62644-LAUDERHILL, FL |
| **Store Name** | Friendly name | Lauderhill Friday's |
| **Primary Contact** | Store contact | John Smith |
| **Contact Email** | Email | jsmith@fridays.com |
| **Contact Phone** | Phone | (555) 123-4567 |
| **Special Requirements** | Notes | Airport location, limited hours for training |

### Reference Sheet: Franchise Group Go-Live Order

Keep Template A's structure:

| Column | Purpose | Example |
|--------|---------|---------|
| **Franchise Group** | Group name | Atlanta Restaurant Partners, LLC [Jackmont] |
| **Rollout Order** | Sequence | 1 |
| **Total Stores** | Count | 19 |
| **Start Week** | First week | 1 |
| **End Week** | Last week | 4 |
| **Group Contact** | Primary contact | Becky Hammer |

---

## Conditional Formatting Rules

### Rollout Calendar Sheet

1. **Status-based row coloring:**
   - Complete: Light green background
   - In Progress: Light yellow background
   - Delayed: Light red background
   - Scheduled: No color

2. **Date proximity alerts:**
   - Go-Live Date within 7 days: Bold text
   - Go-Live Date within 3 days: Bold + orange background
   - Go-Live Date today: Bold + red background

3. **Missing data alerts:**
   - Empty "Franchise Group" or "Location / Store Code": Red text
   - Empty "Primary Contact": Yellow highlight

---

## Data Validation Rules

1. **Status dropdown:** Scheduled, In Progress, Complete, Delayed
2. **Day dropdown:** Mon, Tue, Wed, Thu, Fri, Sat, Sun
3. **Date format:** MM/DD/YYYY for all date columns
4. **Week # range:** 1-52 (numeric only)

---

## Implementation Recommendations

### Phase 1: Build Template (Today - 12/31)
1. Create new workbook with 3 sheets
2. Set up column structure in Rollout Calendar
3. Create Restaurants master list (populate from existing data)
4. Create Franchise Group Go-Live Order (8 groups)
5. Apply conditional formatting and data validation

### Phase 2: Populate Data (1/2-1/5)
1. Import Jackmont data from Template B (validate)
2. Add remaining franchisee groups from Template A structure
3. Populate Primary Contact info from existing sources
4. Review with Becky for approval

### Phase 3: Operationalize (1/6+)
1. Share with operations team
2. Set up weekly update process
3. Use for coordination meetings
4. Track actual vs. planned dates

---

## Sample Data (First 3 Rows)

| Stores Complete | Week # | Go-Live Date | Day | Franchise Group | Location / Store Code | Toast Onsite Day-of | Toast Onsite Friday | Toast Onsite Saturday | Status | Primary Contact | Notes |
|----------------|--------|--------------|-----|-----------------|----------------------|---------------------|---------------------|----------------------|--------|----------------|-------|
| 1 | 1 | 1/20/2026 | Tue | Atlanta Restaurant Partners, LLC [Jackmont] | 62644-LAUDERHILL, FL | 1/20/2026 | 1/23/2026 | 1/24/2026 | Scheduled | TBD | |
| 2 | 1 | 1/21/2026 | Wed | Atlanta Restaurant Partners, LLC [Jackmont] | 62652-N. MIAMI BEACH, FL | 1/20/2026 | 1/23/2026 | 1/24/2026 | Scheduled | TBD | |
| 3 | 1 | 1/21/2026 | Wed | Atlanta Restaurant Partners, LLC [Jackmont] | 62672-W. MIAMI, FL | 1/20/2026 | 1/23/2026 | 1/24/2026 | Scheduled | TBD | |

---

## Next Steps

1. **Create unified template** using structure above
2. **Populate with Jackmont data** from Template B (validate dates/stores)
3. **Add remaining groups** using Template A's master list
4. **Review with Becky** for approval before 1/5/26
5. **Distribute to operations team** for weekly updates

---

## Questions for Becky

1. Do we need additional status values beyond Scheduled/In Progress/Complete/Delayed?
2. Should we track hardware/equipment readiness separately?
3. Do we need a separate column for training completion dates?
4. Should we add a "Risk Level" indicator for stores with known challenges?
5. Do we need to track post-go-live support beyond the first weekend?
