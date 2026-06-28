import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import TextReveal from '../components/common/TextReveal';
import SEO from '../components/SEO';
import { useContent } from '../context/ContentContext.jsx';

const infoIcons = {
  Email: <Mail className="w-6 h-6" />,
  Phone: <Phone className="w-6 h-6" />,
  Address: <MapPin className="w-6 h-6" />,
  'Business Hours': <Clock className="w-6 h-6" />,
};

const Contact = () => {
  const { seo, hero, info, form } = useContent('contact');
  return (
    <div className="pt-32 pb-20 bg-bg-primary min-h-screen transition-colors duration-500">
      <SEO
        title={seo.title}
        description={seo.description}
        path="/contact"
      />
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <TextReveal>
            <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-6">{hero.headline}</h1>
          </TextReveal>
          <TextReveal delay={0.2}>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              {hero.subhead}
            </p>
          </TextReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-text-primary mb-8">{info.sectionTitle}</h2>

              <div className="space-y-6">
                {info.items.map((item, index) => (
                  <motion.div
                    key={item.title || index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (index * 0.1) }}
                    className="flex items-start space-x-4 p-6 rounded-2xl bg-bg-secondary border border-border-primary hover:border-accent-primary/50 transition-colors"
                  >
                    <div className="p-3 bg-bg-primary rounded-xl text-accent-primary border border-border-primary">
                      {infoIcons[item.title] || <Mail className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary mb-1">{item.title}</h3>
                      <p className="text-text-secondary">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-bg-secondary p-8 md:p-10 rounded-3xl border border-border-primary"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-primary ml-1">{form.nameLabel}</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-primary text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all"
                    placeholder={form.namePlaceholder}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-primary ml-1">{form.companyLabel}</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-primary text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all"
                    placeholder={form.companyPlaceholder}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-primary ml-1">{form.emailLabel}</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-primary text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all"
                    placeholder={form.emailPlaceholder}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-primary ml-1">{form.phoneLabel}</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-primary text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all"
                    placeholder={form.phonePlaceholder}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-primary ml-1">{form.projectTypeLabel}</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-primary text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all appearance-none">
                    <option value="">{form.projectTypePlaceholder}</option>
                    {form.projectTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-primary ml-1">{form.budgetLabel}</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-primary text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all appearance-none">
                    <option value="">{form.budgetPlaceholder}</option>
                    {form.budgetOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-text-primary ml-1">{form.referenceLabel}</label>
                <input
                  type="url"
                  className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-primary text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all"
                  placeholder={form.referencePlaceholder}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-text-primary ml-1">{form.messageLabel}</label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-primary text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all resize-none"
                  placeholder={form.messagePlaceholder}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-accent-primary text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-accent-primary/30"
              >
                <span>{form.submitButton}</span>
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
