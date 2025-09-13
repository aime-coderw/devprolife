import { useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function Upload() {
  const [type, setType] = useState("project"); // project or blog
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState(""); // blog content
  const [apkFile, setApkFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image if provided
      let imageUrl = "";
      if (imageFile) {
        const { data, error } = await supabase.storage
          .from("project-assets")
          .upload(`images/${Date.now()}-${imageFile.name}`, imageFile);
        if (error) throw error;
        imageUrl = supabase.storage.from("project-assets").getPublicUrl(data.path).data.publicUrl;
      }

      if (type === "project") {
        // Upload APK if provided
        let apkUrl = "";
        if (apkFile) {
          const { data, error } = await supabase.storage
            .from("project-assets")
            .upload(`apks/${Date.now()}-${apkFile.name}`, apkFile);
          if (error) throw error;
          apkUrl = supabase.storage.from("project-assets").getPublicUrl(data.path).data.publicUrl;
        }

        // Insert into projects table
        const { error: insertError } = await supabase.from("projects").insert([
          {
            title,
            description,
            apk_url: apkUrl,
            image_url: imageUrl,
          },
        ]);
        if (insertError) throw insertError;
      } else {
        // Insert into blog_posts table
        const { error: insertError } = await supabase.from("blog_posts").insert([
          {
            title,
            content,
            image_url: imageUrl,
          },
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
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <form onSubmit={handleUpload} className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Upload New {type === "project" ? "Project" : "Blog Post"}</h2>

        {/* Selector */}
        <label className="block mb-4">
          <span className="mr-2">Type:</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-gray-700 p-2 rounded"
          >
            <option value="project">Project</option>
            <option value="blog">Blog Post</option>
          </select>
        </label>

        {/* Common fields */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700"
          required
        />

        {/* Project-specific */}
        {type === "project" && (
          <>
            <textarea
              placeholder="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700"
              required
            />

            <label className="block mb-2">Upload Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="mb-4" />

            <label className="block mb-2">Upload APK</label>
            <input type="file" accept=".apk" onChange={(e) => setApkFile(e.target.files[0])} className="mb-4" />
          </>
        )}

        {/* Blog-specific */}
        {type === "blog" && (
          <>
            <textarea
              placeholder="Blog Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700"
              required
            />
            <label className="block mb-2">Upload Cover Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="mb-4" />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded"
        >
          {loading ? "Uploading..." : `Upload ${type === "project" ? "Project" : "Blog"}`}
        </button>
      </form>
    </div>
  );
}
