import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Updating rich product SEO content in database...");

  const richProducts = [
    {
      slug: "gas-lanh-r410a-chinh-hang",
      name: "Gas Lạnh R410A Chính Hãng (Bình 11.3kg)",
      shortDesc: `### Giới Thiệu Gas Lạnh R410A Chính Hãng
Gas R410A (Chemours Dupont / Honeywell / Taikang) là loại môi chất lạnh HFC thế hệ mới, được ứng dụng rộng rãi nhất cho các dòng máy lạnh công nghệ Inverter, máy lạnh âm trần và hệ thống điều hòa trung tâm VRV/VRF tại Việt Nam. Đạt tiêu chuẩn tinh khiết quốc tế > 99.9%, giúp tăng tối đa hiệu suất làm lạnh và bảo vệ máy nén.

### Thông Số Kỹ Thuật Chi Tiết
- Loại môi chất: R-410A (Hỗn hợp HFC-32 / HFC-125)
- Thành phần hóa học: 50% R32 / 50% R125
- Quy cách đóng gói: Bình thép nạp sẵn 11.3 kg (25 lbs)
- Xuất xứ: Mỹ / Ấn Độ / Trung Quốc chính ngạch
- Độ tinh khiết: >= 99.9%
- Hàm lượng ẩm: <= 10 ppm
- Áp suất nạp tiêu chuẩn: 110 - 130 PSI (nạp ở dạng lỏng)
- Dòng máy tương thích: Điều hòa Inverter, điều hòa trung tâm Daikin, Panasonic, Mitsubishi, Casper, LG, Gree...

### Hướng Dẫn Sử Dụng &amp; Lưu Ý Kỹ Thuật
- Gas R410A là gas hỗn hợp (2 thành phần), do đó KHI NẠP BẮT BUỘC PHẢI NẠP Ở DẠNG LỎNG (lộn ngược bình gas hoặc dùng van nạp lỏng chuyên dụng).
- Trước khi nạp gas mới hoặc nạp bổ sung, cần dùng máy hút chân không chuyên dụng hút sạch không khí và hơi ẩm trong đường ống tối thiểu 15-20 phút.

### Cách Phân Biệt Hàng Chính Hãng
- Bình gas R410A chính hãng có đầy đủ tem niêm phong chống giả bọc màng co nhiệt ở nắp van.
- Vỏ bình sơn tĩnh điện đồng màu, chữ in niêm yết rõ ràng, không bị trầy xước rỉ sét.
- Cân đủ trọng lượng vỏ + 11.3kg gas lỏng.

### Đối Tượng Sử Dụng &amp; Ứng Dụng
- Thích hợp cho thợ thi công lắp đặt máy lạnh, trung tâm bảo hành điện lạnh, nhà máy công nghiệp.
- Cung cấp giải pháp nạp gas cho nhà ở, văn phòng, khách sạn, nhà hàng tại Đà Nẵng và các tỉnh miền Trung.

### Kho Hàng &amp; Bán Sỉ Tại Đà Nẵng
- Cửa hàng Vật Tư Điện Lạnh Đông Kha tại 400 Phạm Hùng, Hòa Xuân, Đà Nẵng luôn sẵn kho số lượng lớn.
- Khách hàng &amp; thợ kỹ thuật có thể ghé xem sản phẩm, thử thiết bị trực tiếp tại kho.
- Giá sỉ cực tốt cho thợ và đại lý mua số lượng nhiều.`,
    },
    {
      slug: "gas-lanh-r32-chinh-hang",
      name: "Gas Lạnh R32 Chính Hãng (Bình 9.5kg / 3kg)",
      shortDesc: `### Giới Thiệu Gas Lạnh R32 Chính Hãng
Gas R32 (Chemours Freon / Taikang) là môi chất lạnh đơn chất thế hệ mới nhất, có chỉ số làm nóng toàn cầu (GWP) thấp hơn 67% so với gas R410A. Gas R32 giúp máy nén hoạt động êm ái, tiết kiệm điện năng tối đa và đạt khả năng làm lạnh cực nhanh.

### Thông Số Kỹ Thuật Chi Tiết
- Loại môi chất: R-32 (Difluoromethane CH2F2)
- Quy cách đóng gói: Bình nạp 9.5 kg (hoặc lon nhỏ 3kg)
- Độ tinh khiết: >= 99.9%
- Chỉ số GWP: 675 (Thân thiện môi trường)
- Áp suất hút làm việc: 140 - 160 PSI
- Ứng dụng: 100% dòng máy lạnh Inverter treo tường &amp; âm trần thế hệ mới

### Ứng Dụng &amp; Kỹ Thuật Nạp Gas R32
- Vì là gas đơn chất, R32 có thể nạp bổ sung ở cả dạng lỏng lẫn dạng hơi mà không lo thay đổi tỷ lệ thành phần.
- Áp suất làm việc của gas R32 cao hơn gas R22 thông thường, do đó yêu cầu sử dụng ống đồng tiêu chuẩn có độ dày >= 0.71mm để đảm bảo an toàn tuyệt đối.

### Phân Biệt Hàng R32 Chính Hãng
- Vỏ bình sơn tĩnh điện màu đỏ/xanh chuẩn đặc trưng của thương hiệu Chemours / Taikang.
- Tem màng co niêm phong nắp van nguyên vẹn, mã QR tra cứu nguồn gốc.
- Đầy đủ giấy chứng nhận xuất xứ CO/CQ cho công trình.

### Ưu Đãi Bán Sỉ Đà Nẵng
- Hàng sẵn kho 400 Phạm Hùng, Cẩm Lệ, Đà Nẵng.
- Báo giá sỉ ưu đãi cho thợ điện lạnh Đà Nẵng &amp; Quảng Nam.`,
    },
    {
      slug: "gas-lanh-r134a-chinh-hang",
      name: "Gas Lạnh R134a Chính Hãng (Bình 13.6kg / Lon 340g)",
      shortDesc: `### Giới Thiệu Gas Lạnh R134a Chính Hãng
Gas R134a (Tetrafluoroethane) là dòng môi chất lạnh tiêu chuẩn không chứa Chlorine, không gây hại tầng ozone. Sản phẩm chuyên dùng cho tủ lạnh dân dụng, tủ đông công nghiệp, hệ thống điều hòa ô tô và kho lạnh bảo quản thực phẩm.

### Thông Số Kỹ Thuật Chi Tiết
- Loại môi chất: R-134a (CH2FCF3)
- Quy cách đóng gói: Bình 13.6 kg (30 lbs) hoặc lon nhỏ 340g
- Xuất xứ: Chemours / Honeywell / Klea / Taikang
- Độ tinh khiết: >= 99.9%
- Hàm lượng nước: <= 10 ppm
- Dầu lạnh tương thích: Nhớt lạnh tổng hợp PAG hoặc POE (như Suniso, Emkarate)

### Ứng Dụng Thực Tế
- Tủ lạnh gia đình, tủ đông, tủ mát bảo quản siêu thị.
- Hệ thống điều hòa không khí xe hơi, xe tải lạnh.
- Máy làm lạnh nước Chiller công nghiệp.

### Kho Hàng &amp; Bán Sỉ Tại Đà Nẵng
- Đông Kha phân phối sỉ lẻ gas R134a bình lớn và lon nhỏ tiện dụng cho thợ sửa tủ lạnh, máy lạnh ô tô tại Đà Nẵng.
- Hàng sẵn tại kho 400 Phạm Hùng, hỗ trợ xuất hóa đơn VAT đầy đủ.`,
    },
    {
      slug: "bo-mach-dieu-hoa-inverter-da-nang",
      name: "Bo Mạch Điều Hòa Inverter Đa Năng",
      shortDesc: `### Giới Thiệu Bo Mạch Inverter Đa Năng
Bo mạch điều khiển điều hòa Inverter đa năng là giải pháp thay thế hoàn hảo cho các dòng máy lạnh Inverter bị hỏng bo dàn nóng/dàn lạnh mà không tìm được bo zin hoặc chi phí bo hãng quá cao.

### Thông Số Kỹ Thuật
- Công suất tương thích: Dùng cho máy lạnh Inverter từ 1.0 HP đến 2.5 HP (9.000 - 24.000 BTU)
- Loại quạt tương thích: Quạt dàn lạnh AC &amp; DC, Quạt dàn nóng AC &amp; DC
- Thương hiệu máy hỗ trợ: Daikin, Panasonic, Toshiba, LG, Samsung, Casper, Gree, Funiki, Midea...
- Phụ kiện đi kèm: Mạch dàn lạnh, mạch dàn nóng, Remote điều khiển từ chân, mắt nhận hồng ngoại, biến áp &amp; đầu cảm biến sensor.

### Ưu Điểm Nổi Bật
- Đã được lập trình sẵn firmware thông minh, dễ dàng đấu nối theo sơ đồ đính kèm.
- Giúp cứu sống các dòng máy lạnh cũ bị hỏng bo với chi phí tiết kiệm đến 60%.
- Anh em thợ tại Đà Nẵng có thể mang bo máy tới 400 Phạm Hùng để được tư vấn đấu nối trực tiếp.`,
    }
  ];

  for (const item of richProducts) {
    const updated = await prisma.product.updateMany({
      where: { slug: item.slug },
      data: { name: item.name, shortDesc: item.shortDesc }
    });
    console.log(`Updated ${item.slug}: ${updated.count} row(s)`);
  }

  console.log("Rich product SEO update completed successfully!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
