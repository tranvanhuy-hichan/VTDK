export interface ProductCategory {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  badge?: string;
  items: string[];
  icon: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  image: string;
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface CustomerTypeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

export const COMPANY_DATA = {
  name: "Công ty TNHH Vật Tư Đông Kha",
  brandName: "Vật Tư Đông Kha",
  tagline: "Nhà Phân Phối Vật Tư & Thiết Bị Điện Lạnh Chính Hãng",
  subTagline: "Chuyên phân phối sỉ & lẻ ống đồng, gas lạnh, linh kiện điều hòa – tủ lạnh – máy giặt cùng giải pháp kỹ thuật điều hòa & thông gió cho mọi công trình tại Đà Nẵng & miền Trung.",
  
  logoUrl: "/images/logo.png",
  storefrontUrl: "/images/storefront.png",

  address: "400 Phạm Hùng, Phường Hòa Xuân, TP. Đà Nẵng",
  city: "Đà Nẵng",
  hotline: "0905 487 441",
  hotlineRaw: "0905487441",
  zaloUrl: "https://zalo.me/0905487441",
  whatsAppUrl: "https://wa.me/84905487441",
  facebookUrl: "https://www.facebook.com/vattudienlanhdongkha",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=400+Ph%E1%BA%A1m+H%C3%B9ng,+H%C3%B2a+Xu%C3%A2n,+%C4%90%C3%A0+N%E1%BA%B5ng",
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.7924795328456!2d108.204561!3d16.024567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c676d05f31%3A0x6b2b7fb760b29!2s400%20Ph%E1%BA%A1m%20H%C3%B9ng%2C%20H%C3%B2a%20Xu%C3%A2n%2C%20C%E1%BA%A9m%20L%E1%BB%87%2C%20%C4%90%C3%A0%20N%E1%BA%B5ng!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn",

  workingHours: "07:00 – 18:30 (Tất cả các ngày trong tuần)",

  trustPoints: [
    { label: "Sỉ & Lẻ Giá Tốt", icon: "ShieldCheck" },
    { label: "Tư Vấn Kỹ Thuật Nhanh", icon: "Zap" },
    { label: "Giao Hàng Thuận Tiện", icon: "Truck" },
    { label: "Hàng Chính Hãng 100%", icon: "CheckCircle2" }
  ],

  productCategories: [
    {
      id: "ong-dong",
      name: "Ống Đồng Điện Lạnh",
      shortDesc: "Ống đồng cuộn & ống cây tiêu chuẩn ASTM/JIS phục vụ hệ thống điều hòa dân dụng và trung tâm.",
      fullDesc: "Cung cấp ống đồng Thái Lan (Luvata), ống đồng cây Hailiang đạt chuẩn ASTM/JIS, đầy đủ chứng chỉ CO/CQ, độ dày từ 0.61mm - 1.2mm đáp ứng áp suất các dòng gas lạnh thế hệ mới.",
      image: "/images/copper_pipes.jpg",
      badge: "Bán chạy",
      items: ["Ống đồng cuộn 6.35, 9.52, 12.7, 15.88", "Ống đồng cây kỹ thuật công nghiệp", "Ống đồng bọc bảo ôn sẵn", "Phụ kiện nối, co, tê đồng các loại"],
      icon: "Pipette"
    },
    {
      id: "gas-lanh",
      name: "Gas Lạnh Chính Hãng",
      shortDesc: "Gas lạnh thế hệ mới nhập khẩu chính hãng với độ tinh khiết cao cho hệ thống lạnh.",
      fullDesc: "Phân phối bình gas lạnh R32, R410A, R22, R134a, R404A đạt độ tinh khiết 99.9% từ các nhà sản xuất uy tín (Chemours Freon, Honeywell, Floron, Dupont), đảm bảo an toàn thiết bị.",
      image: "/images/refrigerant_gas.jpg",
      badge: "Chính hãng",
      items: ["Gas R32 thế hệ mới cho máy lạnh Inverter", "Gas R410A cho điều hòa trung tâm", "Gas R134a cho tủ lạnh, tủ đông", "Gas R22 dân dụng & R404A kho lạnh"],
      icon: "Flame"
    },
    {
      id: "linh-kien-dieu-hoa",
      name: "Linh Kiện Điều Hòa",
      shortDesc: "Linh kiện thay thế chính hãng cho các dòng điều hòa dân dụng và điều hòa trung tâm.",
      fullDesc: "Đầy đủ linh kiện sửa chữa điều hòa treo tường, âm trần, VRV: Bo mạch điều khiển zin/đa năng Inverter, lốc nén (Daikin, Panasonic, LG, Copeland), motor quạt và tụ ngâm.",
      image: "/images/ac_components.jpg",
      items: ["Bo mạch điều hòa Inverter & Thường", "Block (Lốc) nén Daikin, Panasonic, LG", "Motor quạt dàn nóng & dàn lạnh", "Tụ ngâm, tụ quạt, mắt nhận signal, remote"],
      icon: "Wind"
    },
    {
      id: "linh-kien-tu-lanh",
      name: "Linh Kiện Tủ Lạnh",
      shortDesc: "Linh kiện thay thế chuyên dụng cho tủ lạnh gia đình, tủ mát và tủ đông công nghiệp.",
      fullDesc: "Cung cấp linh kiện sửa tủ lạnh: Rơ le thời gian (Defrost Timer), sò lạnh, sò nóng, điện trở xả đá, quạt tủ lạnh, lốc nén tủ lạnh R134a/R600a và phin lọc.",
      image: "/images/ac_components.jpg",
      items: ["Timer xả đá 1-3, 1-4 chính hãng", "Sò lạnh, sò nóng, cầu chì nhiệt", "Quạt dàn lạnh tủ lạnh 12V / 220V", "Lốc tủ lạnh R134a/R600a, phin lọc"],
      icon: "Refrigerator"
    },
    {
      id: "linh-kien-may-giat",
      name: "Linh Kiện Máy Giặt",
      shortDesc: "Phụ kiện và linh kiện cơ/điện thay thế chuẩn cho máy giặt lồng đứng và lồng ngang.",
      fullDesc: "Cung cấp linh kiện thay thế máy giặt: Van cấp nước đơn/đôi, phao áp lực nước các hãng (LG, Toshiba, Electrolux), công tắc cửa, chạc ba, dây curoa.",
      image: "/images/ac_components.jpg",
      items: ["Van cấp nước máy giặt 1 đầu / 2 đầu", "Phao áp lực nước các hãng LG, Toshiba, Electrolux", "Công tắc cửa, chốt an toàn cửa máy giặt", "Dây curoa, van xả, bo mạch thay thế"],
      icon: "Disc"
    },
    {
      id: "vat-tu-khac",
      name: "Vật Tư & Nhớt Lạnh Khác",
      shortDesc: "Nhớt lạnh nén, ống gen cách nhiệt bảo ôn, băng quấn, que hàn bạc và đồ nghề kỹ thuật.",
      fullDesc: "Đầy đủ nhớt lạnh chuyên dụng Suniso/Emkarate, ống gen cách nhiệt Superlon chính hãng, băng quấn xi, que hàn bạc Harris và đồng hồ đo áp suất.",
      image: "/images/storefront.png",
      items: ["Nhớt lạnh Suniso 3GS/4GS, Emkarate RL68H", "Bảo ôn cách nhiệt Superlon dạng ống/tấm", "Băng quấn xi, que hàn bạc Harris", "Đồng hồ đo áp suất, bơm hút chân không"],
      icon: "Wrench"
    }
  ] as ProductCategory[],

  services: [
    {
      id: "thi-cong-dien-lanh",
      title: "Tư Vấn & Thi Công Điều Hòa & Thông Gió",
      description: "Thiết kế, bóc tách bản vẽ kỹ thuật và thi công trọn gói hệ thống điều hòa trung tâm VRV/VRF, thông gió cho tòa nhà, văn phòng, biệt thự theo quy trình kỹ thuật nghiêm ngặt.",
      features: [
        "Khảo sát thực tế & lập bản vẽ kỹ thuật chi tiết",
        "Cung cấp vật tư chính hãng đúng tiêu chuẩn thiết kế",
        "Đội ngũ kỹ thuật thi công chuẩn quy trình an toàn",
        "Bảo hành hệ thống đường ống và thiết bị dài hạn"
      ],
      icon: "Building2",
      image: "/images/hvac_services.jpg"
    },
    {
      id: "dieu-hoa-khong-khi",
      title: "Giải Pháp Điều Hòa Trung Tâm & Multi",
      description: "Giải pháp điều hòa thẩm mỹ cao (multi giấu trần, âm trần nối ống gió) cho biệt thự, căn hộ cao cấp, tối ưu hóa công suất làm lạnh và tiết kiệm năng lượng.",
      features: [
        "Tối ưu công suất lạnh theo dung tích phòng",
        "Tăng cường tiết kiệm điện năng cho chủ đầu tư",
        "Thiết kế giấu trần thẩm mỹ cao",
        "Tư vấn giải pháp phù hợp ngân sách"
      ],
      icon: "Fan",
      image: "/images/ac_components.jpg"
    },
    {
      id: "thong-gio",
      title: "Hệ Thống Thông Gió Cấp Khí Tươi",
      description: "Thi công đường ống gió tôn mạ kẽm/gió mềm, quạt hút công nghiệp, cấp khí tươi giúp trao đổi lưu thông không khí hiệu quả cho các tòa nhà và không gian kín.",
      features: [
        "Xử lý lưu thông không khí hiệu quả",
        "Giảm bớt hơi nóng và mùi khó chịu",
        "Thi công ống gió tôn mạ kẽm / ống gió mềm",
        "Đảm bảo tiêu chuẩn vi khí hậu trong nhà"
      ],
      icon: "Wind",
      image: "/images/hvac_services.jpg"
    },
    {
      id: "suoi-am",
      title: "Giải Pháp Heat Pump & Kiểm Soát Nhiệt",
      description: "Cung cấp hệ thống máy bơm nhiệt Heat Pump trung tâm tiết kiệm điện năng, máy sưởi và giải pháp điều hòa hai chiều cho các yêu cầu công trình đặc thù.",
      features: [
        "Hệ thống bơm nhiệt Heat Pump tiết kiệm điện",
        "Sưởi ấm an toàn, duy trì độ ẩm không khí",
        "Tích hợp điều khiển thông minh",
        "Phù hợp cho mùa lạnh tại miền Trung"
      ],
      icon: "ThermometerSun",
      image: "/images/hvac_services.jpg"
    }
  ] as ServiceItem[],

  whyChooseUs: [
    {
      id: "nguon-hang",
      title: "Hàng Sẵn Tại Kho - Đầy Đủ CO/CQ",
      description: "Đông Kha luôn chủ động lượng hàng tồn kho lớn các thương hiệu ống đồng, gas lạnh chính hãng, đầy đủ hóa đơn chứng từ xuất xứ rõ ràng.",
      icon: "Layers"
    },
    {
      id: "tu-van-khenh",
      title: "Tư Vấn Kỹ Thuật Chuyên Sâu",
      description: "Đội ngũ am hiểu sâu sắc thông số kỹ thuật hệ thống lạnh dân dụng & công nghiệp, tư vấn đúng giải pháp tối ưu chi phí cho nhà thầu.",
      icon: "Headphones"
    },
    {
      id: "si-va-le",
      title: "Chính Sách Giá Sỉ & Chiết Khấu Cao",
      description: "Cung cấp chính sách chiết khấu thương mại hấp dẫn cho nhà thầu cơ điện, đại lý bán sỉ và các tổ đội thi công công trình.",
      icon: "BadgePercent"
    },
    {
      id: "cua-hang-truc-tiep",
      title: "Cửa Hàng Thực Tế Tại Đà Nẵng",
      description: "Mặt tiền cửa hàng và văn phòng trưng bày tại 400 Phạm Hùng giúp anh em thợ có thể ghé trực tiếp xem sản phẩm, thử bo mạch tiện lợi.",
      icon: "Store"
    }
  ] as WhyChooseUsItem[],

  customerTypes: [
    { id: "tho", title: "Kỹ Thuật Viên Sửa Chữa", description: "Cung cấp đầy đủ linh kiện, phụ tùng và công cụ cầm tay chuyên dụng phục vụ việc sửa chữa hàng ngày.", icon: "Wrench" },
    { id: "doi-thi-cong", title: "Tổ Đội Thi Công Cơ Điện", description: "Đáp ứng nhanh số lượng lớn ống đồng, bảo ôn, gen cách nhiệt phục vụ tiến độ lắp đặt của dự án.", icon: "Users" },
    { id: "dai-ly", title: "Đại Lý & Cửa Hàng Bán Lẻ", description: "Cung cấp nguồn sỉ ổn định, chiết khấu cao cho các cửa hàng bán lẻ vật tư điện lạnh khu vực miền Trung.", icon: "ShoppingBag" },
    { id: "nhan-thau", title: "Nhà Thầu Cơ Điện (M&E)", description: "Đối tác cung ứng vật tư điều hòa & thông gió trọn gói cho công trình xây dựng, xuất hóa đơn tài chính VAT đầy đủ.", icon: "Briefcase" },
    { id: "gia-dinh", title: "Hộ Gia Đình & Người Sử Dụng", description: "Tư vấn, cung cấp linh kiện chính hãng thay thế cho các thiết bị điều hòa, tủ lạnh tại nhà.", icon: "Home" }
  ] as CustomerTypeItem[],

  gallery: [
    {
      id: "g1",
      title: "Mặt tiền cửa hàng Đông Kha tại 400 Phạm Hùng",
      category: "Cửa Hàng",
      image: "/images/storefront.png",
      description: "Cửa hàng rộng rãi, giao thông thuận tiện tại Phường Hòa Xuân, TP Đà Nẵng."
    },
    {
      id: "g2",
      title: "Kho vật tư ống đồng & bảo ôn cách nhiệt",
      category: "Kho Hàng",
      image: "/images/copper_pipes.jpg",
      description: "Luôn sẵn số lượng lớn các quy cách ống đồng cuộn và ống đồng cây chính hãng."
    },
    {
      id: "g3",
      title: "Khu vực trưng bày gas lạnh chính hãng",
      category: "Sản Phẩm",
      image: "/images/refrigerant_gas.jpg",
      description: "Phân phối đầy đủ bình gas R32, R410A, R134a, R22 nguyên tem nhãn."
    },
    {
      id: "g4",
      title: "Linh kiện & bo mạch thay thế điện lạnh",
      category: "Linh Kiện",
      image: "/images/ac_components.jpg",
      description: "Đa dạng các dòng bo mạch, tụ điện, lốc nén, motor quạt cho thợ kỹ thuật."
    },
    {
      id: "g5",
      title: "Thi công lắp đặt hệ thống điều hòa & thông gió công trình",
      category: "Dự Án",
      image: "/images/hvac_services.jpg",
      description: "Đội ngũ Đông Kha hỗ trợ thi công hệ thống ống gió và đường ống điện lạnh chuyên nghiệp."
    }
  ] as GalleryItem[]
};
