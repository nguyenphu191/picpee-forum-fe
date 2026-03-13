import { Metadata } from 'next';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type Props = {
  params: { username: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { data: user } = await axios.get(`${API_URL}/users/${params.username}`);

    if (!user) {
      return { title: 'Người dùng không tồn tại' };
    }

    const avatar = user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;
    const desc = user.signature 
        ? `${user.username} - ${user.signature}` 
        : `Hồ sơ cá nhân và hoạt động chia sẻ của ${user.username} (Uy tín: ${user.reputation})`;

    return {
      title: `${user.username} | Thành viên Picpee Forum`,
      description: desc,
      openGraph: {
        title: user.username,
        description: desc,
        url: `/user/${user.username}`,
        siteName: 'Picpee Forum',
        type: 'profile',
        images: [
          {
            url: avatar,
            width: 400,
            height: 400,
            alt: user.username,
          },
        ],
      },
      twitter: {
        card: 'summary', // using small card for user profiles
        title: user.username,
        description: desc,
        images: [avatar],
      },
    };
  } catch (error) {
    return {
      title: 'Thành viên',
      description: 'Lỗi tải hồ sơ cá nhân',
    };
  }
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
