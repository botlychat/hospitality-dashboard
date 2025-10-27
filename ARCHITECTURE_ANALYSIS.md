# Hospitality Dashboard - Architecture Analysis

## Project Overview
This is an **Admin Dashboard for Multi-Property Hospitality Management** that allows clients to manage their properties (Chalets, Hotels, Apartments), bookings, AI agents, and website settings. The dashboard will integrate with **Supabase** for data persistence and **AI APIs** for intelligent booking management and customer communication.

---

## 📋 File Structure & Purpose

### Page Files (6 HTML files)
Each page is a complete self-contained module with integrated styles and JavaScript:

| File | Purpose | Key Features |
|------|---------|--------------|
| **dashboard.html** | Main admin overview | KPI cards, occupancy rate, recent bookings, weekly income, unit status |
| **units.html** | Property management | CRUD for Chalets/Hotels/Apartments, pricing, features, media gallery |
| **contacts.html** | Customer database | Contact management, groups, filtering, campaigns, CSV export |
| **aiagent.html** | AI Agent configuration | Discount settings, booking methods, welcome messages, reminders, WhatsApp campaigns |
| **website.html** | Website customization | Theme colors, home picture, general settings, multi-group selector |
| **index.html** | Alternative layout | Similar to dashboard.html with tabs and settings panels |

---

## 🏗️ Architecture Components

### 1. **Frontend Stack**
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables (custom theme system)
- **Vanilla JavaScript** - No frameworks, lightweight
- **Font Awesome 6.5.1** - Icon library
- **Responsive Design** - Mobile-first, media queries for 980px breakpoint

### 2. **Design System**
```css
CSS Variables (Root):
--bg: #f5f7fa (background)
--bg-gradient: Multi-color gradient (130°)
--sidebar: #0f1729 (dark sidebar)
--accent: #f97316 (orange primary)
--accent-soft: rgba(249,115,22,0.12) (soft orange)
--muted: #64748b (gray text)
--card: #fff (card background)
--stroke: #e5e7eb (borders)
```

### 3. **Data Layer (Current State)**
Currently using **localStorage** for client-side data:
```javascript
// Sample data structures in localStorage:
- clientsDatabase: Array of customer objects
- unitDataset: Array of property objects
- aiAgentConfig: AI settings
- websiteSettings: Theme & content
- currency: USD/SAR/EUR
- language: EN/AR (English/Arabic)
```

### 4. **Supabase Integration (In Progress)**
```javascript
// Referenced in dashboard.html (module import):
import { 
  supabase, 
  getCurrentUser, 
  getUserOrganization, 
  getUserUnits 
} from './lib/supabase-client.js'

// Functions:
- getCurrentUser() → Get authenticated user
- getUserOrganization() → Get user's organization
- getUserUnits() → Fetch units from database
- Authentication check before page load
```

---

## 📊 Data Models

### Unit/Property Object
```javascript
{
  id: "CH-201",           // Auto-generated: CH/APT/HR/VL + number
  name: "Desert Escape Chalet",
  type: "Chalet" | "Hotel Room" | "Hotel Apartment" | "Villa",
  groupId: "group_1",      // Group this unit belongs to
  status: "Active" | "Maintenance" | "Disabled",
  area: 120,              // Square meters
  maxGuests: 6,
  nightlyRate: 250,       // Average rate (SAR)
  parking: true,
  checkInHour: 14,
  checkOutHour: 12,
  
  // Descriptions
  shortDescription: "...",
  longDescription: "...",
  features: ["WiFi", "Smart TV", ...],
  
  // Property-specific details
  pool: { has: false, specs: "" },
  garden: { has: false, specs: "" },
  kitchen: { has: false, appliances: [] },
  bedrooms: [{ name: "", bed: "", details: "" }],
  toilets: [{ type: "Full", details: "" }],
  
  // Pricing (per type)
  pricing: {
    weekdayRates: {
      Saturday: 250,
      Sunday: 250,
      Monday: 200,
      Tuesday: 200,
      Wednesday: 200,
      Thursday: 200,
      Friday: 250
    },
    specialDates: [
      { date: "2025-12-25", rate: 400, label: "Christmas" }
    ]
  },
  
  // Media
  media: {
    featured: "image_url",
    gallery: ["url1", "url2", ...],
    videos: []
  },
  
  policy: "Cancellation policy text...",
  activity: "Last activity timestamp"
}
```

