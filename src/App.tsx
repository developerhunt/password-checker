import React, { useState, useEffect } from 'react';
import { Shield, X, Check, AlertTriangle, Key, Eye, EyeOff, Copy, RefreshCw } from 'lucide-react';

function App() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState({
    score: 0,
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const checkStrength = (pass: string) => {
    const hasLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    
    const score = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial]
      .filter(Boolean).length;

    setStrength({
      score,
      length: hasLength,
      uppercase: hasUpper,
      lowercase: hasLower,
      number: hasNumber,
      special: hasSpecial
    });
  };

  const generatePassword = () => {
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      special: '!@#$%^&*(),.?":{}|<>'
    };

    let password = '';
    const allChars = Object.values(charset).join('');
    
    for (let i = 0; i < 16; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    setPassword(password);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  useEffect(() => {
    checkStrength(password);
  }, [password]);

  const getStrengthColor = () => {
    switch (strength.score) {
      case 0: return 'bg-gray-200';
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-400';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getStrengthText = () => {
    switch (strength.score) {
      case 0: return 'No Password';
      case 1: return 'Very Weak';
      case 2: return 'Weak';
      case 3: return 'Medium';
      case 4: return 'Strong';
      case 5: return 'Very Strong';
      default: return 'No Password';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header with animated gradient */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 blur-3xl -z-10 animate-pulse"></div>
          <div className="flex justify-center mb-6 transform hover:scale-110 transition-transform duration-300">
            <Shield className="w-20 h-20 text-indigo-600" />
          </div>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            Password Strength Checker
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create and verify strong passwords to keep your accounts secure
          </p>
        </div>

        {/* Password Input Section with glass effect */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8 transform hover:shadow-2xl transition-all duration-300">
          <div className="relative mb-6">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-6 py-4 rounded-xl border-2 border-indigo-100 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none pr-32 text-lg transition-all duration-300 placeholder:text-gray-400"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 text-gray-500 hover:text-indigo-600 transition-colors duration-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
              <button
                onClick={copyToClipboard}
                className={`p-2 transition-colors duration-200 ${copied ? 'text-green-500' : 'text-gray-500 hover:text-indigo-600'}`}
                aria-label="Copy password"
              >
                <Copy className="w-6 h-6" />
              </button>
              <button
                onClick={generatePassword}
                className="p-2 text-gray-500 hover:text-indigo-600 transition-colors duration-200 hover:rotate-180 transition-transform duration-500"
                aria-label="Generate password"
              >
                <RefreshCw className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Strength Indicator with animated bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Strength:</span>
              <span className="text-sm font-medium">{getStrengthText()}</span>
            </div>
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full ${getStrengthColor()} rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${(strength.score / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Requirements with hover effects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RequirementItem
              met={strength.length}
              text="At least 8 characters"
            />
            <RequirementItem
              met={strength.uppercase}
              text="Contains uppercase letter"
            />
            <RequirementItem
              met={strength.lowercase}
              text="Contains lowercase letter"
            />
            <RequirementItem
              met={strength.number}
              text="Contains number"
            />
            <RequirementItem
              met={strength.special}
              text="Contains special character"
            />
          </div>
        </div>

        {/* Tips Section with card effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-indigo-900 mb-6">Password Tips</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-gray-700 group-hover:text-indigo-700 transition-colors duration-200">Use a unique password for each account</span>
              </li>
              <li className="flex items-start gap-3 group">
                <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-gray-700 group-hover:text-indigo-700 transition-colors duration-200">Avoid using personal information</span>
              </li>
              <li className="flex items-start gap-3 group">
                <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-gray-700 group-hover:text-indigo-700 transition-colors duration-200">Consider using a password manager</span>
              </li>
            </ul>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-indigo-900 mb-6">Common Mistakes</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <X className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-gray-700 group-hover:text-red-700 transition-colors duration-200">Using common words or phrases</span>
              </li>
              <li className="flex items-start gap-3 group">
                <X className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-gray-700 group-hover:text-red-700 transition-colors duration-200">Reusing passwords across accounts</span>
              </li>
              <li className="flex items-start gap-3 group">
                <X className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-gray-700 group-hover:text-red-700 transition-colors duration-200">Using sequential numbers or letters</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-white group">
      {met ? (
        <Check className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-300" />
      ) : (
        <AlertTriangle className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform duration-300" />
      )}
      <span className={`text-sm transition-colors duration-200 ${
        met ? 'text-green-700 group-hover:text-green-800' : 'text-orange-700 group-hover:text-orange-800'
      }`}>
        {text}
      </span>
    </div>
  );
}

export default App;