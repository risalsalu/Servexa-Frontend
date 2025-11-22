import { API_BASE_URL } from "../../utils/constants";

export default function GoogleButton({ role }) {
  const handleClick = () => {
    const query = role ? `?role=${encodeURIComponent(role)}` : "";
    window.location.href = `${API_BASE_URL}/api/auth/google/login${query}`;
  };

  return (
    <button
      onClick={handleClick}
      className="w-full border border-gray-300 rounded-xl py-2 mt-3 flex items-center justify-center gap-2 hover:bg-gray-50"
    >
      <img src="/google.svg" alt="Google" className="w-5 h-5" />
      <span className="text-sm font-medium text-gray-700">
        Continue with Google
      </span>
    </button>
  );
}
