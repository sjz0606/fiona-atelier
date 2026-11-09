/* fiona — v1 «Мастерская букета» · vanilla JS */
(() => {
'use strict';

const M = 'media/';
const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------------- data (real posts from @fiona_tashkent, prices from captions) ---------------- */
// [code, price, format, hasVideo]
const RAW = [
  ['DeSGDJbRrs6',370000,'b'],['DdrKIvxNPXb',580000,'b'],['DZcj_9HtQCz',640000,'b'],['DbRLs1tNV0H',670000,'b'],
  ['DZfuiuFNVOW',670000,'b'],['Dbl-JkhtS-t',800000,'b'],['Dbl-eCXNq4M',920000,'b'],['DbZ24y3qkYh',950000,'b'],
  ['DbgbzGAtf59',1000000,'b'],['DfFjhgrRdw-',1000000,'b'],['DbXZT_qtsuD',1000000,'b'],['DZf6kv0NzPn',1000000,'b'],
  ['DZcjb4qtEhG',1000000,'b'],['Dbl-ZyrN7rs',1100000,'b'],['Dbl-EycNdJT',1100000,'b'],['DbdOV7btPEa',1100000,'b'],
  ['DaStDk1OxWT',1100000,'b',1],['DZckccANOXQ',1100000,'b'],['DdtAM62NCR8',1200000,'b',1],['DZcjwqlNq1t',1200000,'b'],
  ['Dbl-Uz1tKzn',1210000,'b'],['DaSXMaONLVc',1330000,'b',1],['DbYlbjsN6z2',1500000,'b'],['DZckGJxNya8',1500000,'b'],
  ['DbRLUZ6tNuU',1580000,'b'],['Db0ac4ONWbx',1630000,'b'],['DbgKP6RNJ56',1630000,'b'],['DfHqI6DPZ02',1700000,'b'],
  ['DZcjoz8tQnn',1950000,'b'],['DbkW_HVtsKj',2100000,'b'],['Dd6foIYtCG7',2300000,'b',1],['DaZ9uCHNujA',2400000,'b'],
  ['DbRL-7ytUER',2900000,'b'],['DZckhoXNQto',2900000,'b'],['DebL9uHNts5',3100000,'b'],['DbXZJ5pNop9',3100000,'b'],
  ['DbQ25cFNCXu',3100000,'b'],['Da4xBBONNUM',3100000,'b'],['DZm0gQUtPxO',3100000,'b'],['DZf4WzbtMKW',3100000,'b'],
  ['DaLZaOztaiU',3100000,'b'],['Dd03JDStxEL',3100000,'b'],['DeUIuU2tDA5',3200000,'b'],['DbRLK7LtMLJ',3200000,'b'],
  ['Da676ZSKtd6',3700000,'b'],['DZckofNNCLJ',3990000,'b'],['DbQLkwWN62k',4100000,'b'],['DbtnW6rNdrw',5100000,'b'],
  ['DaStCwguK1u',5100000,'b',1],['DadbrLEuv5X',5100000,'b',1],['DaLZNqKNhzY',6200000,'b'],['DeOGxP6tlE4',6500000,'b'],
  ['DbRLC8TtXtA',8000000,'b'],
  ['DdtnHx2NLRQ',2000000,'k'],['DaTIfubOc9o',2000000,'k'],['DadShrYuMZT',2650000,'k',1],['Dac4ynsOKhx',3250000,'k'],
  ['DZf7p7utv8c',5000000,'k'],['Da-SIIfNNAd',5000000,'k'],['DdsoRcrNwEt',6000000,'k',1],['Dd8rq99tA9x',6000000,'k',1],
  ['DdvZtk1tytE',6000000,'k',1],['DdrTj3tNRIO',6000000,'k',1],['DZfq6bItceB',7000000,'k'],['DZibJretk9N',7000000,'k'],
  ['Db3J75GjQOV',7000000,'k'],['DeFdqZQRTWT',7000000,'k'],['Da7hy0Ztw3X',12000000,'k'],
  ['DZ-DHTWtx4f',5200000,'t']
];
const ITEMS = RAW.map(([code, price, fmt, v]) => ({ code, price, fmt, video: !!v,
  img: `${M}p/${code}.jpg`, vid: v ? `${M}v/${code}.mp4` : null, url: `https://www.instagram.com/p/${code}/` }));

const FORMATS = {
  b: { cover: 'DbXZJ5pNop9' },
  k: { cover: 'DZfq6bItceB' },
  t: { cover: 'DZ-DHTWtx4f' }
};

const OCCASIONS = [
  { id: 'love',  pick: 'Dbl-ZyrN7rs', poster: 'De7yNh2twww', video: `${M}v/De7yNh2twww.mp4` },
  { id: 'bday',  pick: 'DbgKP6RNJ56', poster: 'DegiSoYtlkD', video: `${M}v/DegiSoYtlkD.mp4` },
  { id: 'sorry', pick: 'DbRLs1tNV0H', poster: 'De9YmjLN9I9', video: `${M}v/De9YmjLN9I9.mp4` },
  { id: 'mom',   pick: 'DfFjhgrRdw-', poster: 'DebavHqtIPl', video: `${M}v/DebavHqtIPl.mp4` },
  { id: 'wed',   pick: 'DbZ24y3qkYh', posterSrc: `${M}hl/bride_02.jpg`, video: `${M}hl/bride_02.mp4` },
  { id: 'just',  pick: 'DZcjoz8tQnn', poster: 'DfEwB7QtMRH', video: `${M}v/DfEwB7QtMRH.mp4` }
];

// Доп. товары (вазы) — names and prices from the «Доп.товары» highlight
const VASES = [
  ['Ceramic 1',450000,0],['Ceramic 2',350000,1],['Ceramic 3',450000,2],['Ceramic 4',350000,3],['Ceramic 5',500000,4],
  ['Ceramic 6',450000,5],['Ceramic 7',350000,6],['Ceramic 8',400000,11],['Ceramic 9',450000,12],['Ceramic 10',450000,13],
  ['Ceramic 11',300000,14],['Crystal 1',200000,7],['Crystal 2',250000,8],['Crystal 3',400000,9],['Crystal 4',375000,10]
].map(([name, price, i]) => ({ name, price, img: `img/vase_${String(i).padStart(2, '0')}.jpg` }));

const DISTRICTS = {
  ru: ['Бектемирский','Мирабадский','Мирзо-Улугбекский','Алмазарский','Сергелийский','Учтепинский','Чиланзарский','Шайхантахурский','Юнусабадский','Яккасарайский','Яшнабадский','Янгихаётский'],
  uz: ['Bektemir','Mirobod','Mirzo Ulug‘bek','Olmazor','Sergeli','Uchtepa','Chilonzor','Shayxontohur','Yunusobod','Yakkasaroy','Yashnobod','Yangihayot']
};

const SLOTS = [[9,11],[11,13],[13,15],[15,17],[17,19],[19,21],[21,23],[23,25]];

/* ---------------- i18n ---------------- */
const T = {
  ru: {
    'nav.atelier':'Мастерская','nav.ready':'Готовые букеты','nav.care':'Уход','nav.contacts':'Контакты',
    'stage.src':'Смотреть в Instagram','sum.total':'Итого','cta.compose':'Оформить заказ',
    'hero.title':'Соберите букет, как флорист',
    'hero.lead':'Шесть коротких шагов — и готовое сообщение для заказа. Доставка по Ташкенту за 30–60 минут, каждый день 9:00–01:00.',
    's1.short':'Повод','s2.short':'Бюджет','s3.short':'Формат','s4.short':'Ваза','s5.short':'Открытка','s6.short':'Доставка',
    's1.title':'Какой повод?','s1.sub':'От повода зависит подсказка для открытки. Сам букет выберете на следующем шаге.',
    'occ.love':'Любимой','occ.bday':'День рождения','occ.sorry':'Извиниться','occ.mom':'Маме','occ.wed':'Свадьба','occ.just':'Просто так',
    's2.title':'Сколько хотите потратить?','s2.sub':'Каждая отметка на шкале — реальная работа Fiona с этой ценой.',
    's2.roses':'≈ 101 роза','s2.one':'Работа Fiona по этой цене','s2.many':'Работ по этой цене: {n}. Выберите любимую',
    's2.single':'В формате «с мишкой» сейчас одна работа с ценой. Другие варианты флорист подберёт в чате.',
    's3.title':'В каком виде?','s3.sub':'Цена подстроится под ближайшую работу в выбранном формате.',
    'fmt.b':'Букет','fmt.k':'Корзина','fmt.t':'С мишкой','fmt.from':'от {p}','fmt.only':'{p}',
    'fmt.note':'Ближайшая работа в этом формате — {p}.',
    's4.title':'Добавить вазу?','s4.sub':'Вазы из раздела «Доп. товары». Цветы приедут уже в ней.','vase.none':'Без вазы','vase.noneSub':'0',
    's5.title':'Что написать в открытке?','s5.label':'Текст открытки','s5.off':'Без открытки','s5.ph':'Ваши слова появятся здесь…',
    's6.title':'Когда и куда доставить?','s6.sub':'Только по Ташкенту. Обычно 30–60 минут после сборки.',
    'day.today':'Сегодня','day.tomorrow':'Завтра','slot.asap':'Как можно скорее, 30–60 мин',
    's6.district':'Район','s6.districtPh':'Выберите район','s6.address':'Адрес','s6.addressPh':'Улица, дом, ориентир',
    's6.name':'Имя получателя','s6.phone':'Телефон получателя',
    's6.photo':'Пришлите фото букета перед отправкой','s6.photoSub':'Вы увидите свой букет до того, как он уедет к получателю.',
    'nav.prev':'Назад','nav.next':'Далее','nav.finish':'Собрать сообщение',
    'ready.title':'Готовые букеты','ready.sub':'Работы Fiona с ценами из постов. Любую можно взять за основу и дособрать в мастерской.',
    'ready.more':'Показать ещё','ready.use':'Собрать на основе','ready.empty':'В этом диапазоне пока нет работ — попробуйте другой фильтр.',
    'ring.aria':'Карусель букетов','ring.prev':'Предыдущий букет','ring.next':'Следующий букет','ring.hint':'Потяните карусель или используйте стрелки',
    'ring.toGrid':'Все работы сеткой','ring.toRing':'Вернуть 3D-карусель','ring.ig':'Пост в Instagram',
    'pf.all':'Все','pf.1':'до 1 млн','pf.2':'1–2 млн','pf.3':'2–4 млн','pf.4':'от 4 млн',
    'ff.all':'Все форматы','ff.b':'Букеты','ff.k':'Корзины','ff.t':'С мишкой',
    'trust.y':'Яндекс Карты, 82 оценки. Чаще всего хвалят быструю доставку и свежие цветы',
    'trust.h':'Каждый день, в том числе поздно вечером','trust.d':'минут на доставку. Работаем только по Ташкенту',
    'trust.pT':'Фото','trust.p':'Предлагаем: снимок вашего букета до отправки курьеру — чтобы он совпал с ожиданием',
    'care.title':'Чтобы букет стоял дольше','care.sub':'Шесть правил от флористов Fiona. Нажмите на шаг, чтобы прочитать.',
    'care.more':'Подробнее','care.less':'Свернуть',
    'cont.title':'Мастерская на Абдуллы Каххора','cont.addr':'Адрес','cont.addrV':'ул. Абдуллы Каххора, 47А, Ташкент',
    'cont.hours':'Часы','cont.hoursV':'Каждый день, 9:00–01:00','cont.phone':'Телефон','cont.order':'Заказ',
    'cont.map':'Открыть на Яндекс Картах','cont.call':'Позвонить',
    'foot.line':'Цветы и подарки с доставкой по Ташкенту','foot.concept':'Концепт сайта · Lumagen',
    'comp.title':'Ваш заказ готов к отправке',
    'comp.sub':'Сайт не принимает оплату — заказ уходит флористу сообщением. Проверьте текст, при желании поправьте и выберите, куда отправить.',
    'comp.call':'Позвонить','comp.copy':'Скопировать текст','comp.ig':'Instagram Direct','comp.tg':'Telegram',
    'comp.hint':'Для Direct и Telegram текст скопируется сам — останется вставить его в чат.',
    'toast.copied':'Текст заказа скопирован','toast.paste':'Текст скопирован — вставьте его в чат',
    'sum.bouquet':'Букет','sum.k':'Корзина','sum.t':'С мишкой','sum.vase':'Ваза','sum.card':'Открытка','sum.cardOff':'без открытки',
    'sum.delivery':'Доставка',
    'cur':'сум',
    'm.hello':'Здравствуйте! Хочу заказать в Fiona:','m.occ':'Повод','m.item':'Работа','m.fmt':'Формат','m.price':'цена',
    'm.vase':'Ваза','m.card':'Открытка','m.noCard':'не нужна','m.when':'Доставка','m.district':'Район','m.address':'Адрес',
    'm.to':'Получатель','m.photo':'Пришлите, пожалуйста, фото букета перед отправкой.','m.total':'Итого',
    'm.ask':'уточню в чате',
    'idea.love':['Ты — мой самый красивый повод.','Люблю. Сегодня и каждый день.'],
    'idea.bday':['С днём рождения! Пусть этот год будет таким же ярким, как этот букет.','С днём рождения! Счастья, тепла и цветов без повода.'],
    'idea.sorry':['Прости меня. Я очень тобой дорожу.','Прости. Давай начнём этот день заново?'],
    'idea.mom':['Мама, спасибо тебе за всё. Люблю.','Мамочка, ты самая лучшая.'],
    'idea.wed':['Поздравляем с днём свадьбы! Любви и тепла вашему дому.','Счастья вам — долгого, как эта история.'],
    'idea.just':['Просто так. Просто потому что ты есть.','Хорошего дня! Пусть он будет немного цветочным.'],
    care:[
      ['Чистая ваза','Перед тем как поставить букет, промойте вазу моющим средством.'],
      ['Прохладная вода','Налейте в вазу прохладную воду. Вода не должна быть ледяной.'],
      ['Листья — не в воду','Удалите нижние листья на стеблях, чтобы они не попали в воду. Так не размножатся бактерии, и букет простоит дольше.'],
      ['Срез под 45°','Подрежьте стебли под углом 45°.'],
      ['Прохладное место','Ваза не должна стоять рядом с батареей, под прямыми лучами солнца или под кондиционером.'],
      ['Свежая вода каждый день','Ежедневно меняйте воду и промывайте вазу моющим средством.']
    ]
  },
  uz: {
    'nav.atelier':'Ustaxona','nav.ready':'Tayyor guldastalar','nav.care':'Parvarish','nav.contacts':'Aloqa',
    'stage.src':'Instagram’da ko‘rish','sum.total':'Jami','cta.compose':'Buyurtma berish',
    'hero.title':'Guldastani florist kabi yig‘ing',
    'hero.lead':'Oltita qisqa qadam — va buyurtma uchun tayyor xabar. Toshkent bo‘ylab 30–60 daqiqada yetkazamiz, har kuni 9:00–01:00.',
    's1.short':'Sabab','s2.short':'Byudjet','s3.short':'Shakl','s4.short':'Guldon','s5.short':'Otkritka','s6.short':'Yetkazish',
    's1.title':'Qanday sabab?','s1.sub':'Sababga qarab otkritka uchun matn taklif qilamiz. Guldastani keyingi qadamda tanlaysiz.',
    'occ.love':'Sevgiliga','occ.bday':'Tug‘ilgan kun','occ.sorry':'Kechirim','occ.mom':'Onamga','occ.wed':'To‘y','occ.just':'Shunchaki',
    's2.title':'Qancha sarflamoqchisiz?','s2.sub':'Shkaladagi har bir belgi — shu narxdagi haqiqiy Fiona ishi.',
    's2.roses':'≈ 101 ta atirgul','s2.one':'Shu narxdagi Fiona ishi','s2.many':'Shu narxdagi ishlar: {n} ta. Yoqqanini tanlang',
    's2.single':'«Ayiqcha bilan» shaklida hozir narxi ko‘rsatilgan bitta ish bor. Boshqa variantlarni florist chatda taklif qiladi.',
    's3.title':'Qanday ko‘rinishda?','s3.sub':'Narx tanlangan shakldagi eng yaqin ishga moslashadi.',
    'fmt.b':'Guldasta','fmt.k':'Savat','fmt.t':'Ayiqcha bilan','fmt.from':'{p} dan','fmt.only':'{p}',
    'fmt.note':'Bu shakldagi eng yaqin ish — {p}.',
    's4.title':'Guldon qo‘shasizmi?','s4.sub':'«Qo‘shimcha mahsulotlar» bo‘limidagi guldonlar. Gullar unda yetib boradi.','vase.none':'Guldonsiz','vase.noneSub':'0',
    's5.title':'Otkritkaga nima yozamiz?','s5.label':'Otkritka matni','s5.off':'Otkritkasiz','s5.ph':'So‘zlaringiz shu yerda paydo bo‘ladi…',
    's6.title':'Qachon va qayerga yetkazamiz?','s6.sub':'Faqat Toshkent bo‘ylab. Odatda yig‘ilgandan keyin 30–60 daqiqa.',
    'day.today':'Bugun','day.tomorrow':'Ertaga','slot.asap':'Imkon qadar tez, 30–60 daq',
    's6.district':'Tuman','s6.districtPh':'Tumanni tanlang','s6.address':'Manzil','s6.addressPh':'Ko‘cha, uy, mo‘ljal',
    's6.name':'Qabul qiluvchi ismi','s6.phone':'Qabul qiluvchi telefoni',
    's6.photo':'Jo‘natishdan oldin guldasta suratini yuboring','s6.photoSub':'Guldastangizni u qabul qiluvchiga ketishidan oldin ko‘rasiz.',
    'nav.prev':'Orqaga','nav.next':'Keyingisi','nav.finish':'Xabarni tayyorlash',
    'ready.title':'Tayyor guldastalar','ready.sub':'Postlardagi narxlari bilan Fiona ishlari. Istalganini asos qilib, ustaxonada to‘ldirishingiz mumkin.',
    'ready.more':'Yana ko‘rsatish','ready.use':'Shu asosda yig‘ish','ready.empty':'Bu oraliqda hozircha ish yo‘q — boshqa filtrni tanlang.',
    'ring.aria':'Guldastalar karuseli','ring.prev':'Oldingi guldasta','ring.next':'Keyingi guldasta','ring.hint':'Karuselni torting yoki strelkalardan foydalaning',
    'ring.toGrid':'Barcha ishlar ro‘yxati','ring.toRing':'3D-karuselga qaytish','ring.ig':'Instagram’dagi post',
    'pf.all':'Hammasi','pf.1':'1 mln gacha','pf.2':'1–2 mln','pf.3':'2–4 mln','pf.4':'4 mln dan',
    'ff.all':'Barcha shakllar','ff.b':'Guldastalar','ff.k':'Savatlar','ff.t':'Ayiqcha bilan',
    'trust.y':'Yandex Xaritalar, 82 baho. Ko‘pincha tez yetkazish va yangi gullarni maqtashadi',
    'trust.h':'Har kuni, kechki payt ham','trust.d':'daqiqada yetkazamiz. Faqat Toshkent bo‘ylab',
    'trust.pT':'Surat','trust.p':'Taklifimiz: kuryerga berishdan oldin guldastangiz surati — kutganingizdek bo‘lishi uchun',
    'care.title':'Guldasta uzoqroq tursin','care.sub':'Fiona floristlaridan oltita qoida. O‘qish uchun qadamni bosing.',
    'care.more':'Batafsil','care.less':'Yopish',
    'cont.title':'Abdulla Qahhor ko‘chasidagi ustaxona','cont.addr':'Manzil','cont.addrV':'Abdulla Qahhor ko‘chasi, 47A, Toshkent',
    'cont.hours':'Ish vaqti','cont.hoursV':'Har kuni, 9:00–01:00','cont.phone':'Telefon','cont.order':'Buyurtma',
    'cont.map':'Yandex Xaritada ochish','cont.call':'Qo‘ng‘iroq qilish',
    'foot.line':'Toshkent bo‘ylab yetkazib beriladigan gullar va sovg‘alar','foot.concept':'Sayt konsepti · Lumagen',
    'comp.title':'Buyurtmangiz yuborishga tayyor',
    'comp.sub':'Sayt to‘lov qabul qilmaydi — buyurtma floristga xabar sifatida boradi. Matnni tekshiring, kerak bo‘lsa tuzating va qayerga yuborishni tanlang.',
    'comp.call':'Qo‘ng‘iroq qilish','comp.copy':'Matnni nusxalash','comp.ig':'Instagram Direct','comp.tg':'Telegram',
    'comp.hint':'Direct va Telegram uchun matn avtomatik nusxalanadi — uni chatga qo‘yish qoladi.',
    'toast.copied':'Buyurtma matni nusxalandi','toast.paste':'Matn nusxalandi — uni chatga qo‘ying',
    'sum.bouquet':'Guldasta','sum.k':'Savat','sum.t':'Ayiqcha bilan','sum.vase':'Guldon','sum.card':'Otkritka','sum.cardOff':'otkritkasiz',
    'sum.delivery':'Yetkazish',
    'cur':'so‘m',
    'm.hello':'Assalomu alaykum! Fiona’dan buyurtma bermoqchiman:','m.occ':'Sabab','m.item':'Ish','m.fmt':'Shakl','m.price':'narxi',
    'm.vase':'Guldon','m.card':'Otkritka','m.noCard':'kerak emas','m.when':'Yetkazish','m.district':'Tuman','m.address':'Manzil',
    'm.to':'Qabul qiluvchi','m.photo':'Iltimos, jo‘natishdan oldin guldasta suratini yuboring.','m.total':'Jami',
    'm.ask':'chatda aniqlashtiraman',
    'idea.love':['Sen — eng chiroyli sababim.','Seni sevaman. Bugun ham, har kuni ham.'],
    'idea.bday':['Tug‘ilgan kuning bilan! Bu yil shu guldasta kabi yorqin o‘tsin.','Tug‘ilgan kuning muborak! Baxt, iliqlik va sababsiz gullar tilayman.'],
    'idea.sorry':['Meni kechir. Sen men uchun juda qadrlisan.','Kechir. Bu kunni yangidan boshlaymizmi?'],
    'idea.mom':['Onajon, hamma narsa uchun rahmat. Sizni yaxshi ko‘raman.','Onajon, siz eng yaxshisiz.'],
    'idea.wed':['To‘yingiz muborak! Xonadoningizga mehr va baxt tilaymiz.','Baxtingiz shu hikoya kabi uzoq bo‘lsin.'],
    'idea.just':['Shunchaki. Sen borliging uchun.','Kuningiz xayrli o‘tsin! Biroz gulli bo‘lsin.'],
    care:[
      ['Toza guldon','Guldastani suvga qo‘yishdan avval guldonni yuvish vositasi bilan yuving.'],
      ['Salqin suv','Guldonga salqin suv quying. Suv muzdek bo‘lmasligi kerak.'],
      ['Barglar suvga tushmasin','Poyaning pastki barglarini olib tashlang, ular suvga tushmasin. Bakteriyalar ko‘paymaydi va guldasta uzoqroq turadi.'],
      ['45° burchakda kesish','Gul bandini 45° burchak ostida kesing.'],
      ['Salqin joy','Guldon isitgich yonida, to‘g‘ridan-to‘g‘ri quyosh nuri yoki konditsioner ostida turmasligi kerak.'],
      ['Har kuni yangi suv','Suvni har kuni almashtiring va guldonni yuvish vositasi bilan yuving.']
    ]
  }
};

/* ---------------- state ---------------- */
const S = {
  lang: localStorage.getItem('fiona-lang') === 'uz' ? 'uz' : 'ru',
  step: 0, occ: null, fmt: 'b', price: 3100000, code: 'DebL9uHNts5',
  vase: -1, card: '', cardTouched: false, cardOff: false,
  day: 'today', slot: null, district: -1, address: '', rname: '', rphone: '', photo: true,
  visited: new Set([0])
};
const t = (k, vars) => {
  let s = T[S.lang][k] ?? T.ru[k] ?? k;
  if (vars && typeof s === 'string') for (const v in vars) s = s.replace(`{${v}}`, vars[v]);
  return s;
};
const fmtN = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const money = n => `${fmtN(n)} ${t('cur')}`;
const short = n => n >= 1e6 ? (S.lang === 'uz' ? `${+(n / 1e6).toFixed(2)} mln` : `${String(+(n / 1e6).toFixed(2)).replace('.', ',')} млн`) : (S.lang === 'uz' ? `${n / 1000} ming` : `${n / 1000} тыс.`);

const byFmt = f => ITEMS.filter(i => i.fmt === f);
const ladder = f => [...new Set(byFmt(f).map(i => i.price))].sort((a, b) => a - b);
const itemsAt = (f, p) => byFmt(f).filter(i => i.price === p);
const curItem = () => ITEMS.find(i => i.code === S.code) || itemsAt(S.fmt, S.price)[0];
const nearest = (arr, p) => arr.reduce((a, b) => Math.abs(b - p) < Math.abs(a - p) ? b : a);
const total = () => curItem().price + (S.vase >= 0 ? VASES[S.vase].price : 0);

/* ---------------- stage (mask-reveal crossfade) ---------------- */
const stageLayers = $('#stageLayers');
let stageKey = '', glKey = '';
function setStage(payload) {
  window.__fionaStage = payload;
  if (window.FionaStage) {
    if (payload.key === glKey) return;
    glKey = payload.key;
    window.FionaStage.show(payload);
    $('#stageSrc').href = payload.href || 'https://www.instagram.com/fiona_tashkent/';
    return;
  }
  domStage(payload);
}
function domStage({ img, vid, key, href }) {
  if (key === stageKey) return;
  stageKey = key;
  const layer = document.createElement('div');
  layer.className = 'layer';
  let el;
  if (vid && !RM) {
    el = document.createElement('video');
    Object.assign(el, { muted: true, loop: true, playsInline: true, autoplay: true, preload: 'auto', poster: img });
    el.setAttribute('muted', ''); el.setAttribute('playsinline', '');
    el.src = vid;
  } else {
    el = document.createElement('img');
    el.src = img; el.alt = ''; el.decoding = 'async';
  }
  layer.appendChild(el);
  const olds = $$('.layer', stageLayers);
  stageLayers.appendChild(layer);
  let done = false;
  const go = () => { if (done) return; done = true; requestAnimationFrame(() => requestAnimationFrame(() => {
    layer.classList.add('in');
    if (el.play) el.play().catch(() => {});
    olds.forEach(o => { o.classList.add('out'); setTimeout(() => o.remove(), 1300); });
  })); };
  if (el.tagName === 'IMG' && !el.complete) { el.onload = go; el.onerror = go; setTimeout(go, 900); } else go();
  const src = $('#stageSrc');
  src.href = href || 'https://www.instagram.com/fiona_tashkent/';
}

function stageForState() {
  if (S.step === 0 && S.occ) {
    const o = OCCASIONS.find(x => x.id === S.occ);
    const img = o.posterSrc || `${M}p/${o.poster}.jpg`;
    setStage({ img, vid: o.video, key: 'occ-' + o.id, href: o.poster ? `https://www.instagram.com/p/${o.poster}/` : null });
  } else {
    const it = curItem();
    setStage({ img: it.img, vid: it.vid, key: 'it-' + it.code, href: it.url });
  }
  const mi = $('#mbarImg'), src = curItem().img;
  if (mi && !mi.src.endsWith(src.replace('../', ''))) { const n = mi.cloneNode(); n.src = src; mi.replaceWith(n); }
}

// pause stage video when off-screen
const stageEl = $('#stage');
if ('IntersectionObserver' in window) {
  new IntersectionObserver(es => es.forEach(e => {
    $$('video', stageEl).forEach(v => e.isIntersecting ? v.play().catch(() => {}) : v.pause());
  }), { threshold: .1 }).observe(stageEl);
}

/* ---------------- total counter ---------------- */
let shownTotal = total(), animId = 0;
function renderTotal() {
  const target = total();
  const from = shownTotal;
  cancelAnimationFrame(animId);
  const els = $$('.js-total');
  flipTotals(target);
  if (RM || from === target) { shownTotal = target; els.forEach(e => e.textContent = fmtN(target)); return; }
  const t0 = performance.now(), d = 700;
  const tick = now => {
    const k = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - k, 3);
    shownTotal = from + (target - from) * e;
    els.forEach(el => el.textContent = fmtN(Math.round(shownTotal / 1000) * 1000));
    if (k < 1) animId = requestAnimationFrame(tick); else { shownTotal = target; els.forEach(el => el.textContent = fmtN(target)); }
  };
  animId = requestAnimationFrame(tick);
}

let flipTarget = total(), flipAt = 0;
function flipTotals(target) {
  if (RM || target === flipTarget) return;
  flipTarget = target;
  const now = performance.now();
  if (now - flipAt < 520) return;
  flipAt = now;
  $$('.js-flip').forEach(el => { el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip'); });
  const tag = $('#tag'); tag.classList.remove('swing'); void tag.offsetWidth; tag.classList.add('swing');
}

/* ---------------- summary tag ---------------- */
function renderTag() {
  const it = curItem();
  const lines = [[t('sum.' + (it.fmt === 'b' ? 'bouquet' : it.fmt)), money(it.price)]];
  if (S.vase >= 0) lines.push([`${t('sum.vase')}: ${VASES[S.vase].name}`, money(VASES[S.vase].price)]);
  if (S.visited.has(4)) lines.push([t('sum.card'), S.cardOff ? t('sum.cardOff') : (S.card ? '«' + S.card.slice(0, 18) + (S.card.length > 18 ? '…' : '') + '»' : '—')]);
  if (S.visited.has(5)) lines.push([t('sum.delivery'), deliveryLabel()]);
  const box = $('#tagLines');
  const html = lines.map(([a, b]) => `<div class="tag-line"><span>${esc(a)}</span><b>${esc(b)}</b></div>`).join('');
  if (box.dataset.h !== html) { box.innerHTML = html; box.dataset.h = html; }
  renderTotal();
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------------- steps ---------------- */
const STEPS = $$('.step');
function go(n, opts = {}) {
  n = Math.max(0, Math.min(5, n));
  const prev = S.step;
  if (n !== prev) {
    const old = STEPS[prev], nu = STEPS[n];
    const fwd = n > prev;
    old.classList.remove('is-active', 'from-l');
    if (!RM) { old.classList.add(fwd ? 'leave-l' : 'leave-r'); setTimeout(() => old.classList.remove('leave-l', 'leave-r'), 330); }
    nu.classList.toggle('from-l', !fwd);
    nu.classList.add('is-active');
    S.step = n; S.visited.add(n);
  }
  $('.panel').classList.toggle('started', S.step > 0);
  renderRail(); stageForState(); renderTag(); mbar.classList.toggle('show', scrollY > 260 || S.step > 0);
  if (n === 1) renderBudget();
  if (n === 5) renderDelivery();
  if (opts.focus !== false && n !== prev) {
    const h = STEPS[n].querySelector('.step-h');
    h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true });
    // on mobile, keep the step in view
    if (window.innerWidth <= 900) {
      const top = $('#rail').getBoundingClientRect().top + scrollY - 70;
      if (Math.abs(scrollY - top) > 40) scrollTo({ top, behavior: RM ? 'auto' : 'smooth' });
    }
  }
}
function renderRail() {
  $$('#rail li:not(.rail-fill)').forEach((li, i) => {
    li.classList.toggle('cur', i === S.step);
    li.classList.toggle('done', i !== S.step && S.visited.has(i));
    li.querySelector('button').setAttribute('aria-current', i === S.step ? 'step' : 'false');
  });
  $('#railFill').style.transform = `scaleX(${S.step / 5})`;
  $('#prev').disabled = S.step === 0;
  $('#nextLabel').textContent = S.step === 5 ? t('nav.finish') : t('nav.next');
}
$('#rail').addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) go(+b.dataset.go); });
$('#prev').addEventListener('click', () => go(S.step - 1));
$('#next').addEventListener('click', () => S.step === 5 ? openComposer() : go(S.step + 1));