### Client/Contact Object
```javascript
{
  id: 1,
  name: "Ahmed Ali",
  phone: "+966501234567",
  email: "ahmed@example.com",
  groupId: "group_2",           // Which property group they belong to
  groupName: "Chalets Collection",
  unitId: "CH-201",             // Last booked unit
  unitName: "Desert Escape Chalet",
  lastBooking: "2025-10-20",
  review: "5",                  // Rating
  payment: "Paid" | "Pending",
  bookingDates: "2025-10-20 to 2025-10-23",
  paymentMethod: "Credit Card" | "Bank Transfer",
  status: "Active" | "Inactive"
}
```

### Booking Object
```javascript
{
  id: "BKG-001",
  client: "Ahmed Ali",
  phone: "+966501234567",
  unit: "CH-201",
  start: "2025-10-20",
  end: "2025-10-23",
  nights: 3,
  ratePerNight: 250,
  total: 750,
  payment: "Paid" | "Pending",
  paymentMethod: "Credit Card",
  source: "Website" | "Manual" | "AI Agent",
  status: "Active" | "Pending" | "Past",
  notes: ""
}
```

### AI Agent Config Object
```javascript
{
  enabled: true,
  welcomeMessage: "Welcome to our booking service...",
  reminder1: "Booking reminder message",
  reminder2: "Check-in reminder message",
  
  discountEnabled: true,
  discountAmount: 50,           // SAR
  bookingMethod: "full" | "website_only",
  
  customRoles: [
    "Customer Service Agent",
    "Booking Manager",
    ...
  ],
  
  campaigns: {
    whatsapp: [
      {
        date: "2025-12-25",
        recipients: ["group_1", "group_2"],
        message: "Special holiday offer...",
        status: "Scheduled"
      }
    ]
  }
}
```

---

## 🔄 Data Flow Architecture

### Current Flow (localStorage)
```
┌─────────────────┐
│  HTML Form UI   │
└────────┬────────┘
         │ User Input
         ▼
┌─────────────────────────┐
│  JavaScript Handlers    │
│  - Event listeners      │
│  - Form validation      │
│  - Data transformation  │
└────────┬────────────────┘
         │ Processed Data
         ▼
┌─────────────────────────┐
│  localStorage.setItem() │
│  JSON serialization     │
└────────┬────────────────┘
         │ Persisted
         ▼
┌─────────────────────────┐
│  Browser Storage        │
│  (Limited to 5-10MB)    │
└─────────────────────────┘
```

### Target Flow (Supabase Integration)
```
┌─────────────────┐
│  HTML Form UI   │
└────────┬────────┘
         │ User Input
         ▼
┌─────────────────────────┐
│  JavaScript Handlers    │
│  - Validation           │
│  - Data transformation  │
└────────┬────────────────┘
         │ Processed Data
         ▼
┌─────────────────────────┐
│  Supabase Client API    │
│  supabase.from().insert/update()
└────────┬────────────────┘
         │ HTTP/Realtime
         ▼
┌──────────────────────────┐
│  Supabase PostgreSQL DB  │
│  ├─ organizations        │
│  ├─ users                │
│  ├─ properties/units     │
│  ├─ bookings             │
│  ├─ contacts/clients     │
│  ├─ ai_agent_configs     │
│  └─ website_settings     │
└──────────────────────────┘
```

---

## 🤖 AI Agent Integration Points

