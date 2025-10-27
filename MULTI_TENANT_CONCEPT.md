# Multi-Tenant Hospitality Dashboard - Concept & Architecture

## 🏢 Core Concept

This is a **Multi-Tenant SaaS Dashboard** where:
- Multiple independent hospitality businesses (Organizations) share the same platform
- Each organization has its own login credentials (username/password)
- Each organization can manage multiple property groups
- Each property group has its own independent website and AI agent
- All organizations share a single Supabase database with data isolation via RLS (Row Level Security)

---

## 👥 User Hierarchy & Tenant Isolation

### Organization Structure
```
┌─────────────────────────────────────────────────────────────┐
│                    Shared Platform                          │
│              (One Supabase Database)                        │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
    ┌────▼─────┐         ┌────▼─────┐        ┌────▼─────┐
    │ Org A     │         │ Org B     │        │ Org C     │
    │ (Login)   │         │ (Login)   │        │ (Login)   │
    └────┬─────┘         └────┬─────┘        └────┬─────┘
         │                    │                    │
    ┌─────────────┐       ┌─────────────┐      ┌─────────────┐
    │ Group 1     │       │ Group 1     │      │ Group 1     │
    │ "Main Hotel"│       │"Chalets"    │      │"Villas"     │
    │ Website 1   │       │Website 1    │      │Website 1    │
    │ AI Agent 1  │       │AI Agent 1   │      │AI Agent 1   │
    ├─────────────┤       ├─────────────┤      ├─────────────┤
    │ Group 2     │       │ Group 2     │      └─────────────┘
    │ "Chalets"   │       │"Villas"     │
    │ Website 2   │       │Website 2    │
    │ AI Agent 2  │       │AI Agent 2   │
    └─────────────┘       └─────────────┘

Database rows are filtered by:
organization_id (ensures Org A cannot see Org B's data)
```

---

## 🗄️ Database Schema (Multi-Tenant Design)

### Authentication & Organizations
```sql
-- Supabase Auth Users (Built-in)
auth.users (
  id: UUID,
  email: VARCHAR,
  -- Supabase handles password hashing
)

-- Link users to organizations
CREATE TABLE organizations (
  id: UUID PRIMARY KEY,
  name: VARCHAR,                    -- "Riyadh Getaways"
  owner_id: UUID REFERENCES auth.users(id),
  subscription_plan: VARCHAR,       -- "basic", "pro", "enterprise"
  created_at: TIMESTAMP,
  
  -- Enable tenant isolation
  POLICY: SELECT/INSERT/UPDATE/DELETE 
    USING (auth.uid() = owner_id OR 
           auth.uid() IN (SELECT user_id FROM organization_members))
);

-- Multi-admin support
CREATE TABLE organization_members (
  id: UUID PRIMARY KEY,
  organization_id: UUID REFERENCES organizations(id),
  user_id: UUID REFERENCES auth.users(id),
  role: VARCHAR,                    -- "admin", "manager", "viewer"
  created_at: TIMESTAMP
);
```

### Unit Groups (Properties by Organization)
```sql
-- Each organization can have multiple groups
-- Each group has independent website and AI agent
CREATE TABLE unit_groups (
  id: UUID PRIMARY KEY,
  organization_id: UUID REFERENCES organizations(id),
  name: VARCHAR,                    -- "Main Hotel", "Chalets Collection"
  slug: VARCHAR,                    -- URL-friendly: "main-hotel"
  description: VARCHAR,
  created_at: TIMESTAMP,
  
  POLICY: Only organization members can access
);

-- Units belong to a group
CREATE TABLE units (
  id: VARCHAR PRIMARY KEY,          -- "CH-201"
  organization_id: UUID REFERENCES organizations(id),
  unit_group_id: UUID REFERENCES unit_groups(id),
  name: VARCHAR,
  type: VARCHAR,                    -- "Chalet", "Hotel Room", etc.
  status: VARCHAR,
  pricing: JSONB,
  features: JSONB,
  media: JSONB,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP,
  
  POLICY: Only organization members can access
);
```

