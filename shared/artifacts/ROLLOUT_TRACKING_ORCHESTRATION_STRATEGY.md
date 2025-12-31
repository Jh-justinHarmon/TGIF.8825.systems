# Rollout Tracking Orchestration Strategy

**Date:** December 31, 2025  
**Purpose:** Handle multiple shared Google Sheets as inputs for unified rollout tracking

---

## Current Challenge

The unified rollout tracking template needs data from multiple sources:
1. **Franchisee Group Contacts** (Google Sheet) - Contact info, group details
2. **System Integrations Tracking** (Google Sheet) - Integration status per store
3. **Hardware Orders** (Toast system or Google Sheet) - Order status, tracking numbers
4. **Training Schedules** (Google Sheet or Calendar) - Training dates per store
5. **Store Master List** (Google Sheet) - All 61 stores with metadata

**Problem:** Manual copy/paste is error-prone and doesn't scale. Need automated orchestration.

---

## Orchestration Approaches

### Option 1: Google Apps Script (Recommended for Phase 1)

**How it works:**
- Create a Google Apps Script attached to the unified tracking sheet
- Script runs on schedule (hourly, daily) or on-demand (button click)
- Pulls data from source sheets via Google Sheets API
- Updates unified tracking sheet automatically

**Pros:**
- Native to Google Sheets (no external dependencies)
- Can run on schedule or trigger
- Users can click "Refresh Data" button
- Free (within Google Apps Script quotas)

**Cons:**
- Limited to Google Sheets ecosystem
- Requires Google Apps Script knowledge
- 6-minute execution time limit per run

**Implementation:**
```javascript
// Example Google Apps Script
function refreshRolloutData() {
  const trackingSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Rollout Calendar');
  
  // Pull from Franchisee Contacts sheet
  const contactsSheet = SpreadsheetApp.openById('CONTACTS_SHEET_ID').getSheetByName('Contacts');
  const contactsData = contactsSheet.getDataRange().getValues();
  
  // Pull from System Integrations sheet
  const integrationsSheet = SpreadsheetApp.openById('INTEGRATIONS_SHEET_ID').getSheetByName('Integrations');
  const integrationsData = integrationsSheet.getDataRange().getValues();
  
  // Merge data into tracking sheet
  // ... (matching logic by store code)
  
  Logger.log('Rollout data refreshed successfully');
}

// Set up time-based trigger
function createTrigger() {
  ScriptApp.newTrigger('refreshRolloutData')
    .timeBased()
    .everyHours(6)
    .create();
}
```

---

### Option 2: TGIF Hub Integration (Recommended for Phase 2)

**How it works:**
- TGIF Hub (Express + Drizzle ORM) acts as orchestrator
- Syncs data from multiple Google Sheets to local SQLite database
- Provides API endpoints for data access
- Can push updates back to Google Sheets

**Pros:**
- Centralized orchestration logic
- Can integrate with non-Google sources (Toast API, email, etc.)
- Better error handling and logging
- Can add business logic (validation, notifications)

**Cons:**
- Requires backend deployment (already have TGIF Hub)
- More complex setup
- Needs Google Sheets API credentials

**Implementation:**
```typescript
// TGIF Hub backend route
app.post('/api/rollout/sync', async (req, res) => {
  try {
    // 1. Fetch from Franchisee Contacts sheet
    const contacts = await googleSheets.getSheet(CONTACTS_SHEET_ID, 'Contacts');
    
    // 2. Fetch from System Integrations sheet
    const integrations = await googleSheets.getSheet(INTEGRATIONS_SHEET_ID, 'Integrations');
    
    // 3. Fetch from Hardware Orders sheet
    const hardware = await googleSheets.getSheet(HARDWARE_SHEET_ID, 'Orders');
    
    // 4. Merge data by store code
    const mergedData = mergeRolloutData(contacts, integrations, hardware);
    
    // 5. Update unified tracking sheet
    await googleSheets.updateSheet(TRACKING_SHEET_ID, 'Rollout Calendar', mergedData);
    
    // 6. Store in local DB for caching
    await db.insert(rolloutData).values(mergedData);
    
    res.json({ success: true, recordsUpdated: mergedData.length });
  } catch (error) {
    console.error('Rollout sync failed:', error);
    res.status(500).json({ error: error.message });
  }
});
```

---

### Option 3: Zapier/Make.com (No-Code Alternative)

**How it works:**
- Use Zapier or Make.com to create automation workflows
- Trigger: New row in source sheet OR scheduled (every 6 hours)
- Action: Update row in unified tracking sheet (match by store code)

**Pros:**
- No coding required
- Visual workflow builder
- Can integrate with non-Google sources (email, Slack, etc.)

**Cons:**
- Costs money ($20-50/month for needed features)
- Less flexible than custom code
- Harder to debug complex logic

