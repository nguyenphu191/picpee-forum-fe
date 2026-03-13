import { FileText, Shield, Users, DollarSign, AlertTriangle, Mail } from 'lucide-react';

export const metadata = {
  title: 'Điều khoản dịch vụ',
  description: 'Điều khoản sử dụng dịch vụ Picpee Forum',
};

const sections = [
  {
    icon: Users,
    title: '1. Điều kiện sử dụng',
    content: [
      'Bằng cách truy cập và sử dụng Picpee Forum, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu trong tài liệu này.',
      'Bạn phải từ 13 tuổi trở lên để sử dụng dịch vụ. Nếu bạn dưới 18 tuổi, vui lòng có sự đồng ý của phụ huynh hoặc người giám hộ.',
      'Bạn chịu trách nhiệm duy trì tính bảo mật của tài khoản và mật khẩu. Mọi hoạt động diễn ra dưới tài khoản của bạn đều là trách nhiệm của bạn.',
      'Một người chỉ được đăng ký một tài khoản. Việc tạo nhiều tài khoản để lách luật hoặc gian lận sẽ dẫn đến việc bị khóa tài khoản vĩnh viễn.',
    ],
  },
  {
    icon: FileText,
    title: '2. Quy tắc nội dung',
    content: [
      'Nghiêm cấm đăng tải nội dung vi phạm pháp luật Việt Nam, bao gồm nhưng không giới hạn: nội dung khiêu dâm, kích động bạo lực, phân biệt chủng tộc, tôn giáo.',
      'Không được spam, quảng cáo không được phép, hoặc đăng các liên kết lừa đảo, phần mềm độc hại.',
      'Mọi nội dung vi phạm bản quyền sẽ bị gỡ bỏ ngay lập tức. Người đăng có thể bị khóa tài khoản nếu vi phạm nhiều lần.',
      'Không được đăng thông tin cá nhân của người khác (số điện thoại, địa chỉ, ảnh cá nhân) mà không có sự đồng ý.',
      'Tôn trọng các thành viên khác trong cộng đồng. Hành vi quấy rối, xúc phạm, hoặc đe dọa sẽ dẫn đến khóa tài khoản.',
    ],
  },
  {
    icon: DollarSign,
    title: '3. Chương trình Share & Earn',
    content: [
      'Chương trình Share & Earn cho phép thành viên kiếm tiền bằng cách chia sẻ nội dung của Picpee lên các nền tảng mạng xã hội.',
      'Mỗi nhiệm vụ chia sẻ thành công (được admin xác nhận) sẽ được tích lũy điểm uy tín và tiền thưởng theo quy định của từng chiến dịch.',
      'Picpee có quyền thay đổi mức thưởng, điều kiện tham gia và hủy chiến dịch mà không cần thông báo trước.',
      'Việc gian lận (tạo tài khoản ảo, click giả, báo cáo sai) sẽ dẫn đến mất toàn bộ số dư và bị cấm tham gia chương trình vĩnh viễn.',
      'Yêu cầu rút tiền tối thiểu là 100,000 VNĐ. Tiền sẽ được chuyển khoản trong vòng 3-7 ngày làm việc sau khi yêu cầu được duyệt.',
    ],
  },
  {
    icon: Shield,
    title: '4. Quyền riêng tư & Dữ liệu',
    content: [
      'Chúng tôi thu thập các thông tin cơ bản như email, tên đăng nhập, và hoạt động trên diễn đàn để cung cấp dịch vụ.',
      'Thông tin của bạn sẽ không được bán hoặc chia sẻ với bên thứ ba vì mục đích thương mại mà không có sự đồng ý của bạn.',
      'Chúng tôi sử dụng cookies để cải thiện trải nghiệm người dùng và duy trì phiên đăng nhập.',
      'Bạn có quyền yêu cầu xóa tài khoản và toàn bộ dữ liệu cá nhân bằng cách liên hệ với đội ngũ hỗ trợ.',
    ],
  },
  {
    icon: AlertTriangle,
    title: '5. Giới hạn trách nhiệm',
    content: [
      'Picpee Forum cung cấp dịch vụ "nguyên trạng" và không đảm bảo dịch vụ sẽ hoạt động liên tục, không có lỗi hoặc virus.',
      'Chúng tôi không chịu trách nhiệm về bất kỳ tổn thất nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ.',
      'Các nội dung do người dùng đăng tải là quan điểm cá nhân, không đại diện cho quan điểm của Picpee.',
      'Picpee có quyền đình chỉ, thay đổi hoặc chấm dứt dịch vụ vào bất kỳ lúc nào mà không cần thông báo trước.',
    ],
  },
  {
    icon: Mail,
    title: '6. Liên hệ & Khiếu nại',
    content: [
      'Nếu bạn có thắc mắc về điều khoản dịch vụ, vui lòng liên hệ: support@picpee.vn',
      'Các khiếu nại liên quan đến nội dung vi phạm có thể được gửi qua chức năng "Báo cáo" trên từng bài viết.',
      'Chúng tôi cam kết phản hồi các yêu cầu hợp lệ trong vòng 48 giờ làm việc.',
      'Điều khoản này được điều chỉnh bởi pháp luật Cộng hòa Xã hội Chủ nghĩa Việt Nam.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="lg:col-span-12 max-w-4xl mx-auto w-full py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
          <FileText className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-zinc-100">Điều khoản dịch vụ</h1>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
          Vui lòng đọc kỹ các điều khoản này trước khi sử dụng Picpee Forum.
        </p>
        <p className="text-xs text-zinc-600 font-medium">Cập nhật lần cuối: 13/03/2026</p>
      </div>

      {/* Notice banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-sm text-zinc-300">
        <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        <p>
          Bằng cách tạo tài khoản hoặc tiếp tục sử dụng dịch vụ, bạn xác nhận rằng bạn đã đọc,
          hiểu và đồng ý bị ràng buộc bởi các Điều khoản dịch vụ này.
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

      {/* Footer note */}
      <p className="text-center text-xs text-zinc-600 pb-8">
        © 2026 Picpee Forum. Mọi quyền được bảo lưu.
      </p>
    </div>
  );
}
