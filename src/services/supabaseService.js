import { supabase } from '../config/supabase'

export const supabaseService = {
  // إدارة المستخدمين
  auth: {
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      return data
    },

    signOut: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    }
  },

  // إدارة الشكاوى
  complaints: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },

    getById: async (id) => {
      const { data, error } = await supabase
        .from('complaints')
        .select(`
          *,
          messages (
            *
          )
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },

    create: async (complaint) => {
      try {
        const { data, error } = await supabase
          .from('complaints')
          .insert([complaint])
          .select()
          .single()
        
        if (error) throw error
        return data
      } catch (error) {
        console.error('Error creating complaint:', error)
        throw error
      }
    },

    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('complaints')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    },

    delete: async (id) => {
      const { error } = await supabase
        .from('complaints')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    }
  },

  // إدارة الرسائل
  messages: {
    create: async (message) => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .insert([message])
          .select()
          .single()
        
        if (error) throw error
        return data
      } catch (error) {
        console.error('Error creating message:', error)
        throw error
      }
    },

    getByComplaintId: async (complaintId) => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('complaint_id', complaintId)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      return data
    }
  }
}