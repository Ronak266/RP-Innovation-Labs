import { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle, AlertCircle, X } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  service_type: string;
  project_description: string;
}

const countryCodes = [
  { code: '+1', label: 'United States (+1)' },
  { code: '+1', label: 'Canada (+1)' },
  { code: '+44', label: 'United Kingdom (+44)' },
  { code: '+91', label: 'India (+91)' },
  { code: '+61', label: 'Australia (+61)' },
  { code: '+49', label: 'Germany (+49)' },
  { code: '+33', label: 'France (+33)' },
  { code: '+39', label: 'Italy (+39)' },
  { code: '+34', label: 'Spain (+34)' },
  { code: '+31', label: 'Netherlands (+31)' },
  { code: '+81', label: 'Japan (+81)' },
  { code: '+82', label: 'South Korea (+82)' },
  { code: '+86', label: 'China (+86)' },
  { code: '+65', label: 'Singapore (+65)' },
  { code: '+971', label: 'UAE (+971)' },
  { code: '+966', label: 'Saudi Arabia (+966)' },
  { code: '+27', label: 'South Africa (+27)' },
  { code: '+55', label: 'Brazil (+55)' },
  { code: '+52', label: 'Mexico (+52)' },
  { code: '+7', label: 'Russia (+7)' },
];

interface FormState {
  name: string;
  email: string;
  company: string;
  countryCode: string;
  phone: string;
  service_type: string;
  project_description: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  service_type?: string;
  project_description?: string;
}

interface ServiceRequestProps {
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: { sitekey: string; callback: (token: string) => void; 'expired-callback': () => void }) => string;
      remove: (widgetId: string) => void;
    };
  }
}

export default function ServiceRequest({ isOpen, onClose }: ServiceRequestProps) {
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    company: '',
    countryCode: '+1',
    phone: '',
    service_type: '',
    project_description: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileContainer = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string>();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
    if (!isOpen || !siteKey || !turnstileContainer.current) return;
    const render = () => {
      if (window.turnstile && turnstileContainer.current && !turnstileWidgetId.current) {
        turnstileWidgetId.current = window.turnstile.render(turnstileContainer.current, {
          sitekey: siteKey,
          callback: setTurnstileToken,
          'expired-callback': () => setTurnstileToken(''),
        });
      }
    };
    const script = document.querySelector<HTMLScriptElement>('script[data-turnstile]');
    if (script) {
      script.addEventListener('load', render);
      render();
      return () => {
        script.removeEventListener('load', render);
        if (turnstileWidgetId.current && window.turnstile) window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = undefined;
      };
    }
    const newScript = document.createElement('script');
    newScript.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    newScript.async = true;
    newScript.defer = true;
    newScript.dataset.turnstile = 'true';
    newScript.addEventListener('load', render);
    document.head.appendChild(newScript);
    return () => {
      newScript.removeEventListener('load', render);
      if (turnstileWidgetId.current && window.turnstile) window.turnstile.remove(turnstileWidgetId.current);
      turnstileWidgetId.current = undefined;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const serviceOptions = [
    'ERP Analytics Solutions',
    'Data Ingestion',
    'Data Transformation',
    'Data Visualization',
    'Business Intelligence',
    'Data Security & Compliance',
    'Custom Solution'
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formState.name.trim()) {
      newErrors.name = 'Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formState.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formState.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    const phoneRegex = /^[\d\s\-()]+$/;
    if (!formState.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formState.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formState.service_type) {
      newErrors.service_type = 'Please select a service';
    }

    if (!formState.project_description.trim()) {
      newErrors.project_description = 'Project description is required';
    } else if (formState.project_description.trim().length < 20) {
      newErrors.project_description = 'Please provide at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const submitData: FormData = {
        name: formState.name,
        email: formState.email,
        company: formState.company,
        phone: `${formState.countryCode} ${formState.phone}`,
        service_type: formState.service_type,
        project_description: formState.project_description
      };

      if (!turnstileToken) throw new Error('Please complete the security check before submitting.');
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-service-request-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...submitData, turnstileToken })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to submit your request.');

      setSubmitStatus('success');
      setFormState({
        name: '',
        email: '',
        company: '',
        countryCode: '+1',
        phone: '',
        service_type: '',
        project_description: ''
      });
      setTurnstileToken('');

      setTimeout(() => {
        setSubmitStatus('idle');
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ project_description: error instanceof Error ? error.message : 'Unable to submit your request.' });
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Request a Service</h2>
            <p className="text-blue-100">
              Let's discuss how we can transform your data into actionable insights
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 md:p-12">
          {submitStatus === 'success' && (
            <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900">Request Submitted Successfully!</h3>
                <p className="text-green-700 text-sm mt-1">
                  Thank you for your interest. Our team will review your request and get back to you within 24 hours.
                </p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Submission Failed</h3>
                <p className="text-red-700 text-sm mt-1">
                  There was an error submitting your request. Please try again or contact us directly.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } focus:ring-2 focus:border-transparent transition-all duration-200`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } focus:ring-2 focus:border-transparent transition-all duration-200`}
                  placeholder="john@company.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formState.company}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.company ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } focus:ring-2 focus:border-transparent transition-all duration-200`}
                  placeholder="ABC Corporation"
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-600">{errors.company}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="flex gap-2">
                  <select
                    id="countryCode"
                    name="countryCode"
                    value={formState.countryCode}
                    onChange={handleChange}
                    className={`px-3 py-3 rounded-lg border ${
                      errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } focus:ring-2 focus:border-transparent transition-all duration-200 flex-shrink-0`}
                    style={{ minWidth: '7rem' }}
                  >
                    {countryCodes.map((country) => (
                      <option key={country.label} value={country.code}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    className={`flex-1 min-w-0 px-4 py-3 rounded-lg border ${
                      errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } focus:ring-2 focus:border-transparent transition-all duration-200`}
                    placeholder="(555) 123-4567"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="service_type" className="block text-sm font-semibold text-gray-700 mb-2">
                Service Required *
              </label>
              <select
                id="service_type"
                name="service_type"
                value={formState.service_type}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.service_type ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                } focus:ring-2 focus:border-transparent transition-all duration-200`}
              >
                <option value="">Select a service</option>
                {serviceOptions.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
              {errors.service_type && (
                <p className="mt-1 text-sm text-red-600">{errors.service_type}</p>
              )}
            </div>

            <div ref={turnstileContainer} aria-label="Spam protection" />
            {!import.meta.env.VITE_TURNSTILE_SITE_KEY && (
              <p className="text-sm text-red-600">Security check is not configured. Please contact us directly.</p>
            )}

            <div>
              <label htmlFor="project_description" className="block text-sm font-semibold text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                id="project_description"
                name="project_description"
                value={formState.project_description}
                onChange={handleChange}
                rows={6}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.project_description ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                } focus:ring-2 focus:border-transparent transition-all duration-200 resize-none`}
                placeholder="Please describe your project requirements, goals, and any specific challenges you're facing..."
              />
              {errors.project_description && (
                <p className="mt-1 text-sm text-red-600">{errors.project_description}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                {formState.project_description.length} characters (minimum 20 required)
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !turnstileToken}
              className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