/* ---------------- step 1: occasion ---------------- */
function renderOcc() {
  $('#occ').innerHTML = OCCASIONS.map(o => `
    <button type="button" class="opt tilt" role="radio" aria-checked="${S.occ === o.id}" data-occ="${o.id}">
      <img src="${o.posterSrc || `${M}p/${o.poster}.jpg`}" alt="" loading="lazy" width="52" height="52">
      <b>${t('occ.' + o.id)}</b>
    </button>`).join('');
}
$('#occ').addEventListener('click', e => {
  const b = e.target.closest('[data-occ]'); if (!b) return;
  S.occ = b.dataset.occ;
  $$('#occ .opt').forEach(x => x.setAttribute('aria-checked', x === b));
  if (!S.cardTouched) { S.card = t('idea.' + S.occ)[0]; syncCard(); }
  // suggest a fitting real bouquet until the customer moves the budget themselves
  if (!S.budgetTouched) {
    const it = ITEMS.find(i => i.code === OCCASIONS.find(o => o.id === S.occ).pick);
    S.fmt = it.fmt; S.price = it.price; S.code = it.code; ticksReset(); renderFmts(); renderTag();
  }
  renderIdeas(); stageForState();
  // gentle auto-advance so the flow feels guided
  clearTimeout(go._t); go._t = setTimeout(() => { if (S.step === 0) go(1); }, RM ? 0 : 1100);
});

