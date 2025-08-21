"use client"

import { useState } from "react"
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  Shield,
  Building,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
  Check,
  X,
} from "lucide-react"

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })
  const [validationErrors, setValidationErrors] = useState({})

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    rePassword: "",
    phoneNumber: "",
    firmName: "",
    firmAddress: "",
    licenseNumber: "",
    agreeTerms: false,
  })
  const [focusedField, setFocusedField] = useState("")

  const validatePassword = (password) => {
    const validation = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }
    setPasswordValidation(validation)
    return validation
  }

  const validateForm = () => {
    const errors = {}

    // Check for duplicate firm name (simulated)
    const existingFirms = ["ABC Law Associates", "XYZ Legal Services", "Smith & Partners"]
    if (existingFirms.includes(formData.firmName)) {
      errors.firmName = "This firm name is already registered"
    }

    // Check for duplicate license number (simulated)
    const existingLicenses = ["LIC123456", "LIC789012", "LIC345678"]
    if (existingLicenses.includes(formData.licenseNumber)) {
      errors.licenseNumber = "This license number is already registered"
    }

    // Password match validation
    if (formData.password !== formData.rePassword) {
      errors.rePassword = "Passwords do not match"
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    // Phone number validation
    if (formData.phoneNumber.length !== 10 || !/^\d+$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid 10-digit phone number"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    if (name === "password") {
      validatePassword(value)
    }

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const allPasswordRequirementsMet = Object.values(passwordValidation).every((req) => req)
    if (!allPasswordRequirementsMet) {
      alert("Please ensure your password meets all requirements")
      return
    }

    console.log("Form submitted:", formData)

    setShowSuccessAlert(true)

    // Hide alert after 5 seconds
    setTimeout(() => {
      setShowSuccessAlert(false)
    }, 5000)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {showSuccessAlert && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-slide-in-right">
          <CheckCircle className="w-6 h-6" />
          <div>
            <p className="font-semibold">Registration Successful!</p>
            <p className="text-sm opacity-90">Email verification link sent to your email</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl transform transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
        {/* Header with icon */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Law Firm Registration
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-3 text-sm">Register your law firm and create your account</p>
          <p className="text-gray-500 text-xs mt-1">For Senior Lawyer/Firm Head only</p>
          <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-700 text-xs flex items-center justify-center">
              <Mail className="w-3 h-3 mr-1" />
              Email verification will be required after registration
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details Section */}
          <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-6 rounded-2xl border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-indigo-600" />
              Personal Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                  Full Name
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("fullName")}
                    onBlur={() => setFocusedField("")}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 hover:border-gray-300 bg-gray-50/50 focus:bg-white group-hover:shadow-md text-gray-800 placeholder-gray-400"
                    required
                  />
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 pointer-events-none ${focusedField === "fullName" ? "opacity-100" : ""}`}
                  ></div>
                </div>
              </div>

              {/* Email Id */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Mail className="w-4 h-4 text-indigo-600" />
                  </div>
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    placeholder="lawyer@lawfirm.com"
                    className={`w-full px-4 py-4 border-2 ${validationErrors.email ? "border-red-300" : "border-gray-200"} rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 hover:border-gray-300 bg-gray-50/50 focus:bg-white group-hover:shadow-md text-gray-800 placeholder-gray-400`}
                    required
                  />
                  {validationErrors.email && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                  )}
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 pointer-events-none ${focusedField === "email" ? "opacity-100" : ""}`}
                  ></div>
                </div>
                {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
              </div>
            </div>

            {/* Phone number */}
            <div className="space-y-2 mt-4">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Phone className="w-4 h-4 text-indigo-600" />
                </div>
                Contact Number
              </label>
              <div className="flex group">
                <span className="inline-flex items-center px-4 py-4 rounded-l-xl border-2 border-r-0 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-sm font-semibold group-hover:border-gray-300 transition-all duration-300">
                  +91
                </span>
                <div className="relative flex-1">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("phoneNumber")}
                    onBlur={() => setFocusedField("")}
                    placeholder="10 digits"
                    className={`w-full px-4 py-4 border-2 ${validationErrors.phoneNumber ? "border-red-300" : "border-gray-200"} rounded-r-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 hover:border-gray-300 bg-gray-50/50 focus:bg-white group-hover:shadow-md text-gray-800 placeholder-gray-400`}
                    maxLength="10"
                    required
                  />
                  <div
                    className={`absolute inset-0 rounded-r-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 pointer-events-none ${focusedField === "phoneNumber" ? "opacity-100" : ""}`}
                  ></div>
                </div>
              </div>
              {validationErrors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.phoneNumber}</p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 p-6 rounded-2xl border border-purple-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2 text-purple-600" />
              Law Firm Details
            </h3>

            {/* Firm Name */}
            <div className="space-y-2 mb-4">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mr-3">
                  <Building className="w-4 h-4 text-purple-600" />
                </div>
                Law Firm Name
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="firmName"
                  value={formData.firmName}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("firmName")}
                  onBlur={() => setFocusedField("")}
                  placeholder="Enter your law firm name"
                  className={`w-full px-4 py-4 border-2 ${validationErrors.firmName ? "border-red-300" : "border-gray-200"} rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 hover:border-gray-300 bg-gray-50/50 focus:bg-white group-hover:shadow-md text-gray-800 placeholder-gray-400`}
                  required
                />
                {validationErrors.firmName && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 pointer-events-none ${focusedField === "firmName" ? "opacity-100" : ""}`}
                ></div>
              </div>
              {validationErrors.firmName && <p className="text-red-500 text-xs mt-1">{validationErrors.firmName}</p>}
            </div>

            {/* Firm Address */}
            <div className="space-y-2 mb-4">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mr-3">
                  <MapPin className="w-4 h-4 text-purple-600" />
                </div>
                Firm Address
              </label>
              <div className="relative group">
                <textarea
                  name="firmAddress"
                  value={formData.firmAddress}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("firmAddress")}
                  onBlur={() => setFocusedField("")}
                  placeholder="Enter complete firm address"
                  rows="3"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 hover:border-gray-300 bg-gray-50/50 focus:bg-white group-hover:shadow-md text-gray-800 placeholder-gray-400 resize-none"
                  required
                />
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 pointer-events-none ${focusedField === "firmAddress" ? "opacity-100" : ""}`}
                ></div>
              </div>
            </div>

            {/* License Number */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                License Number
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("licenseNumber")}
                  onBlur={() => setFocusedField("")}
                  placeholder="Enter law firm license number"
                  className={`w-full px-4 py-4 border-2 ${validationErrors.licenseNumber ? "border-red-300" : "border-gray-200"} rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 hover:border-gray-300 bg-gray-50/50 focus:bg-white group-hover:shadow-md text-gray-800 placeholder-gray-400`}
                  required
                />
                {validationErrors.licenseNumber && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 pointer-events-none ${focusedField === "licenseNumber" ? "opacity-100" : ""}`}
                ></div>
              </div>
              {validationErrors.licenseNumber && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.licenseNumber}</p>
              )}
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 p-6 rounded-2xl border border-indigo-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-indigo-600" />
              Security Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Lock className="w-4 h-4 text-indigo-600" />
                  </div>
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    placeholder="Create strong password"
                    className="w-full px-4 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 hover:border-gray-300 bg-gray-50/50 focus:bg-white group-hover:shadow-md text-gray-800"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-indigo-600 transition-all duration-200 hover:bg-indigo-50 rounded-lg"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 pointer-events-none ${focusedField === "password" ? "opacity-100" : ""}`}
                  ></div>
                </div>

                {formData.password && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Password Requirements:</p>
                    <div className="space-y-1">
                      <div
                        className={`flex items-center text-xs ${passwordValidation.length ? "text-green-600" : "text-gray-500"}`}
                      >
                        {passwordValidation.length ? (
                          <Check className="w-3 h-3 mr-1" />
                        ) : (
                          <X className="w-3 h-3 mr-1" />
                        )}
                        At least 8 characters
                      </div>
                      <div
                        className={`flex items-center text-xs ${passwordValidation.uppercase ? "text-green-600" : "text-gray-500"}`}
                      >
                        {passwordValidation.uppercase ? (
                          <Check className="w-3 h-3 mr-1" />
                        ) : (
                          <X className="w-3 h-3 mr-1" />
                        )}
                        One uppercase letter
                      </div>
                      <div
                        className={`flex items-center text-xs ${passwordValidation.lowercase ? "text-green-600" : "text-gray-500"}`}
                      >
                        {passwordValidation.lowercase ? (
                          <Check className="w-3 h-3 mr-1" />
                        ) : (
                          <X className="w-3 h-3 mr-1" />
                        )}
                        One lowercase letter
                      </div>
                      <div
                        className={`flex items-center text-xs ${passwordValidation.number ? "text-green-600" : "text-gray-500"}`}
                      >
                        {passwordValidation.number ? (
                          <Check className="w-3 h-3 mr-1" />
                        ) : (
                          <X className="w-3 h-3 mr-1" />
                        )}
                        One number
                      </div>
                      <div
                        className={`flex items-center text-xs ${passwordValidation.special ? "text-green-600" : "text-gray-500"}`}
                      >
                        {passwordValidation.special ? (
                          <Check className="w-3 h-3 mr-1" />
                        ) : (
                          <X className="w-3 h-3 mr-1" />
                        )}
                        One special character (!@#$%^&*)
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Re-Password */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Shield className="w-4 h-4 text-indigo-600" />
                  </div>
                  Confirm Password
                </label>
                <div className="relative group">
                  <input
                    type={showRePassword ? "text" : "password"}
                    name="rePassword"
                    value={formData.rePassword}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("rePassword")}
                    onBlur={() => setFocusedField("")}
                    placeholder="Confirm your password"
                    className={`w-full px-4 py-4 pr-12 border-2 ${validationErrors.rePassword ? "border-red-300" : "border-gray-200"} rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 hover:border-gray-300 bg-gray-50/50 focus:bg-white group-hover:shadow-md text-gray-800`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRePassword(!showRePassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-indigo-600 transition-all duration-200 hover:bg-indigo-50 rounded-lg"
                  >
                    {showRePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 pointer-events-none ${focusedField === "rePassword" ? "opacity-100" : ""}`}
                  ></div>
                </div>
                {validationErrors.rePassword && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.rePassword}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center text-sm text-gray-600 py-2">
            Already have an account?
            <button
              type="button"
              className="text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text hover:from-indigo-700 hover:to-purple-700 font-semibold ml-1 transition-all duration-200 hover:scale-105"
            >
              Sign In Now
            </button>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-xl border border-indigo-100">
            <div className="relative">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 focus:ring-2 border-2 border-gray-300 rounded-md transition-all duration-200 hover:border-indigo-400"
                required
              />
              {formData.agreeTerms && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-3 h-3 bg-indigo-600 rounded-sm animate-pulse"></div>
                </div>
              )}
            </div>
            <label htmlFor="agreeTerms" className="text-sm text-gray-700 leading-6 font-medium">
              I agree to the{" "}
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-800 underline font-semibold"
                onClick={() => window.open("/terms-conditions", "_blank")}
              >
                Terms and Conditions
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-800 underline font-semibold"
                onClick={() => window.open("/privacy-policy", "_blank")}
              >
                Privacy Policy
              </button>{" "}
              for law firm registration
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!formData.agreeTerms}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:transform-none disabled:hover:shadow-none disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <span className="relative z-10">Register Law Firm</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}

export default Register
