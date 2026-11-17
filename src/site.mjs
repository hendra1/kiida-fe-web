/**
 * KIIDA Static Site Configuration, Page Metadata & Bilingual UI Strings
 * Edit company details here and run `node scripts/build.mjs` to update all 20 pages.
 */

export const site = {
  brand: "KIIDA",
  legalName: "PT Kiida Tumbuh Bersama",
  founded: "2025",
  url: "https://kiida.app",
  address: {
    line1: "District 8, Prosperity Tower Lt. 18",
    line2: "Jl. Jend. Sudirman Kav. 52-53, SCBD Lot 28",
    city: "Jakarta Selatan",
    region: "DKI Jakarta",
    postal: "12190",
    country: "Indonesia",
    fullEn: "District 8, Prosperity Tower Level 18, Jl. Jend. Sudirman Kav. 52-53, SCBD, Jakarta Selatan, DKI Jakarta 12190, Indonesia",
    fullId: "District 8, Prosperity Tower Lantai 18, Jl. Jend. Sudirman Kav. 52-53, SCBD, Jakarta Selatan, DKI Jakarta 12190, Indonesia",
    mapsUrl: "https://maps.google.com/?q=District+8+Prosperity+Tower+SCBD+Jakarta"
  },
  phoneDisplay: "+62 21 5088 9900",
  phoneHref: "+622150889900",
  whatsappDisplay: "+62 811 9900 8822",
  whatsappHref: "https://wa.me/6281199008822",
  email: {
    hello: "hello@kiida.app",
    support: "support@kiida.app",
    partners: "partners@kiida.app",
    privacy: "privacy@kiida.app"
  },
  hours: {
    en: "Monday – Friday, 09:00 – 18:00 WIB (GMT+7)",
    id: "Senin – Jumat, 09.00 – 18.00 WIB (GMT+7)"
  },
  // Leave empty to use the built-in mailto fallback; set to a Formspree URL to post directly.
  formEndpoint: "",
  singlePage: {
    en: {
      title: "KIIDA — Every Little Moment, Gently Understood",
      description:
        "KIIDA turns everyday photos and videos into a warm, clear picture of your child's growth—connecting parents, teachers, learning centers, and pediatric clinics across Indonesia."
    },
    id: {
      title: "KIIDA — Setiap Momen Kecil, Dipahami dengan Hangat",
      description:
        "KIIDA mengubah foto dan video keseharian anak menjadi gambaran tumbuh kembang yang hangat dan jelas—menghubungkan orang tua, guru, pusat belajar, dan klinik anak."
    }
  }
};