/* ---------------- step 2: budget ---------------- */
const range = $('#budget');
function renderBudget() {
  const lad = ladder(S.fmt);
  if (!lad.includes(S.price)) S.price = nearest(lad, S.price);
  const idx = lad.indexOf(S.price);
  range.max = Math.max(lad.length - 1, 0);
  range.value = idx;
  range.disabled = lad.length < 2;
  $('.slider-wrap').hidden = lad.length < 2;
  range.setAttribute('aria-valuetext', money(S.price));
  const p = lad.length > 1 ? idx / (lad.length - 1) * 100 : 100;
  range.style.setProperty('--p', p + '%');
  $('#budgetPrice').textContent = fmtN(S.price);
  $('#roses').hidden = !(S.price === 3100000 && S.fmt === 'b');
  // ticks
  const ticks = $('#ticks');
  if (ticks.dataset.f !== S.fmt) {
    ticks.dataset.f = S.fmt;
    ticks.innerHTML = lad.map((v, i) => `<i style="left:${lad.length > 1 ? i / (lad.length - 1) * 100 : 50}%" class="${v === 1000000 || v === 3100000 ? 'big' : ''}"></i>`).join('');
  }
  $$('i', ticks).forEach((el, i) => el.classList.toggle('on', i === idx));
  // anchors: min, 1M / 101 roses, max
  const anchors = [[0, lad[0]], [lad.length - 1, lad[lad.length - 1]]];
  if (S.fmt === 'b') anchors.splice(1, 0, [lad.indexOf(1000000), 1000000], [lad.indexOf(3100000), 3100000]);
  $('#anchors').innerHTML = lad.length > 1 ? anchors.map(([i, v], k) => `<span class="${S.fmt === 'b' && k === 1 ? 'mid1' : ''}" style="left:${i / (lad.length - 1) * 100}%">${short(v)}</span>`).join('') : '';
  // variants
  const vs = itemsAt(S.fmt, S.price);
  if (!vs.find(v => v.code === S.code)) S.code = vs[0].code;
  $('#variantsH').textContent = S.fmt === 't' ? t('s2.single') : vs.length > 1 ? t('s2.many', { n: vs.length }) : t('s2.one');
  $('#thumbs').innerHTML = vs.map(v => `<button type="button" class="thumb" data-code="${v.code}" aria-pressed="${v.code === S.code}" aria-label="${money(v.price)}"><img src="${v.img}" alt="" loading="lazy"></button>`).join('');
}
let lastIdx = -1;
range.addEventListener('input', () => {
  S.budgetTouched = true;
  const lad = ladder(S.fmt);
  const idx = +range.value;
  S.price = lad[idx];
  S.code = itemsAt(S.fmt, S.price)[0].code;
  if (idx !== lastIdx) {
    lastIdx = idx;
    if (navigator.vibrate && !RM && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) try { navigator.vibrate(6); } catch (_) {}
    range.classList.remove('snap'); void range.offsetWidth; range.classList.add('snap');
  }
  renderBudget(); stageForState(); renderTag();
});
$('#thumbs').addEventListener('click', e => {
  const b = e.target.closest('[data-code]'); if (!b) return;
  S.code = b.dataset.code; S.budgetTouched = true;
  $$('#thumbs .thumb').forEach(x => x.setAttribute('aria-pressed', x === b));
  stageForState(); renderTag();
});

