import { Eye, Database, Cookie, Lock, UserCheck, Mail } from 'lucide-react';

export const metadata = {
  title: 'Chính sách bảo mật',
  description: 'Chính sách quyền riêng tư và bảo mật dữ liệu của Picpee Forum',
};

const sections = [
  {
    icon: Database,
    title: '1. Dữ liệu chúng tôi thu thập',
    content: [
      'Thông tin tài khoản: email, tên đăng nhập, mật khẩu (đã được mã hóa), ảnh đại diện và chữ ký cá nhân.',
      'Thông tin thanh toán: tên ngân hàng, số tài khoản, tên chủ tài khoản — chỉ dùng cho việc chi trả thưởng Share & Earn.',
      'Thông tin liên hệ: số điện thoại (tùy chọn, dùng cho xác minh danh tính khi rút tiền).',
      'Dữ liệu hoạt động: bài viết, bình luận, lượt thích, lượt xem, lịch sử chia sẻ và điểm uy tín.',
      'Dữ liệu kỹ thuật: địa chỉ IP, loại trình duyệt, thiết bị, thời gian truy cập — phục vụ mục đích bảo mật và thống kê.',
    ],
  },
  {
    icon: Eye,
    title: '2. Mục đích sử dụng dữ liệu',
    content: [
      'Cung cấp và duy trì dịch vụ diễn đàn, xử lý yêu cầu đăng nhập và quản lý tài khoản.',
      'Xử lý thanh toán và chi trả thưởng cho chương trình Share & Earn.',
      'Gửi thông báo liên quan đến tài khoản (xác thực email, cảnh báo đăng nhập bất thường).',
      'Phân tích và cải thiện trải nghiệm người dùng thông qua dữ liệu ẩn danh tổng hợp.',
      'Ngăn chặn gian lận, bảo vệ cộng đồng và tuân thủ các yêu cầu pháp lý.',
    ],
  },
  {
    icon: UserCheck,
    title: '3. Chia sẻ dữ liệu với bên thứ ba',
    content: [
      'Chúng tôi không bán dữ liệu cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích thương mại.',
      'Dữ liệu có thể được chia sẻ với đối tác thanh toán (ngân hàng, ví điện tử) để xử lý giao dịch rút tiền.',
      'Chúng tôi có thể cung cấp dữ liệu cho cơ quan pháp luật nếu có yêu cầu hợp pháp bằng văn bản.',
      'Dịch vụ lưu trữ (hosting) của bên thứ ba có thể tiếp cận dữ liệu ở mức kỹ thuật, nhưng bị ràng buộc bởi hợp đồng bảo mật nghiêm ngặt.',
    ],
  },
  {
    icon: Cookie,
    title: '4. Cookies & Tracking',
    content: [
      'Chúng tôi sử dụng cookies phiên (session cookies) để duy trì trạng thái đăng nhập. Cookie này tự động xóa khi bạn đóng trình duyệt.',
      'Không sử dụng cookies theo dõi quảng cáo của bên thứ ba (Google Ads, Facebook Pixel, v.v.).',
      'Bạn có thể xóa cookies trong cài đặt trình duyệt bất kỳ lúc nào, tuy nhiên điều này có thể làm gián đoạn phiên đăng nhập.',
      'Chúng tôi có thể sử dụng localStorage để lưu tùy chọn giao diện (theme, ngôn ngữ) — dữ liệu này không được gửi lên server.',
    ],
  },
  {
    icon: Lock,
    title: '5. Bảo mật dữ liệu',
    content: [
      'Mật khẩu được mã hóa bằng thuật toán bcrypt trước khi lưu vào cơ sở dữ liệu. Chúng tôi không bao giờ lưu mật khẩu dạng văn bản thuần.',
      'Kết nối giữa trình duyệt và máy chủ được bảo mật bằng giao thức HTTPS/TLS.',
      'Dữ liệu nhạy cảm (thông tin ngân hàng) chỉ được truy cập bởi nhân viên được ủy quyền khi xử lý yêu cầu rút tiền.',
      'Chúng tôi thực hiện sao lưu dữ liệu định kỳ và có kế hoạch khôi phục sự cố để đảm bảo tính liên tục của dịch vụ.',
      'Trong trường hợp xảy ra sự cố bảo mật ảnh hưởng đến dữ liệu của bạn, chúng tôi sẽ thông báo trong vòng 72 giờ.',
    ],
  },
  {
    icon: UserCheck,
    title: '6. Quyền của bạn',
    content: [
      'Quyền truy cập: Bạn có thể xem toàn bộ thông tin cá nhân trong phần Cài đặt tài khoản.',
      'Quyền chỉnh sửa: Bạn có thể cập nhật thông tin cá nhân, ảnh đại diện và chữ ký bất kỳ lúc nào.',
      'Quyền xóa: Bạn có thể yêu cầu xóa tài khoản và toàn bộ dữ liệu bằng cách liên hệ support@picpee.vn.',
      'Quyền xuất dữ liệu: Theo yêu cầu, chúng tôi sẽ cung cấp bản sao dữ liệu của bạn dưới định dạng có thể đọc được.',
      'Quyền phản đối: Bạn có quyền phản đối việc xử lý dữ liệu trong một số trường hợp nhất định.',
    ],
  },
  {
    icon: Mail,
    title: '7. Liên hệ về quyền riêng tư',
    content: [
      'Nếu bạn có câu hỏi về chính sách này hoặc muốn thực hiện quyền của mình: privacy@picpee.vn',
      'Để yêu cầu xóa tài khoản hoặc xuất dữ liệu, vui lòng gửi email từ địa chỉ đã đăng ký kèm tiêu đề "DATA REQUEST".',
      'Chúng tôi cam kết phản hồi tất cả yêu cầu liên quan đến quyền riêng tư trong vòng 30 ngày làm việc.',
      'Chính sách này có thể được cập nhật. Các thay đổi quan trọng sẽ được thông báo qua email đã đăng ký.',
    ],
  },
];

export default function PolicyPage() {
  return (
    <div className="lg:col-span-12 max-w-4xl mx-auto w-full py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-zinc-100">Chính sách bảo mật</h1>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
          Chúng tôi cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn.
        </p>
        <p className="text-xs text-zinc-600 font-medium">Cập nhật lần cuối: 13/03/2026</p>
      </div>

      {/* Notice banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-sm text-zinc-300">
        <Lock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        <p>
          Chính sách bảo mật này giải thích cách Picpee Forum thu thập, sử dụng và bảo vệ thông tin
          của bạn khi sử dụng dịch vụ. Chúng tôi tuân thủ các quy định về bảo vệ dữ liệu cá nhân
          theo pháp luật Việt Nam.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div
            key={section.title}
            className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-800 bg-zinc-900/80">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <section.icon className="w-4 h-4 text-emerald-500" />
              </div>
              <h2 className="font-black text-zinc-100">{section.title}</h2>
            </div>
            <ul className="px-6 py-5 space-y-3">
              {section.content.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-zinc-400 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-zinc-600 pb-8">
        © 2026 Picpee Forum. Mọi quyền được bảo lưu.
      </p>
    </div>
  );
}