### Bookings (Organization-scoped)
```sql
CREATE TABLE bookings (
  id: VARCHAR PRIMARY KEY,
  organization_id: UUID REFERENCES organizations(id),
  unit_id: VARCHAR REFERENCES units(id),
  client_id: INTEGER,
  check_in: DATE,
  check_out: DATE,
  total_amount: DECIMAL,
  payment_status: VARCHAR,
  created_at: TIMESTAMP,
  
  POLICY: Only organization members can access
);
```

### Contacts/Clients (Organization-scoped)
```sql
CREATE TABLE contacts (
  id: BIGSERIAL PRIMARY KEY,
  organization_id: UUID REFERENCES organizations(id),
  name: VARCHAR,
  email: VARCHAR,
  phone: VARCHAR,
  unit_group_id: UUID REFERENCES unit_groups(id),  -- Linked to group
  last_booking: DATE,
  review_rating: INTEGER,
  payment_status: VARCHAR,
  created_at: TIMESTAMP,
  
  POLICY: Only organization members can access
);
```

### Website Settings (Per Unit Group)
```sql
-- Each group has independent website configuration
CREATE TABLE website_settings (
  id: UUID PRIMARY KEY,
  organization_id: UUID REFERENCES organizations(id),
  unit_group_id: UUID REFERENCES unit_groups(id),
  
  -- Website customization
  home_page_image: VARCHAR,         -- File URL
  theme_color: VARCHAR,             -- "#f97316"
  website_title: VARCHAR,
  website_description: VARCHAR,
  contact_email: VARCHAR,
  contact_phone: VARCHAR,
  
  -- Domain (optional)
  custom_domain: VARCHAR,           -- "hotel.example.com"
  public_url: VARCHAR,              -- "https://platform.com/org/group-slug"
  
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP,
  
  POLICY: Only organization members can access
);
```

### AI Agent Configuration (Per Unit Group)
```sql
-- Each group has independent AI agent settings
CREATE TABLE ai_agent_configs (
  id: UUID PRIMARY KEY,
  organization_id: UUID REFERENCES organizations(id),
  unit_group_id: UUID REFERENCES unit_groups(id),
  
  -- AI settings
  enabled: BOOLEAN,
  booking_method: VARCHAR,          -- "full" or "website_only"
  discount_enabled: BOOLEAN,
  discount_amount: DECIMAL,
  
  -- Messages
  welcome_message: TEXT,
  reminder_1: TEXT,
  reminder_2: TEXT,
  
  -- Custom roles for this group
  custom_roles: JSONB,              -- ["Support Agent", "Manager", ...]
  
  api_key: VARCHAR,                 -- For AI service integration
  api_status: VARCHAR,              -- "active", "inactive", "error"
  
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP,
  
  POLICY: Only organization members can access
);
```

### Campaigns (Per Unit Group)
```sql
CREATE TABLE campaigns (
  id: UUID PRIMARY KEY,
  organization_id: UUID REFERENCES organizations(id),
  unit_group_id: UUID REFERENCES unit_groups(id),
  
  campaign_type: VARCHAR,           -- "whatsapp", "email", "sms"
  message: TEXT,
  scheduled_date: DATE,
  scheduled_time: TIME,
  recipient_count: INTEGER,
  status: VARCHAR,                  -- "draft", "scheduled", "sent", "failed"
  
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP,
  
  POLICY: Only organization members can access
);

-- Track which contacts were targeted
CREATE TABLE campaign_recipients (
  id: UUID PRIMARY KEY,
  campaign_id: UUID REFERENCES campaigns(id),
  contact_id: BIGINT REFERENCES contacts(id),
  status: VARCHAR,                  -- "pending", "sent", "failed"
  created_at: TIMESTAMP
);
```

---

## 🔐 Row Level Security (RLS) Implementation