/* ---------------- step 3: format ---------------- */
function renderFmts() {
  $('#fmts').innerHTML = ['b', 'k', 't'].map(f => {
    const lad = ladder(f);
    const label = lad.length > 1 ? t('fmt.from', { p: short(lad[0]) }) : t('fmt.only', { p: short(lad[0]) });
    return `<button type="button" class="fmt tilt" role="radio" aria-checked="${S.fmt === f}" data-fmt="${f}">
      <div class="fmt-img"><img src="${M}p/${FORMATS[f].cover}.jpg" alt="" loading="lazy"></div>
      <div class="fmt-txt"><b>${t('fmt.' + f)}</b><small>${label}</small></div></button>`;
  }).join('');
}
$('#fmts').addEventListener('click', e => {
  const b = e.target.closest('[data-fmt]'); if (!b) return;
  const f = b.dataset.fmt;
  $$('#fmts .fmt').forEach(x => x.setAttribute('aria-checked', x === b));
  if (f === S.fmt) return;
  const was = S.price;
  S.fmt = f;
  S.price = nearest(ladder(f), was);
  S.code = itemsAt(f, S.price)[0].code;
  ticksReset();
  $('#fmtNote').textContent = S.price !== was ? t('fmt.note', { p: money(S.price) }) : '';
  stageForState(); renderTag();
});
const ticksReset = () => { $('#ticks').dataset.f = ''; };

