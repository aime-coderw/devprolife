import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Upload() {
  const [type, setType] = useState("project");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [apkFile, setApkFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        const { data, error } = await supabase.storage
          .from("project-assets")
          .upload(`images/${Date.now()}-${imageFile.name}`, imageFile);
        if (error) throw error;
        imageUrl = supabase.storage
          .from("project-assets")
          .getPublicUrl(data.path).data.publicUrl;
      }

      if (type === "project") {
        let apkUrl = "";
        if (apkFile) {
          const { data, error } = await supabase.storage
            .from("project-assets")
            .upload(`apks/${Date.now()}-${apkFile.name}`, apkFile);
          if (error) throw error;
          apkUrl = supabase.storage
            .from("project-assets")
            .getPublicUrl(data.path).data.publicUrl;
        }

        const { error: insertError } = await supabase.from("projects").insert([
          { title, description, apk_url: apkUrl, image_url: imageUrl },
        ]);
        if (insertError) throw insertError;
      } else {
        const { error: insertError } = await supabase.from("blog_posts").insert([
          { title, content, image_url: imageUrl },
        ]);
        if (insertError) throw insertError;
      }

      alert("✅ Uploaded successfully!");
      setTitle("");
      setDescription("");
      setContent("");
      setApkFile(null);
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <form
        onSubmit={handleUpload}
        className="bg-gray-900 border border-gray-700 p-8 rounded-2xl shadow-xl w-full max-w-lg transition-transform transform hover:scale-[1.01]"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Upload {type === "project" ? "Project" : "Blog Post"}
        </h2>

        {/* Selector */}
        <label className="block mb-6">
          <span className="block text-sm text-gray-300 mb-2">Type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="project">Project</option>
            <option value="blog">Blog Post</option>
          </select>
        </label>

        {/* Common fields */}
        <input
          type="text"
          placeholder="Enter title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        {/* Project-specific */}
        {type === "project" && (
          <>
            <textarea
              placeholder="Enter project description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            <label className="block mb-2 text-sm text-gray-300">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="mb-6 text-gray-300"
            />

            <label className="block mb-2 text-sm text-gray-300">Upload APK</label>
            <input
              type="file"
              accept=".apk"
              onChange={(e) => setApkFile(e.target.files[0])}
              className="mb-6 text-gray-300"
            />
          </>
        )}

        {/* Blog-specific */}
        {type === "blog" && (
          <>
            <textarea
              placeholder="Enter blog content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />

            <label className="block mb-2 text-sm text-gray-300">Upload Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="mb-6 text-gray-300"
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-3 px-6 rounded-lg font-semibold shadow-md transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Uploading..." : `Upload ${type === "project" ? "Project" : "Blog"}`}
        </button>
      </form>
    </div>
  );
}
