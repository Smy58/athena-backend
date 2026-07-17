import { PrismaClient, Guild } from '@prisma/client';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const FAQ_DATA = [
  { q: 'Как вступить в клуб?', a: 'Зарегистрируйся на сайте (кнопка «Вступить»), укажи свой опыт в D&D — и сразу получишь доступ к личному кабинету.' },
  { q: 'Как записаться на игру?', a: 'Смотри «Доска заданий» в кабинете или расписание игр — там же можно записаться прямо на сайте одним нажатием.' },
  { q: 'Нужен ли опыт в D&D, чтобы вступить?', a: 'Нет, мы принимаем игроков любого уровня. При регистрации укажи, что ты новичок, — подберём подходящую сессию и мастера.' },
  { q: 'Как создать персонажа?', a: 'В разделе «Персонажи» нажми «Создать персонажа» и заполни имя, вид, класс, предысторию, характеристики и здоровье.' },
  { q: 'Что такое гильдии?', a: 'Это сезонная система фракций с собственными бонусами и рангами. Выбрать гильдию можно в разделе «Гильдия» в кабинете — в любой момент.' },
  { q: 'Что такое камешки славы и банка гильдии?', a: 'Камешки — награда за выполненные контракты. Они складываются в общую банку твоей гильдии; когда банка заполняется, гильдия получает право на особый Контракт сезона.' },
  { q: 'Как получить награду за задание с доски?', a: 'Запишись на задание на «Доске заданий». После того как игра сыграна, задание отмечается выполненным и переходит в «Историю» вместе с итогами.' },
  { q: 'Можно ли создать несколько персонажей?', a: 'Да, без ограничений — все они сохраняются в разделе «Персонажи», между ними можно переключаться в любой момент.' },
  { q: 'Как оставить отзыв об игре или задании?', a: 'В разделе «История» открой прошедшую игру или завершённое задание и оставь оценку звёздами и комментарий — свой отзыв всегда можно отредактировать.' },
  { q: 'Нашёл баг или есть идея — что делать?', a: 'Опиши это в разделе «Обратная связь»: создай тему с типом «Проблема» или «Предложение» — там же можно продолжить обсуждение в чате.' },
];

const GUILDS_INFO: Record<Guild, { name: string; icon: string; color: string; role: string; bonus: string; rank3: string }> = {
  TOWER: {
    name: 'Башня Семи Печатей',
    icon: '🗼',
    color: '#7B61FF',
    role: 'Маги, арканисты, исследователи запретного знания и хранители древних тайн.',
    bonus:
      'Если умеешь колдовать — +1 дополнительная ячейка заклинания 1 уровня за длинный отдых. Если не колдуешь — можешь выбрать заговор волшебника и использовать его 1 раз за короткий отдых. Плюс +1 к проверкам Магии.',
    rank3: '1 раз за игру — бесплатное «Обнаружение магии» или подсказка о магической природе объекта.',
  },
  LEAGUE: {
    name: 'Лига Чёрной Монеты',
    icon: '🪙',
    color: '#C9A227',
    role: 'Воры, шпионы, лазутчики, информаторы и мастера теневых сделок.',
    bonus:
      '+1 к Ловкости рук, +1 к Скрытности. Раз за игру — переброс проваленной проверки на взлом, карманную кражу, скрытное проникновение или попытку незаметно уйти.',
    rank3: '1 раз за игру — «У меня здесь есть знакомый»: получаешь контакт, слух или помощь в городе.',
  },
  BLADE: {
    name: 'Серебряный Клинок',
    icon: '🗡️',
    color: '#9FB3C8',
    role: 'Охотники на чудовищ, нежить, проклятых существ и всё, что приходит из тёмного леса.',
    bonus:
      '+1 к проверкам Выживания при выслеживании существ, +1 к Природе при изучении следов, логова или монстров. Раз за игру — +1d4 урона по чудовищу, нежити, фее или исчадию.',
    rank3: '1 раз за игру — узнаёшь слабость, привычку или опасную особенность чудовища.',
  },
  CANDLE: {
    name: 'Орден Пепельной Свечи',
    icon: '🕯️',
    color: '#E0654A',
    role: 'Инквизиторы, экзорцисты, хранители мёртвых и расследователи тёмных культов.',
    bonus:
      '+1 к проверкам Религии, +1 к Проницательности. Раз за игру — преимущество на спасбросок от испуга, очарования, одержимости или тёмного влияния.',
    rank3: '1 раз за игру — спрашиваешь мастера «Есть ли здесь след тёмного влияния?» и получаешь честный ответ.',
  },
};

const GUILD_RANKS = [
  { value: 'r1', label: 'Ранг 1 — стандартный контракт', fameStones: 1, finiki: 5, order: 1 },
  { value: 'r2', label: 'Ранг 2 — сложный контракт', fameStones: 2, finiki: 8, order: 2 },
  { value: 'r3', label: 'Ранг 3 — опасный контракт', fameStones: 3, finiki: 12, order: 3 },
  { value: 'special', label: 'Особый контракт сезона', fameStones: 5, finiki: 20, order: 4 },
  { value: 'fail', label: 'Контракт провален', fameStones: 1, finiki: 2, order: 5 },
];

const MASTERS = [
  {
    name: 'Арман',
    icon: '🧙',
    status: 'Мастер D&D 5e · Основатель клуба',
    experienceLevel: '5+ лет',
    gamesHostedCount: 74,
    systems: ['D&D 5e'],
    genres: ['Фэнтези', 'Приключения', 'Драма'],
    styleTags: ['Сюжетная игра', 'Кинематографично'],
    beginnerFriendly: false,
    shortDescription: 'Ведёт долгие сюжетные кампейны с проработанным миром и последствиями выборов.',
    fullDescription:
      'Арман — основатель клуба Афина и мастер с шестилетним стажем. Специализируется на многолетних кампейнах с сильным сюжетом, где решения игроков реально меняют мир. Любит эпичные арки и проработанных NPC. Лучше всего подходит игрокам, готовым к долгосрочному вовлечению.',
    pastGames: [
      { title: 'Проклятие Чёрного Замка', date: 'май 2026' },
      { title: 'Падение Империи', date: 'март 2026' },
      { title: 'Хроники Пепельных Земель', date: 'январь 2026' },
    ],
  },
  {
    name: 'Диана',
    icon: '🌿',
    status: 'Мастер D&D 5e · Мастер новичков',
    experienceLevel: '1–3 года',
    gamesHostedCount: 35,
    systems: ['D&D 5e'],
    genres: ['Фэнтези', 'Юмор', 'Приключения'],
    styleTags: ['Дружелюбно к новичкам', 'Лёгкая весёлая игра'],
    beginnerFriendly: true,
    shortDescription: 'Специализируется на вводных играх — мягкий вход в D&D без давления и сложных правил.',
    fullDescription:
      'Диана два года помогает новичкам сделать первые шаги в D&D. Её игры — это лёгкая атмосфера, простые механики и терпеливое объяснение правил по ходу игры. Идеально, если ты никогда не играл и немного нервничаешь.',
    pastGames: [
      { title: 'Проклятие старой башни', date: 'июнь 2026' },
      { title: 'Первый квест', date: 'май 2026' },
    ],
  },
  {
    name: 'Тимур',
    icon: '⚔️',
    status: 'Мастер D&D 5e · Мастер подземелий',
    experienceLevel: '3+ года',
    gamesHostedCount: 58,
    systems: ['D&D 5e'],
    genres: ['Боёвка', 'Выживание', 'Исследование'],
    styleTags: ['Много боёвки', 'Жёсткие последствия'],
    beginnerFriendly: false,
    shortDescription: 'Тактические данжкроулы с реальной угрозой смерти персонажа — для тех, кто любит вызов.',
    fullDescription:
      'Тимур ведёт сложные подземелья с продуманной тактической боёвкой. Здесь решения имеют вес, а смерть персонажа — реальная возможность. Подходит опытным игрокам, которые хотят серьёзного вызова, а не прогулку.',
    pastGames: [
      { title: 'Гробница ужаса', date: 'июнь 2026' },
      { title: 'Подземелья Забытых Королей', date: 'апрель 2026' },
    ],
  },
  {
    name: 'Алия',
    icon: '🎭',
    status: 'Мастер Vampire · Нарративный мастер',
    experienceLevel: '3+ года',
    gamesHostedCount: 29,
    systems: ['Vampire'],
    genres: ['Драма', 'Романтика', 'Политика'],
    styleTags: ['Много отыгрыша', 'Атмосферно'],
    beginnerFriendly: true,
    shortDescription: 'Интриги, политика кланов и почти никакой боёвки — чистый отыгрыш и напряжённые диалоги.',
    fullDescription:
      'Алия ведёт игры, где важнее не броски кубиков, а слова и решения. Её стол — это придворные интриги, союзы и предательства. Отлично подходит тем, кто устал от боёвки и хочет глубокого отыгрыша.',
    pastGames: [
      { title: 'Маскарад теней', date: 'июнь 2026' },
      { title: 'Кровные узы', date: 'апрель 2026' },
    ],
  },
  {
    name: 'Данияр',
    icon: '🔥',
    status: 'Мастер D&D 5e · Мастер ивентов',
    experienceLevel: '1–3 года',
    gamesHostedCount: 44,
    systems: ['D&D 5e'],
    genres: ['Юмор', 'Приключения'],
    styleTags: ['Лёгкая весёлая игра', 'Дружелюбно к новичкам'],
    beginnerFriendly: true,
    shortDescription: 'Проводит открытые клубные вечера — динамично, весело, без обязательств.',
    fullDescription:
      'Данияр отвечает за открытые ивенты клуба. Его игры — разовые весёлые вечера без долгих обязательств, идеально для тех, кто хочет просто хорошо провести время и познакомиться с сообществом.',
    pastGames: [
      { title: 'Открытый стол клуба Афина', date: 'июнь 2026' },
      { title: 'Ночь настолок', date: 'май 2026' },
    ],
  },
  {
    name: 'Лера',
    icon: '🌊',
    status: 'Мастер Call of Cthulhu · Мастер интриг',
    experienceLevel: '3+ года',
    gamesHostedCount: 31,
    systems: ['Call of Cthulhu'],
    genres: ['Хоррор', 'Детектив', 'Мистика'],
    styleTags: ['Атмосферно', 'Кинематографично', 'Тяжёлая драматичная игра'],
    beginnerFriendly: false,
    shortDescription: 'Хоррор-расследования на грани безумия — атмосфера превыше всего.',
    fullDescription:
      'Лера специализируется на Зове Ктулху и хоррор-детективах. Её игры славятся плотной атмосферой, саспенсом и тем самым моментом, когда персонаж понимает больше, чем может выдержать. Не для слабонервных.',
    pastGames: [
      { title: 'Тайна маяка', date: 'июнь 2026' },
      { title: 'Дом на болотах', date: 'март 2026' },
    ],
  },
];

