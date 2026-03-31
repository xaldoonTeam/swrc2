import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ArrowRight, Check, User, Briefcase, GraduationCap, 
  Send, AlertCircle, CheckCircle, Sparkles,
  Award, BookOpen, Clock
} from "lucide-react";

// Program options
const PROGRAMS = [
  {
    id: "lawyer-training",
    title: "Lawyer Training",
    duration: "6 months",
    description: "Comprehensive legal training for aspiring lawyers",
    icon: <Briefcase size={20} />
  },
  {
    id: "employment-training",
    title: "Employment Training",
    duration: "3 months",
    description: "Job readiness, CV writing, and interview skills",
    icon: <User size={20} />
  },
  {
    id: "kg-teacher-training",
    title: "KG Teacher Training",
    duration: "4 months",
    description: "Early childhood education certification",
    icon: <GraduationCap size={20} />
  },
  {
    id: "leadership-program",
    title: "Women's Leadership",
    duration: "2 months",
    description: "Develop leadership and management skills",
    icon: <Award size={20} />
  }
];

const STEPS = [
  { id: "personal", title: "Personal Info", icon: <User size={16} /> },
  { id: "program", title: "Select Program", icon: <BookOpen size={16} /> },
  { id: "education", title: "Education", icon: <GraduationCap size={16} /> },
  { id: "review", title: "Review", icon: <CheckCircle size={16} /> }
];

