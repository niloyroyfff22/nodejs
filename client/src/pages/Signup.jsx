import { useState } from "preact/hooks";

export default function Signup() {
  const [form, setForm] = useState({
    user: "",
    pass: ""
  });

  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function validate() {
    const newErrors = {};

    if (!form.user.trim()) {
      newErrors.user = "Username is required";
    }

    if (!form.pass.trim()) {
      newErrors.pass = "Password is required";
    } else if (form.pass.length < 6) {
      newErrors.pass = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || { general: "Signup failed" });
        return;
      }

      // success redirect
     // window.location.href = "/login";

    } catch (err) {
      setErrors({ general: "Server error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div class="lcard">
      <form class="login-form" onSubmit={handleSubmit}>
        <h2 class="form-title">Sign Up</h2>

        {errors.general && <div class="error">{errors.general}</div>}

        <div class="form-group">
          <label>Username</label>
          <div class="input-container">
            <input
              type="text"
              name="user"
              placeholder="Username"
              value={form.user}
              onInput={handleChange}
            />
            <span class="icon">👤</span>
          </div>
          {errors.user && <div class="error">{errors.user}</div>}
        </div>

        <div class="form-group">
          <label>Password</label>
          <div class="input-container">
            <input
              type={showPass ? "text" : "password"}
              name="pass"
              placeholder="Password"
              value={form.pass}
              onInput={handleChange}
            />
            <button
              type="button"
              class="password-toggle"
              onClick={() => setShowPass(!showPass)}
            >
              👁️
            </button>
          </div>
          {errors.pass && <div class="error">{errors.pass}</div>}
        </div>

        <button type="submit" class="btnn" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <div class="signup-link">
          Already Account <a href="/login">Login</a>
        </div>
      </form>
    </div>
  );
}