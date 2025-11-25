import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const [files, setFiles] = useState({
    shopPhoto: null,
    licenseDocument: null,
    idCard: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState("customer"); // "customer" or "shop"

  const isUser = userType === "customer";
  const totalSteps = isUser ? 1 : 3;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles(prev => ({
      ...prev,
      [name]: selectedFiles[0]
    }));
    setError("");
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.fullName.trim()) {
          setError("Full name is required");
          return false;
        }
        if (!isUser && !formData.businessName.trim()) {
          setError("Business name is required");
          return false;
        }
        if (!formData.email.trim()) {
          setError("Email is required");
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          setError("Please enter a valid email address");
          return false;
        }
        if (!formData.phone.trim()) {
          setError("Phone number is required");
          return false;
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return false;
        }
        return true;
      
      case 2:
        if (!isUser) {
          if (!formData.address.trim()) {
            setError("Business address is required");
            return false;
          }
        }
        return true;
      
      case 3:
        if (!isUser) {
          if (!files.shopPhoto) {
            setError("Shop photo is required");
            return false;
          }
          if (!files.licenseDocument) {
            setError("Business license document is required");
            return false;
          }
          if (!files.idCard) {
            setError("Owner ID card is required");
            return false;
          }
        }
        return true;
      
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setError("");
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateStep(currentStep)) return;

    if (!isUser && currentStep < totalSteps) {
      nextStep();
      return;
    }

    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const submitData = isUser ? {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "Customer"
      } : {
        ownerName: formData.fullName,
        businessName: formData.businessName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "ShopOwner",
        address: formData.address,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        shopPhoto: files.shopPhoto?.name,
        licenseDocument: files.licenseDocument?.name,
        idCard: files.idCard?.name
      };

      console.log("Registration data:", submitData);
      setSuccess("Account created successfully! Redirecting to login...");
      setSubmitting(false);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          fullName: "",
          businessName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          address: "",
          latitude: "",
          longitude: "",
        });
        setFiles({
          shopPhoto: null,
          licenseDocument: null,
          idCard: null,
        });
        setCurrentStep(1);
        setSuccess("");
      }, 2000);
    }, 1500);
  };

  const Input = ({ type, name, placeholder, value, onChange, icon, required, step }) => (
    <div className="relative">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        step={step}
        className="w-full pl-14 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 text-gray-800 font-medium placeholder-gray-400 hover:border-gray-300"
      />
    </div>
  );

  const FileUpload = ({ name, label, accept, required = true }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 group bg-gray-50 border-gray-300">
          <div className="flex flex-col items-center justify-center p-4">
            <svg className="w-10 h-10 mb-3 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mb-2 text-sm font-medium text-gray-600 group-hover:text-blue-600">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            {files[name] ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs font-medium text-blue-700">{files[name].name}</span>
              </div>
            ) : (
              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
            )}
          </div>
          <input
            type="file"
            name={name}
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            required={required}
          />
        </label>
      </div>
    </div>
  );

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-10">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
            step < currentStep 
              ? "bg-green-500 shadow-lg shadow-green-500/50" 
              : step === currentStep
              ? "bg-blue-600 shadow-lg shadow-blue-600/50 scale-110"
              : "bg-gray-200"
          }`}>
            {step < currentStep ? (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span className={`font-bold text-lg ${step === currentStep ? "text-white" : "text-gray-500"}`}>
                {step}
              </span>
            )}
            <div className={`absolute -bottom-8 whitespace-nowrap text-xs font-medium ${
              step === currentStep ? "text-blue-600" : "text-gray-500"
            }`}>
              {step === 1 && "Account Info"}
              {step === 2 && "Business Details"}
              {step === 3 && "Documents"}
            </div>
          </div>
          {step < totalSteps && (
            <div className={`w-20 h-1 mx-3 rounded transition-all duration-300 ${
              step < currentStep ? "bg-green-500" : "bg-gray-200"
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden">
        {/* User Type Selector */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <div className="flex justify-center gap-4 mb-6">
            <button
              type="button"
              onClick={() => {
                setUserType("customer");
                setCurrentStep(1);
                setError("");
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                isUser 
                  ? "bg-white text-blue-600 shadow-lg" 
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              👤 Customer
            </button>
            <button
              type="button"
              onClick={() => {
                setUserType("shop");
                setCurrentStep(1);
                setError("");
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                !isUser 
                  ? "bg-white text-blue-600 shadow-lg" 
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              🏪 Shop Owner
            </button>
          </div>
          
          <div className="text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
              <span className="text-4xl">{isUser ? "👤" : "🏪"}</span>
            </div>
            <h1 className="text-4xl font-bold mb-3">
              {isUser ? "Create Your Account" : "Register Your Business"}
            </h1>
            <p className="text-blue-100 text-lg font-medium">
              {isUser ? "Join our community of customers" : "Start your journey as a shop owner"}
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-8 py-10">
          {!isUser && <StepIndicator />}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 animate-shake">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-start gap-3 animate-slideIn">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          )}

          <div onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Account Information */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <Input
                  type="text"
                  name="fullName"
                  placeholder={isUser ? "Full Name" : "Owner Full Name"}
                  value={formData.fullName}
                  onChange={handleInputChange}
                  icon="👤"
                  required
                />
                {!isUser && (
                  <Input
                    type="text"
                    name="businessName"
                    placeholder="Business Name"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    icon="🏪"
                    required
                  />
                )}
                <Input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  icon="📧"
                  required
                />
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  icon="📱"
                  required
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="Create Password (min. 6 characters)"
                  value={formData.password}
                  onChange={handleInputChange}
                  icon="🔒"
                  required
                />
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  icon="🔒"
                  required
                />
              </div>
            )}

            {/* Step 2: Business Details */}
            {currentStep === 2 && !isUser && (
              <div className="space-y-5 animate-fadeIn">
                <Input
                  type="text"
                  name="address"
                  placeholder="Complete Business Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  icon="📍"
                  required
                />
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-800 mb-3">📍 Location Coordinates (Optional)</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="number"
                      name="latitude"
                      placeholder="Latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      icon="🌐"
                      step="any"
                    />
                    <Input
                      type="number"
                      name="longitude"
                      placeholder="Longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      icon="🌐"
                      step="any"
                    />
                  </div>
                  <p className="text-xs text-blue-600 mt-2">Add coordinates for accurate location mapping</p>
                </div>
              </div>
            )}

            {/* Step 3: Document Upload */}
            {currentStep === 3 && !isUser && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Required Documents</p>
                      <p className="text-xs text-amber-700 mt-1">Please upload clear, readable copies of all required documents</p>
                    </div>
                  </div>
                </div>
                <FileUpload
                  name="shopPhoto"
                  label="Shop Front Photo"
                  accept="image/*"
                />
                <FileUpload
                  name="licenseDocument"
                  label="Business License"
                  accept=".pdf,.doc,.docx,image/*"
                />
                <FileUpload
                  name="idCard"
                  label="Owner ID Card"
                  accept="image/*,.pdf"
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
              )}
              
              {(!isUser && currentStep < totalSteps) ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Continue
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Create Account
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <p className="text-center text-gray-600 font-medium">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => alert("Redirecting to login...")}
              className="text-blue-600 hover:text-blue-700 font-bold transition-colors hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateX(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}