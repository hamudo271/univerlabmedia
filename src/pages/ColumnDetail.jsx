import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import SEO, { SITE_NAME, SITE_URL } from '../components/SEO';
import { FinalCta, fadeInUp } from '../components/common/ui.jsx';
import { postsApi } from '../lib/api.js';

function fmtDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

// Read server-prerendered post data (injected into the HTML shell) for an
// instant first paint, but only when it matches this slug. Consumed once.
function readInjected(slug) {
  if (typeof window === 'undefined' || !window.__POST__) return null;
  const injected = window.__POST__;
  delete window.__POST__;
  return injected && injected.slug === slug ? injected : null;
}

const ColumnDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(() => readInjected(slug));
  const [status, setStatus] = useState(post ? 'ok' : 'loading'); // loading | ok | notfound

  useEffect(() => {
    let alive = true;
    // Always hit the API: it increments the view count and refreshes the data.
    postsApi
      .get(slug)
      .then((p) => {
        if (!alive) return;
        setPost(p);
        setStatus('ok');
      })
      .catch((err) => {
        if (!alive) return;
        if (err.status === 404 && !post) setStatus('notfound');
        else if (!post) setStatus('notfound');
        // If we already have injected data, keep showing it on transient errors.
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (status === 'loading') {
    return (
      <div className="bg-bg-primary min-h-[60vh] grid place-items-center text-text-secondary">
        불러오는 중…
      </div>
    );
  }

  if (status === 'notfound') {
    return (
      <div className="bg-bg-primary min-h-[60vh] grid place-items-center px-6 text-center">
        <div>
          <p className="mb-4 text-2xl font-bold text-text-primary">글을 찾을 수 없습니다</p>
          <Link to="/column" className="font-semibold text-accent-primary hover:underline">
            ← 칼럼 목록으로
          </Link>
        </div>
      </div>
    );
  }

  const path = `/column/${encodeURIComponent(post.slug)}`;
  const url = `${SITE_URL}${path}`;
  const imageUrl = post.thumbnailUrl
    ? post.thumbnailUrl.startsWith('http')
      ? post.thumbnailUrl
      : `${SITE_URL}${post.thumbnailUrl}`
    : `${SITE_URL}/og-image.png`;

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || undefined,
    image: [imageUrl],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/brand/favicon.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  return (
    <div className="bg-bg-primary">
      <SEO
        title={post.title}
        description={post.excerpt || post.title}
        path={path}
        image={imageUrl}
        type="article"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleLd)}</script>
      </Helmet>

      <article className="mx-auto max-w-3xl px-6 pb-16 pt-32 md:pt-40">
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <Link
            to="/column"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary transition-colors hover:text-accent-primary"
          >
            <ArrowLeft size={16} /> 칼럼 목록
          </Link>

          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
            {post.category && (
              <span className="bg-brand-gradient rounded-full px-3 py-1 text-xs font-bold text-white">
                {post.category}
              </span>
            )}
            {post.publishedAt && <span>{fmtDate(post.publishedAt)}</span>}
            <span>· 조회 {post.viewCount}</span>
          </div>

          <h1 className="mb-8 text-3xl font-black leading-tight text-text-primary md:text-4xl">
            {post.title}
          </h1>

          {post.thumbnailUrl && (
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="mb-10 w-full rounded-2xl border border-border-primary object-cover"
            />
          )}

          <div
            className="post-prose"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.div>
      </article>

      <FinalCta />
    </div>
  );
};

export default ColumnDetail;
