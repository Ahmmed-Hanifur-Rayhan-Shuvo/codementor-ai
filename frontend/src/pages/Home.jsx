import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, Zap, Code2, Sparkles, Wand2, 
  Globe, Users, Award, Rocket, Lock, Cpu,
  Github, Twitter, Linkedin
} from 'lucide-react';

const Home = ({ darkMode }) => {
  const features = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'GDPR & SOC2 compliant code analysis with zero data retention'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Real-time analysis with AI-powered suggestions in milliseconds'
    },
    {
      icon: Globe,
      title: '20+ Languages',
      description: 'Support for all major programming languages and frameworks'
    },
    {
      icon: Wand2,
      title: 'Auto-Fix',
      description: 'One-click code fixes with AI-generated solutions'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Share insights and collaborate with your development team'
    },
    {
      icon: Cpu,
      title: 'Multi-Model AI',
      description: 'Choose from OpenAI, DeepSeek, Claude, and Gemini models'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto"
      >
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm mb-6 ${
          darkMode ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-primary/5 border-primary/20 text-primary'
        }`}>
          <Sparkles className="w-4 h-4" />
          <span>v4.0 Enterprise Edition • 2030 Ready</span>
        </div>
        
        <h1 className={`text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent`}>
          CodeMentor AI
        </h1>
        <p className={`text-xl md:text-2xl mb-8 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Intelligent Code Analysis & Auto-Fix for the Modern Developer
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/analyze" className="px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-primary/25 transition flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Start Analyzing
          </Link>
          <a href="#features" className={`px-8 py-4 rounded-xl font-semibold transition flex items-center gap-2 ${
            darkMode ? 'glass hover:bg-white/10' : 'bg-white border border-gray-200 hover:border-primary text-gray-700'
          }`}>
            Learn More
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {[
            { value: '20+', label: 'Languages', color: 'text-primary' },
            { value: '4', label: 'AI Models', color: 'text-secondary' },
            { value: '100%', label: 'Accuracy', color: 'text-accent' },
            { value: '24/7', label: 'Availability', color: 'text-green-500' },
          ].map((stat, index) => (
            <div key={index} className={`rounded-xl p-4 text-center ${darkMode ? 'glass' : 'bg-white border border-gray-200'}`}>
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Features */}
      <motion.div 
        id="features"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-20"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Enterprise-Grade Features
          </span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`rounded-2xl p-6 transition group ${
                darkMode ? 'glass hover:bg-white/5' : 'bg-white border border-gray-200 hover:border-primary'
              }`}
            >
              <div className={`p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition ${
                darkMode ? 'bg-primary/10' : 'bg-primary/10'
              }`}>
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {feature.title}
              </h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-20 text-center"
      >
        <div className={`rounded-3xl p-12 max-w-4xl mx-auto ${darkMode ? 'glass' : 'bg-white border border-gray-200'}`}>
          <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Ready to Write Better Code?
          </h2>
          <p className={darkMode ? 'text-gray-400 mb-8' : 'text-gray-600 mb-8'}>
            Join thousands of developers who trust CodeMentor AI
          </p>
          <Link to="/analyze" className="px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-primary/25 transition inline-flex items-center gap-2">
            <Code2 className="w-5 h-5" />
            Get Started Free
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;