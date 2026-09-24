import { useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  getProfile,
  logoutUser,
} from "./services/api";

function Logo() {
  return (
    <div className="logo">
      <b>VS</b>
      VIMAL STUDIO
    </div>
  );
}

/* =========================
   IMAGE SLIDER
========================= */

function ImageSlider() {
  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85",
      title: "Build your future",
      subtitle: "Create. Learn. Grow.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85",
      title: "Learn together",
      subtitle: "Ideas become better when shared.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85",
      title: "Work smarter",
      subtitle: "Turn your skills into real projects.",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const previousSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="slider">
      <img src={slides[current].image} alt={slides[current].title} />

      <div className="slider-gradient"></div>

      <div className="slider-content">
        <strong>{slides[current].title}</strong>
        <span>{slides[current].subtitle}</span>
      </div>

      <button
        type="button"
        className="slider-btn slider-prev"
        onClick={previousSlide}
        aria-label="Previous slide"
      >
        ←
      </button>

      <button
        type="button"
        className="slider-btn slider-next"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        →
      </button>

      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            type="button"
            key={index}
            className={index === current ? "active" : ""}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================
   AUTH SHELL
========================= */

function AuthShell({ children, mode, setMode }) {
  return (
    <main className="auth">
      <section className="hero">
        <Logo />

        <div className="hero-middle">
          <small>SECURE STUDENT PORTAL</small>

          <h1>
            One account.
            <br />
            <i>Everything you need.</i>
          </h1>

          <ImageSlider />

          <p>
            A clean authentication experience powered by JWT access tokens,
            refresh-token rotation and role-based access.
          </p>

          <div className="pills">
            <span>✓ JWT Auth</span>
            <span>✓ bcrypt</span>
            <span>✓ Role Based Access</span>
            <span>✓ Choti kahi ki</span>
          </div>
        </div>

        <footer>© 2026 Vimal Studio</footer>
      </section>

      <section className="formside">
        <div className="mobile">
          <Logo />
        </div>

        {children}

        <button
          type="button"
          className="switch"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login"
            ? "Need an account? Create one"
            : "Already have an account? Sign in"}
        </button>
      </section>
    </main>
  );
}

/* =========================
   LOGIN
========================= */

function Login({ setMode, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const loginData = await loginUser(email, password);

      console.log("Login response:", loginData);

      onLogin(loginData);
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell mode="login" setMode={setMode}>
      <div className="form">
        <small>WELCOME BACK</small>

        <h2>Sign in</h2>

        <p>Enter your details to access your account.</p>

        <form onSubmit={handleLogin}>
          <label>Email</label>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <div className="row">
            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <button type="button">Forgot password?</button>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="primary" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}

            <span>→</span>
          </button>
        </form>

        <div className="secure">SECURE CONNECTION</div>
      </div>
    </AuthShell>
  );
}

/* =========================
   REGISTER
========================= */

function Register({ setMode, onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser(name, email, password);

      console.log("Register response:", data);

      onRegister();
    } catch (error) {
      console.error("Register error:", error);

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell mode="register" setMode={setMode}>
      <div className="form">
        <small>GET STARTED</small>

        <h2>Create account</h2>

        <p>Join the student portal in a few seconds.</p>

        <form onSubmit={handleRegister}>
          <label>Full name</label>

          <input
            placeholder="Vimal Chamoli"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />

          <label>Email</label>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          <label>Confirm password</label>

          <input
            type="password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="primary" disabled={loading}>
            {loading ? "Creating..." : "Create account"}

            <span>→</span>
          </button>
        </form>

        <p className="note">
          By creating an account, you agree to the portal terms.
        </p>
      </div>
    </AuthShell>
  );
}

/* =========================
   DASHBOARD
========================= */

function Dashboard({ user, onLogout }) {
  return (
    <main className="dash">
      <header>
        <Logo />

        <div>
          <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>

          <button type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <section className="content">
        <small>DASHBOARD</small>

        <h1>Welcome back, {user.name}.</h1>

        <p>Your account is successfully connected to the backend.</p>

        <span className="status">● Authenticated</span>

        <div className="cards">
          <article>
            <div className="big">{user.name?.charAt(0).toUpperCase()}</div>

            <h3>{user.name}</h3>

            <em>{user.role}</em>

            <hr />

            <p>
              Email
              <strong>{user.email}</strong>
            </p>

            <p>
              Role
              <strong>{user.role}</strong>
            </p>

            <p>
              Session
              <strong className="green">Active</strong>
            </p>
          </article>

          <article>
            <small>AUTH FLOW</small>

            <h3>Backend integration</h3>

            <div className="flow">
              <div>
                <b>01</b>
                <span>Login & Register</span>
                <small>Connected</small>
              </div>

              <div>
                <b>02</b>
                <span>JWT Access Token</span>
                <small>15 min</small>
              </div>

              <div>
                <b>03</b>
                <span>Refresh Token</span>
                <small>Rotation enabled</small>
              </div>

              <div>
                <b>04</b>
                <span>Protected Profile</span>
                <small>Role based</small>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

/* =========================
   APP
========================= */

function App() {
  const [mode, setMode] = useState("login");

  const [user, setUser] = useState(null);

  const handleLogin = async (loginData) => {
    try {
      const accessToken = loginData.token.accessToken;

      const refreshToken = loginData.token.refreshToken;

      sessionStorage.setItem("accessToken", accessToken);

      sessionStorage.setItem("refreshToken", refreshToken);

      console.log("ACCESS TOKEN:", accessToken);

      const profileData = await getProfile(accessToken);

      console.log("Profile response:", profileData);

      setUser(profileData.studentData);
    } catch (error) {
      console.error("Profile error:", error);

      sessionStorage.removeItem("accessToken");

      sessionStorage.removeItem("refreshToken");
    }
  };

  const handleLogout = async () => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");

      if (accessToken) {
        await logoutUser(accessToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }

    sessionStorage.removeItem("accessToken");

    sessionStorage.removeItem("refreshToken");

    setUser(null);
  };

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  if (mode === "register") {
    return <Register setMode={setMode} onRegister={() => setMode("login")} />;
  }

  return <Login setMode={setMode} onLogin={handleLogin} />;
}

export default App;