### Supabase RLS Policies
```sql
-- Example: Users can only see their organization's units
CREATE POLICY "Users see only their organization units"
ON units
FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid()
  )
  OR
  organization_id IN (
    SELECT id 
    FROM organizations 
    WHERE owner_id = auth.uid()
  )
);

-- Users can only insert units for their organization
CREATE POLICY "Users insert into their organization"
ON units
FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
  )
  OR
  organization_id IN (
    SELECT id 
    FROM organizations 
    WHERE owner_id = auth.uid()
  )
);

-- Apply similar policies to: bookings, contacts, 
-- website_settings, ai_agent_configs, campaigns, etc.
```

---

## 🔑 Authentication Flow

### Login Process
```
┌──────────────────────────────┐
│  User navigates to platform  │
│  (e.g., dashboard.example.com)
└──────────────┬───────────────┘
               │
               ▼
        ┌──────────────┐
        │ login.html   │
        │  - Email     │
        │  - Password  │
        └──────┬───────┘
               │ Submit
               ▼
    ┌─────────────────────────┐
    │ Supabase Auth API       │
    │ supabase.auth.          │
    │   signInWithPassword()  │
    └──────┬──────────────────┘
           │ Auth Token + Session
           ▼
    ┌─────────────────────────┐
    │ Store JWT Token         │
    │ (localStorage)          │
    └──────┬──────────────────┘
           │
           ▼
    ┌─────────────────────────┐
    │ Fetch user's orgs       │
    │ SELECT * FROM           │
    │ organizations           │
    │ WHERE owner_id = uid    │
    │ OR uid IN members       │
    └──────┬──────────────────┘
           │
           ▼
    ┌─────────────────────────┐
    │ Load dashboard          │
    │ Fetch org's unit_groups │
    │ Store org_id + group_ids│
    └─────────────────────────┘
```

---

## 📊 Dashboard Data Flow (Multi-Tenant)

### When User Logs In
```javascript
// 1. Authenticate
const user = await supabase.auth.signInWithPassword(email, password);
window.currentUserId = user.user.id;

// 2. Get their organizations
const { data: orgs } = await supabase
  .from('organizations')
  .select('*')
  .or(`owner_id.eq.${user.user.id},organization_members!inner(user_id).eq.${user.user.id}`);
// Result: [Org A, Org B] (if user belongs to multiple orgs)

// 3. Select default organization or let user choose
window.currentOrgId = orgs[0].id;

// 4. Get organization's unit groups
const { data: groups } = await supabase
  .from('unit_groups')
  .select('*')
  .eq('organization_id', window.currentOrgId);
// Result: [Group 1, Group 2, ...] for this org only

// 5. Select default group or let user choose
window.currentGroupId = groups[0].id;

// 6. Load group-specific data
const units = await supabase
  .from('units')
  .select('*')
  .eq('unit_group_id', window.currentGroupId);

const websiteSettings = await supabase
  .from('website_settings')
  .select('*')
  .eq('unit_group_id', window.currentGroupId)
  .single();

const aiConfig = await supabase
  .from('ai_agent_configs')
  .select('*')
  .eq('unit_group_id', window.currentGroupId)
  .single();
```

---

## 🖥️ Dashboard UI Changes

### Updated Header/Navigation
```html
<!-- Current: Just profile menu -->
<!-- New: Organization and Group Selector -->

<div class="header">
  <div class="org-group-selector">
    <select id="orgSelector" style="padding: 8px 12px; border-radius: 8px;">
      <!-- Options populated from user's orgs -->
      <option value="org_1">Riyadh Getaways (Owner)</option>
      <option value="org_2">Desert Hotels (Manager)</option>
    </select>
    
    <select id="groupSelector" style="padding: 8px 12px; border-radius: 8px; margin-left: 8px;">
      <!-- Options populated from selected org's groups -->
      <option value="group_1">Main Hotel</option>
      <option value="group_2">Chalets Collection</option>
      <option value="group_3">Villas</option>
    </select>
  </div>
  
  <div class="profile" id="profileBtn">
    <!-- Existing profile menu -->
  </div>
</div>

<!-- JavaScript: When user changes org/group -->
<script>
document.getElementById('orgSelector').addEventListener('change', async (e) => {
  window.currentOrgId = e.target.value;
  
  // Reload groups
  const groups = await supabase
    .from('unit_groups')
    .select('*')
    .eq('organization_id', window.currentOrgId);
  
  // Update group selector
  // Refresh all data
  location.reload(); // Or partial reload
});

document.getElementById('groupSelector').addEventListener('change', async (e) => {
  window.currentGroupId = e.target.value;
  
  // Reload group-specific data (units, settings, AI config)
  // Refresh dashboards without full page reload
  renderDashboard();
});
</script>
```

