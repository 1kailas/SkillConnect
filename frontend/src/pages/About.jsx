import { FiTarget, FiEye, FiHeart, FiAward, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

const About = () => {
  const stats = [
    { value: '1,500+', label: 'Verified Workers', icon: FiUsers },
    { value: '500+', label: 'Active Employers', icon: FiTrendingUp },
    { value: '3,000+', label: 'Jobs Completed', icon: FiAward },
  ];

  const values = [
    { icon: FiTarget, title: 'Our Mission', description: 'To connect skilled workers in Tier 3 cities of Kerala with quality employment opportunities, eliminating middlemen and ensuring fair wages.' },
    { icon: FiEye, title: 'Our Vision', description: 'To become the most trusted platform for skilled workers and employers in Kerala, fostering economic growth in smaller cities.' },
    { icon: FiHeart, title: 'Our Values', description: 'Transparency, fairness, dignity of labor, and empowerment of workers through technology.' },
  ];

  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">About SkillConnect Kerala</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Empowering skilled workers and employers across Kerala's Tier 3 cities with technology-driven solutions for better opportunities and transparent connections.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="card text-center">
                <Icon className="w-12 h-12 mx-auto mb-4 text-primary-600" />
                <div className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}>
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-slate-600">
              <p>SkillConnect Kerala was born from a simple observation: talented skilled workers in Tier 3 cities often struggle to find good opportunities, while employers face challenges in finding reliable workers.</p>
              <p>Traditional methods involving middlemen led to unfair practices, lack of transparency, and reduced wages for workers. We knew technology could solve this.</p>
              <p>Founded in 2024, we've built a platform that directly connects workers with employers, features AI-powered certificate verification, GPS-based matching, and transparent review systems.</p>
              <p>Today, we're proud to serve thousands of workers and employers across Kerala, helping build better livelihoods and businesses.</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}>
            <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600" alt="Team" className="rounded-2xl shadow-xl" />
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-heading font-bold text-slate-900 text-center mb-12">Our Mission, Vision & Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="card text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-rose-600" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-slate-900 mb-3">{value.title}</h3>
                  <p className="text-slate-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">Ready to Join Our Community?</h2>
          <p className="text-xl mb-8 text-rose-100">Whether you're a skilled worker or an employer, we're here to help you succeed.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/auth/signup?role=worker" className="btn bg-white text-rose-600 hover:bg-slate-100">Join as Worker</a>
            <a href="/auth/signup?role=employer" className="btn bg-white/10 hover:bg-white/20 text-white border-2 border-white">Join as Employer</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
