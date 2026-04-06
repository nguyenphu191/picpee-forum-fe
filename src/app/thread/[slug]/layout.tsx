import { Metadata } from 'next';
import axios from 'axios';

// Since this is a server module, we need absolute URLs. Use NEXT_PUBLIC_API_URL or a fallback.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate Dynamic Metadata for SEO & Social Previews
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data: thread } = await axios.get(`${API_URL}/forum/threads/${slug}`);

    if (!thread) {
      return { title: 'Bài viết không tồn tại' };
    }

    const shortContent = thread.content.length > 150 
      ? thread.content.substring(0, 150) + '...' 
      : thread.content;

    return {
      title: thread.title,
      description: shortContent,
      authors: [{ name: thread.author.username }],
      openGraph: {
        title: thread.title,
        description: shortContent,
        url: `/thread/${thread.slug}`,
        siteName: 'Picpee Forum',
        type: 'article',
        publishedTime: thread.createdAt,
        authors: [thread.author.username],
        images: [
          {
            url: thread.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${thread.author.username}`,
            width: 800,
            height: 600,
            alt: thread.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: thread.title,
        description: shortContent,
        images: [thread.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${thread.author.username}`],
      },
    };
  } catch (error) {
    return {
      title: 'Chủ đề',
      description: 'Lỗi tải chủ đề',
    };
  }
}

export default function ThreadLayout({ children }: { children: React.ReactNode }) {
  // Pass children through, the layout is just a wrapper for the metadata execution.
  return <>{children}</>;
}