---

## 💾 Modified Data Operations

### Before (localStorage, single tenant)
```javascript
// Save unit
function saveUnit(unit) {
  let unitDataset = JSON.parse(localStorage.getItem('unitDataset')) || [];
  unitDataset.push(unit);
  localStorage.setItem('unitDataset', JSON.stringify(unitDataset));
}
```

### After (Supabase, multi-tenant)
```javascript
// Save unit
async function saveUnit(unit) {
  const { data, error } = await supabase
    .from('units')
    .insert([{
      id: unit.id,
      organization_id: window.currentOrgId,    // ← Tenant isolation
      unit_group_id: window.currentGroupId,    // ← Group scope
      name: unit.name,
      type: unit.type,
      status: unit.status,
      pricing: unit.pricing,
      features: unit.features,
      media: unit.media,
    }]);
  
  if (error) {
    console.error('Error saving unit:', error);
    return;
  }
  
  // Unit automatically filtered by RLS to this org only
  renderUnits();
}

// Get units (auto-filtered by RLS)
async function getUnits() {
  const { data } = await supabase
    .from('units')
    .select('*')
    .eq('unit_group_id', window.currentGroupId);
  // RLS ensures: data only includes units from current org & group
  return data;
}

// Get contacts for this group
async function getContacts() {
  const { data } = await supabase
    .from('contacts')
    .select('*')
    .eq('unit_group_id', window.currentGroupId);
  // Only contacts assigned to this group
  return data;
}

// Get website settings for this group
async function getWebsiteSettings() {
  const { data } = await supabase
    .from('website_settings')
    .select('*')
    .eq('unit_group_id', window.currentGroupId)
    .single();
  return data;
}

// Get AI config for this group
async function getAIConfig() {
  const { data } = await supabase
    .from('ai_agent_configs')
    .select('*')
    .eq('unit_group_id', window.currentGroupId)
    .single();
  return data;
}
```

---

## 🤖 AI Agent Separation

### Each Group Has Independent AI Agent

```
Organization A                          Organization B
├─ Group 1: "Main Hotel"               ├─ Group 1: "Chalets"
│  ├─ Website: hotel.example.com        │  ├─ Website: chalets.example.com
│  ├─ AI Agent: openai-key-1            │  ├─ AI Agent: openai-key-2
│  ├─ Discount: 10%                     │  ├─ Discount: 15%
│  └─ Welcome: "Welcome to hotel"       │  └─ Welcome: "Welcome to chalets"
│                                        │
├─ Group 2: "Chalets"                  └─ Group 2: "Villas"
│  ├─ Website: chalets.example.com        ├─ Website: villas.example.com
│  ├─ AI Agent: openai-key-3              ├─ AI Agent: openai-key-4
│  ├─ Discount: 20%                       ├─ Discount: 5%
│  └─ Welcome: "Welcome to chalets"       └─ Welcome: "Welcome to villas"
```

