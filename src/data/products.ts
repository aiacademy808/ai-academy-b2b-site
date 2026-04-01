export interface ProductKPI {
  value: string;
  label: string;
  source: string;
}

export interface ProductPricingTier {
  tier: string;
  price: number;
  desc: string;
}

export interface Product {
  slug: string;
  accentColor: string;
  heroTitle: string;
  heroSlogan: string;
  pains: string[];
  features: string[];
  kpi: ProductKPI[];
  pricing: ProductPricingTier[];
}

export const products: Product[] = [
  {
    slug: "umnaya-pervichka",
    accentColor: "#00e5ff",
    heroTitle: "Умная первичка — AI-обработка документов",
    heroSlogan:
      "Забудьте о ручном вводе накладных навсегда. Ускорение в 6\u20138 раз, точность 97%.",
    pains: [
      "До 70% рабочего времени сотрудников уходит на ручной ввод накладных и счетов",
      "Критические ошибки в учёте из-за человеческого фактора",
      "Задержки в цепочках поставок из-за медленной обработки документов",
    ],
    features: [
      "OCR банковских выписок и счетов-фактур — точность до 97%",
      "Автовалидация: система выявляет ошибки и спорные поля без участия человека",
      "Бесшовная интеграция с 1С, ERP-системами и ЕГРСЕ",
      "Пакетная обработка: тысячи документов через Batch API",
    ],
    kpi: [
      { value: "6\u20138\u00d7", label: "Ускорение обработки", source: "Feathery, 2024" },
      { value: "до 97%", label: "Точность OCR", source: "TrustRadius \u2014 ABBYY FineReader" },
      { value: "\u221270%", label: "Снижение ручного труда", source: "ProcessMaker, 2024" },
    ],
    pricing: [
      { tier: "Старт", price: 80000, desc: "до 3 типов документов" },
      { tier: "Бизнес", price: 140000, desc: "до 7 типов + OCR" },
      { tier: "Про", price: 200000, desc: "неограниченно + API" },
    ],
  },
  {
    slug: "ml-model",
    accentColor: "#a78bfa",
    heroTitle: "Обучение ML-модели — AI под ваш бизнес",
    heroSlogan:
      "Есть данные — обучим. Нет данных — соберём и разметим сами. Модель под вашу задачу.",
    pains: [
      "Нет готовой AI-модели под специфику вашего бизнеса",
      "Нет данных — непонятно с чего начать",
      "Универсальные решения дают 50\u201370% точности вместо нужных 90%+",
    ],
    features: [
      "Полный цикл: аудит данных \u2192 сбор \u2192 разметка \u2192 обучение \u2192 интеграция \u2192 поддержка",
      "Работаем с малыми датасетами (от 500 примеров) — transfer learning",
      "Типы моделей: прогноз спроса, классификация, детекция аномалий, рекомендации",
      "MLOps-сопровождение: мониторинг дрейфа модели, переобучение",
    ],
    kpi: [
      { value: "+20\u201330%", label: "Точность прогноза", source: "Internal benchmarks" },
      { value: "от 500", label: "Минимум примеров", source: "Transfer learning" },
      { value: "4\u20138 нед", label: "Срок MVP", source: "AI Academy" },
    ],
    pricing: [
      { tier: "Старт", price: 150000, desc: "базовая модель" },
      { tier: "Бизнес", price: 250000, desc: "кастом + интеграция" },
      { tier: "Про", price: 400000, desc: "полный цикл MLOps" },
    ],
  },
  {
    slug: "crm-assistant",
    accentColor: "#10b981",
    heroTitle: "CRM-Ассистент — AI внутри вашего отдела продаж",
    heroSlogan:
      "Автоквалификация лидов, анализ звонков и прогноз конверсии — без найма аналитика.",
    pains: [
      "Менеджеры тратят 60% времени на рутину вместо продаж",
      "Нет объективной аналитики по звонкам и сделкам",
      "VIP-клиенты теряются среди обычных заявок",
    ],
    features: [
      "Анализ тональности звонков и переписки — выявление \u00abгорячих\u00bb и \u00abхолодных\u00bb клиентов",
      "Автоматическое тегирование и приоритизация VIP-лидов",
      "Детекция конфликтных ситуаций в реальном времени — эскалация руководителю",
      "Автогенерация КП по итогам разговора",
    ],
    kpi: [
      { value: "+25%", label: "Конверсия продаж", source: "Salesforce / Nucleus Research" },
      { value: "$8.71:$1", label: "ROI CRM-автоматизации", source: "Nucleus Research" },
      { value: "\u221240%", label: "Время на рутину", source: "HubSpot Research" },
    ],
    pricing: [
      { tier: "Старт", price: 100000, desc: "базовый AI" },
      { tier: "Бизнес", price: 180000, desc: "+ воронка + авто-КП" },
      { tier: "Про", price: 250000, desc: "полная автоматизация" },
    ],
  },
  {
    slug: "whatsapp-bot",
    accentColor: "#f59e0b",
    heroTitle: "WhatsApp-Бот — умный помощник 24/7",
    heroSlogan:
      "Отвечает клиентам пока вы спите. NLP-агент с реальным пониманием контекста — не скрипт.",
    pains: [
      "Клиенты уходят, не дождавшись ответа в нерабочее время",
      "Операторы перегружены однотипными вопросами",
      "Нет автоматической квалификации входящих заявок",
    ],
    features: [
      "LLM-агент (GPT-4o): понимает контекст, задаёт уточняющие вопросы",
      "Обработка входящих заявок, FAQ, квалификация лидов без оператора",
      "Интеграция с CRM: автоматически создаёт карточку клиента",
      "Мультиязычность: русский, кыргызский, английский, казахский",
    ],
    kpi: [
      { value: "+225%", label: "Скорость ответа", source: "Tidio Research" },
      { value: "+27%", label: "Рост продаж", source: "Business Insider" },
      { value: "24/7", label: "Доступность", source: "Without operators" },
    ],
    pricing: [
      { tier: "Старт", price: 80000, desc: "AI-ответы + FAQ" },
      { tier: "Бизнес", price: 130000, desc: "+ CRM + квалификация" },
      { tier: "Про", price: 180000, desc: "+ аналитика + мультиязык" },
    ],
  },
  {
    slug: "optimizer",
    accentColor: "#fb7185",
    heroTitle: "Оптимизатор — BI + ML + Мониторинг",
    heroSlogan:
      "Остановите потери на оборудовании и маршрутах. Кейс Чакан ГЭС — 850 000 KGS.",
    pains: [
      "Оборудование ломается внезапно, простои стоят миллионы",
      "Маршруты не оптимизированы — перерасход топлива и времени",
      "Нет единой картины по производственным KPI",
    ],
    features: [
      "BI-дашборды в реальном времени: маршруты, оборудование, KPI производства",
      "ML-прогноз: когда сломается оборудование (Predictive Maintenance)",
      "Оптимизация маршрутов: алгоритм сокращает пробег и расход топлива",
      "Алерты: автоматическое уведомление при отклонении от нормы",
    ],
    kpi: [
      { value: "\u221218\u201325%", label: "Снижение затрат", source: "McKinsey & Company" },
      { value: "ROI 10:1\u201330:1", label: "Возврат инвестиций", source: "Gartner Research" },
      { value: "6\u20138 нед", label: "Срок MVP", source: "AI Academy (Чакан ГЭС)" },
    ],
    pricing: [
      { tier: "Старт", price: 200000, desc: "BI + базовый прогноз" },
      { tier: "Бизнес", price: 400000, desc: "+ автопрогноз + алерты" },
      { tier: "Про", price: 850000, desc: "полный MVP (Чакан ГЭС)" },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return products.map((p) => p.slug);
}
