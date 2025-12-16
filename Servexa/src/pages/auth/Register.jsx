import { useState } from "react";
import authService from "../../services/authService";

export default function Register() {
  const [userType, setUserType] = useState("customer");
  const isUser = userType === "customer";

  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    latitude: "",
    longitude: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const [files, setFiles] = useState({
    shopPhoto: null,
    licenseDocument: null,
    idCard: null
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (isUser) {
        await authService.registerUser({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        });
      } else {
        const fd = new FormData();
        fd.append("ownerName", formData.fullName);
        fd.append("businessName", formData.businessName);
        fd.append("email", formData.email);
        fd.append("phone", formData.phone);
        fd.append("password", formData.password);
        fd.append("address", formData.address);
        fd.append("latitude", formData.latitude);
        fd.append("longitude", formData.longitude);
        fd.append("role", "ShopOwner");
        fd.append("shopPhoto", files.shopPhoto);
        fd.append("licenseDocument", files.licenseDocument);
        fd.append("idCard", files.idCard);

        await authService.registerShopOwner(fd);
      }

      setSuccess("Registration successful");
    } catch {
      setError("Registration failed");
    }

    setSubmitting(false);
  };

  return (
    <form onSubmit={submit} className="p-6 space-y-4 max-w-md mx-auto">
      <select
        value={userType}
        onChange={(e) => setUserType(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="customer">Customer</option>
        <option value="shop">Shop Owner</option>
      </select>

      <input
        name="fullName"
        placeholder="Full Name"
        onChange={handleInput}
        className="border p-2 w-full"
      />

      {!isUser && (
        <input
          name="businessName"
          placeholder="Business Name"
          onChange={handleInput}
          className="border p-2 w-full"
        />
      )}

      <input
        name="email"
        placeholder="Email"
        onChange={handleInput}
        className="border p-2 w-full"
      />

      <input
        name="phone"
        placeholder="Phone"
        onChange={handleInput}
        className="border p-2 w-full"
      />

      <div className="relative">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          onChange={handleInput}
          className="border p-2 w-full"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2.5 text-sm text-gray-600"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      {!isUser && (
        <>
          <input
            name="address"
            placeholder="Address"
            onChange={handleInput}
            className="border p-2 w-full"
          />
          <input
            name="latitude"
            placeholder="Latitude"
            onChange={handleInput}
            className="border p-2 w-full"
          />
          <input
            name="longitude"
            placeholder="Longitude"
            onChange={handleInput}
            className="border p-2 w-full"
          />

          <input type="file" name="shopPhoto" onChange={handleFile} />
          <input type="file" name="licenseDocument" onChange={handleFile} />
          <input type="file" name="idCard" onChange={handleFile} />
        </>
      )}

      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white p-2 rounded w-full"
      >
        {submitting ? "Submitting..." : "Register"}
      </button>
    </form>
  );
}
