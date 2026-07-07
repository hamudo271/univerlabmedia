import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SectionHeader, fadeInUp, stagger } from '../common/ui.jsx';
import { postsApi } from '../../lib/api.js';

function fmtDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

/**
 * Home-page "latest columns" section. Pulls the 3 newest published posts.
 * Renders nothing until at least one post exists, so it stays invisible
 * pre-launch and never shows an empty shell.
 */
const ColumnHighlights = () => {
  const [items, setItems] = useState(null);

  useEffect(() => {
    let alive = true;
    postsApi
      .latest(3)
      .then((res) => alive && setItems(res.items))
      .catch(() => alive && setItems([]));
    return () => {
      alive = false;
    };
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <section className="border-t border-border-primary bg-bg-secondary py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="Insights" headline={'최신\n인사이트'} accent="인사이트" center />

        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {items.map((post) => (
            <motion.article
              key={post.id} variants={fadeInUp} whileHover={{ y: -8 }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border-primary bg-bg-primary transition-colors hover:border-accent-primary"
            >
              <Link to={`/column/${encodeURIComponent(post.slug)}`} className="flex flex-1 flex-col">
                <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-bg-elevated">
                  {post.thumbnailUrl ? (
                    <img
                      src={post.thumbnailUrl} alt={post.title} loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <>
                      <div className="bg-grid absolute inset-0 opacity-40" />
                      <div
                        className="absolute inset-0 opacity-60"
                        style={{ background: 'radial-gradient(420px circle at 30% 20%, rgba(91,140,255,0.25), transparent 60%), radial-gradient(360px circle at 80% 90%, rgba(167,139,250,0.22), transparent 60%)' }}
                      />
                    </>
                  )}
                  {post.category && (
                    <span className="bg-brand-gradient absolute left-4 top-4 z-10 rounded-full px-3.5 py-1.5 text-xs font-bold text-white">
                      {post.category}
                    </span>
                  )}
                  <ArrowUpRight className="absolute right-5 top-5 z-10 text-white opacity-0 transition-opacity group-hover:opacity-100" size={22} />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="mb-3 text-lg font-bold leading-snug text-text-primary transition-colors group-hover:text-accent-primary">
                    {post.title}
                  </h3>
                  <p className="mb-6 line-clamp-2 leading-relaxed text-text-secondary">{post.excerpt}</p>
                  <div className="mt-auto border-t border-border-primary pt-4 text-sm text-text-secondary/70">
                    {fmtDate(post.publishedAt)}
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        <div className="mt-14 text-center">
          <Link
            to="/column"
            className="inline-flex items-center gap-2 rounded-full border border-border-primary bg-bg-primary px-8 py-4 font-bold text-text-primary transition-colors hover:border-accent-primary hover:text-accent-primary"
          >
            칼럼 더 보기 <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ColumnHighlights;
