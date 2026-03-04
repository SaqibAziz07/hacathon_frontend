"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Activity, AlertTriangle, CheckCircle, Search, User, HeartPulse, Microscope, Stethoscope, Brain } from "lucide-react";

export default function AISymptomChecker() {
  const [formData, setFormData] = useState({
    symptoms: "",
    age: "",
    gender: "Male",
    medicalHistory: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.symptoms || !formData.age) {
      setError("Please provide symptoms and age.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await api.post("/ai/symptom-checker", {
  ...formData,
  age: Number(formData.age),
})
      if (res.data.success) {
        setResult(res.data);
      } else {
        setError(res.data.message || "Failed to analyze symptoms");
      }
    } catch (err) {
      setError("Server error during AI analysis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
        
        {/* Premium Header - Fully Responsive */}
        <div className="relative rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900 p-4 sm:p-6 md:p-8 overflow-hidden shadow-lg border border-indigo-500/30">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-20 w-20 sm:h-40 sm:w-40 rounded-full bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-20 w-20 sm:h-40 sm:w-40 rounded-full bg-purple-500 blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 shadow-inner">
              <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  Smart Symptom Analyzer
                </h1>
                <span className="inline-block text-xs sm:text-sm text-blue-300 font-semibold px-2 py-0.5 rounded-full bg-blue-900/50 border border-blue-400/30 w-fit">
                  AI Powered
                </span>
              </div>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-blue-100/80 max-w-2xl leading-relaxed">
                Enter patient symptoms to instantly generate AI-driven differential diagnoses, risk assessments, and intelligent testing recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
          
          {/* Input Form - Left Column */}
          <div className="lg:col-span-5 bg-white/80 backdrop-blur-xl shadow-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
              <HeartPulse className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-indigo-500" />
              Patient Information
            </h2>
            
            <form onSubmit={handleAnalyze} className="space-y-3 sm:space-y-4">
              
              {error && (
                <div className="bg-red-50 p-2 sm:p-3 rounded-md border border-red-200 text-xs sm:text-sm text-red-700 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              
              {/* Age & Gender - Responsive Grid */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-500"
                    placeholder="e.g. 34"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Symptoms Textarea */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1">
                  Reported Symptoms <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-500"
                  placeholder="E.g. Persistent cough, mild fever for 3 days, body ache"
                  required
                />
              </div>

              {/* Medical History */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1">
                  Medical History <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-500"
                  placeholder="E.g. Asthma, Hypertension, Diabetes"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2 sm:py-2.5 px-3 sm:px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Generate AI Analysis
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Pane - Right Column */}
          <div className="lg:col-span-7 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 border border-gray-200/50">
            
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
              <Microscope className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-indigo-500" />
              Analysis Results
            </h2>
            
            {!result && !loading && (
              <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-gray-400">
                <Activity className="h-12 w-12 sm:h-16 sm:w-16 mb-3 sm:mb-4 text-gray-200" />
                <p className="text-sm sm:text-base text-center px-4">Enter patient details to see AI-powered insights</p>
              </div>
            )}

            {loading && (
              <div className="space-y-3 sm:space-y-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
            )}

            {result && (
              <div className="space-y-4 sm:space-y-6 animate-in fade-in">
                
                {result.isFallback && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-yellow-800">Fallback Mode Active</p>
                      <p className="text-xs sm:text-sm text-yellow-700 mt-0.5">
                        AI service unavailable. Showing standard protocol suggestions.
                      </p>
                    </div>
                  </div>
                )}

                {/* Risk Level Badge */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <span className="text-xs sm:text-sm font-medium text-gray-500">Risk Assessment:</span>
                  <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold capitalize
                    ${(result.data.riskAssessment?.level || result.data.riskLevel) === 'high' ? 'bg-red-100 text-red-800' : 
                      (result.data.riskAssessment?.level || result.data.riskLevel) === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'}`}>
                    {(result.data.riskAssessment?.level || result.data.riskLevel || 'N/A')} Risk
                  </span>
                </div>

                {/* Possible Conditions */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 flex items-center">
                    <Stethoscope className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-blue-500" />
                    Possible Conditions
                  </h3>
                  <div className="bg-blue-50/50 rounded-lg p-3 sm:p-4 space-y-2">
                    {(result.data.possibleConditions || result.data.conditions || []).map((condition: any, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-gray-900">
                          {typeof condition === 'object' ? `${condition.name} (${condition.match}%)` : condition}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Tests */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 flex items-center">
                    <Microscope className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-purple-500" />
                    Recommended Tests
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2 border border-gray-100">
                    {(result.data.suggestedTests || result.data.tests || []).map((test: any, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full mt-2"></div>
                        <span className="text-xs sm:text-sm text-gray-900">{test}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="pt-3 sm:pt-4 border-t border-gray-200">
                  <p className="text-[10px] sm:text-xs text-gray-400 text-center">
                    ⚕️ This is an AI-generated analysis meant to assist medical professionals. Always exercise clinical judgment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}