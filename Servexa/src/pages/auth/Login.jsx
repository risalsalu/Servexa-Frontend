import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import Input from "../../components/common/Input";

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(emailOrPhone, password);
      if (user.role === "Admin") navigate("/admin/dashboard", { replace: true });
      else if (user.role === "ShopOwner") navigate("/shop/dashboard", { replace: true });
      else navigate("/user/dashboard", { replace: true });
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-8 rounded-2xl w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <Input value={emailOrPhone} onChange={e => setEmailOrPhone(e.target.value)} placeholder="Email or Phone" />
        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold">
          Login
        </button>
      </form>
    </div>
  );
}