const ApplyProgram: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    location: "",
    
    // Program
    selectedProgram: "",
    motivation: "",
    hearAbout: "",
    
    // Education
    highestEducation: "",
    institution: "",
    graduationYear: "",
    fieldOfStudy: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 0) {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      if (!formData.location) newErrors.location = "Location is required";
    }
    
    if (currentStep === 1) {
      if (!formData.selectedProgram) newErrors.selectedProgram = "Please select a program";
      if (!formData.motivation) newErrors.motivation = "Please tell us why you want to join";
    }
    
    if (currentStep === 2) {
      if (!formData.highestEducation) newErrors.highestEducation = "Education level is required";
      if (!formData.institution) newErrors.institution = "Institution name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={40} className="text-green-600" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Application Submitted!</h2>
          <p className="text-slate-500 mb-6">
            Thank you for applying to the program. We'll review your application and get back to you within 3-5 business days.
          </p>
          
          <div className="bg-amber-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800">
              📧 A confirmation email has been sent to {formData.email}
            </p>
          </div>
          
          <button
            onClick={() => window.location.href = "/"}
            className="w-full bg-amber-600 text-white py-3 rounded-xl font-medium hover:bg-amber-700 transition-colors"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50/30">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full mb-4">
            <Sparkles size={14} className="text-amber-600" />
            <span className="text-xs font-medium text-amber-700 uppercase tracking-wider">
              Apply Now
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-4">
            Join Our <span className="font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">Programs</span>
          </h1>
          
          <p className="text-slate-500 max-w-2xl mx-auto">
            Take the next step in your journey. Apply for our transformative programs 
            and unlock your full potential.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex-1 relative">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      index <= currentStep
                        ? "bg-amber-600 text-white shadow-lg"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {index < currentStep ? <Check size={16} /> : step.icon}
                  </div>
                  <span className={`text-xs mt-2 hidden md:block ${
                    index <= currentStep ? "text-slate-700" : "text-slate-400"
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-0.5 -translate-y-1/2 ${
                      index < currentStep ? "bg-amber-600" : "bg-slate-100"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Info */}
            {currentStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.firstName ? "border-red-300 bg-red-50" : "border-slate-200"
                      } focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.lastName ? "border-red-300 bg-red-50" : "border-slate-200"
                      } focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.email ? "border-red-300 bg-red-50" : "border-slate-200"
                      } focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.phone ? "border-red-300 bg-red-50" : "border-slate-200"
                      } focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                      placeholder="+252 XXX XXX XXX"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Location / City *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.location ? "border-red-300 bg-red-50" : "border-slate-200"
                      } focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                      placeholder="Hargeisa, Somaliland"
                    />
                    {errors.location && (
                      <p className="text-xs text-red-500 mt-1">{errors.location}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Select Program */}
            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Select Program *
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {PROGRAMS.map((program) => (
                      <motion.div
                        key={program.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData(prev => ({ ...prev, selectedProgram: program.id }))}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.selectedProgram === program.id
                            ? "border-amber-500 bg-amber-50"
                            : "border-slate-200 hover:border-amber-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                            formData.selectedProgram === program.id
                              ? "border-amber-500 bg-amber-500"
                              : "border-slate-300"
                          }`}>
                            {formData.selectedProgram === program.id && (
                              <Check size={10} className="text-white" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {program.icon}
                              <h3 className="font-semibold text-slate-800">{program.title}</h3>
                            </div>
                            <p className="text-xs text-slate-400 mb-1">
                              <Clock size={10} className="inline mr-1" />
                              {program.duration}
                            </p>
                            <p className="text-xs text-slate-500">{program.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {errors.selectedProgram && (
                    <p className="text-xs text-red-500 mt-2">{errors.selectedProgram}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Why do you want to join this program? *
                  </label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.motivation ? "border-red-300 bg-red-50" : "border-slate-200"
                    } focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                    placeholder="Tell us about your motivation, goals, and what you hope to achieve..."
                  />
                  {errors.motivation && (
                    <p className="text-xs text-red-500 mt-1">{errors.motivation}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    How did you hear about us?
                  </label>
                  <select
                    name="hearAbout"
                    value={formData.hearAbout}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select an option</option>
                    <option value="social">Social Media</option>
                    <option value="friend">Friend/Family</option>
                    <option value="workshop">Workshop/Event</option>
                    <option value="radio">Radio</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </motion.div>
            )}

            {/* Step 3: Education */}
            {currentStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Highest Education Level *
                    </label>
                    <select
                      name="highestEducation"
                      value={formData.highestEducation}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.highestEducation ? "border-red-300 bg-red-50" : "border-slate-200"
                      } focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                    >
                      <option value="">Select education level</option>
                      <option value="highschool">High School Diploma</option>
                      <option value="bachelor">Bachelor's Degree</option>
                      <option value="master">Master's Degree</option>
                      <option value="diploma">Diploma/Certificate</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.highestEducation && (
                      <p className="text-xs text-red-500 mt-1">{errors.highestEducation}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Institution Name *
                    </label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.institution ? "border-red-300 bg-red-50" : "border-slate-200"
                      } focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                      placeholder="University or school name"
                    />
                    {errors.institution && (
                      <p className="text-xs text-red-500 mt-1">{errors.institution}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Field of Study
                    </label>
                    <input
                      type="text"
                      name="fieldOfStudy"
                      value={formData.fieldOfStudy}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="e.g., Law, Business, Education"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Graduation Year
                    </label>
                    <input
                      type="text"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="YYYY"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review */}
            {currentStep === 3 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <User size={16} /> Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <p><span className="text-slate-400">Name:</span> {formData.firstName} {formData.lastName}</p>
                    <p><span className="text-slate-400">Email:</span> {formData.email}</p>
                    <p><span className="text-slate-400">Phone:</span> {formData.phone}</p>
                    <p><span className="text-slate-400">Location:</span> {formData.location}</p>
                    {formData.dateOfBirth && (
                      <p><span className="text-slate-400">Date of Birth:</span> {formData.dateOfBirth}</p>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <BookOpen size={16} /> Program Selection
                  </h3>
                  <p className="text-sm">
                    <span className="text-slate-400">Selected Program:</span>{' '}
                    <span className="font-medium text-amber-600">
                      {PROGRAMS.find(p => p.id === formData.selectedProgram)?.title || formData.selectedProgram}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="text-slate-400">Motivation:</span> {formData.motivation}
                  </p>
                  {formData.hearAbout && (
                    <p className="text-sm">
                      <span className="text-slate-400">How did you hear about us:</span> {formData.hearAbout}
                    </p>
                  )}
                </div>

                <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <GraduationCap size={16} /> Education
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <p><span className="text-slate-400">Education Level:</span> {formData.highestEducation}</p>
                    <p><span className="text-slate-400">Institution:</span> {formData.institution}</p>
                    {formData.fieldOfStudy && <p><span className="text-slate-400">Field:</span> {formData.fieldOfStudy}</p>}
                    {formData.graduationYear && <p><span className="text-slate-400">Graduation Year:</span> {formData.graduationYear}</p>}
                  </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-4">
                  <p className="text-sm text-amber-800 flex items-start gap-2">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    By submitting this application, you confirm that all information provided is accurate and complete.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12">
            <button
              type="button"
              onClick={handleBack}
              className={`px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:border-amber-300 hover:text-amber-600 transition-all ${
                currentStep === 0 ? "invisible" : ""
              }`}
            >
              Back
            </button>
            
            {currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-all flex items-center gap-2"
              >
                Continue
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-medium hover:from-amber-700 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <Send size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyProgram;