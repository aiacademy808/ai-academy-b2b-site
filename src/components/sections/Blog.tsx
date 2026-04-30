'use client';

import { motion } from 'framer-motion';
import { Play, Calendar } from 'lucide-react';
import { useState } from 'react';
import { extractYouTubeId } from '@/lib/youtube';

interface BlogPostData {
  slug: string;
  title: string;
  excerpt: string | null;
  videoUrl: string | null;
  content: string;
  publishedAt: string | null;
  createdAt: string;
}

function YouTubeEmbed({ videoUrl, title }: { videoUrl: string; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = extractYouTubeId(videoUrl);

  if (!videoId) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
      {isPlaying ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        />
      ) : (
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 w-full h-full group cursor-pointer"
          aria-label={`Play ${title}`}
        >
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#ff0000] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
              <Play size={28} className="text-white ml-1" fill="white" />
            </div>
          </div>
        </button>
      )}
    </div>
  );
}

export default function Blog({ posts }: { posts: BlogPostData[] }) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-20 px-4 bg-[#060810]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Блог и видео
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Полезные материалы о внедрении ИИ в бизнес
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {posts.map((post, index) => {
            const videoId = post.videoUrl ? extractYouTubeId(post.videoUrl) : null;
            const date = post.publishedAt || post.createdAt;

            return (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.5) }}
              >
                <div className="bg-[#0d1120] border border-[#1e2540] rounded-2xl overflow-hidden shadow-glow-lg h-full flex flex-col">
                  {/* Video or thumbnail */}
                  {videoId && post.videoUrl && (
                    <YouTubeEmbed videoUrl={post.videoUrl} title={post.title} />
                  )}

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Date */}
                    {date && (
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
                        <Calendar size={12} />
                        {new Date(date).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                    )}

                    <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                    )}

                    {!post.excerpt && post.content && (
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1">
                        {post.content.slice(0, 200)}
                      </p>
                    )}

                    {videoId && (
                      <div className="mt-4 flex items-center gap-2 text-[#00e5ff] text-sm font-medium">
                        <Play size={14} />
                        Смотреть видео
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
