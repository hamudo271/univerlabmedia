import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Info, Plus, Minus } from 'lucide-react';
import SEO from '../components/SEO';
import { PageHero, SectionHeader, fadeInUp } from '../components/common/ui.jsx';
import { useContent } from '../context/ContentContext.jsx';

const infoIcons = {
  Email: Mail,
  Phone: Phone,
  Address: MapPin,
  'Business Hours': Clock,
};

const fieldCls =
  'w-full rounded-xl border border-border-primary bg-bg-primary px-4 py-3 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-accent-primary focus:ring-1 focus:ring-accent-primary';

const Field = ({ label, required, children }) => (
  <div className="space-y-2">
    <label className="ml-1 text-sm font-bold text-text-primary">
      {label} {required && <span className="text-accent-primary">*</span>}
    </label>
    {children}
  </div>
);

const ContactFAQ = () => {
  const { faq } = useContent('home');
  const [open, setOpen] = useState(null);
  return (
    <section className="border-t border-border-primary bg-bg-secondary py-24">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader eyebrow={faq.eyebrow} headline={faq.headline} center />
        <div className="border-t border-border-primary">
          {faq.items.map((item, i) => (
            <div key={i} className="border-b border-border-primary">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="group flex w-full items-center justify-between py-6 text-left"
              >
                <span className="pr-6 text-lg font-bold text-text-primary group-hover:text-accent-primary">{item.q}</span>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${open === i ? 'border-accent-primary bg-accent-primary text-white' : 'border-border-primary text-text-secondary'}`}>
                  {open === i ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }} className="overflow-hidden"
                  >
                    <p className="ml-1 whitespace-pre-line border-l-2 border-accent-primary pb-6 pl-4 leading-relaxed text-text-secondary">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const { seo, hero, info, form } = useContent('contact');

  return (
    <div className="bg-bg-primary">
      <SEO title={seo.title} description={seo.description} path="/contact" />

      <PageHero eyebrow="Contact" title={hero.headline} accent="Us" subhead={hero.subhead} />

      <section className="py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Info sidebar */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-4">
            <h2 className="mb-6 text-2xl font-black text-text-primary">{info.sectionTitle}</h2>
            {info.items.map((item, i) => {
              const Icon = infoIcons[item.title] || Mail;
              return (
                <div key={i} className="flex items-start gap-4 rounded-2xl border border-border-primary bg-bg-secondary p-5">
                  <div className="bg-brand-gradient flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">{item.title}</h3>
                    <p className="mt-1 text-sm text-text-secondary">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Form */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="rounded-3xl border border-border-primary bg-bg-secondary p-8 md:p-10"
          >
            <h2 className="mb-2 text-2xl font-black text-text-primary">{form.sectionTitle}</h2>
            <div className="mb-8 flex items-start gap-2 rounded-xl bg-accent-primary/10 p-4 text-sm text-text-secondary">
              <Info size={18} className="mt-0.5 shrink-0 text-accent-primary" />
              <p>{form.notice}</p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label={form.brandLabel} required>
                  <input type="text" className={fieldCls} placeholder={form.brandPlaceholder} />
                </Field>
                <Field label={form.managerLabel} required>
                  <input type="text" className={fieldCls} placeholder={form.managerPlaceholder} />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label={form.positionLabel}>
                  <input type="text" className={fieldCls} placeholder={form.positionPlaceholder} />
                </Field>
                <Field label={form.phoneLabel} required>
                  <input type="tel" className={fieldCls} placeholder={form.phonePlaceholder} />
                </Field>
              </div>

              <Field label={form.channelLabel} required>
                <input type="url" className={fieldCls} placeholder={form.channelPlaceholder} />
              </Field>

              <Field label={form.bizLabel} required>
                <textarea rows="3" className={`${fieldCls} resize-none`} placeholder={form.bizPlaceholder} />
              </Field>

              <Field label={form.benchLabel} required>
                <input type="url" className={fieldCls} placeholder={form.benchPlaceholder} />
              </Field>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label={form.budgetLabel} required>
                  <select className={`${fieldCls} appearance-none`} defaultValue="">
                    <option value="" disabled>{form.budgetPlaceholder}</option>
                    {form.budgetOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </Field>
                <Field label={form.serviceLabel} required>
                  <select className={`${fieldCls} appearance-none`} defaultValue="">
                    <option value="" disabled>{form.servicePlaceholder}</option>
                    {form.serviceOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </Field>
              </div>

              <Field label={form.reasonLabel} required>
                <textarea rows="2" className={`${fieldCls} resize-none`} placeholder={form.reasonPlaceholder} />
              </Field>

              <Field label={form.goalLabel} required>
                <textarea rows="2" className={`${fieldCls} resize-none`} placeholder={form.goalPlaceholder} />
              </Field>

              <Field label={form.sourceLabel} required>
                <select className={`${fieldCls} appearance-none`} defaultValue="">
                  <option value="" disabled>{form.sourcePlaceholder}</option>
                  {form.sourceOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>

              <label className="flex items-center gap-3 text-sm text-text-secondary">
                <input type="checkbox" className="h-4 w-4 rounded border-border-primary accent-[var(--accent-primary)]" />
                {form.consentLabel} <span className="text-accent-primary">*</span>
              </label>

              <button
                type="submit"
                className="bg-brand-gradient flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold text-white shadow-lg shadow-accent-primary/30 transition-transform hover:scale-[1.01]"
              >
                <span>{form.submitButton}</span>
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <ContactFAQ />
    </div>
  );
};

export default Contact;
