import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions? We're here to help you transform your data strategy
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
            <a href="mailto:rpinnovationlabs@gmail.com" className="text-blue-600 hover:text-blue-700 transition-colors">
              rpinnovationlabs@gmail.com
            </a>
            <p className="text-sm text-gray-500 mt-2">
              For general inquiries
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
            <a href="tel:+918374737488" className="text-blue-600 hover:text-blue-700 transition-colors">
              +91 8374737488
            </a>
            <p className="text-sm text-gray-500 mt-2">
              Mon-Fri 9am-6pm EST
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Visit Us</h3>
            <p className="text-gray-600">
              Sri Navika opposite to<br />
              Abyaas Junior College Bachupally
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Hours</h3>
            <p className="text-gray-600">
              Monday - Friday<br />
              9:00 AM - 6:00 PM EST
            </p>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Need Immediate Assistance?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our support team is available 24/7 for urgent matters and critical issues
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:rpinnovationlabs@gmail.com"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-all duration-200 font-semibold"
            >
              Email Support
            </a>
            <a
              href="tel:+918374737488"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-400 transition-all duration-200 font-semibold border-2 border-white"
            >
              Call Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