/* ---------------- step 4: vases ---------------- */
function renderVases() {
  $('#vases').innerHTML = `<button type="button" class="vase tilt" role="radio" aria-checked="${S.vase < 0}" data-v="-1">
      <div class="vase-img"><span class="vase-none">—</span></div><b>${t('vase.none')}</b><small>&nbsp;</small></button>` +
    VASES.map((v, i) => `<button type="button" class="vase tilt" role="radio" aria-checked="${S.vase === i}" data-v="${i}">
      <div class="vase-img"><img src="${v.img}" alt="" loading="lazy"></div><b>${v.name}</b><small>${money(v.price)}</small></button>`).join('');
}
$('#vases').addEventListener('click', e => {
  const b = e.target.closest('[data-v]'); if (!b) return;
  S.vase = +b.dataset.v;
  $$('#vases .vase').forEach(x => x.setAttribute('aria-checked', x === b));
  renderStageVase(); renderTag();
});
function renderStageVase() {
  const box = $('#stageVase');
  if (S.vase < 0) { box.hidden = true; return; }
  const v = VASES[S.vase];
  $('#stageVaseImg').src = v.img; $('#stageVaseName').textContent = '+ ' + v.name;
  box.hidden = false; box.style.animation = 'none'; void box.offsetWidth; box.style.animation = '';
}

