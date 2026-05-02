import { supabase } from "../lib/supabase";

const APPLICATION_SELECT = `
  *,
  companies (id, name, website),
  resumes (id, version_name, file_path)
`;

export const applicationService = {
  async getAll(userId) {
    const { data, error } = await supabase
      .from("applications")
      .select(APPLICATION_SELECT)
      .eq("user_id", userId)
      .order("applied_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("applications")
      .select(APPLICATION_SELECT)
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(applicationData, userId) {
    const { data, error } = await supabase
      .from("applications")
      .insert([{ ...applicationData, user_id: userId }])
      .select(APPLICATION_SELECT);

    if (error) throw error;
    return data[0];
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from("applications")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select(APPLICATION_SELECT);

    if (error) throw error;
    return data[0];
  },

  async updateStatus(id, newStatus) {
    return this.update(id, { status: newStatus });
  },

  async delete(id) {
    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },

  async toggleFavorite(id, currentStatus) {
    return this.update(id, { is_favorite: !currentStatus });
  }
};
