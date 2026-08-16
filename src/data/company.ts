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
  name: "Vật Tư Điện Lạnh Đông Kha Đà Nẵng",
  brandName: "Đông Kha Đà Nẵng",
  tagline: "Giải Pháp & Vật Tư Điện Lạnh Đáng Tin Cậy Tại Đà Nẵng",
  subTagline: "Chuyên sỉ & lẻ ống đồng, gas lạnh, linh kiện điều hòa – tủ lạnh – máy giặt cùng giải pháp thi công điện lạnh dân dụng và công nghiệp.",
  
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
      shortDesc: "Ống đồng cuộn & ống đồng cây phục vụ lắp đặt điều hòa, hệ thống lạnh VRV/VRF.",
      fullDesc: "Cung cấp đầy đủ các chuẩn ống đồng Thái Lan, Malaysia, Việt Nam với độ dày chuẩn kỹ thuật từ 0.61mm đến 1.2mm, cuộn 15m, 30m hoặc dạng cây 2.9m / 6m.",
      image: "/images/copper_pipes.jpg",
      badge: "Bán chạy",
      items: ["Ống đồng cuộn 6.35, 9.52, 12.7, 15.88", "Ống đồng cây kỹ thuật công nghiệp", "Ống đồng bọc bảo ôn sẵn", "Phụ kiện nối, co, tê đồng các loại"],
      icon: "Pipette"
    },
    {
      id: "gas-lanh",
      name: "Gas Lạnh Chính Hãng",
      shortDesc: "Các dòng gas lạnh phổ biến nhất cho điều hòa dân dụng và hệ thống lạnh công nghiệp.",
      fullDesc: "Phân phối bình gas lạnh R32, R410A, R22, R134a, R404A thương hiệu Chemours, DuPont, Honeywell, Floron chuẩn định lượng và tinh khiết 99.9%.",
      image: "/images/refrigerant_gas.jpg",
      badge: "Chính hãng",
      items: ["Gas R32 thế hệ mới cho máy lạnh Inverter", "Gas R410A cho điều hòa trung tâm", "Gas R134a cho tủ lạnh, tủ đông", "Gas R22 dân dụng & R404A kho lạnh"],
      icon: "Flame"
    },
    {
      id: "linh-kien-dieu-hoa",
      name: "Linh Kiện Điều Hòa",
      shortDesc: "Linh kiện thay thế & phụ kiện sửa chữa cho tất cả các thương hiệu máy lạnh.",
      fullDesc: "Đầy đủ vật tư sửa chữa máy lạnh treo tường, âm trần, tủ đứng: Bo mạch đa năng/zin, lốc (block) nén, motor quạt, tụ điện, mắt nhận, remote điều khiển.",
      image: "/images/ac_components.jpg",
      items: ["Bo mạch điều hòa Inverter & Thường", "Block (Lốc) nén Daikin, Panasonic, LG", "Motor quạt dàn nóng & dàn lạnh", "Tụ ngâm, tụ quạt, mắt nhận signal, remote"],
      icon: "Wind"
    },
    {
      id: "linh-kien-tu-lanh",
      name: "Linh Kiện Tủ Lạnh",
      shortDesc: "Vật tư và phụ kiện thay thế chuyên dụng cho tủ lạnh, tủ đông, tủ mát.",
      fullDesc: "Chuyên linh kiện sửa tủ lạnh: Rơ le thời gian (Defrost Timer), sò lạnh, sò nóng, điện trở xả đá, quạt tủ lạnh, lốc nén tủ lạnh, phin lọc gas.",
      image: "/images/ac_components.jpg",
      items: ["Timer xả đá 1-3, 1-4 chính hãng", "Sò lạnh, sò nóng, cầu chì nhiệt", "Quạt dàn lạnh tủ lạnh 12V / 220V", "Lốc tủ lạnh R134a/R600a, phin lọc"],
      icon: "Refrigerator"
    },
    {
      id: "linh-kien-may-giat",
      name: "Linh Kiện Máy Giặt",
      shortDesc: "Phụ kiện và linh kiện thay thế chuẩn cho máy giặt cửa trên và cửa ngang.",
      fullDesc: "Cung cấp vật tư sửa máy giặt: Van cấp nước đơn/đôi, phao áp lực water level, bo mạch điều khiển, chốt khóa cửa, chạc ba, dây curoa.",
      image: "/images/ac_components.jpg",
      items: ["Van cấp nước máy giặt 1 đầu / 2 đầu", "Phao áp lực nước các hãng LG, Toshiba, Electrolux", "Công tắc cửa, chốt an toàn cửa máy giặt", "Dây curoa, van xả, bo mạch thay thế"],
      icon: "Disc"
    },
    {
      id: "vat-tu-khac",
      name: "Vật Tư & Nhớt Lạnh Khác",
      shortDesc: "Nhớt lạnh, gen bảo ôn, băng quấn, que hàn, đồ nghề kỹ thuật điện lạnh.",
      fullDesc: "Đa dạng các sản phẩm vật tư tiêu hao và công cụ hỗ trợ thợ kỹ thuật: Nhớt nén Suniso/Emkarate, gen dán Superlon, que hàn bạc, đồng hồ nạp gas.",
      image: "/images/storefront.png",
      items: ["Nhớt lạnh Suniso 3GS/4GS, Emkarate RL68H", "Bảo ôn cách nhiệt Superlon dạng ống/tấm", "Băng quấn xi, que hàn bạc Harris", "Đồng hồ đo áp suất, bơm hút chân không"],
      icon: "Wrench"
    }
  ] as ProductCategory[],

  services: [
    {
      id: "thi-cong-dien-lanh",
      title: "Thi Công Điện Lạnh Trọn Gói",
      description: "Tư vấn, thiết kế và thi công hệ thống điện lạnh trọn gói cho công trình dân dụng, biệt thự, nhà hàng, khách sạn và nhà xưởng công nghiệp tại Đà Nẵng.",
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
      title: "Giải Pháp Điều Hòa Không Khí",
      description: "Giải pháp tổng thể từ máy lạnh treo tường gia đình đến hệ thống điều hòa trung tâm VRV/VRF, multi cho căn hộ cao cấp và văn phòng.",
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
      description: "Thiết kế và triển khai đường ống thông gió, quạt hút công nghiệp, hệ thống cấp khí tươi sạch cho không gian kín.",
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
      title: "Giải Pháp Sưởi Ấm & Kiểm Soát Nhiệt",
      description: "Cung cấp các thiết bị sưởi ấm, bơm nhiệt heat pump và giải pháp điều hòa 2 chiều cho nhu cầu đặc thù.",
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
      title: "Nguồn Vật Tư Đa Dạng & Sẵn Kho",
      description: "Kho hàng 400 Phạm Hùng luôn có sẵn đầy đủ mẫu mã ống đồng, gas lạnh, linh kiện sửa chữa điều hòa, tủ lạnh, máy giặt.",
      icon: "Layers"
    },
    {
      id: "tu-van-khenh",
      title: "Tư Vấn Kỹ Thuật Nhanh & Chính Xác",
      description: "Am hiểu chuyên sâu về thông số kỹ thuật điện lạnh, giúp bạn chọn đúng chủng loại vật tư, tiết kiệm chi phí.",
      icon: "Headphones"
    },
    {
      id: "si-va-le",
      title: "Phục Vụ Sỉ & Lẻ Linh Hoạt",
      description: "Chính sách giá ưu đãi tốt cho anh em thợ điện lạnh, đại lý, cửa hàng lẻ và các nhà thầu thi công công trình.",
      icon: "BadgePercent"
    },
    {
      id: "cua-hang-truc-tiep",
      title: "Có Cửa Hàng Trực Tiếp Tại Đà Nẵng",
      description: "Mặt tiền rộng tại 400 Phạm Hùng, Hòa Xuân. Khách hàng dễ dàng ghé xem trực tiếp sản phẩm và trao đổi trực tiếp.",
      icon: "Store"
    }
  ] as WhyChooseUsItem[],

  customerTypes: [
    { id: "tho", title: "Thợ Điện Lạnh", description: "Cung cấp phụ kiện & linh kiện sẵn có, hỗ trợ nhanh cho công việc sửa chữa hàng ngày.", icon: "Wrench" },
    { id: "doi-thi-cong", title: "Đội Thi Công", description: "Cung cấp ống đồng, bảo ôn, gas lạnh số lượng lớn cho các dự án lắp đặt.", icon: "Users" },
    { id: "dai-ly", title: "Đại Lý & Cửa Hàng", description: "Bán sỉ vật tư giá cạnh tranh, nguồn hàng ổn định cho các đại lý khu vực Đà Nẵng & lân cận.", icon: "ShoppingBag" },
    { id: "nhan-thau", title: "Nhà Thầu & Doanh Nghiệp", description: "Giải pháp vật tư thi công hệ thống HVAC công trình, hóa đơn VAT đầy đủ.", icon: "Briefcase" },
    { id: "gia-dinh", title: "Khách Hàng Gia Đình", description: "Tư vấn vật tư & giải pháp sửa chữa thay thế linh kiện chính hãng cho thiết bị gia đình.", icon: "Home" }
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
      title: "Thi công lắp đặt hệ thống HVAC công trình",
      category: "Dự Án",
      image: "/images/hvac_services.jpg",
      description: "Đội ngũ Đông Kha hỗ trợ thi công hệ thống ống gió và đường ống điện lạnh chuyên nghiệp."
    }
  ] as GalleryItem[]
};