### AI Request to External API
```javascript
// Purpose: Send booking data to AI for processing
async function sendToAIAgent(bookingData) {
  const aiEndpoint = "https://api.aiagent.com/process-booking";
  
  const payload = {
    userId: currentUserId,
    organizationId: userOrgId,
    bookingData: bookingData,
    discountCode: aiAgentConfig.discountAmount,
    welcomeMessage: aiAgentConfig.welcomeMessage,
    bookingMethod: aiAgentConfig.bookingMethod
  };
  
  try {
    const response = await fetch(aiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify(payload)
    });
    
    return await response.json();
  } catch (error) {
    console.error("AI Agent API Error:", error);
  }
}
```

### WhatsApp Campaign via AI
```javascript
// Current: Creates local campaign object
// Target: Send to AI Agent API for distribution
async function sendWhatsAppCampaign(campaignData) {
  const recipients = clientsDatabase.filter(c => 
    selectedClients.has(c.id)
  );
  
  const campaignPayload = {
    type: "whatsapp_campaign",
    recipients: recipients.map(r => r.phone),
    message: campaignData.message,
    scheduledDate: campaignData.date,
    organizationId: userOrgId
  };
  
  // Send to AI Agent (simulated)
  // In production: await aiAgentAPI.sendCampaign(campaignPayload)
}
```

---

## 🔐 Authentication & Authorization

### Current Implementation
- Basic check at page load (dashboard.html)
- Redirects to login.html if not authenticated
- Stores user info globally: `window.currentUserId`, `window.userOrgId`

### Required Supabase Functions
```javascript
// In lib/supabase-client.js
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserOrganization() {
  const user = await getCurrentUser();
  const { data } = await supabase
    .from('organizations')
    .select('*')
    .eq('owner_id', user.id)
    .single();
  return data;
}

export async function getUserUnits() {
  const org = await getUserOrganization();
  const { data } = await supabase
    .from('units')
    .select('*')
    .eq('organization_id', org.id);
  return data;
}
```

---

## 🎨 UI/UX Components

### Common Patterns
1. **Sidebar Navigation** - Left 260px fixed sidebar with brand and nav items
2. **Header** - Sticky top bar with profile menu and branding
3. **Modal/Backdrop** - Fullscreen overlay for forms and confirmations
4. **Sheet (Off-Canvas)** - Right-sliding panel for editing units (520px)
5. **Tabs** - Tab sections with active states
6. **Forms** - Standardized with validation and required field indicators
7. **Tables** - Sortable columns, pagination, row actions
8. **Status Pills** - Color-coded status badges
9. **Filters** - Multi-field filtering with real-time updates
10. **Notifications** - Toast-style confirmation messages

### Multilingual Support
- **i18n attributes**: `data-i18n="key"`
- **Languages**: English (EN) & Arabic (AR)
- **Storage**: `localStorage.getItem('language')`
- **Dynamic translation**: JavaScript object with language keys

### Multi-Currency Support
- **Currencies**: USD, SAR (Saudi Riyal), EUR
- **Storage**: `localStorage.getItem('currency')`
- **Display**: Format prices based on selected currency

---

## 🔄 Key Workflows

### 1. **Create/Edit Unit**
```
Click "Add Unit" → Open Sheet → Fill Form 
→ Validate Data → Save to localStorage/Supabase 
→ Update Table → Show Notification
```

### 2. **Add Booking**
```
Click "New Booking" → Open Modal → Fill Details 
→ Calculate Nights & Total → Validate Dates 
→ Check Availability → Save → Notify AI Agent
```

### 3. **Send WhatsApp Campaign**
```
Select Clients → Click Campaign → Choose Date/Time 
→ Compose Message → Estimate Cost 
→ Send to AI Agent API → Store Campaign Record
```

### 4. **Edit Contact**
```
Click Edit Button → Load Contact Data → Open Modal 
→ Update Fields → Validate Email/Phone 
→ Save to Database → Update Table
```

---

## ⚠️ Current Limitations & To-Do

### Frontend
- [ ] No form validation beyond basic checks
- [ ] No offline mode/service workers
- [ ] Limited error handling
- [ ] No loading indicators for async operations
- [ ] localStorage size limit (5-10MB)

