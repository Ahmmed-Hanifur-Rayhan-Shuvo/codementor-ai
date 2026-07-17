import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Shield, Zap, Code2, Globe, 
  Moon, Sun, Bell, Lock, User,
  Save, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = ({ darkMode }) => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    autoFix: true,
    language: 'python',
    model: 'deepseek',
    securityLevel: 'high'
  });

  const handleSave = () => {
    toast.success('✅ Settings saved successfully!');
  };

  const settingsSections = [
    {
      icon: User,
      title: 'Profile',
      fields: [
        { label: 'Username', value: 'developer' },
        { label: 'Email', value: 'dev@codementor.ai' },
      ]
    },
    {
      icon: Shield,
      title: 'Security',
      fields: [
        { label: 'Security Level', value: settings.securityLevel },
        { label: '2FA', value: 'Disabled' },
      ]
    },
    {
      icon: Bell,
      title: 'Notifications',
      fields: [
        { label: 'Email Notifications', value: settings.notifications ? 'On' : 'Off' },
        { label: 'Push Notifications', value: 'On' },
      ]
    },
    {
      icon: Globe,
      title: 'Preferences',
      fields: [
        { label: 'Default Language', value: settings.language },
        { label: 'Default Model', value: settings.model },
        { label: 'Auto-Fix', value: settings.autoFix ? 'Enabled' : 'Disabled' },
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Settings
          </h1>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        {/* Settings Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {settingsSections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl p-6 ${darkMode ? 'glass' : 'bg-white border border-gray-200'}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-primary/20' : 'bg-primary/10'}`}>
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {section.title}
                </h3>
              </div>
              
              <div className="space-y-3">
                {section.fields.map((field, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-white/5">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {field.label}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      darkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {field.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reset Button */}
        <div className="mt-8 text-center">
          <button className={`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 mx-auto ${
            darkMode ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`}>
            <RefreshCw className="w-4 h-4" />
            Reset All Settings
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;