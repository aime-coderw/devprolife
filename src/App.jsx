import { useState, useEffect } from "react";
import "./App.css";
import logo from "./assets/devprolife-logo.png";
import { supabase } from "./supabaseClient";
import Upload from "./upload";
import Auth from "./Auth";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";


function Navbar({ setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (tab) => {
    setActiveTab(tab);
    setIsOpen(false); // close menu when a link is clicked
  };

  return (
    <nav className="navbar">
      <img src={logo} alt="DevProlife Logo" className="logo-img" />

      <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
        <li onClick={() => handleClick("home")}>Home</li>
        <li onClick={() => handleClick("projects")}>Projects</li>
        <li onClick={() => handleClick("blog")}>Blog</li>
        <li onClick={() => handleClick("about")}>About</li>
        <li onClick={() => handleClick("contact")}>Contact</li>
        <li onClick={() => handleClick("admin")}>Admin</li>
      </ul>

      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
    </nav>
  );
}


function Projects({ projects }) {
  return (
    <section className="projects-section">
      <h3>📱 Our Apps</h3>
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <img
              src={project.image_url}
              alt={project.title}
              className="project-img"
            />
            <div className="project-content">
              <h4>{project.title}</h4>
              <p>
                {project.description.length > 120
                  ? project.description.substring(0, 120) + "..."
                  : project.description}
              </p>
              {project.apk_url && (
                <a
                  href={project.apk_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-btn"
                >
                  Download APK →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Blog({ posts, selectedPost, setSelectedPost }) {
  if (selectedPost) {
    return (
      <section className="section">
        <div className="blog-detail-card">
          <button onClick={() => setSelectedPost(null)} className="back-btn">
            ← Back to Blog
          </button>
          <h2 className="blog-detail-title">{selectedPost.title}</h2>
          {selectedPost.image_url && (
            <img
              src={selectedPost.image_url}
              alt={selectedPost.title}
              className="blog-detail-img"
            />
          )}
          <p className="blog-detail-content">{selectedPost.content}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <h3>✍️ Blog</h3>
      <div className="grid">
        {posts.map((post) => (
          <div
            key={post.id}
            className="card blog-card"
            onClick={() => setSelectedPost(post)}
          >
            {post.image_url && (
              <img src={post.image_url} alt={post.title} className="blog-img" />
            )}
            <div className="blog-content">
              <h4>{post.title}</h4>
              <p>
                {post.content.length > 100
                  ? post.content.substring(0, 100) + "..."
                  : post.content}
              </p>
              <span className="read-more">Read More →</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    // fetch projects
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setProjects(data);
    };
    fetchProjects();

    // fetch blog posts
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setPosts(data);
    };
    fetchPosts();

    // auth session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) setUser(data.session.user);
    });

    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(session.user);
      else setUser(null);
    });

    return () => subscription?.unsubscribe?.();
  }, []);

  return (
    <div className="app">
      <Navbar setActiveTab={setActiveTab} />

      <div className="content">
        {activeTab === "home" && (
          <>
            <Projects projects={projects} />
            <section className="blog-home-section">
              <h3>✍️ Latest Blog Posts</h3>
              <div className="grid">
                {posts.slice(0, 4).map((post) => (
                  <div
                    key={post.id}
                    className="card blog-card"
                    onClick={() => setSelectedPost(post)}
                  >
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="blog-img"
                      />
                    )}
                    <div className="blog-content">
                      <h4>{post.title}</h4>
                      <p>
                        {post.content.length > 100
                          ? post.content.substring(0, 100) + "..."
                          : post.content}
                      </p>
                      <span className="read-more">Read More →</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === "projects" && <Projects projects={projects} />}
        {activeTab === "blog" && (
          <Blog posts={posts} selectedPost={selectedPost} setSelectedPost={setSelectedPost} />
        )}

        {activeTab === "about" && (
          <section className="about-section">
            <h1>👨‍💻 About Us</h1>
            <div className="about-card">
              <p>
                At <strong>DevProLife</strong>, we are committed to developing innovative and dependable
                applications that improve everyday life. Our goal is to provide technology
                solutions that are practical, accessible, and designed with the user in mind.
              </p>
              <p>
                We focus on creating digital tools that simplify tasks, enhance productivity,
                and foster meaningful connections. Each of our projects is guided by three principles:
              </p>
              <ul>
                <li><strong>Purpose-driven development</strong> – every product is built to address real needs.</li>
                <li><strong>User-centered design</strong> – we listen, adapt, and improve based on feedback.</li>
                <li><strong>Continuous growth</strong> – as technology advances, we strive to remain at the forefront.</li>
              </ul>
              <p>
                With a passion for innovation and a dedication to quality,
                <strong> DevProLife </strong> seeks to empower individuals and communities through technology.
              </p>
            </div>
          </section>
        )}

   
{activeTab === "contact" && (
  <section className="contact-section">
    <div className="contact-card">
      <h1>📬 Contact Us</h1>
      <p>Email: <a href="mailto:aimemeddy25@gmail.com">aimemeddy25@gmail.com</a></p>
      <p>Phone: <a href="tel:+250791231993">+250 791 231 993</a></p>
      

      <div className="social-links">
        <h3>Follow Us</h3>
        <a href="https://facebook.com/aimenilo" target="_blank" rel="noopener noreferrer">
          <FaFacebook /> Facebook
        </a>
        <a href="https://twitter.com/aimenilo" target="_blank" rel="noopener noreferrer">
          <FaTwitter /> Twitter
        </a>
        <a href="https://instagram.com/aimenilo" target="_blank" rel="noopener noreferrer">
          <FaInstagram /> Instagram
        </a>
        <a href="https://linkedin.com/in/aimenilo" target="_blank" rel="noopener noreferrer">
          <FaLinkedin /> LinkedIn
        </a>
        <a href="https://youtube.com/@aimenilorw" target="_blank" rel="noopener noreferrer">
          <FaYoutube /> YouTube
        </a>
      </div>
<p>Feel free to reach out for collaborations or inquiries.</p>
      <form
        className="contact-form"
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const name = formData.get("name");
          const email = formData.get("email");
          const message = formData.get("message");

          const { error } = await supabase
            .from("contacts")
            .insert([{ name, email, message }]);

          if (error) alert("Error sending message!");
          else {
            alert("Message sent successfully!");
            e.target.reset();
          }
        }}
      >
        <input type="text" name="name" placeholder="Your Name" required />
        <input type="email" name="email" placeholder="Your Email" required />
        <textarea name="message" placeholder="Your Message" rows="5" required />
        <button type="submit">Send Message</button>
      </form>
    </div>
  </section>
)}

        {activeTab === "admin" && user && <Upload />}
        {activeTab === "admin" && !user && <Auth setActiveTab={setActiveTab} />}
      </div>
    </div>
  );
}