/* ---------------- step 5: card ---------------- */
const cardText = $('#cardText');
function syncCard() {
  cardText.value = S.card;
  $('#cardLive').textContent = S.card;
  $('#cardCount').textContent = S.card.length;
}
cardText.addEventListener('input', () => { S.card = cardText.value; S.cardTouched = true; $$('#ideas .idea').forEach(b => b.setAttribute('aria-pressed', b.textContent === S.card)); $('#cardLive').textContent = S.card; $('#cardCount').textContent = S.card.length; renderTag(); });
function renderIdeas() {
  const occ = S.occ || 'just';
  $('#ideas').innerHTML = t('idea.' + occ).map(s => `<button type="button" class="idea" aria-pressed="${s === S.card}">${esc(s)}</button>`).join('');
  $('#cardLive').dataset.ph = t('s5.ph');
}
$('#ideas').addEventListener('click', e => {
  const b = e.target.closest('.idea'); if (!b) return;
  S.card = b.textContent; S.cardTouched = true; S.cardOff = false; $('#cardOff').checked = false;
  $('#cardPreview').classList.remove('off'); cardText.disabled = false;
  syncCard(); renderIdeas(); renderTag();
});
$('#cardOff').addEventListener('change', e => {
  S.cardOff = e.target.checked;
  $('#cardPreview').classList.toggle('off', S.cardOff);
  cardText.disabled = S.cardOff; renderTag();
});

/* ---------------- step 6: delivery ---------------- */
function tashkentNow() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Tashkent', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const h = +parts.find(p => p.type === 'hour').value, m = +parts.find(p => p.type === 'minute').value;
  let mins = h * 60 + m;
  if (h < 1) mins += 24 * 60; // 00:xx still belongs to "today's" working evening
  return mins;
}
const slotLabel = ([a, b]) => `${String(a % 24).padStart(2, '0')}:00–${String(b % 24).padStart(2, '0')}:00`;
function slotOk(s, day) {
  if (day !== 'today') return true;
  const now = tashkentNow();
  if (now < 9 * 60 && now >= 60) return true; // before opening: whole day ahead
  return s[1] * 60 - 60 > now;
}
function asapOk() {
  const now = tashkentNow();
  return now >= 9 * 60 && now < 24 * 60 + 30;
}
function renderDelivery() {
  const todayAny = SLOTS.some(s => slotOk(s, 'today'));
  if (!todayAny && S.day === 'today') S.day = 'tomorrow';
  $('#days').innerHTML = ['today', 'tomorrow'].map(d => `<button type="button" class="chip" role="radio" data-day="${d}" aria-checked="${S.day === d}" ${d === 'today' && !todayAny ? 'disabled' : ''}>${t('day.' + d)}</button>`).join('');
  const asap = S.day === 'today' && asapOk();
  if (S.slot === 'asap' && !asap) S.slot = null;
  if (S.slot != null && S.slot !== 'asap' && !slotOk(SLOTS[S.slot], S.day)) S.slot = null;
  $('#slots').innerHTML = (asap ? `<button type="button" class="chip asap" role="radio" data-slot="asap" aria-checked="${S.slot === 'asap'}">${t('slot.asap')}</button>` : '') +
    SLOTS.map((s, i) => `<button type="button" class="chip" role="radio" data-slot="${i}" aria-checked="${S.slot === i}" ${slotOk(s, S.day) ? '' : 'disabled'}>${slotLabel(s)}</button>`).join('');
  const sel = $('#district');
  sel.innerHTML = `<option value="-1">${t('s6.districtPh')}</option>` + DISTRICTS[S.lang].map((d, i) => `<option value="${i}" ${S.district === i ? 'selected' : ''}>${d}</option>`).join('');
}
function deliveryLabel() {
  const d = t('day.' + S.day);
  if (S.slot === 'asap') return `${d}, 30–60 ${S.lang === 'uz' ? 'daq' : 'мин'}`;
  if (S.slot == null) return d;
  return `${d}, ${slotLabel(SLOTS[S.slot])}`;
}
$('#days').addEventListener('click', e => { const b = e.target.closest('[data-day]'); if (!b || b.disabled) return; S.day = b.dataset.day; renderDelivery(); renderTag(); });
$('#slots').addEventListener('click', e => { const b = e.target.closest('[data-slot]'); if (!b || b.disabled) return; S.slot = b.dataset.slot === 'asap' ? 'asap' : +b.dataset.slot; $$('#slots .chip').forEach(x => x.setAttribute('aria-checked', x === b)); renderTag(); });
$('#district').addEventListener('change', e => { S.district = +e.target.value; });
$('#address').addEventListener('input', e => { S.address = e.target.value; });
$('#rname').addEventListener('input', e => { S.rname = e.target.value; });
$('#rphone').addEventListener('input', e => { S.rphone = e.target.value; });
$('#photoReq').addEventListener('change', e => { S.photo = e.target.checked; });

