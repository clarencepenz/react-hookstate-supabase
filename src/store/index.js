import { hookstate, useHookstate } from "@hookstate/core";
import { devtools } from "@hookstate/devtools";
import { supabase } from "../config/supabaseClient";

const initialState = hookstate(
  {
    success: null,
    errorMsg: null,
    blog: [],
  },
  devtools({ key: "my-state-label" })
);

export const useGlobalState = () => {
  const state = useHookstate(initialState);

  return {
    getBlogCount: () => state.blog.length,
    success: () => state.success.value,
    errorMsg: () => state.errorMsg.value,
    clearErrorMsg: () => state.errorMsg.set(null),
    clearSuccess: () => state.success.set(null),
    getBlogs: async () => {
      const { data, error } = await supabase
        .from("blog")
        .select()
        .order("created_at", { ascending: false });
      state.blog.set(data);
      if (error) {
        state.errorMsg.set("Error occured while fetching blog");
      }
    },
    fetchBlogs: () => state.blog,
    addBlog: async (content, session) => {
      const { data, error } = await supabase
      .from("blog")
      .insert([
        { content,  user_id: session.user.id, email: session.user.email },
      ])
      .select();

      if (data) {
        state.success.set("Blog added successfully");
      }
      if (error) {
        state.errorMsg.set("Error occured while adding blog");
      }
    },
    updateBlog: async (id, session, content) => {
      const { data, error } = await supabase
        .from("blog")
        .update({ content })
        .eq("user_id", session.user.id)
        .eq("id", id)
        .select();

      if (data) {
        state.success.set("Blog updated successfully");
      }
      if (error) {
        state.errorMsg.set("Error occured while updating blog");
      }
    },
    deleteBlog: async (id, session) => {
      const { data, error } = await supabase
        .from("blog")
        .delete()
        .eq("user_id", session.user.id)
        .eq("id", id)
        .select();

      if (data) {
        state.success.set("Blog deleted successfully");
      }
      if (error) {
        state.errorMsg.set("Error occured while deleting blog");
      }
    },
  };
};
