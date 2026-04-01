import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // --- Admin User ---
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      name: "Администратор",
      role: "admin",
    },
  });
  console.log("Admin user created");

  // --- Products ---
  const productsData = [
    {
      slug: "umnaya-pervichka",
      name: "Умная первичка",
      tagline: "AI-обработка документов",
      heroTitle: "Умная первичка — AI-обработка документов",
      heroSlogan:
        "Забудьте о ручном вводе накладных навсегда. Ускорение в 6–8 раз, точность 97%.",
      accentColor: "#00e5ff",
      sortOrder: 1,
      kpiItems: [
        { value: "6–8×", label: "Ускорение обработки", source: "Feathery, 2024" },
        { value: "до 97%", label: "Точность OCR", source: "TrustRadius — ABBYY FineReader" },
        { value: "−70%", label: "Снижение ручного труда", source: "ProcessMaker, 2024" },
      ],
      pains: [
        { title: "Ручной ввод", description: "До 70% рабочего времени сотрудников уходит на ручной ввод накладных и счетов" },
        { title: "Ошибки в учёте", description: "Критические ошибки в учёте из-за человеческого фактора" },
        { title: "Задержки", description: "Задержки в цепочках поставок из-за медленной обработки документов" },
      ],
      features: [
        { title: "OCR документов", description: "OCR банковских выписок и счетов-фактур — точность до 97%", icon: "ScanLine" },
        { title: "Автовалидация", description: "Система выявляет ошибки и спорные поля без участия человека", icon: "ShieldCheck" },
        { title: "Интеграция", description: "Бесшовная интеграция с 1С, ERP-системами и ЕГРСЕ", icon: "Plug" },
        { title: "Пакетная обработка", description: "Тысячи документов через Batch API", icon: "Layers" },
      ],
      targetIndustries: [
        { name: "Логистика", icon: "Truck" },
        { name: "Финансы", icon: "Landmark" },
        { name: "Ритейл", icon: "ShoppingCart" },
      ],
      pricingTiers: [
        { tierName: "Старт", price: 80000, description: "до 3 типов документов", features: ["До 3 типов документов", "Базовый OCR", "Email-поддержка"], isPopular: false },
        { tierName: "Бизнес", price: 140000, description: "до 7 типов + OCR", features: ["До 7 типов документов", "Продвинутый OCR", "Автовалидация", "Интеграция с 1С"], isPopular: true },
        { tierName: "Про", price: 200000, description: "неограниченно + API", features: ["Неограниченно типов", "Batch API", "Полная интеграция", "Выделенная поддержка"], isPopular: false },
      ],
    },
    {
      slug: "ml-model",
      name: "Обучение ML-модели",
      tagline: "AI под ваш бизнес",
      heroTitle: "Обучение ML-модели — AI под ваш бизнес",
      heroSlogan:
        "Есть данные — обучим. Нет данных — соберём и разметим сами. Модель под вашу задачу.",
      accentColor: "#a78bfa",
      sortOrder: 2,
      kpiItems: [
        { value: "+20–30%", label: "Точность прогноза", source: "Internal benchmarks" },
        { value: "от 500", label: "Минимум примеров", source: "Transfer learning" },
        { value: "4–8 нед", label: "Срок MVP", source: "AI Academy" },
      ],
      pains: [
        { title: "Нет готовой модели", description: "Нет готовой AI-модели под специфику вашего бизнеса" },
        { title: "Нет данных", description: "Нет данных — непонятно с чего начать" },
        { title: "Низкая точность", description: "Универсальные решения дают 50–70% точности вместо нужных 90%+" },
      ],
      features: [
        { title: "Полный цикл", description: "Аудит данных, сбор, разметка, обучение, интеграция, поддержка", icon: "RefreshCw" },
        { title: "Малые датасеты", description: "Работаем с малыми датасетами (от 500 примеров) — transfer learning", icon: "Database" },
        { title: "Типы моделей", description: "Прогноз спроса, классификация, детекция аномалий, рекомендации", icon: "BrainCircuit" },
        { title: "MLOps", description: "Мониторинг дрейфа модели, переобучение", icon: "Activity" },
      ],
      targetIndustries: [
        { name: "Производство", icon: "Factory" },
        { name: "E-commerce", icon: "ShoppingBag" },
        { name: "Телеком", icon: "Radio" },
      ],
      pricingTiers: [
        { tierName: "Старт", price: 150000, description: "базовая модель", features: ["Базовая модель", "Аудит данных", "Документация"], isPopular: false },
        { tierName: "Бизнес", price: 250000, description: "кастом + интеграция", features: ["Кастомная модель", "Интеграция", "Transfer learning", "3 мес поддержки"], isPopular: true },
        { tierName: "Про", price: 400000, description: "полный цикл MLOps", features: ["Полный цикл MLOps", "Мониторинг дрейфа", "Переобучение", "Выделенная команда"], isPopular: false },
      ],
    },
    {
      slug: "crm-assistant",
      name: "CRM-Ассистент",
      tagline: "AI внутри вашего отдела продаж",
      heroTitle: "CRM-Ассистент — AI внутри вашего отдела продаж",
      heroSlogan:
        "Автоквалификация лидов, анализ звонков и прогноз конверсии — без найма аналитика.",
      accentColor: "#10b981",
      sortOrder: 3,
      kpiItems: [
        { value: "+25%", label: "Конверсия продаж", source: "Salesforce / Nucleus Research" },
        { value: "$8.71:$1", label: "ROI CRM-автоматизации", source: "Nucleus Research" },
        { value: "−40%", label: "Время на рутину", source: "HubSpot Research" },
      ],
      pains: [
        { title: "Рутина вместо продаж", description: "Менеджеры тратят 60% времени на рутину вместо продаж" },
        { title: "Нет аналитики", description: "Нет объективной аналитики по звонкам и сделкам" },
        { title: "Потеря VIP", description: "VIP-клиенты теряются среди обычных заявок" },
      ],
      features: [
        { title: "Анализ тональности", description: "Анализ тональности звонков и переписки — выявление горячих и холодных клиентов", icon: "AudioLines" },
        { title: "VIP-приоритизация", description: "Автоматическое тегирование и приоритизация VIP-лидов", icon: "Star" },
        { title: "Детекция конфликтов", description: "Детекция конфликтных ситуаций в реальном времени — эскалация руководителю", icon: "AlertTriangle" },
        { title: "Авто-КП", description: "Автогенерация КП по итогам разговора", icon: "FileText" },
      ],
      targetIndustries: [
        { name: "B2B-продажи", icon: "Handshake" },
        { name: "Банки", icon: "Landmark" },
        { name: "Страхование", icon: "Shield" },
      ],
      pricingTiers: [
        { tierName: "Старт", price: 100000, description: "базовый AI", features: ["Базовый AI-ассистент", "Анализ звонков", "Email-поддержка"], isPopular: false },
        { tierName: "Бизнес", price: 180000, description: "+ воронка + авто-КП", features: ["Воронка продаж", "Авто-КП", "VIP-приоритизация", "Интеграция с CRM"], isPopular: true },
        { tierName: "Про", price: 250000, description: "полная автоматизация", features: ["Полная автоматизация", "Детекция конфликтов", "Прогноз конверсии", "Выделенная поддержка"], isPopular: false },
      ],
    },
    {
      slug: "whatsapp-bot",
      name: "WhatsApp-Бот",
      tagline: "Умный помощник 24/7",
      heroTitle: "WhatsApp-Бот — умный помощник 24/7",
      heroSlogan:
        "Отвечает клиентам пока вы спите. NLP-агент с реальным пониманием контекста — не скрипт.",
      accentColor: "#f59e0b",
      sortOrder: 4,
      kpiItems: [
        { value: "+225%", label: "Скорость ответа", source: "Tidio Research" },
        { value: "+27%", label: "Рост продаж", source: "Business Insider" },
        { value: "24/7", label: "Доступность", source: "Without operators" },
      ],
      pains: [
        { title: "Потеря клиентов", description: "Клиенты уходят, не дождавшись ответа в нерабочее время" },
        { title: "Перегрузка операторов", description: "Операторы перегружены однотипными вопросами" },
        { title: "Нет квалификации", description: "Нет автоматической квалификации входящих заявок" },
      ],
      features: [
        { title: "LLM-агент", description: "GPT-4o: понимает контекст, задаёт уточняющие вопросы", icon: "Bot" },
        { title: "Обработка заявок", description: "Обработка входящих заявок, FAQ, квалификация лидов без оператора", icon: "MessageSquare" },
        { title: "CRM-интеграция", description: "Автоматически создаёт карточку клиента в CRM", icon: "UserPlus" },
        { title: "Мультиязычность", description: "Русский, кыргызский, английский, казахский", icon: "Globe" },
      ],
      targetIndustries: [
        { name: "Ритейл", icon: "ShoppingCart" },
        { name: "Услуги", icon: "Wrench" },
        { name: "HoReCa", icon: "UtensilsCrossed" },
      ],
      pricingTiers: [
        { tierName: "Старт", price: 80000, description: "AI-ответы + FAQ", features: ["AI-ответы", "FAQ-база", "Базовая аналитика"], isPopular: false },
        { tierName: "Бизнес", price: 130000, description: "+ CRM + квалификация", features: ["CRM-интеграция", "Квалификация лидов", "Мультиязычность", "Приоритетная поддержка"], isPopular: true },
        { tierName: "Про", price: 180000, description: "+ аналитика + мультиязык", features: ["Полная аналитика", "4 языка", "Кастомные сценарии", "Выделенный менеджер"], isPopular: false },
      ],
    },
    {
      slug: "optimizer",
      name: "Оптимизатор",
      tagline: "BI + ML + Мониторинг",
      heroTitle: "Оптимизатор — BI + ML + Мониторинг",
      heroSlogan:
        "Остановите потери на оборудовании и маршрутах. Кейс Чакан ГЭС — 850 000 KGS.",
      accentColor: "#fb7185",
      sortOrder: 5,
      kpiItems: [
        { value: "−18–25%", label: "Снижение затрат", source: "McKinsey & Company" },
        { value: "ROI 10:1–30:1", label: "Возврат инвестиций", source: "Gartner Research" },
        { value: "6–8 нед", label: "Срок MVP", source: "AI Academy (Чакан ГЭС)" },
      ],
      pains: [
        { title: "Внезапные поломки", description: "Оборудование ломается внезапно, простои стоят миллионы" },
        { title: "Неоптимальные маршруты", description: "Маршруты не оптимизированы — перерасход топлива и времени" },
        { title: "Нет единой картины", description: "Нет единой картины по производственным KPI" },
      ],
      features: [
        { title: "BI-дашборды", description: "Дашборды в реальном времени: маршруты, оборудование, KPI производства", icon: "BarChart3" },
        { title: "Predictive Maintenance", description: "ML-прогноз: когда сломается оборудование", icon: "Cog" },
        { title: "Оптимизация маршрутов", description: "Алгоритм сокращает пробег и расход топлива", icon: "Route" },
        { title: "Алерты", description: "Автоматическое уведомление при отклонении от нормы", icon: "Bell" },
      ],
      targetIndustries: [
        { name: "Энергетика", icon: "Zap" },
        { name: "Логистика", icon: "Truck" },
        { name: "Производство", icon: "Factory" },
      ],
      pricingTiers: [
        { tierName: "Старт", price: 200000, description: "BI + базовый прогноз", features: ["BI-дашборды", "Базовый прогноз", "Email-поддержка"], isPopular: false },
        { tierName: "Бизнес", price: 400000, description: "+ автопрогноз + алерты", features: ["Автопрогноз поломок", "Алерты", "Оптимизация маршрутов", "Интеграция"], isPopular: true },
        { tierName: "Про", price: 850000, description: "полный MVP (Чакан ГЭС)", features: ["Полный MVP", "Predictive Maintenance", "Кастомные дашборды", "Выделенная команда"], isPopular: false },
      ],
    },
  ];

  for (const productData of productsData) {
    const { pricingTiers, ...product } = productData;

    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...product,
      },
      create: {
        ...product,
      },
    });

    for (const tier of pricingTiers) {
      await prisma.pricingTier.upsert({
        where: {
          productId_tierName: {
            productId: created.id,
            tierName: tier.tierName,
          },
        },
        update: {
          price: tier.price,
          description: tier.description,
          features: tier.features,
          isPopular: tier.isPopular,
        },
        create: {
          productId: created.id,
          tierName: tier.tierName,
          price: tier.price,
          description: tier.description,
          features: tier.features,
          isPopular: tier.isPopular,
        },
      });
    }

    console.log(`Product "${product.name}" seeded with ${pricingTiers.length} pricing tiers`);
  }

  // --- Case Study: Chakan GES ---
  await prisma.caseStudy.upsert({
    where: { slug: "chakan-ges" },
    update: {},
    create: {
      slug: "chakan-ges",
      title: "Оптимизация Чакан ГЭС",
      clientName: "Чакан ГЭС",
      productName: "Оптимизатор",
      cost: "850 000 KGS",
      timeline: "6–8 недель",
      result:
        "Внедрение BI-дашбордов и ML-модели предиктивного обслуживания позволило сократить незапланированные простои на 35% и снизить затраты на обслуживание оборудования на 25%. Система алертов предупреждает о критических отклонениях за 48 часов до возможной поломки.",
      status: "completed",
      quote:
        "AI Academy помогли нам увидеть то, что мы не замечали годами. Теперь мы предотвращаем поломки, а не реагируем на них.",
      quoteAuthor: "Главный инженер, Чакан ГЭС",
      isPublished: true,
      sortOrder: 1,
    },
  });
  console.log("Case study 'Chakan GES' seeded");

  // --- Site Settings ---
  const settings = [
    { key: "siteName", value: "AI Academy" },
    { key: "phone", value: "+996 555 123 456" },
    { key: "email", value: "info@aiacademy.kg" },
    { key: "address", value: "Бишкек, Кыргызстан" },
    { key: "whatsappNumber", value: "+996555123456" },
    { key: "heroTitle", value: "AI-решения для бизнеса Центральной Азии" },
    { key: "heroSubtitle", value: "Автоматизируем документооборот, продажи и операции с помощью искусственного интеллекта. От идеи до внедрения за 6–8 недель." },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log("Site settings seeded");

  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
