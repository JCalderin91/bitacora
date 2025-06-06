import { supabase } from '../supabase'

export class EventService {
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }

  async fetchEvents(userId) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async createEvent({ content, created_at, user_id }) {
    const { error } = await supabase
      .from('events')
      .insert([{ content, created_at, user_id }])

    if (error) throw error
  }

  async updateEvent({ id, content, user_id }) {
    const { error } = await supabase
      .from('events')
      .update({ content })
      .eq('id', id)
      .eq('user_id', user_id)

    if (error) throw error
  }

  async deleteEvent({ id, user_id }) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .eq('user_id', user_id)

    if (error) throw error
  }
}