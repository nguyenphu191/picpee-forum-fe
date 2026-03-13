import { Metadata, ResolvingMetadata } from 'next';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const previousImages = (await parent).openGraph?.images || [];
  try {
    const { data: board } = await axios.get(`${API_URL}/forum/boards/${params.slug}`);

    if (!board) {
      return { title: 'Chuyên mục không tồn tại' };
    }

    return {
      title: `${board.name} | Cộng đồng ${board.category?.name || ''}`,
      description: board.description || `Thảo luận, chia sẻ ở chuyên mục ${board.name}`,
      openGraph: {
        title: `${board.name} | Cộng đồng Picpee`,
        description: board.description || `Chào mừng bạn đến với ${board.name}`,
        url: `/board/${board.slug}`,
        siteName: 'Picpee Forum',
        type: 'website',
        images: [...previousImages],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${board.name} | Thảo luận`,
        description: board.description || 'Tham gia chia sẻ với các thành viên khác',
      },
    };
  } catch (error) {
    return {
      title: 'Chuyên mục',
      description: 'Lỗi tải chuyên mục',
    };
  }
}

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