/* ---------------- composer ---------------- */
function buildMessage() {
  const it = curItem();
  const L = [t('m.hello'), ''];
  if (S.occ) L.push(`${t('m.occ')}: ${t('occ.' + S.occ)}`);
  L.push(`${t('m.fmt')}: ${t('fmt.' + it.fmt)}`);
  L.push(`${t('m.item')}: ${it.url} (${t('m.price')} ${money(it.price)})`);
  if (S.vase >= 0) L.push(`${t('m.vase')}: ${VASES[S.vase].name} — ${money(VASES[S.vase].price)}`);
  L.push(`${t('m.card')}: ${S.cardOff || !S.card.trim() ? t('m.noCard') : '«' + S.card.trim() + '»'}`);
  L.push('');
  L.push(`${t('m.when')}: ${S.slot == null ? t('day.' + S.day) + ', ' + t('m.ask') : deliveryLabel()}`);
  L.push(`${t('m.district')}: ${S.district >= 0 ? DISTRICTS[S.lang][S.district] : t('m.ask')}`);
  L.push(`${t('m.address')}: ${S.address.trim() || t('m.ask')}`);
  const to = [S.rname.trim(), S.rphone.trim()].filter(Boolean).join(', ');
  if (to) L.push(`${t('m.to')}: ${to}`);
  if (S.photo) L.push('', t('m.photo'));
  L.push('', `${t('m.total')}: ${money(total())}`);
  return L.join('\n');
}
const dlg = $('#composer');
function openComposer() {
  $('#msg').value = buildMessage();
  if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
}
$$('.js-compose').forEach(b => b.addEventListener('click', openComposer));
$('#mbarPic').addEventListener('click', () => $('#stage').scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' }));
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
async function copyMsg() {
  const txt = $('#msg').value;
  try { await navigator.clipboard.writeText(txt); return true; }
  catch (_) {
    const ta = $('#msg'); ta.select();
    try { return document.execCommand('copy'); } catch (__) { return false; }
  }
}
$('#copyBtn').addEventListener('click', async () => { if (await copyMsg()) toast(t('toast.copied')); });
$$('.js-send').forEach(a => a.addEventListener('click', () => { copyMsg().then(ok => ok && toast(t('toast.paste'))); }));
let toastT;
function toast(s) {
  const el = $('#toast'); el.textContent = s; el.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ---------------- ready grid ---------------- */
const PF = [['all', 0, Infinity], ['1', 0, 999999], ['2', 1000000, 1999999], ['3', 2000000, 3999999], ['4', 4000000, Infinity]];
let pf = 'all', ff = 'all', shown = 12;
function renderChips() {
  $('#priceChips').innerHTML = PF.map(([k]) => `<button type="button" class="chip" data-pf="${k}" aria-pressed="${pf === k}">${t('pf.' + k)}</button>`).join('');
  $('#fmtChips').innerHTML = ['all', 'b', 'k', 't'].map(k => `<button type="button" class="chip" data-ff="${k}" aria-pressed="${ff === k}">${t('ff.' + k)}</button>`).join('');
}
function filtered() {
  const [, lo, hi] = PF.find(p => p[0] === pf);
  return ITEMS.filter(i => i.price >= lo && i.price <= hi && (ff === 'all' || i.fmt === ff)).sort((a, b) => a.price - b.price);
}
function renderGrid() {
  const list = filtered();
  $('#grid').innerHTML = list.length ? list.slice(0, shown).map((i, n) => `
    <article class="item" style="animation-delay:${Math.min(n % 12, 8) * 40}ms">
      <div class="item-img tilt">
        <img src="${i.img}" alt="${esc(t('fmt.' + i.fmt) + ', ' + money(i.price))}" loading="lazy">
        <button type="button" class="btn btn-ink btn-sm item-use" data-use="${i.code}">${t('ready.use')}</button>
      </div>
      <div class="item-meta"><b>${fmtN(i.price)} <small>${t('cur')}</small></b><small>${t('fmt.' + i.fmt)}</small></div>
    </article>`).join('') : `<p class="empty">${t('ready.empty')}</p>`;
  $('#more').hidden = list.length <= shown;
}
const RING_STEP = 13, RING_MAX = 24;
const ringCapable = () => FINE && !RM && window.innerWidth > 900 && (navigator.hardwareConcurrency || 8) > 2 && !!window.CSS && CSS.supports('transform-style', 'preserve-3d');
let view = null; // 'ring' | 'grid'
const R = { rot: 0, target: 0, vel: 0, drag: null, list: [], R: 1200, raf: 0, front: -1, mx: 0, my: 0, tmx: 0, tmy: 0, visible: false };
function renderReady() {
  const cap = ringCapable();
  if (!cap) view = 'grid'; else if (!view) view = 'ring';
  const ring = view === 'ring';
  $('#ringWrap').hidden = !ring;
  $('#grid').hidden = ring;
  const vt = $('#viewToggle');
  vt.hidden = !cap; vt.textContent = ring ? t('ring.toGrid') : t('ring.toRing');
  if (ring) { renderRing(); $('#more').hidden = true; } else renderGrid();
}
function renderRing() {
  const all = filtered();
  let list = all;
  if (all.length > RING_MAX) list = Array.from({ length: RING_MAX }, (_, k) => all[Math.round(k * (all.length - 1) / (RING_MAX - 1))]);
  R.list = list;
  const ring = $('#ring');
  if (!list.length) { ring.innerHTML = `<p class="empty">${t('ready.empty')}</p>`; $('#ringCap').innerHTML = ''; return; }
  const cw = parseFloat(getComputedStyle(ring).getPropertyValue('--cw')) || 270;
  R.R = Math.round((cw + 34) / (2 * Math.tan(RING_STEP / 2 * Math.PI / 180)));
  ring.style.setProperty('--r', R.R + 'px');
  ring.innerHTML = list.map((i, n) => `
    <button type="button" class="ring-card" data-n="${n}" tabindex="-1" style="transform:rotateY(${n * RING_STEP}deg) translateZ(${R.R}px)" aria-label="${esc(t('fmt.' + i.fmt) + ', ' + money(i.price))}">
      <img src="${i.img}" alt="" loading="lazy" draggable="false"><span class="ring-shine"></span>
    </button>`).join('');
  const max = (list.length - 1) * RING_STEP;
  if (R.reset !== false) { R.target = Math.floor((list.length - 1) / 2) * RING_STEP; R.rot = R.target + (RM ? 0 : 36); R.reset = false; }
  R.target = Math.min(Math.max(0, Math.round(R.target / RING_STEP) * RING_STEP), max);
  R.front = -1;
  ringKick();
}
function ringCaption(n) {
  const i = R.list[n]; if (!i) return;
  $('#ringCap').innerHTML = `<div class="ring-price"><b>${fmtN(i.price)}</b> <small>${t('cur')}</small></div>
    <div class="ring-meta">${t('fmt.' + i.fmt)}, ${n + 1}/${R.list.length} &nbsp;<a href="${i.url}" target="_blank" rel="noopener">${t('ring.ig')}</a></div>
    <button type="button" class="btn btn-ink btn-sm magnetic" data-use="${i.code}">${t('ready.use')}</button>`;
}
function ringFrame() {
  R.raf = 0;
  if (view !== 'ring' || !R.visible) return;
  if (!R.drag) R.rot += (R.target - R.rot) * 0.085;
  R.mx += (R.tmx - R.mx) * 0.06; R.my += (R.tmy - R.my) * 0.06;
  const ring = $('#ring');
  ring.style.transform = `translateZ(${-R.R}px) rotateX(${(-R.my * 3).toFixed(2)}deg) rotateY(${(-R.rot + R.mx * 4).toFixed(3)}deg)`;
  $$('.ring-card', ring).forEach((c, n) => {
    const d = Math.abs(n * RING_STEP - R.rot);
    const o = Math.max(0, Math.min(1, 1.25 - d / 48));
    c.style.opacity = o.toFixed(3);
    c.style.pointerEvents = o < .15 ? 'none' : '';
    c.style.setProperty('--lit', Math.max(0, 1 - d / 26).toFixed(3));
  });
  const front = Math.max(0, Math.min(R.list.length - 1, Math.round(R.rot / RING_STEP)));
  if (front !== R.front) { R.front = front; ringCaption(front); $$('.ring-card', ring).forEach((c, n) => c.classList.toggle('is-front', n === front)); }
  const moving = R.drag || Math.abs(R.target - R.rot) > .02 || Math.abs(R.tmx - R.mx) > .002 || Math.abs(R.tmy - R.my) > .002;
  if (moving) R.raf = requestAnimationFrame(ringFrame);
}
const ringKick = () => { if (!R.raf) R.raf = requestAnimationFrame(ringFrame); };
const ringClamp = v => Math.min(Math.max(0, v), Math.max(0, (R.list.length - 1) * RING_STEP));
const ringSnap = () => { R.target = ringClamp(Math.round(R.target / RING_STEP) * RING_STEP); ringKick(); };
const ringGo = d => { R.target = ringClamp(Math.round(R.target / RING_STEP + d) * RING_STEP); ringKick(); };
(() => {
  const sc = $('#ringScene');
  new IntersectionObserver(es => { R.visible = es.some(e => e.isIntersecting); ringKick(); }, { rootMargin: '100px' }).observe($('#ringWrap'));
  let sx = 0, sr = 0, lx = 0, lt = 0, moved = false;
  sc.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    R.drag = { id: e.pointerId }; sx = lx = e.clientX; sr = R.rot; lt = performance.now(); R.vel = 0; moved = false;
    ringKick();
  });
  sc.addEventListener('pointermove', e => {
    const r = sc.getBoundingClientRect();
    R.tmx = (e.clientX - r.left) / r.width - .5; R.tmy = (e.clientY - r.top) / r.height - .5;
    if (!R.drag) { ringKick(); return; }
    const dx = e.clientX - sx;
    if (!moved && Math.abs(dx) > 6) { moved = true; sc.setPointerCapture(e.pointerId); sc.classList.add('is-drag'); }
    if (!moved) return;
    const now = performance.now();
    R.rot = R.target = sr - dx * 0.075;
    R.vel = -(e.clientX - lx) * 0.075 / Math.max(1, now - lt) * 16;
    lx = e.clientX; lt = now;
  });
  const end = () => {
    if (!R.drag) return;
    R.drag = null; sc.classList.remove('is-drag');
    if (moved) { R.target = R.rot + R.vel * 9; ringSnap(); }
  };
  sc.addEventListener('pointerup', end); sc.addEventListener('pointercancel', end);
  sc.addEventListener('pointerleave', () => { R.tmx = 0; R.tmy = 0; ringKick(); });
  sc.addEventListener('click', e => {
    if (moved) { moved = false; return; }
    const c = e.target.closest('.ring-card'); if (!c) return;
    const n = +c.dataset.n;
    if (n === R.front) { const b = $('#ringCap [data-use]'); b && b.focus(); }
    else { R.target = n * RING_STEP; ringKick(); }
  });
  let wt;
  sc.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    R.target = ringClamp(R.target + e.deltaX * 0.06); ringKick();
    clearTimeout(wt); wt = setTimeout(ringSnap, 140);
  }, { passive: false });
  sc.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { ringGo(1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { ringGo(-1); e.preventDefault(); }
  });
  $('#ringPrev').addEventListener('click', () => ringGo(-1));
  $('#ringNext').addEventListener('click', () => ringGo(1));
  $('#ringCap').addEventListener('click', e => { const b = e.target.closest('[data-use]'); if (b) useItem(b.dataset.use); });
  $('#viewToggle').addEventListener('click', () => { view = view === 'ring' ? 'grid' : 'ring'; renderReady(); });
  let rw = innerWidth;
  addEventListener('resize', () => { if ((rw > 900) !== (innerWidth > 900)) { rw = innerWidth; view = null; renderReady(); } });
})();
$('#priceChips').addEventListener('click', e => { const b = e.target.closest('[data-pf]'); if (!b) return; pf = b.dataset.pf; shown = 12; R.reset = true; renderChips(); renderReady(); });
$('#fmtChips').addEventListener('click', e => { const b = e.target.closest('[data-ff]'); if (!b) return; ff = b.dataset.ff; shown = 12; R.reset = true; renderChips(); renderReady(); });
$('#more').addEventListener('click', () => { shown += 12; renderGrid(); });
$('#grid').addEventListener('click', e => { const b = e.target.closest('[data-use]'); if (b) useItem(b.dataset.use); });
function useItem(code) {
  const it = ITEMS.find(i => i.code === code);
  S.fmt = it.fmt; S.price = it.price; S.code = it.code; S.budgetTouched = true; ticksReset();
  renderFmts(); $('#fmtNote').textContent = '';
  $('#atelier').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
  setTimeout(() => go(1, { focus: false }), RM ? 0 : 350);
}

