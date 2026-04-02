import { Scale, Lightbulb, Shield, Rocket, Headphones as HeadphonesIcon, TrendingUp } from 'lucide-react';

interface WhyChooseUsProps {
  onRequestService: () => void;
}

export default function WhyChooseUs({ onRequestService }: WhyChooseUsProps) {
  const reasons = [
    {
      icon: Scale,
      title: 'Scalable Solutions',
      description: 'Our platforms grow with your business, from startup to enterprise, handling millions of data points seamlessly.'
    },
    {
      icon: Lightbulb,
      title: 'Business Intelligence',
      description: 'Turn data into actionable insights with our advanced BI tools and predictive analytics capabilities.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption and compliance with international data protection standards ensure your data stays secure.'
    },
    {
      icon: Rocket,
      title: 'Rapid Deployment',
      description: 'Get up and running quickly with our streamlined implementation process and proven methodologies.'
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Round-the-clock technical support and dedicated account management for peace of mind.'
    },
    {
      icon: TrendingUp,
      title: 'Proven ROI',
      description: 'Our clients see measurable improvements in efficiency, cost savings, and revenue growth within months.'
    }
  ];

  return (
    <section id="why-us" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose RP Innovation Labs
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We deliver excellence through innovation, expertise, and unwavering commitment to your success
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

                <div className="relative z-10">
                  <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {reason.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Data Strategy?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of companies already leveraging our ERP-driven analytics solutions
          </p>
          <button
            onClick={onRequestService}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            Start Your Journey Today
          </button>
        </div>
      </div>
    </section>
  );
}
