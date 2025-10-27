/**
 * Supabase Client Wrapper
 * Handles authentication and data operations
 * 
 * Note: This is a template. You need to:
 * 1. Install @supabase/supabase-js: npm install @supabase/supabase-js
 * 2. Set VITE_SUPABASE_URL and VITE_SUPABASE_KEY in .env
 * 3. Uncomment imports when ready to use
 */

// ============================================
// IMPORTS (Uncomment when using real Supabase)
// ============================================

// import { createClient } from '@supabase/supabase-js'

// ============================================
// CONFIGURATION
// ============================================

// const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
// const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
// export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Mock Supabase client for development
 * Replace with real Supabase when ready
 */
export const supabase = {
  auth: {
    signInWithPassword: async (credentials) => {
      console.log('Mock signInWithPassword:', credentials);
      return { data: { user: { id: 'user_1', email: credentials.email } }, error: null };
    },
    signUp: async (credentials) => {
      console.log('Mock signUp:', credentials);
      return { data: { user: { id: 'user_1', email: credentials.email } }, error: null };
    },
    signOut: async () => {
      console.log('Mock signOut');
      return { error: null };
    },
    getSession: async () => {
      const session = localStorage.getItem('session');
      return { data: { session: session ? JSON.parse(session) : null } };
    },
    getUser: async () => {
      const user = localStorage.getItem('user');
      return { data: { user: user ? JSON.parse(user) : null } };
    },
    updateUser: async (attributes) => {
      console.log('Mock updateUser:', attributes);
      return { data: { user: attributes }, error: null };
    },
    resetPasswordForEmail: async (email) => {
      console.log('Mock resetPasswordForEmail:', email);
      return { error: null };
    },
    onAuthStateChange: (callback) => {
      const listener = {
        unsubscribe: () => {},
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
      return listener;
    }
  },
  from: (table) => ({
    select: () => ({
      eq: () => ({ data: [], error: null }),
      order: () => ({ data: [], error: null }),
      limit: () => ({ data: [], error: null }),
      data: [],
      error: null
    }),
    insert: () => ({ data: [], error: null }),
    update: () => ({ data: [], error: null }),
    delete: () => ({ data: [], error: null })
  })
};

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

/**
 * Get current authenticated user
 * @returns {Promise<Object>} User object
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Auth response
 */
export async function signInWithPassword(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    
    // Store user locally
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('session', JSON.stringify(data.session));
    }
    
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { user: null, error: error.message };
  }
}

/**
 * Sign up new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {Object} metadata - Additional user metadata
 * @returns {Promise<Object>} Auth response
 */
export async function signUp(email, password, metadata = {}) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { user: null, error: error.message };
  }
}

/**
 * Sign out current user
 * @returns {Promise<Object>} Sign out response
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('session');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentOrganization');
    
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error: error.message };
  }
}

/**
 * Reset password for email
 * @param {string} email - User email
 * @returns {Promise<Object>} Response
 */
export async function resetPasswordForEmail(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Reset password error:', error);
    return { error: error.message };
  }
}

// ============================================
// DATA OPERATIONS
// ============================================

/**
 * Get user's organization
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Organization data
 */
export async function getUserOrganization(userId) {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching organization:', error);
    return [];
  }
}

/**
 * Get organization's unit groups
 * @param {string} orgId - Organization ID
 * @returns {Promise<Array>} Unit groups data
 */
export async function getUnitGroups(orgId) {
  try {
    const { data, error } = await supabase
      .from('unit_groups')
      .select('*')
      .eq('organization_id', orgId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching unit groups:', error);
    return [];
  }
}

/**
 * Get units for a group
 * @param {string} groupId - Unit group ID
 * @returns {Promise<Array>} Units data
 */
export async function getUnits(groupId) {
  try {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .eq('group_id', groupId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching units:', error);
    return [];
  }
}

/**
 * Create or update unit
 * @param {Object} unitData - Unit data
 * @param {string} unitId - Unit ID (for update)
 * @returns {Promise<Object>} Response
 */
export async function upsertUnit(unitData, unitId = null) {
  try {
    const operation = unitId 
      ? supabase.from('units').update(unitData).eq('id', unitId)
      : supabase.from('units').insert(unitData);
    
    const { data, error } = await operation;
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error upserting unit:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Delete unit
 * @param {string} unitId - Unit ID to delete
 * @returns {Promise<Object>} Response
 */
export async function deleteUnit(unitId) {
  try {
    const { error } = await supabase
      .from('units')
      .delete()
      .eq('id', unitId);
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting unit:', error);
    return { error: error.message };
  }
}

/**
 * Get bookings for a unit
 * @param {string} unitId - Unit ID
 * @returns {Promise<Array>} Bookings data
 */
export async function getBookings(unitId) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('unit_id', unitId)
      .order('check_in', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

/**
 * Create booking
 * @param {Object} bookingData - Booking data
 * @returns {Promise<Object>} Response
 */
export async function createBooking(bookingData) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData);
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Get contacts/clients for a group
 * @param {string} groupId - Group ID
 * @returns {Promise<Array>} Contacts data
 */
export async function getContacts(groupId) {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
}

/**
 * Get AI Agent configuration for a group
 * @param {string} groupId - Group ID
 * @returns {Promise<Object>} AI Agent config
 */
export async function getAIAgentConfig(groupId) {
  try {
    const { data, error } = await supabase
      .from('ai_agent_configs')
      .select('*')
      .eq('group_id', groupId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data || null;
  } catch (error) {
    console.error('Error fetching AI agent config:', error);
    return null;
  }
}

/**
 * Save AI Agent configuration
 * @param {string} groupId - Group ID
 * @param {Object} config - Configuration data
 * @returns {Promise<Object>} Response
 */
export async function saveAIAgentConfig(groupId, config) {
  try {
    const { data, error } = await supabase
      .from('ai_agent_configs')
      .upsert({
        group_id: groupId,
        ...config,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving AI agent config:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Get website configuration for a group
 * @param {string} groupId - Group ID
 * @returns {Promise<Object>} Website config
 */
export async function getWebsiteConfig(groupId) {
  try {
    const { data, error } = await supabase
      .from('website_configs')
      .select('*')
      .eq('group_id', groupId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  } catch (error) {
    console.error('Error fetching website config:', error);
    return null;
  }
}

/**
 * Save website configuration
 * @param {string} groupId - Group ID
 * @param {Object} config - Configuration data
 * @returns {Promise<Object>} Response
 */
export async function saveWebsiteConfig(groupId, config) {
  try {
    const { data, error } = await supabase
      .from('website_configs')
      .upsert({
        group_id: groupId,
        ...config,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving website config:', error);
    return { data: null, error: error.message };
  }
}

// ============================================
// EXPORTS
// ============================================

export default {
  // Auth
  getCurrentUser,
  signInWithPassword,
  signUp,
  signOut,
  resetPasswordForEmail,
  // Data
  getUserOrganization,
  getUnitGroups,
  getUnits,
  upsertUnit,
  deleteUnit,
  getBookings,
  createBooking,
  getContacts,
  getAIAgentConfig,
  saveAIAgentConfig,
  getWebsiteConfig,
  saveWebsiteConfig
};