---

## Recommended Implementation Plan

### Phase 1: Google Apps Script (Quick Win)
**Timeline:** 1-2 days  
**Effort:** Low  
**Cost:** $0

1. Create Google Apps Script in unified tracking sheet
2. Add "Refresh Data" button to sheet
3. Script pulls from 3-4 key source sheets
4. Set up hourly trigger
5. Test with Jackmont data

**Deliverable:** Automated data sync for rollout tracking

---

### Phase 2: TGIF Hub Integration (Scalable)
**Timeline:** 3-5 days  
**Effort:** Medium  
**Cost:** $0 (already have TGIF Hub)

1. Set up Google Sheets API credentials in TGIF Hub
2. Create `/api/rollout/sync` endpoint
3. Build sync logic with validation
4. Add UI button in TGIF Hub dashboard: "Sync Rollout Data"
5. Set up cron job for automatic sync (every 6 hours)
6. Add notification system (Slack/email on sync errors)

**Deliverable:** Full orchestration with error handling and notifications

---

## Data Mapping Strategy

### Source Sheet 1: Franchisee Group Contacts
**Columns:** Franchise Group, Primary Contact, Contact Email, Contact Phone

**Maps to Rollout Calendar:**
- Match by: `Franchise Group`
- Update: `Primary Contact` (column 24)

---

### Source Sheet 2: System Integrations Tracking
**Columns:** Store Code, Integration Status, Last Verified Date

**Maps to Rollout Calendar:**
- Match by: `Location / Store Code`
- Update: `Notes` (column 25) - append integration status

---

### Source Sheet 3: Hardware Orders
**Columns:** Store Code, Order Number, Order Status, Tracking Number, Delivery Date

**Maps to Rollout Calendar:**
- Match by: `Location / Store Code`
- Update:
  - `Hardware Order #` (column 20)
  - `Hardware Status` (column 21)
  - `Hardware Tracking #` (column 22)
  - `Hardware Delivery Date` (column 23)

---

### Source Sheet 4: Training Schedules
**Columns:** Store Code, Remote Install Date, Onsite Install Date, Remote Training Date, Onsite Training Date, Manager Training Date

**Maps to Rollout Calendar:**
- Match by: `Location / Store Code`
- Update:
  - `Remote Install Date` (column 15)
  - `Onsite Install Date` (column 16)
  - `Remote Training Date` (column 17)
  - `Onsite Training Date` (column 18)
  - `Manager Training Date` (column 19)

---

## Error Handling

### Common Issues:
1. **Store code mismatch** - Source sheet has different store code format
2. **Missing data** - Source sheet doesn't have data for all stores
3. **Date format inconsistency** - Source sheet uses different date format
4. **Duplicate entries** - Multiple rows for same store

### Solutions:
1. **Normalize store codes** - Strip whitespace, uppercase, standardize format
2. **Default values** - Use "TBD" or blank for missing data
3. **Date parsing** - Convert all dates to DD/MM/YY format
4. **Deduplication** - Use most recent entry if duplicates found

---

## Validation Rules

Before updating unified tracking sheet:
1. ✅ Store code exists in master list (61 stores)
2. ✅ Dates are valid and in DD/MM/YY format
3. ✅ Hardware Status is one of: Not Ordered / Ordered / Shipped / Delivered
4. ✅ Install Type is one of: Onsite / Remote / Self Install
5. ✅ Project Health is one of: On Track / Some Risk / At Risk
6. ✅ No duplicate entries per store

---

## Notification Strategy

### When to notify:
- ✅ Sync completed successfully (daily summary)
- ⚠️ Sync failed (immediate alert)
- ⚠️ Data validation errors (immediate alert)
- ⚠️ Missing critical data (daily summary)

### Notification channels:
- **Slack:** #tgif-rollout-tracking channel
- **Email:** Becky Hammer + operations team
- **TGIF Hub:** Dashboard alert banner

---

## Next Steps

1. **Decide on approach:** Google Apps Script (quick) vs TGIF Hub (scalable)
2. **Identify source sheets:** Get Google Sheet IDs for all data sources
3. **Define sync frequency:** Hourly? Daily? On-demand only?
4. **Set up credentials:** Google Sheets API access (if using TGIF Hub)
5. **Build & test:** Start with Jackmont data, expand to all groups
6. **Train operations team:** How to use "Refresh Data" button, interpret errors

---

## Questions for Becky

1. Which source sheets exist today? (Franchisee contacts, integrations, hardware, training)
2. Who maintains each source sheet? (ownership/permissions)
3. How often should data sync? (hourly, daily, on-demand)
4. Who should be notified on sync errors?
5. Should sync be bidirectional? (unified sheet → source sheets)
