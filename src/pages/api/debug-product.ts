export const prerender = false;
import { supabase } from "../../lib/supabase";

export const GET = async () => {
  const { data, error } = await supabase.from("products").select("id").limit(1);

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return new Response(JSON.stringify({ data }), { status: 200 });
};