const GAMES = [
  {
    title: 'Проклятие старой башни',
    master: 'Диана',
    masterIcon: '🌿',
    date: new Date('2026-07-13'),
    startTime: '15:00',
    endTime: '18:00',
    gameSystem: 'D&D 5e',
    format: 'Ваншот',
    levelMin: 1,
    levelMax: 1,
    forBeginners: true,
    totalSeats: 6,
    price: 4000,
    currency: '₸',
    shortDescription: 'Лёгкий ваншот для тех, кто никогда не играл в D&D — идеальный первый шаг.',
    ageLimit: '12+',
  },
  {
    title: 'Тени над Долиной Теней',
    master: 'Арман',
    masterIcon: '🧙',
    date: new Date('2026-07-12'),
    startTime: '18:00',
    endTime: '22:00',
    gameSystem: 'D&D 5e',
    format: 'Кампейн',
    levelMin: 3,
    levelMax: 5,
    forBeginners: false,
    totalSeats: 5,
    price: 5000,
    currency: '₸',
    shortDescription: 'Продолжение долгой кампании про древнее проклятие, поглотившее долину.',
    ageLimit: '16+',
  },
  {
    title: 'Зов Ктулху: Тайна маяка',
    master: 'Лера',
    masterIcon: '🌊',
    date: new Date('2026-07-19'),
    startTime: '19:00',
    endTime: '23:00',
    gameSystem: 'Call of Cthulhu',
    format: 'Ваншот',
    levelMin: null,
    levelMax: null,
    forBeginners: false,
    totalSeats: 6,
    price: 4500,
    currency: '₸',
    shortDescription: 'Детективы расследуют серию исчезновений у старого маяка. Атмосфера, паранойя, безумие.',
    ageLimit: '18+',
  },
  {
    title: 'Вечер вампиров: Маскарад теней',
    master: 'Алия',
    masterIcon: '🎭',
    date: new Date('2026-07-20'),
    startTime: '16:00',
    endTime: '20:00',
    gameSystem: 'Vampire',
    format: 'Открытая кампания',
    levelMin: null,
    levelMax: null,
    forBeginners: true,
    totalSeats: 8,
    price: 3500,
    currency: '₸',
    shortDescription: 'Интриги, политика кланов и светские маски — ролевая игра почти без боёвки.',
    ageLimit: '16+',
  },
  {
    title: 'Гробница аннигиляции',
    master: 'Тимур',
    masterIcon: '⚔️',
    date: new Date('2026-07-26'),
    startTime: '14:00',
    endTime: '19:00',
    gameSystem: 'D&D 5e',
    format: 'Кампейн',
    levelMin: 5,
    levelMax: 8,
    forBeginners: false,
    totalSeats: 6,
    price: 5000,
    currency: '₸',
    shortDescription: 'Смертоносное подземелье в сердце джунглей — не для слабонервных персонажей.',
    ageLimit: '16+',
  },
  {
    title: 'Открытый стол клуба Афина',
    master: 'Данияр',
    masterIcon: '🔥',
    date: new Date('2026-07-27'),
    startTime: '17:00',
    endTime: '21:00',
    gameSystem: 'D&D 5e',
    format: 'Клубная игра',
    levelMin: 1,
    levelMax: 3,
    forBeginners: true,
    totalSeats: 12,
    price: 0,
    currency: '₸',
    shortDescription: 'Открытый игровой вечер — заходи с улицы, бери готового персонажа и играй.',
    ageLimit: '12+',
  },
];

