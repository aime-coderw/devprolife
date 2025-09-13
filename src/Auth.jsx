import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function Auth({ setActiveTab }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setActiveTab("upload");
    });

    // Listen for auth changes
    const subscription = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setActiveTab("upload");
    });

    return () => subscription.data?.unsubscribe?.();
  }, [setActiveTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let data;
      if (isLogin) {
        const { data: loginData, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        data = loginData;
      } else {
        const { data: signupData, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        data = signupData;
      }

      if (data.session || data.user) setActiveTab("upload");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded"
        >
          {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
        </button>

        <p
          className="mt-4 text-sm text-gray-400 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
        </p>
      </form>
    </div>
  );
}