### Backend Integration
- [ ] Supabase module not created yet (`lib/supabase-client.js`)
- [ ] No real API endpoints for AI agent
- [ ] No authentication system (login.html)
- [ ] No file upload handlers for images/videos
- [ ] No real email/WhatsApp sending

### Missing Pages
- `calendar.html` - Booking calendar
- `login.html` - Authentication page
- `lib/supabase-client.js` - Supabase configuration

---

## 🚀 Next Steps for Implementation

### Phase 1: Core Infrastructure
1. Create `lib/supabase-client.js` with auth functions
2. Create `login.html` with authentication UI
3. Create Supabase database schema (organizations, users, units, bookings, contacts)
4. Implement RLS (Row Level Security) policies

### Phase 2: Data Persistence
1. Replace localStorage with Supabase `.from().select/insert/update/delete()`
2. Add real-time subscriptions for live updates
3. Implement file storage for images/videos
4. Add data validation on backend

### Phase 3: AI Integration
1. Configure AI agent API endpoints
2. Implement booking processing via AI
3. Add WhatsApp campaign distribution
4. Create webhook handlers for AI callbacks

### Phase 4: Advanced Features
1. Calendar view and booking management
2. Reports and analytics
3. Email notifications
4. Payment gateway integration
5. Audit logging

---

## 📦 Dependencies
- **Font Awesome 6.5.1** - Icons (CDN)
- **Supabase** - Database & Auth (To be added)
- **AI Agent API** - External service (To be configured)
- **No build tools needed** - Pure HTML/CSS/JS

---

## 🔗 Integration Points

### External APIs to Implement
1. **Supabase REST API** - All CRUD operations
2. **AI Agent API** - Process bookings, send campaigns
3. **Payment Gateway** - Process payments (Stripe, 2Checkout)
4. **Email Service** - Send notifications (SendGrid, AWS SES)
5. **WhatsApp API** - Send messages (Twilio, MessageBird)
6. **File Storage** - Upload images (Supabase Storage, AWS S3)

---

## 💾 Database Schema (Planned)

```sql
-- Organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name VARCHAR,
  owner_id UUID REFERENCES auth.users,
  created_at TIMESTAMP
);

-- Units/Properties
CREATE TABLE units (
  id VARCHAR PRIMARY KEY,
  organization_id UUID REFERENCES organizations,
  name VARCHAR,
  type VARCHAR,
  status VARCHAR,
  pricing JSONB,
  features JSONB,
  media JSONB,
  created_at TIMESTAMP
);

-- Bookings
CREATE TABLE bookings (
  id VARCHAR PRIMARY KEY,
  organization_id UUID REFERENCES organizations,
  unit_id VARCHAR REFERENCES units,
  client_id INTEGER,
  check_in DATE,
  check_out DATE,
  total_amount DECIMAL,
  payment_status VARCHAR,
  created_at TIMESTAMP
);

-- Contacts/Clients
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY,
  organization_id UUID REFERENCES organizations,
  name VARCHAR,
  email VARCHAR,
  phone VARCHAR,
  unit_preferences JSONB,
  created_at TIMESTAMP
);

-- AI Agent Configuration
CREATE TABLE ai_agent_configs (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations,
  settings JSONB,
  updated_at TIMESTAMP
);
```

---

## 📝 Summary

This is a **modern, responsive admin dashboard** for hospitality management that:
- ✅ Manages multiple properties with detailed configurations
- ✅ Tracks bookings and customer information
- ✅ Configures AI agents for automated booking processing
- ✅ Customizes website appearance and settings
- ✅ Supports multi-language (EN/AR) and multi-currency (USD/SAR/EUR)
- ✅ Uses localStorage currently (needs Supabase migration)
- ⏳ Will integrate with AI agents for smart booking management
- ⏳ Will send WhatsApp campaigns via AI
- ⏳ Will connect to payment systems

The foundation is solid and ready for backend integration with Supabase and AI APIs.