export const pages = [
  {
    key: "home",
    file: "index.html",
    en: {
      title: "KIIDA — Every Little Moment, Gently Understood",
      description: "KIIDA turns the everyday photos and videos you already take into a warm, clear picture of your child's growth—and helps you find trusted sensory classes, clinics, and toys when you're ready."
    },
    id: {
      title: "KIIDA — Setiap Momen Kecil, Dipahami dengan Hangat",
      description: "KIIDA mengubah foto dan video keseharian anak menjadi gambaran tumbuh kembang yang hangat dan jelas—serta membantu Anda menemukan kelas sensorik, klinik, dan mainan terpercaya saat dibutuhkan."
    }
  },
  {
    key: "parents",
    file: "parents.html",
    en: {
      title: "For Parents — Growth Diary, Milestones & Discovery | KIIDA",
      description: "Follow your child's developmental milestones from 2 months to 5 years with a shared home-and-school Growth Diary, doctor-visit summaries, 24/7 Ask KIIDA chat, and trusted class bookings."
    },
    id: {
      title: "Untuk Orang Tua — Buku Harian Tumbuh Kembang & Kelas Anak | KIIDA",
      description: "Pantau tahapan tumbuh kembang anak usia 2 bulan hingga 5 tahun melalui Growth Diary bersama guru, ringkasan kunjungan dokter, tanya jawab Ask KIIDA 24/7, dan pemesanan kelas anak."
    }
  },
  {
    key: "partners",
    file: "partners.html",
    en: {
      title: "For Schools, Teachers & Clinics — Partner with KIIDA",
      description: "Spend less time on daily classroom logs and manual WhatsApp bookings. KIIDA supports teachers with AI-assisted observation notes and connects learning centers and pediatric clinics with families."
    },
    id: {
      title: "Untuk Sekolah, Guru & Klinik — Bermitra dengan KIIDA",
      description: "Hemat waktu mencatat laporan harian kelas dan jadwal pendaftaran manual. KIIDA membantu guru menyusun catatan observasi serta menghubungkan tempat les, kelas sensorik, dan klinik dengan keluarga."
    }
  },
  {
    key: "pricing",
    file: "pricing.html",
    en: {
      title: "Pricing — Free for Families & Teachers | KIIDA",
      description: "Simple, honest pricing. KIIDA is free to start for parents and teachers, with a transparent IDR 5,000 service fee on class or clinic bookings."
    },
    id: {
      title: "Harga — Gratis untuk Keluarga & Guru | KIIDA",
      description: "Biaya yang jujur dan transparan. KIIDA gratis digunakan oleh orang tua dan guru, dengan biaya layanan Rp5.000 per pemesanan kelas atau klinik."
    }
  },
  {
    key: "about",
    file: "about.html",
    en: {
      title: "About KIIDA — Our Story, Values & Company | PT Kiida Tumbuh Bersama",
      description: "Learn why PT Kiida Tumbuh Bersama built KIIDA in Jakarta: bringing families, teachers, learning centers, and pediatric specialists together around every child's early years."
    },
    id: {
      title: "Tentang KIIDA — Cerita, Nilai & Perusahaan Kami | PT Kiida Tumbuh Bersama",
      description: "Pelajari mengapa PT Kiida Tumbuh Bersama membangun KIIDA di Jakarta: menyatukan orang tua, guru, pusat belajar, dan klinik tumbuh kembang di setiap langkah awal anak."
    }
  },
  {
    key: "help",
    file: "help.html",
    en: {
      title: "Help & Frequently Asked Questions | KIIDA",
      description: "Answers to common questions about the KIIDA Growth Diary, CDC milestone checklists, child photo privacy, class and clinic bookings, and school partnerships."
    },
    id: {
      title: "Bantuan & Pertanyaan Umum (FAQ) | KIIDA",
      description: "Jawaban lengkap seputar Growth Diary KIIDA, panduan tahapan tumbuh kembang CDC, privasi foto anak, pemesanan kelas dan klinik, serta kemitraan sekolah."
    }
  },
  {
    key: "contact",
    file: "contact.html",
    en: {
      title: "Contact Us — Jakarta Office, Support & Partnerships | KIIDA",
      description: "Get in touch with PT Kiida Tumbuh Bersama in Jakarta for family support, school and clinic partnerships, or privacy inquiries."
    },
    id: {
      title: "Hubungi Kami — Kantor Jakarta, Layanan Pelanggan & Kemitraan | KIIDA",
      description: "Hubungi PT Kiida Tumbuh Bersama di Jakarta untuk bantuan keluarga, kemitraan sekolah dan klinik, maupun pertanyaan privasi."
    }
  },
  {
    key: "privacy",
    file: "privacy.html",
    en: {
      title: "Privacy Policy & Children's Data Protection | KIIDA",
      description: "How PT Kiida Tumbuh Bersama protects your family's photos, videos, and developmental records in accordance with Indonesian Personal Data Protection Law (UU PDP No. 27/2022)."
    },
    id: {
      title: "Kebijakan Privasi & Perlindungan Data Anak | KIIDA",
      description: "Bagaimana PT Kiida Tumbuh Bersama melindungi foto, video, dan catatan tumbuh kembang anak Anda sesuai Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022)."
    }
  },
  {
    key: "terms",
    file: "terms.html",
    en: {
      title: "Terms of Service | KIIDA",
      description: "Terms of Service governing the use of the KIIDA mobile application, partner web dashboard, and class or clinic booking marketplace operated by PT Kiida Tumbuh Bersama."
    },
    id: {
      title: "Syarat & Ketentuan Layanan | KIIDA",
      description: "Syarat dan Ketentuan penggunaan aplikasi mobile KIIDA, dashboard web mitra, serta layanan pemesanan kelas dan klinik yang dioperasikan oleh PT Kiida Tumbuh Bersama."
    }
  },
  {
    key: "404",
    file: "404.html",
    en: {
      title: "Page Not Found | KIIDA",
      description: "We couldn't find the page you were looking for. Head back to the KIIDA home page."
    },
    id: {
      title: "Halaman Tidak Ditemukan | KIIDA",
      description: "Halaman yang Anda cari tidak ditemukan. Kembali ke halaman utama KIIDA."
    }
  }
];

