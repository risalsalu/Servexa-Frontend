export default function Input({ type = "text", value, onChange, placeholder }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
    />
  );
}
