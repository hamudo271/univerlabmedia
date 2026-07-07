import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Info, Plus, Minus, CheckCircle2, Loader2 } from 'lucide-react';
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
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');
  const [phone, setPhone] = useState('');

  // Auto-format a Korean mobile number as 010-XXXX-XXXX while typing (max 11 digits).
  const formatPhone = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length < 4) return d;
    if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError('');
    if (!fd.get('consent')) {
      setError('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }
    const payload = Object.fromEntries(fd.entries());
    payload.consent = true;
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || '전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

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

            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border-primary bg-bg-primary px-6 py-16 text-center">
                <div className="bg-brand-gradient mb-5 flex h-16 w-16 items-center justify-center rounded-full text-white">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="mb-2 text-2xl font-black text-text-primary">문의가 접수되었습니다</h3>
                <p className="text-text-secondary">
                  소중한 문의 감사합니다. 담당자가 순차적으로 빠르게 답변드리겠습니다.
                </p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Honeypot (spam trap) — hidden from real users */}
                <input
                  type="text" name="_hp" tabIndex={-1} autoComplete="off" aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Field label={form.brandLabel} required>
                    <input name="brand" required type="text" className={fieldCls} placeholder={form.brandPlaceholder} />
                  </Field>
                  <Field label={form.managerLabel} required>
                    <input name="manager" required type="text" className={fieldCls} placeholder={form.managerPlaceholder} />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Field label={form.positionLabel}>
                    <input name="position" type="text" className={fieldCls} placeholder={form.positionPlaceholder} />
                  </Field>
                  <Field label={form.phoneLabel} required>
                    <input
                      name="phone" required type="tel" inputMode="numeric" maxLength={13}
                      value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))}
                      className={fieldCls} placeholder={form.phonePlaceholder}
                    />
                  </Field>
                </div>

                <Field label={form.channelLabel} required>
                  <input name="channel" required type="url" className={fieldCls} placeholder={form.channelPlaceholder} />
                </Field>

                <Field label={form.bizLabel} required>
                  <textarea name="biz" required rows="3" className={`${fieldCls} resize-none`} placeholder={form.bizPlaceholder} />
                </Field>

                <Field label={form.benchLabel} required>
                  <input name="bench" required type="url" className={fieldCls} placeholder={form.benchPlaceholder} />
                </Field>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Field label={form.budgetLabel} required>
                    <select name="budget" required className={`${fieldCls} appearance-none`} defaultValue="">
                      <option value="" disabled>{form.budgetPlaceholder}</option>
                      {form.budgetOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </Field>
                  <Field label={form.serviceLabel} required>
                    <select name="service" required className={`${fieldCls} appearance-none`} defaultValue="">
                      <option value="" disabled>{form.servicePlaceholder}</option>
                      {form.serviceOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </Field>
                </div>

                <Field label={form.reasonLabel} required>
                  <textarea name="reason" required rows="2" className={`${fieldCls} resize-none`} placeholder={form.reasonPlaceholder} />
                </Field>

                <Field label={form.goalLabel} required>
                  <textarea name="goal" required rows="2" className={`${fieldCls} resize-none`} placeholder={form.goalPlaceholder} />
                </Field>

                <Field label={form.sourceLabel} required>
                  <select name="source" required className={`${fieldCls} appearance-none`} defaultValue="">
                    <option value="" disabled>{form.sourcePlaceholder}</option>
                    {form.sourceOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </Field>

                <label className="flex items-center gap-3 text-sm text-text-secondary">
                  <input name="consent" type="checkbox" className="h-4 w-4 rounded border-border-primary accent-[var(--accent-primary)]" />
                  {form.consentLabel} <span className="text-accent-primary">*</span>
                </label>

                {error && (
                  <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="bg-brand-gradient flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold text-white shadow-lg shadow-accent-primary/30 transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'sending' ? (
                    <><Loader2 size={18} className="animate-spin" /> <span>전송 중...</span></>
                  ) : (
                    <><span>{form.submitButton}</span> <Send size={18} /></>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <ContactFAQ />
    </div>
  );
};

export default Contact;