export const ui = {
  en: {
    htmlLang: "en",
    skipToContent: "Skip to main content",
    menuLabel: "Menu",
    navAriaLabel: "Primary",
    nav: {
      home: "Home",
      parents: "For Parents",
      partners: "For Schools & Clinics",
      pricing: "Pricing",
      about: "About",
      help: "Help",
      contact: "Contact",
      cta: "Join early access"
    },
    langSwitchLabel: "Bahasa Indonesia",
    langSwitchShort: "ID",
    currentLangShort: "EN",
    footer: {
      tagline: "Parent’s trusted companion in every early step. Helping families, teachers, and learning centers nurture every child’s growth with warmth and clarity.",
      operatedBy: "KIIDA is a product of",
      colProduct: "Product",
      colCompany: "Company & Support",
      colOffice: "Jakarta Office",
      linkHome: "Overview",
      linkParents: "For Parents",
      linkPartners: "For Schools & Clinics",
      linkPricing: "Pricing",
      linkAbout: "About Us",
      linkHelp: "Help & FAQ",
      linkContact: "Contact Us",
      linkPrivacy: "Privacy Policy",
      linkTerms: "Terms of Service",
      phoneLabel: "Phone:",
      emailLabel: "Email:",
      hoursLabel: "Hours:",
      rights: "All rights reserved."
    }
  },
  id: {
    htmlLang: "id",
    skipToContent: "Lewati ke konten utama",
    menuLabel: "Menu",
    navAriaLabel: "Utama",
    nav: {
      home: "Beranda",
      parents: "Untuk Orang Tua",
      partners: "Untuk Sekolah & Klinik",
      pricing: "Harga",
      about: "Tentang Kami",
      help: "Bantuan",
      contact: "Kontak",
      cta: "Daftar Akses Awal"
    },
    langSwitchLabel: "English",
    langSwitchShort: "EN",
    currentLangShort: "ID",
    footer: {
      tagline: "Sahabat terpercaya orang tua di setiap langkah awal anak. Membantu keluarga, guru, dan pusat belajar mendampingi tumbuh kembang anak dengan hangat dan jelas.",
      operatedBy: "KIIDA adalah produk dari",
      colProduct: "Produk",
      colCompany: "Perusahaan & Bantuan",
      colOffice: "Kantor Jakarta",
      linkHome: "Ringkasan",
      linkParents: "Untuk Orang Tua",
      linkPartners: "Untuk Sekolah & Klinik",
      linkPricing: "Harga",
      linkAbout: "Tentang Kami",
      linkHelp: "Bantuan & FAQ",
      linkContact: "Hubungi Kami",
      linkPrivacy: "Kebijakan Privasi",
      linkTerms: "Syarat & Ketentuan",
      phoneLabel: "Telepon:",
      emailLabel: "Email:",
      hoursLabel: "Jam Kerja:",
      rights: "Seluruh hak cipta dilindungi."
    }
  }
};
