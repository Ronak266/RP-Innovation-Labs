import { Database, GitBranch, BarChart3, Cloud, Lock, Zap } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Database,
      title: 'ERP Analytics Solutions',
      description: 'Comprehensive ERP integration and analytics solutions tailored to your business needs. Transform your enterprise resource planning data into strategic insights.',
      features: ['Real-time Reporting', 'Custom Dashboards', 'KPI Tracking']
    },
    {
      icon: Cloud,
      title: 'Data Ingestion',
      description: 'Seamlessly collect and integrate data from multiple sources into a unified platform. We handle structured, semi-structured, and unstructured data.',
      features: ['Multi-source Integration', 'Real-time Streaming', 'Batch Processing']
    },
    {
      icon: GitBranch,
      title: 'Data Transformation',
      description: 'Clean, normalize, and enrich your data for optimal analysis. Our ETL pipelines ensure data quality and consistency across your organization.',
      features: ['Data Cleansing', 'ETL Pipelines', 'Quality Assurance']
    },
    {
      icon: BarChart3,
      title: 'Data Visualization',
      description: 'Create stunning, interactive visualizations and dashboards that make complex data easy to understand and act upon.',
      features: ['Interactive Dashboards', 'Custom Reports', 'Mobile-Ready']
    },
    {
      icon: Zap,
      title: 'Business Intelligence',
      description: 'Advanced BI solutions that provide predictive analytics, trend analysis, and strategic insights to drive informed decision-making.',
      features: ['Predictive Analytics', 'Trend Analysis', 'Strategic Planning']
    },
    {
      icon: Lock,
      title: 'Data Security & Compliance',
      description: 'Enterprise-grade security measures and compliance frameworks to protect your sensitive business data and meet regulatory requirements.',
      features: ['Data Encryption', 'Access Control', 'Compliance Monitoring']
    }
  ];

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive data analytics solutions designed to transform your business operations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 flex items-center group-hover:gap-2 gap-1">
                    Learn More
                    <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