// Order matters: Review.eventId refers to these rows positionally (id 1-5),
// so insertion order must match the original SCHEDULE_HISTORY array exactly.
const SCHEDULE_HISTORY = [
  { date: new Date('2026-07-05'), name: 'Испытание Красной Луны', meta: 'Мастер: Арман · 18:00 · завершён', typeLabel: 'Кампейн' },
  { date: new Date('2026-06-29'), name: 'Похитители снов', meta: 'Мастер: Диана · 15:00 · для новичков', typeLabel: 'Ваншот' },
  { date: new Date('2026-06-22'), name: 'Ночь открытых дверей «Афина»', meta: 'Все мастера · 17:00 · Алматы', typeLabel: 'Ивент' },
  { date: new Date('2026-06-15'), name: 'Тайна Медного Квартала', meta: 'Мастер: Лера · 14:00 · 3–5 игроков', typeLabel: 'Кампейн' },
  { date: new Date('2026-06-08'), name: 'Турнир импровизации', meta: 'Мастер: Данияр · 16:00 · открытый набор', typeLabel: 'Ивент' },
];

const SHOP_TITLES = [
  { id: 'newbie', name: 'Новичок квартала', price: 15 },
  { id: 'cat_tail', name: 'Хвост Кошки', price: 35 },
  { id: 'goblin_slayer', name: 'Истребитель гоблинов', price: 40 },
  { id: 'secret_keeper', name: 'Хранитель тайн', price: 70 },
  { id: 'blade_master', name: 'Мастер клинка', price: 60 },
  { id: 'shadow', name: 'Тень переулков', price: 50 },
  { id: 'dungeon_scourge', name: 'Бич подземелий', price: 90 },
  { id: 'dragonslayer', name: 'Драконоборец', price: 150 },
  { id: 'archmage', name: 'Архимаг', price: 120 },
  { id: 'legend', name: 'Легенда Афины', price: 300 },
];

