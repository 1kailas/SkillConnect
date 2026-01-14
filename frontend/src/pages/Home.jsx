import { Link } from 'react-router-dom';
import { FiSearch, FiBriefcase, FiAward, FiMapPin, FiStar, FiUsers, FiTrendingUp, FiShield, FiArrowRight, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Home = () => {
  const stats = [
    { label: 'Verified Workers', value: '1,500+', icon: FiUsers },
    { label: 'Active Employers', value: '500+', icon: FiBriefcase },
    { label: 'Jobs Completed', value: '3,000+', icon: FiTrendingUp },
    { label: 'Average Rating', value: '4.8/5', icon: FiStar },
  ];

  const features = [
    {
      icon: FiAward,
      title: 'Verified Certificates',
      description: 'AI-powered certificate verification ensures authentic skilled workers',
    },
    {
      icon: FiMapPin,
      title: 'GPS-Based Matching',
      description: 'Find workers near you with our location-based search',
    },
    {
      icon: FiStar,
      title: 'Transparent Reviews',
      description: 'Make informed decisions with our honest rating system',
    },
    {
      icon: FiShield,
      title: 'Secure Platform',
      description: 'Your data and transactions are protected with industry-standard security',
    },
  ];

  const steps = [
    {
      title: 'Create Profile',
      description: 'Sign up as a worker or employer and complete your profile',
    },
    {
      title: 'Search & Connect',
      description: 'Find the perfect match using our advanced search filters',
    },
    {
      title: 'Work & Review',
      description: 'Complete jobs and build your reputation with reviews',
    },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-2 pb-8 lg:pt-6 lg:pb-10 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-[80%] bg-gradient-to-b from-slate-50 to-white -z-10"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary-100/40 rounded-full blur-[100px] animate-float -z-10"></div>
        <div className="absolute bottom-[0%] left-[-10%] w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-[80px] -z-10"></div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-sm font-medium text-slate-700">#1 Trusted Platform in Kerala</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-heading font-bold mb-6 text-slate-900 leading-tight">
                Find Skilled Workers <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
                  in Your Area
                </span>
              </h1>
              <p className="text-xl mb-8 text-slate-600 leading-relaxed max-w-lg">
                Connect directly with verified professionals in Kerala. No middlemen, just quality work and transparent pricing for Tier 2 & 3 cities.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/auth/signup" className="btn btn-primary rounded-full px-8 py-4 text-lg shadow-xl shadow-primary-500/20 hover:scale-105 transition-transform">
                  Get Started
                </Link>
                <Link to="/workers" className="btn btn-secondary rounded-full px-8 py-4 text-lg hover:bg-slate-50 hover:scale-105 transition-transform">
                  Find Workers
                </Link>
              </div>
              
              <div className="mt-10 flex items-center gap-4 text-sm text-slate-500">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden flex items-center justify-center text-white text-xs font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p>Trusted by <span className="font-bold text-slate-900">2,000+</span> employers</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
               <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-primary-900/10 border border-slate-100 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                 <img
                   src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80"
                   alt="Skilled Worker"
                   className="w-full h-auto object-cover"
                 />
                 
                 {/* Floating Card */}
                 <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-white/40 shadow-lg animate-in slide-in-from-bottom-5 fade-in duration-700 delay-500">
                   <div className="flex items-center gap-4">
                     <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                       <FiCheck size={20} />
                     </div>
                     <div>
                       <p className="font-bold text-slate-900">Certificate Verified</p>
                       <p className="text-sm text-slate-500">AI-verified credentials</p>
                     </div>
                   </div>
                 </div>
               </div>
               
               {/* Decorative blobs */}
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-400 rounded-full opacity-20 blur-2xl animate-pulse"></div>
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-400 rounded-full opacity-20 blur-2xl animate-pulse delay-700"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-50 rounded-2xl p-6 text-center hover:bg-white hover:shadow-xl hover:shadow-primary-100/50 transition-all duration-300 border border-transparent hover:border-slate-100"
                >
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
                    <Icon size={24} />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white relative">
        <div className="container-custom">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-primary-600 font-semibold tracking-wider text-sm uppercase">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mt-2 mb-4">
              How SkillConnect Works
            </h2>
            <p className="text-lg text-slate-600">
              Get started in minutes and find the opportunities or talent you need without the hassle.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-100 -z-10"></div>
            
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center group"
              >
                <div className="w-24 h-24 bg-white border-4 border-slate-50 shadow-xl rounded-full flex items-center justify-center text-3xl font-bold text-primary-600 mx-auto mb-6 relative z-10 group-hover:scale-110 group-hover:border-primary-50 transition-all duration-300">
                  {index + 1}
                </div>
                <h3 className="text-xl font-heading font-bold mb-3 text-slate-900">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed px-4">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-100 rounded-full blur-[100px] opacity-40"></div>
        
        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-xl">
              <span className="text-primary-600 font-semibold tracking-wider text-sm uppercase">Why Choose Us</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mt-2">
                 Built for Kerala's Workforce
              </h2>
            </div>
            <Link to="/about" className="btn btn-secondary self-start">
              Learn more about us
              <FiArrowRight />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 mb-6">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-3 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="bg-primary-900 rounded-3xl overflow-hidden relative p-12 lg:p-20 text-center">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-indigo-900 z-0"></div>
            <div className="absolute top-0 right-0 w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-500 rounded-full blur-[100px] z-0"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-500 rounded-full blur-[100px] z-0"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
                Ready to transform your work life?
              </h2>
              <p className="text-indigo-100 text-lg mb-10">
                Join thousands of workers and employers already using SkillConnect to build better careers and businesses.
              </p>
              <Link to="/auth/signup" className="btn bg-white text-primary-900 hover:bg-slate-100 px-10 py-4 rounded-full text-lg font-bold shadow-2xl shadow-black/20 hover:scale-105 transition-transform">
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