### AI Agent Workflow
```javascript
// When booking created for Group 1
async function processBooking(booking) {
  // 1. Get this group's AI config
  const aiConfig = await getAIConfig(); // Only Group 1's config
  
  if (!aiConfig.enabled) return;
  
  // 2. Get AI API key for this group
  const apiKey = aiConfig.api_key;
  const apiEndpoint = aiConfig.api_endpoint;
  
  // 3. Send booking data to this group's AI agent
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      bookingData: booking,
      organizationId: window.currentOrgId,
      groupId: window.currentGroupId,
      config: {
        welcomeMessage: aiConfig.welcome_message,
        discountAmount: aiConfig.discount_amount,
        bookingMethod: aiConfig.booking_method
      }
    })
  });
  
  return await response.json();
}

// When sending WhatsApp campaign
async function sendCampaign(campaignData) {
  const aiConfig = await getAIConfig(); // Group-specific config
  
  const contacts = await supabase
    .from('contacts')
    .select('*')
    .eq('unit_group_id', window.currentGroupId)
    .in('id', selectedContactIds);
  
  // Send to AI agent for this group
  await fetch(aiConfig.api_endpoint + '/campaigns/whatsapp', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${aiConfig.api_key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipients: contacts,
      message: campaignData.message,
      scheduledDate: campaignData.date,
      organizationId: window.currentOrgId,
      groupId: window.currentGroupId
    })
  });
}
```

---

## 🌐 Public Website (Per Group)

### Each Group Gets Its Own Website
```
Organization A, Group 1 (Main Hotel):
  Dashboard: https://dashboard.example.com/org/org_1?group=group_1
  Website: https://main-hotel.example.com
  or: https://example.com/group/main-hotel

Organization A, Group 2 (Chalets):
  Dashboard: https://dashboard.example.com/org/org_1?group=group_2
  Website: https://chalets-collection.example.com
  or: https://example.com/group/chalets-collection
```

### Website Data (Read-Only Public Access)
```sql
-- Public data endpoint for websites
SELECT * FROM units WHERE unit_group_id = 'group_1' AND status = 'Active'
SELECT * FROM website_settings WHERE unit_group_id = 'group_1'
SELECT * FROM bookings WHERE unit_group_id = 'group_1' AND date = TODAY()

-- RLS: Public can read, but only active units
CREATE POLICY "Public read active units"
ON units
FOR SELECT
USING (status = 'Active')
TO anon; -- Anonymous access
```

---

## 📈 Multi-Tenant Data Overview

```
Shared Database Structure:

auth.users (Supabase built-in)
│
├─ organizations
│  ├─ org_1 (owner: user_123)
│  └─ org_2 (owner: user_456)
│
├─ organization_members
│  ├─ org_1 → user_123 (admin)
│  ├─ org_1 → user_789 (manager)
│  └─ org_2 → user_456 (admin)
│
├─ unit_groups
│  ├─ group_1 → org_1
│  ├─ group_2 → org_1
│  └─ group_3 → org_2
│
├─ units
│  ├─ CH-201 → group_1 → org_1
│  ├─ CH-202 → group_1 → org_1
│  ├─ HR-101 → group_2 → org_1
│  └─ VL-301 → group_3 → org_2
│
├─ bookings
│  ├─ BKG-001 → org_1 → group_1
│  ├─ BKG-002 → org_1 → group_2
│  └─ BKG-003 → org_2 → group_3
│
├─ contacts
│  ├─ contact_1 → org_1 → group_1
│  ├─ contact_2 → org_1 → group_2
│  └─ contact_3 → org_2 → group_3
│
├─ website_settings
│  ├─ settings_1 → org_1 → group_1
│  ├─ settings_2 → org_1 → group_2
│  └─ settings_3 → org_2 → group_3
│
└─ ai_agent_configs
   ├─ ai_config_1 → org_1 → group_1
   ├─ ai_config_2 → org_1 → group_2
   └─ ai_config_3 → org_2 → group_3

All queries filtered by RLS:
  - User can only see data where organization_id matches their org
  - All WHERE clauses include organization_id filter
  - No data leakage between organizations
```

---

## 🔄 Data Flow Summary