const SHOP_POTIONS = [
  { id: 'water', name: '💧 Вода', price: 5 },
  { id: 'tea', name: '🍵 Чай', price: 10 },
  { id: 'juice', name: '🧃 Сок', price: 12 },
  { id: 'coffee', name: '☕ Кофе', price: 15 },
  { id: 'soda', name: '🥤 Газировка', price: 15 },
  { id: 'energy', name: '⚡ Энергетик', price: 20 },
  { id: 'mulled_wine', name: '🍷 Глинтвейн (безалк.)', price: 25 },
];

const SHOP_SNACKS = [
  { id: 'cookies', name: '🍪 Печенье', price: 10 },
  { id: 'nuts', name: '🥜 Орешки', price: 10 },
  { id: 'chocolate', name: '🍫 Шоколадка', price: 12 },
  { id: 'popcorn', name: '🍿 Попкорн', price: 12 },
  { id: 'chips', name: '🍟 Чипсы', price: 15 },
  { id: 'pizza', name: '🍕 Кусок пиццы', price: 20 },
  { id: 'sandwich', name: '🥪 Сэндвич', price: 25 },
];

async function main() {
  await prisma.faq.deleteMany();
  await prisma.faq.createMany({
    data: FAQ_DATA.map((f, i) => ({ question: f.q, answer: f.a, order: i })),
  });

  for (const [guild, info] of Object.entries(GUILDS_INFO)) {
    await prisma.guildInfo.upsert({
      where: { guild: guild as Guild },
      create: { guild: guild as Guild, ...info },
      update: info,
    });
  }

  for (const rank of GUILD_RANKS) {
    await prisma.guildRank.upsert({
      where: { value: rank.value },
      create: rank,
      update: rank,
    });
  }

  await prisma.master.deleteMany();
  await prisma.master.createMany({
    data: MASTERS.map((m) => ({ ...m, pastGames: m.pastGames })),
  });

  await prisma.game.deleteMany();
  await prisma.game.createMany({ data: GAMES });

  await prisma.scheduleHistory.deleteMany();
  await prisma.scheduleHistory.createMany({ data: SCHEDULE_HISTORY });

  for (const [i, t] of SHOP_TITLES.entries()) {
    await prisma.shopTitle.upsert({
      where: { id: t.id },
      create: { ...t, order: i },
      update: { name: t.name, price: t.price, order: i },
    });
  }

  await prisma.shopSection.upsert({
    where: { id: 'potions' },
    create: { id: 'potions', name: 'Зелья', icon: '🧪', order: 0 },
    update: {},
  });
  await prisma.shopSection.upsert({
    where: { id: 'snacks' },
    create: { id: 'snacks', name: 'Пойки', icon: '🍪', order: 1 },
    update: {},
  });

  for (const [i, p] of SHOP_POTIONS.entries()) {
    await prisma.shopItem.upsert({
      where: { id: p.id },
      create: { ...p, sectionId: 'potions', order: i },
      update: { name: p.name, price: p.price, order: i },
    });
  }

  for (const [i, s] of SHOP_SNACKS.entries()) {
    await prisma.shopItem.upsert({
      where: { id: s.id },
      create: { ...s, sectionId: 'snacks', order: i },
      update: { name: s.name, price: s.price, order: i },
    });
  }

  const existingAdmin = await prisma.adminUser.findUnique({ where: { login: 'admin' } });
  if (!existingAdmin) {
    const password = crypto.randomBytes(9).toString('base64url');
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.adminUser.create({
      data: { login: 'admin', passwordHash, role: 'ADMIN' },
    });
    console.log('Created admin user — login: admin, password:', password);
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
