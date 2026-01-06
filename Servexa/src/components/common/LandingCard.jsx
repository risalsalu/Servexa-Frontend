import { Link } from "react-router-dom";

export default function LandingCard() {
  return (
    <div className="relative w-full max-w-6xl mx-auto bg-[#f6f1eb] rounded-[2.5rem] shadow-2xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-14 flex flex-col justify-center">
          <span className="text-xs tracking-widest text-[#9c6b4e] mb-4">
            PERSONALIZED HAIR & BEAUTY CARE
          </span>

          <h1 className="text-4xl lg:text-5xl font-semibold text-[#3b2a1f] leading-tight mb-6">
            Immerse yourself in a world of personalized salon & spa care
          </h1>

          <p className="text-[#6f5a4b] text-lg mb-10 max-w-xl">
            Servexa helps you manage bookings, services, and customers with a premium experience tailored for salons and spas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/login" className="px-8 py-3 rounded-full bg-[#3b2a1f] text-white font-medium">
              Continue as User
            </Link>

            <Link to="/login" className="px-8 py-3 rounded-full bg-white border border-[#3b2a1f] text-[#3b2a1f] font-medium">
              Continue as Shop Owner
            </Link>

            <Link to="/login" className="px-8 py-3 rounded-full bg-[#9c6b4e] text-white font-medium">
              Admin Access
            </Link>
          </div>
        </div>

        <div className="hidden lg:block relative">
          <img
            src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=1200&auto=format&fit=crop"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
