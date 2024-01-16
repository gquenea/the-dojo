import { useEffect, useState } from "react";
import "./Signup.css";
import useSignup from "../../hooks/useSignup";

export default function Signup() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailError, setThumbnaiError] = useState<string | null>("");
  const { signup, isPending, error } = useSignup();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    signup(email, password, displayName, thumbnail);
  };

  const handleFileChange = (e: any) => {
    setThumbnail(null);
    let selected = e.target.files[0];

    if (!selected) {
      setThumbnaiError("Please select a file");
      return;
    }
    if (!selected.type.includes("image")) {
      setThumbnaiError("Selected file must be an image");
      return;
    }
    if (selected.size > 100000) {
      setThumbnaiError("Image file size must be less than 100Kb");
      return;
    }
    setThumbnaiError(null);
    setThumbnail(selected);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Sign up</h2>
      <label>
        <span>email:</span>
        <input
          required
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </label>
      <label>
        <span>password:</span>
        <input
          required
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </label>
      <label>
        <span>displayName:</span>
        <input
          required
          type="text"
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName}
        />
      </label>
      <label>
        <span>thumbnail:</span>
        <input required type="file" onChange={handleFileChange} />
        {thumbnailError && <div className="error">{thumbnailError}</div>}
      </label>
      {!isPending && <button className="btn">Sign up</button>}
      {isPending && (
        <button className="btn" disabled>
          Loading
        </button>
      )}

      {error && <div className="error">{error}</div>}
    </form>
  );
}
