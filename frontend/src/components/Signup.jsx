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
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Star,
  Home,
} from "lucide-react"

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
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

  const steps = [
    { id: 1, title: "Personal Details", description: "Your basic information" },
    { id: 2, title: "Email Verification", description: "Verify your email address" },
    { id: 3, title: "Law Firm Details", description: "Your firm information" },
    { id: 4, title: "Complete Registration", description: "Finalize your account" },
  ]

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

  const validateStep1 = () => {
    const errors = {}

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    // Phone number validation
    if (formData.phoneNumber.length !== 10 || !/^\d+$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid 10-digit phone number"
    }

    // Password match validation
    if (formData.password !== formData.rePassword) {
      errors.rePassword = "Passwords do not match"
    }

    const allPasswordRequirementsMet = Object.values(passwordValidation).every((req) => req)
    if (!allPasswordRequirementsMet) {
      errors.password = "Password must meet all requirements"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateStep2 = () => {
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

  const handleStep1Submit = (e) => {
    e.preventDefault()
    if (!validateStep1()) return

    // Simulate email verification
    setTimeout(() => {
      setEmailVerified(true)
    }, 2000)
  }

  const handleStep2Submit = (e) => {
    e.preventDefault()
    if (!validateStep2()) return

    setCurrentStep(3)
  }

  const handleFinalSubmit = () => {
    // Simulate redirect to home page
    console.log("Registration complete, redirecting to home...")
    // In a real app: router.push('/') or window.location.href = '/'
  }

  const nextStep = () => {
    if (currentStep === 1 && emailVerified) {
      setCurrentStep(2)
    }
  }

  const prevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
      setEmailVerified(false)
    }
  }

  // Step 1: Personal Details & Email Verification
  const renderStep1 = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="size-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <User className="size-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Create Your Account
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-4"></div>
        <p className="text-muted-foreground">Step 1 of 2: Personal Information</p>
      </div>

      <form onSubmit={handleStep1Submit} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 p-8 rounded-3xl border border-blue-100 shadow-sm">
          <div className="flex items-center mb-6">
            <Sparkles className="size-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-foreground">Personal Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-semibold text-foreground">
                <div className="size-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                  <User className="size-5 text-blue-600" />
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
                  className="w-full px-5 py-4 border-2 border-input rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-muted-foreground bg-background/80 backdrop-blur-sm text-foreground placeholder-muted-foreground shadow-sm"
                  required
                />
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 pointer-events-none ${focusedField === "fullName" ? "opacity-100" : ""}`}
                ></div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-semibold text-foreground">
                <div className="size-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                  <Mail className="size-5 text-blue-600" />
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
                  className={`w-full px-5 py-4 border-2 ${validationErrors.email ? "border-destructive" : "border-input"} rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-muted-foreground bg-background/80 backdrop-blur-sm text-foreground placeholder-muted-foreground shadow-sm`}
                  required
                />
                {validationErrors.email && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <AlertCircle className="size-5 text-destructive" />
                  </div>
                )}
              </div>
              {validationErrors.email && <p className="text-destructive text-sm mt-1">{validationErrors.email}</p>}
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-3 mt-6">
            <label className="flex items-center text-sm font-semibold text-foreground">
              <div className="size-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                <Phone className="size-5 text-blue-600" />
              </div>
              Contact Number
            </label>
            <div className="flex group">
              <span className="inline-flex items-center px-5 py-4 rounded-l-2xl border-2 border-r-0 border-input bg-gradient-to-r from-muted to-muted/80 text-foreground text-sm font-semibold shadow-sm">
                +91
              </span>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("phoneNumber")}
                onBlur={() => setFocusedField("")}
                placeholder="10 digits"
                className={`flex-1 px-5 py-4 border-2 ${validationErrors.phoneNumber ? "border-destructive" : "border-input"} rounded-r-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-muted-foreground bg-background/80 backdrop-blur-sm text-foreground placeholder-muted-foreground shadow-sm`}
                maxLength="10"
                required
              />
            </div>
            {validationErrors.phoneNumber && (
              <p className="text-destructive text-sm mt-1">{validationErrors.phoneNumber}</p>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Password */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-semibold text-foreground">
                <div className="size-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                  <Lock className="size-5 text-blue-600" />
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
                  className="w-full px-5 py-4 pr-14 border-2 border-input rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-muted-foreground bg-background/80 backdrop-blur-sm text-foreground shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-muted-foreground hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 rounded-xl"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>

              {formData.password && (
                <div className="mt-4 p-4 bg-background/60 backdrop-blur-sm rounded-2xl border border-border shadow-sm">
                  <p className="text-xs font-semibold text-foreground mb-3">Password Requirements:</p>
                  <div className="space-y-2">
                    {[
                      { key: "length", text: "At least 8 characters" },
                      { key: "uppercase", text: "One uppercase letter" },
                      { key: "lowercase", text: "One lowercase letter" },
                      { key: "number", text: "One number" },
                      { key: "special", text: "One special character" },
                    ].map(({ key, text }) => (
                      <div
                        key={key}
                        className={`flex items-center text-xs ${passwordValidation[key] ? "text-green-600" : "text-muted-foreground"}`}
                      >
                        {passwordValidation[key] ? (
                          <CheckCircle className="size-4 mr-2" />
                        ) : (
                          <X className="size-4 mr-2" />
                        )}
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-semibold text-foreground">
                <div className="size-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                  <Shield className="size-5 text-blue-600" />
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
                  className={`w-full px-5 py-4 pr-14 border-2 ${validationErrors.rePassword ? "border-destructive" : "border-input"} rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-muted-foreground bg-background/80 backdrop-blur-sm text-foreground shadow-sm`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRePassword(!showRePassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-muted-foreground hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 rounded-xl"
                >
                  {showRePassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              {validationErrors.rePassword && (
                <p className="text-destructive text-sm mt-1">{validationErrors.rePassword}</p>
              )}
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-3xl border border-blue-100 shadow-sm">
          <input
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleInputChange}
            className="size-5 text-blue-600 focus:ring-blue-500 focus:ring-2 border-2 border-input rounded-lg transition-all duration-200 hover:border-blue-400 mt-1"
            required
          />
          <label htmlFor="agreeTerms" className="text-sm text-foreground leading-6 font-medium">
            I agree to the{" "}
            <button type="button" className="text-blue-600 hover:text-blue-800 underline font-semibold">
              Terms and Conditions
            </button>{" "}
            and{" "}
            <button type="button" className="text-blue-600 hover:text-blue-800 underline font-semibold">
              Privacy Policy
            </button>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!formData.agreeTerms}
          className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:from-muted disabled:via-muted disabled:to-muted text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:transform-none disabled:hover:shadow-none disabled:cursor-not-allowed relative overflow-hidden group shadow-lg"
        >
          <span className="relative z-10 flex items-center justify-center">
            Verify Email & Continue
            <ArrowRight className="size-5 ml-2" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </form>

      {/* Email Verification Status */}
      {emailVerified && (
        <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl border border-green-200 shadow-sm">
          <div className="flex items-center justify-center mb-4">
            <div className="size-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <CheckCircle className="size-8 text-white" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-green-800 mb-2">Email Verified Successfully!</h3>
            <p className="text-green-700 mb-6">Your email has been verified. You can now proceed to the next step.</p>
            <button
              onClick={nextStep}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center mx-auto"
            >
              Continue to Law Firm Details
              <ArrowRight className="size-5 ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  )

  // Step 2: Law Firm Details
  const renderStep2 = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="size-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Building className="size-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Law Firm Details
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 mx-auto rounded-full mb-4"></div>
        <p className="text-muted-foreground">Step 2 of 2: Professional Information</p>
      </div>

      <form onSubmit={handleStep2Submit} className="space-y-6">
        <div className="bg-gradient-to-br from-purple-50/80 to-pink-50/80 p-8 rounded-3xl border border-purple-100 shadow-sm">
          <div className="flex items-center mb-6">
            <Star className="size-6 text-purple-600 mr-3" />
            <h3 className="text-xl font-semibold text-foreground">Professional Details</h3>
          </div>

          {/* Law Firm Name */}
          <div className="space-y-3 mb-6">
            <label className="flex items-center text-sm font-semibold text-foreground">
              <div className="size-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                <Building className="size-5 text-purple-600" />
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
                className={`w-full px-5 py-4 border-2 ${validationErrors.firmName ? "border-destructive" : "border-input"} rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 hover:border-muted-foreground bg-background/80 backdrop-blur-sm text-foreground placeholder-muted-foreground shadow-sm`}
                required
              />
              {validationErrors.firmName && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <AlertCircle className="size-5 text-destructive" />
                </div>
              )}
            </div>
            {validationErrors.firmName && <p className="text-destructive text-sm mt-1">{validationErrors.firmName}</p>}
          </div>

          {/* Firm Address */}
          <div className="space-y-3 mb-6">
            <label className="flex items-center text-sm font-semibold text-foreground">
              <div className="size-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                <MapPin className="size-5 text-purple-600" />
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
                rows="4"
                className="w-full px-5 py-4 border-2 border-input rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 hover:border-muted-foreground bg-background/80 backdrop-blur-sm text-foreground placeholder-muted-foreground resize-none shadow-sm"
                required
              />
            </div>
          </div>

          {/* License Number */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-semibold text-foreground">
              <div className="size-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                <FileText className="size-5 text-purple-600" />
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
                className={`w-full px-5 py-4 border-2 ${validationErrors.licenseNumber ? "border-destructive" : "border-input"} rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 hover:border-muted-foreground bg-background/80 backdrop-blur-sm text-foreground placeholder-muted-foreground shadow-sm`}
                required
              />
              {validationErrors.licenseNumber && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <AlertCircle className="size-5 text-destructive" />
                </div>
              )}
            </div>
            {validationErrors.licenseNumber && (
              <p className="text-destructive text-sm mt-1">{validationErrors.licenseNumber}</p>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 bg-gradient-to-r from-muted to-muted/80 hover:from-muted/80 hover:to-muted text-foreground font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center"
          >
            <ArrowLeft className="size-5 mr-2" />
            Go Back
          </button>
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden group shadow-lg"
          >
            <span className="relative z-10 flex items-center justify-center">
              Complete Registration
              <ArrowRight className="size-5 ml-2" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </form>
    </div>
  )

  // Step 3: Success & Redirect
  const renderStep3 = () => (
    <div className="text-center space-y-8">
      <div className="flex items-center justify-center mb-6">
        <div className="size-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
          <CheckCircle className="size-12 text-white" />
        </div>
      </div>

      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
          Registration Complete!
        </h1>
        <div className="w-32 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 mx-auto rounded-full mb-6"></div>
        <p className="text-xl text-foreground mb-2">Welcome to our platform!</p>
        <p className="text-muted-foreground mb-8">Your law firm has been successfully registered.</p>
      </div>

      <div className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 p-8 rounded-3xl border border-green-100 shadow-sm">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="size-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-4">What's Next?</h3>
        <p className="text-green-700 mb-6">
          You can now access all features of our platform. Start managing your law firm efficiently!
        </p>

        <button
          onClick={handleFinalSubmit}
          className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center mx-auto text-lg"
        >
          <Home className="size-6 mr-3" />
          Go to Dashboard
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-background/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-4xl transform transition-all duration-500 hover:shadow-3xl border border-border/20">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`size-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${currentStep >= 1 ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" : "bg-muted text-muted-foreground"}`}
            >
              1
            </div>
            <div
              className={`w-16 h-1 rounded-full transition-all duration-300 ${currentStep >= 2 ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-muted"}`}
            ></div>
            <div
              className={`size-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${currentStep >= 2 ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" : "bg-muted text-muted-foreground"}`}
            >
              2
            </div>
            <div
              className={`w-16 h-1 rounded-full transition-all duration-300 ${currentStep >= 3 ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-muted"}`}
            ></div>
            <div
              className={`size-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${currentStep >= 3 ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg" : "bg-muted text-muted-foreground"}`}
            >
              ✓
            </div>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
    </div>
  )
}

export default Register
