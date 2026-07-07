import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { PageHero, FinalCta, fadeInUp, stagger } from '../components/common/ui.jsx';
import { useContent } from '../context/ContentContext.jsx';
import { postsApi } from '../lib/api.js';

function fmtDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

const Column = () => {
  const { seo, hero, list } = useContent('column');

  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(null);
  const [data, setData] = useState(null); // { items, totalPages, categories, total }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    postsApi
      .list({ page, category })
      .then((res) => {
        if (alive) setData(res);
      })
      .catch(() => {
        if (alive) setData({ items: [], totalPages: 0, categories: [], total: 0 });
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [page, category]);

  const hasPosts = data && data.items.length > 0;
  // Pre-launch fallback: when no published posts exist, keep showing the static
  // demo cards (non-clickable) so the page never looks broken.
  const showFallback = !loading && !hasPosts && page === 1 && !category;

  return (
    <div className="bg-bg-primary">
      <SEO title={seo.title} description={seo.description} path="/column" />

      <PageHero eyebrow={hero.eyebrow} title={hero.headline} accent="인사이트" subhead={hero.subhead} />

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Category filter — only when real posts define categories */}
          {data && data.categories.length > 0 && (
            <div className="mb-12 flex flex-wrap justify-center gap-2">
              <FilterChip active={!category} onClick={() => { setCategory(null); setPage(1); }}>
                전체
              </FilterChip>
              {data.categories.map((c) => (
                <FilterChip
                  key={c}
                  active={category === c}
                  onClick={() => { setCategory(c); setPage(1); }}
                >
                  {c}
                </FilterChip>
              ))}
            </div>
          )}

          {loading ? (
            <div className="py-20 text-center text-text-secondary">불러오는 중…</div>
          ) : hasPosts ? (
            <>
              <motion.div
                variants={stagger} initial="hidden" animate="visible"
                className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
              >
                {data.items.map((post) => (
                  <PostCard key={post.id} post={post} readMore={list.readMore} />
                ))}
              </motion.div>

              {data.totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={data.totalPages}
                  onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                />
              )}
            </>
          ) : showFallback ? (
            <motion.div
              variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {list.items.map((item, i) => (
                <FallbackCard key={i} item={item} readMore={list.readMore} />
              ))}
            </motion.div>
          ) : (
            <div className="py-20 text-center text-text-secondary">
              {category ? '해당 카테고리의 글이 아직 없습니다.' : '아직 등록된 칼럼이 없습니다.'}
            </div>
          )}
        </div>
      </section>

      <FinalCta />
    </div>
  );
};

function PostCard({ post, readMore }) {
  return (
    <motion.article
      variants={fadeInUp} whileHover={{ y: -8 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border-primary bg-bg-secondary transition-colors hover:border-accent-primary"
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
            <span className="bg-brand-gradient absolute left-4 top-4 z-10 rounded-full px-4 py-1.5 text-xs font-bold text-white">
              {post.category}
            </span>
          )}
          <ArrowUpRight className="absolute right-5 top-5 z-10 text-white opacity-0 transition-opacity group-hover:opacity-100" size={22} />
        </div>
        <div className="flex flex-1 flex-col p-7">
          <h3 className="mb-3 text-xl font-bold leading-snug text-text-primary transition-colors group-hover:text-accent-primary">
            {post.title}
          </h3>
          <p className="mb-6 line-clamp-2 leading-relaxed text-text-secondary">{post.excerpt}</p>
          <div className="mt-auto flex items-center justify-between border-t border-border-primary pt-4 text-sm text-text-secondary/70">
            <span>{fmtDate(post.publishedAt)}</span>
            <span className="font-semibold text-accent-primary">{readMore}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

// Static, non-clickable card kept for the pre-launch empty state.
function FallbackCard({ item, readMore }) {
  return (
    <motion.article
      variants={fadeInUp} whileHover={{ y: -8 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border-primary bg-bg-secondary"
    >
      <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-bg-elevated">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div
          className="absolute inset-0 opacity-60"
          style={{ background: 'radial-gradient(420px circle at 30% 20%, rgba(91,140,255,0.25), transparent 60%), radial-gradient(360px circle at 80% 90%, rgba(167,139,250,0.22), transparent 60%)' }}
        />
        <span className="bg-brand-gradient relative z-10 rounded-full px-4 py-1.5 text-xs font-bold text-white">
          {item.badge}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-7">
        <h3 className="mb-3 text-xl font-bold leading-snug text-text-primary">{item.title}</h3>
        <p className="mb-6 line-clamp-2 leading-relaxed text-text-secondary">{item.desc}</p>
        <div className="mt-auto flex items-center justify-between border-t border-border-primary pt-4 text-sm text-text-secondary/70">
          <span>{item.date}</span>
          <span className="font-semibold text-accent-primary">{readMore}</span>
        </div>
      </div>
    </motion.article>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? 'border-accent-primary bg-accent-primary text-white'
          : 'border-border-primary text-text-secondary hover:border-accent-primary hover:text-accent-primary'
      }`}
    >
      {children}
    </button>
  );
}

function Pagination({ page, totalPages, onChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="mt-16 flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(page - 1)} disabled={page <= 1}
        className="rounded-full border border-border-primary px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent-primary hover:text-accent-primary disabled:cursor-not-allowed disabled:opacity-30"
      >
        이전
      </button>
      {pages.map((p) => (
        <button
          key={p} onClick={() => onChange(p)}
          className={`h-10 w-10 rounded-full text-sm font-semibold transition-colors ${
            p === page
              ? 'bg-accent-primary text-white'
              : 'text-text-secondary hover:text-accent-primary'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)} disabled={page >= totalPages}
        className="rounded-full border border-border-primary px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent-primary hover:text-accent-primary disabled:cursor-not-allowed disabled:opacity-30"
      >
        다음
      </button>
    </div>
  );
}

export default Column;