```
┌──────────────────────────────────┐
│  User Logs In (username/pwd)     │
│  Org: Riyadh Getaways            │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Authenticate with Supabase      │
│  Get JWT Token                   │
│  user_id = abc123                │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Query organizations WHERE        │
│  owner_id = abc123               │
│  Result: [Org A, Org B]          │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  User selects: Org A             │
│  window.currentOrgId = org_a_id  │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Query unit_groups WHERE         │
│  organization_id = org_a_id      │
│  Result: [Group 1, Group 2]      │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  User selects: Group 1           │
│  window.currentGroupId = grp_1_id│
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Dashboard loads data:           │
│  - units (from group 1)          │
│  - bookings (from group 1)       │
│  - contacts (from group 1)       │
│  - website_settings (for grp 1)  │
│  - ai_agent_configs (for grp 1)  │
│  All filtered by RLS             │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Display Dashboard               │
│  Edit/Create/Delete operations   │
│  All include org_id + group_id   │
└──────────────────────────────────┘
```

---

## 🛡️ Security & Isolation Guarantees

| Scenario | How It's Prevented |
|----------|-------------------|
| User A sees User B's data | RLS policies check organization_id on every query |
| User hacks token, tries to edit other org | RLS validates organization membership |
| User manually changes organization_id in request | Supabase RLS re-validates on backend |
| Organization data leaks between groups | Each group has separate website_settings, ai_agent_configs |
| AI agent serves wrong config | AI endpoint receives organization_id + group_id in request |
| Public website shows inactive units | RLS policy: status = 'Active' for public access |

---

## 📋 Implementation Checklist

### Phase 1: Authentication & Org Setup
- [ ] Create `lib/supabase-client.js` with auth functions
- [ ] Create `login.html` with email/password form
- [ ] Create Supabase auth tables
- [ ] Implement organization creation flow (admin signup)
- [ ] Create organization_members table for multi-admin

### Phase 2: Multi-Tenant Data Structure
- [ ] Create unit_groups table
- [ ] Add organization_id to all existing tables
- [ ] Create website_settings table (per group)
- [ ] Create ai_agent_configs table (per group)
- [ ] Modify all queries to filter by organization_id + group_id

### Phase 3: RLS Implementation
- [ ] Create RLS policies for each table
- [ ] Test data isolation between orgs
- [ ] Test role-based access (admin vs manager vs viewer)

### Phase 4: Dashboard Updates
- [ ] Add organization selector to header
- [ ] Add group selector to header
- [ ] Modify all data queries for multi-tenant
- [ ] Test switching between orgs/groups

### Phase 5: Per-Group Customization
- [ ] Update website_settings editor (per group)
- [ ] Update ai_agent_configs editor (per group)
- [ ] Ensure campaigns target correct group
- [ ] Test AI agent isolation

---

## 🎯 Key Differences from Single-Tenant

| Single-Tenant | Multi-Tenant |
|---------------|-------------|
| All data in localStorage | All data in shared Supabase DB |
| No authentication needed | Login required (email/pwd) |
| One website, one AI agent | One website + AI per group per org |
| No data isolation | RLS policies enforce isolation |
| Any user can access all data | Only org members see org data |
| Scaling: Per browser | Scaling: Unlimited across cloud |

---

## 💡 Summary

This dashboard is a **true multi-tenant SaaS application** where:

1. **Multiple Organizations** (hospitality businesses) share the same platform
2. **Each Organization** has login credentials and can add team members
3. **Each Organization** can manage multiple property groups
4. **Each Group** has its own independent website and AI agent configuration
5. **All Data** is stored in one Supabase database but isolated by RLS
6. **Switching Context** = Changing organization or group selector
7. **Perfect Isolation** = No organization can see another's data

This enables:
- ✅ Cost-effective multi-tenant hosting
- ✅ Shared infrastructure (one database, one server)
- ✅ No data leakage between clients
- ✅ Easy team collaboration within organization
- ✅ Scalable to thousands of organizations
- ✅ Independent website per property group
- ✅ Independent AI agent per property group
