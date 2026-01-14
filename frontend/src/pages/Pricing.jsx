import { FiCheck, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    { 
      name: 'Worker - Free', 
      price: '₹0', 
      period: 'Forever', 
      description: 'Perfect for all workers', 
      features: [
        'Create professional profile', 
        'Apply for unlimited jobs', 
        'Upload certificates', 
        'Build portfolio', 
        'Direct messaging', 
        'Reviews & ratings',
        'AI-powered job recommendations',
        'Location-based job search'
      ], 
      notIncluded: [], 
      cta: 'Get Started', 
      link: '/auth/signup?role=worker', 
      highlight: false 
    },
    { 
      name: 'Worker - Priority', 
      price: 'Coming Soon', 
      period: '', 
      description: 'Get ahead with priority features', 
      features: [
        'Everything in Free', 
        'Priority in search results', 
        'Featured profile badge',
        'Priority job notifications', 
        'Advanced analytics', 
        'Verified profile badge',
        'Ad-free experience', 
        'Priority support'
      ], 
      notIncluded: [], 
      cta: 'Coming Soon', 
      link: '#', 
      highlight: true, 
      badge: 'Coming Soon',
      disabled: true
    },
    { 
      name: 'Employer - Free', 
      price: '₹0', 
      period: 'Forever', 
      description: 'Everything you need to hire', 
      features: [
        'Post unlimited jobs', 
        'Search verified workers', 
        'Direct messaging', 
        'Review applicants', 
        'Map-based worker search',
        'AI-powered worker matching',
        'Reviews & ratings',
        'Hire unlimited workers'
      ], 
      notIncluded: [], 
      cta: 'Get Started', 
      link: '/auth/signup?role=employer', 
      highlight: false 
    },
  ];

  const faqs = [
    { q: 'Is the platform really free?', a: 'Yes! Both workers and employers can use all features completely free. No hidden charges or commissions.' },
    { q: 'When will the Priority plan be available?', a: 'The Worker Priority plan is currently in development. Sign up for free now and you\'ll be notified when it launches!' },
    { q: 'Do workers pay any commission?', a: 'No! Workers keep 100% of their earnings. We don\'t charge any commission on jobs or payments.' },
    { q: 'Are there any limits on the free plan?', a: 'No limits! Post unlimited jobs, apply to unlimited positions, and connect with as many people as you need.' },
    { q: 'What will the Priority plan include?', a: 'The Priority plan will offer enhanced visibility, priority placement in search results, advanced analytics, and premium support features.' },
    { q: 'How can I stay updated?', a: 'Register for free now and we\'ll notify you about all new features and updates, including the Priority plan launch.' },
  ];

  return (
    <div className="py-12">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">Choose the plan that's right for you. No hidden fees, cancel anytime.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-20 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.1 }} 
              className={`card relative ${plan.highlight ? 'ring-2 ring-primary-500 shadow-xl' : ''} ${plan.disabled ? 'opacity-75' : ''}`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className={`${plan.disabled ? 'bg-slate-500' : 'bg-rose-500'} text-white px-4 py-1 rounded-full text-sm font-semibold`}>
                    {plan.badge}
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-heading font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-600 mb-4">{plan.description}</p>
                <div className="flex items-end justify-center gap-1 min-h-[60px]">
                  <span className={`${plan.disabled ? 'text-2xl' : 'text-4xl'} font-bold text-slate-900`}>{plan.price}</span>
                  {plan.period && <span className="text-slate-500 mb-1">{plan.period}</span>}
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <FiCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature, i) => (
                  <li key={`not-${i}`} className="flex items-start gap-2 opacity-50">
                    <FiX className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-500">{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.disabled ? (
                <button 
                  disabled 
                  className="btn btn-outline w-full opacity-50 cursor-not-allowed"
                >
                  {plan.cta}
                </button>
              ) : (
                <Link 
                  to={plan.link} 
                  className={`btn w-full ${plan.highlight ? 'btn-primary' : 'btn-outline'}`}
                >
                  {plan.cta}
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-heading font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="card">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600 text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">Still have questions?</h2>
          <p className="text-xl mb-8 text-rose-100">Our team is here to help you choose the right plan</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn bg-white text-rose-600 hover:bg-slate-100">Contact Sales</Link>
            <Link to="/auth/signup" className="btn bg-white/10 hover:bg-white/20 text-white border-2 border-white">Start Free</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