/* ---------------- care ---------------- */
function renderCare() {
  $('#careList').innerHTML = t('care').map(([h, p], i) => `
    <li><button type="button" class="care-c tilt" aria-expanded="false">
      <span class="care-n">${i + 1}</span><b>${esc(h)}</b><p><span>${esc(p)}</span></p>
      <span class="care-plus">${t('care.more')}</span></button></li>`).join('');
}
$('#careList').addEventListener('click', e => {
  const b = e.target.closest('.care-c'); if (!b) return;
  const open = b.getAttribute('aria-expanded') !== 'true';
  b.setAttribute('aria-expanded', open);
  b.querySelector('.care-plus').textContent = open ? t('care.less') : t('care.more');
});

/* ---------------- language ---------------- */
function applyLang() {
  document.documentElement.lang = S.lang;
  $$('[data-i18n]').forEach(el => { const v = t(el.dataset.i18n); if (typeof v === 'string') el.textContent = v; });
  $$('[data-i18n-ph]').forEach(el => el.placeholder = t(el.dataset.i18nPh));
  $$('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  $$('.js-cur').forEach(el => el.textContent = t('cur'));
  $$('.lang button').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === S.lang));
  document.title = S.lang === 'uz' ? 'fiona — guldasta ustaxonasi · Toshkent' : 'fiona — мастерская букета · Ташкент';
  if (S.occ && !S.cardTouched) { S.card = t('idea.' + S.occ)[0]; syncCard(); }
  renderOcc(); renderFmts(); renderVases(); renderIdeas(); renderBudget(); renderDelivery(); renderChips(); renderReady(); renderCare(); renderRail(); renderTag();
  if (dlg.open) $('#msg').value = buildMessage();
}
$$('.lang button').forEach(b => b.addEventListener('click', () => { S.lang = b.dataset.lang; localStorage.setItem('fiona-lang', S.lang); applyLang(); }));

/* ---------------- magnetic buttons ---------------- */
if (FINE && !RM) {
  document.addEventListener('pointermove', e => {
    const b = e.target.closest && e.target.closest('.magnetic');
    $$('.magnetic.is-mag').forEach(x => { if (x !== b) { x.classList.remove('is-mag'); x.style.setProperty('--mx', '0px'); x.style.setProperty('--my', '0px'); } });
    if (!b) return;
    const r = b.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * .22, dy = (e.clientY - (r.top + r.height / 2)) * .3;
    b.classList.add('is-mag');
    b.style.setProperty('--mx', dx.toFixed(1) + 'px'); b.style.setProperty('--my', dy.toFixed(1) + 'px');
  }, { passive: true });
}

/* ---------------- 3D tilt + sheen on cards ---------------- */
if (FINE && !RM) {
  let cur = null;
  const reset = el => { el.classList.remove('is-tilting'); el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); };
  document.addEventListener('pointermove', e => {
    const el = e.target.closest && e.target.closest('.tilt');
    if (cur && cur !== el) reset(cur);
    cur = el;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    const k = el.classList.contains('item-img') ? 7 : 10;
    el.classList.add('is-tilting');
    el.style.setProperty('--rx', ((.5 - y) * k).toFixed(2) + 'deg');
    el.style.setProperty('--ry', ((x - .5) * k).toFixed(2) + 'deg');
    el.style.setProperty('--sx', (x * 100).toFixed(1) + '%');
    el.style.setProperty('--sy', (y * 100).toFixed(1) + '%');
  }, { passive: true });
}

/* ---------------- perspective scroll reveals ---------------- */
if (!RM && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('rv');
  const targets = ['.ready .sec-head', '.filters', '.ring-wrap', '.trust-i', '.care .sec-head', '.care-list li', '.cont-media', '.cont-body'];
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  targets.forEach(s => $$(s).forEach((el, i) => { el.setAttribute('data-reveal', ''); el.style.setProperty('--d', (i % 6) * 70 + 'ms'); io.observe(el); }));
}

/* ---------------- header state ---------------- */
const top = $('#top');
const mbar = $('#mbar');
const onScroll = () => { top.classList.toggle('is-scrolled', scrollY > 8); mbar.classList.toggle('show', scrollY > 260 || S.step > 0); };
addEventListener('scroll', onScroll, { passive: true });

/* ---------------- init ---------------- */
applyLang();
syncCard();
stageForState();
})();
