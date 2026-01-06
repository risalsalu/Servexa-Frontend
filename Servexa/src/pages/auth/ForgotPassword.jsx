import { useState } from "react";
import authApi from "../../api/auth.api";
import Input from "../../components/common/Input";

export default function ForgotPassword() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await authApi.forgotPassword({ emailOrPhone });
    setMsg("Reset link sent");
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-6 space-y-4">
      <Input placeholder="Email or Phone" onChange={e => setEmailOrPhone(e.target.value)} />
      <button className="w-full bg-blue-600 text-white py-3 rounded-xl">Send</button>
      {msg && <p className="text-green-600 text-center">{msg}</p>}
    </form>
  );
}
