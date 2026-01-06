import { useState } from "react";
import authApi from "../../api/auth.api";
import Input from "../../components/common/Input";

export default function RegisterUser() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: ""
  });
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await authApi.registerUser(form);
    setMsg("Registration successful");
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-6 space-y-4">
      <Input placeholder="Full Name" onChange={e => setForm({ ...form, fullName: e.target.value })} />
      <Input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <Input placeholder="Phone" onChange={e => setForm({ ...form, phone: e.target.value })} />
      <Input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button className="w-full bg-blue-600 text-white py-3 rounded-xl">Register</button>
      {msg && <p className="text-green-600 text-center">{msg}</p>}
    </form>
  );
}
