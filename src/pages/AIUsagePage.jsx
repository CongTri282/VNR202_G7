import { NavLink } from 'react-router-dom'

function AIUsagePage() {
  const usageMeta = [
    { label: 'Mức công khai', value: 'Đầy đủ và cập nhật' },
    { label: 'Phạm vi nội dung', value: 'Đảng Cộng sản Việt Nam 1986-1991' },
    { label: 'Trách nhiệm cuối cùng', value: 'Nhóm thực hiện đề tài' },
  ]

  const transparencyItems = [
    {
      title: 'Mục đích sử dụng AI',
      points: [
        'Hỗ trợ biên tập cấu trúc nội dung, tóm tắt và đề xuất cách trình bày để học nhanh hơn.',
        'Hỗ trợ gợi ý giao diện, cấu trúc thông tin và ý tưởng trò chơi học tập.',
        'Không thay thế vai trò thẩm định học thuật của nhóm thực hiện đề tài.',
      ],
    },
    {
      title: 'Phạm vi AI đã tham gia',
      points: [
        'Hỗ trợ ở vai trò trợ lý lập trình và tối ưu trình bày trong quá trình phát triển website.',
        'Hỗ trợ tạo bản nháp mô tả; sau đó được nhóm kiểm tra và chỉnh sửa thủ công.',
        'Một số thành phần giao diện và animation được phát triển từ đề xuất của AI.',
      ],
    },
    {
      title: 'Nội dung không giao cho AI',
      points: [
        'Đánh giá tính đúng đắn lịch sử ở phiên bản cuối cùng.',
        'Quyết định học thuật, phạm vi đề tài và kết luận chuyên môn.',
        'Kiểm duyệt bản công bố cuối cùng trước khi nộp.',
      ],
    },
    {
      title: 'Quy trình kiểm chứng',
      points: [
        'Đối chiếu thông tin với giáo trình, tài liệu học phần và nguồn tham khảo được giảng viên cho phép.',
        'Mọi nội dung do AI đề xuất đều được nhóm rà soát, chỉnh ngữ cảnh và loại bỏ phần không phù hợp.',
        'Nếu có mâu thuẫn thông tin, ưu tiên nguồn học thuật và quyết định của nhóm.',
      ],
    },
    {
      title: 'Cam kết minh bạch',
      points: [
        'Website công khai việc có sử dụng AI trong quá trình xây dựng.',
        'Nhóm chịu trách nhiệm cuối cùng về độ chính xác, tính trung thực và chất lượng học thuật.',
        'Người dùng nên xem website như công cụ hỗ trợ học tập, không thay thế tài liệu chính thống.',
      ],
    },
  ]

  return (
    <section className="ai-usage-page route-panel" aria-labelledby="ai-usage-heading">
      <div className="ai-usage-shell">
        <header className="ai-usage-header">
          <p className="eyebrow">AI Usage</p>
          <h2 id="ai-usage-heading">Minh bạch việc sử dụng AI trong website</h2>
          <p>
            Trang này công bố rõ ràng cách nhóm sử dụng công cụ AI trong quá trình xây dựng website
            với chủ đề Đảng Cộng sản Việt Nam giai đoạn 1986-1991.
          </p>

          <div className="ai-usage-meta" aria-label="Thông tin công khai nhanh">
            {usageMeta.map((item) => (
              <article key={item.label} className="ai-usage-meta-item">
                <p>{item.label}</p>
                <h3>{item.value}</h3>
              </article>
            ))}
          </div>
        </header>

        <div className="ai-usage-grid">
          {transparencyItems.map((item, index) => (
            <article
              key={item.title}
              className="ai-usage-card"
              style={{ '--ai-delay': `${index * 70}ms` }}
            >
              <h3>{item.title}</h3>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <section className="ai-usage-note" aria-label="Lưu ý trách nhiệm sử dụng">
          <h3>Lưu ý quan trọng</h3>
          <p>
            Tất cả nội dung lịch sử trên website cần được hiểu là tài liệu hỗ trợ học tập. Với mục đích
            học thuật chính thức, vui lòng đối chiếu thêm với giáo trình và tài liệu tham khảo của học phần.
          </p>
        </section>

        <div className="ai-usage-actions">
          <NavLink to="/presentation" className="primary-link">
            Xem nội dung học tập
          </NavLink>
          <NavLink to="/game" className="primary-link secondary-link">
            Quay lại khu vực game
          </NavLink>
        </div>
      </div>
    </section>
  )
}

export default AIUsagePage
