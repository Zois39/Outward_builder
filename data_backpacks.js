const BACKPACKS=[
{id:'adventurer',n:'Adventurer Backpack',ru:'Рюкзак Искателя Приключений',img:'https://outward.wiki.gg/images/thumb/8/8e/Adventurer_Backpack.png/150px-Adventurer_Backpack.png',st:'+20 вес, +5 защита',d:'Стандартный рюкзак искателя приключений.',src:'Basic'},
{id:'scavenger',n:'Scavenger Backpack',ru:'Рюкзак Мусорщика',img:'https://outward.wiki.gg/images/thumb/8/8e/Scavenger_Backpack.png/150px-Scavenger_Backpack.png',st:'+15 вес, +3 скорость',d:'Лёгкий рюкзак мусорщика.',src:'Basic'},
{id:'mefino',n:"Mefino's Trade Backpack",ru:'Торговый Рюкзак Мефино',img:'https://outward.wiki.gg/images/thumb/8/8e/Mefino%27s_Trade_Backpack.png/150px-Mefino%27s_Trade_Backpack.png',st:'+40 вес, -5% скорость',d:'Большой торговый рюкзак.',src:'Unique'},
{id:'zagis',n:'Zagis Backpack',ru:'Рюкзак Загиса',img:'https://outward.wiki.gg/images/thumb/8/8e/Zagis_Backpack.png/150px-Zagis_Backpack.png',st:'+25 вес, +10 защита',d:'Рюкзак Загиса.',src:'Zagis Set'},
{id:'tsar',n:'Tsar Backpack',ru:'Рюкзак Царя',img:'https://outward.wiki.gg/images/thumb/8/8e/Tsar_Backpack.png/150px-Tsar_Backpack.png',st:'+30 вес, +15 защита',d:'Легендарный рюкзак.',src:'Tsar Set'},
{id:'light',n:'Light Backpack',ru:'Лёгкий Рюкзак',img:'https://outward.wiki.gg/images/thumb/8/8e/Light_Backpack.png/150px-Light_Backpack.png',st:'+10 вес, +5 скорость',d:'Лёгкий рюкзак.',src:'Basic'},
{id:'duelist',n:'Duelist Backpack',ru:'Рюкзак Дуэлянта',img:'https://outward.wiki.gg/images/thumb/8/8e/Duelist_Backpack.png/150px-Duelist_Backpack.png',st:'+20 вес, +5 защита',d:'Рюкзак дуэлянта.',src:'Unique'},
{id:'gatherer',n:'Gatherer Backpack',ru:'Рюкзак Собирателя',img:'https://outward.wiki.gg/images/thumb/8/8e/Gatherer_Backpack.png/150px-Gatherer_Backpack.png',st:'+25 вес',d:'Рюкзак собирателя.',src:'Basic'},
{id:'hunter_bp',n:'Hunter Backpack',ru:'Охотничий Рюкзак',img:'https://outward.wiki.gg/images/thumb/8/8e/Hunter_Backpack.png/150px-Hunter_Backpack.png',st:'+20 вес, +5 защита',d:'Охотничий рюкзак.',src:'Hunter Set'},
{id:'merchant_bp',n:'Merchant Backpack',ru:'Торговый Рюкзак',img:'https://outward.wiki.gg/images/thumb/8/8e/Merchant_Backpack.png/150px-Merchant_Backpack.png',st:'+30 вес',d:'Торговый рюкзак.',src:'Merchant Set'},
{id:'nomad',n:'Nomad Backpack',ru:'Рюкзак Кочевника',img:'https://outward.wiki.gg/images/thumb/8/8e/Nomad_Backpack.png/150px-Nomad_Backpack.png',st:'+20 вес, +5 защита',d:'Рюкзак кочевника.',src:'Basic'},
{id:'padded',n:'Padded Backpack',ru:'Стёганый Рюкзак',img:'https://outward.wiki.gg/images/thumb/8/8e/Padded_Backpack.png/150px-Padded_Backpack.png',st:'+15 вес, +5 защита',d:'Стёганый рюкзак.',src:'Basic'},
{id:'reinforced',n:'Reinforced Backpack',ru:'Усиленный Рюкзак',img:'https://outward.wiki.gg/images/thumb/8/8e/Reinforced_Backpack.png/150px-Reinforced_Backpack.png',st:'+25 вес, +10 защита',d:'Усиленный рюкзак.',src:'Basic'},
{id:'warlord_bp',n:'Warlord Backpack',ru:'Рюкзак Военачальника',img:'https://outward.wiki.gg/images/thumb/8/8e/Warlord_Backpack.png/150px-Warlord_Backpack.png',st:'+30 вес, +15 защита',d:'Рюкзак военачальника.',src:'Warlord Set'},
{id:'worker_bp',n:'Worker Backpack',ru:'Рабочий Рюкзак',img:'https://outward.wiki.gg/images/thumb/8/8e/Worker_Backpack.png/150px-Worker_Backpack.png',st:'+20 вес',d:'Рабочий рюкзак.',src:'Basic'}];

const LANTERNS=[
{id:'old',n:'Old Lantern',ru:'Старый Фонарь',img:'https://outward.wiki.gg/images/thumb/8/8e/Old_Lantern.png/150px-Old_Lantern.png',st:'Просто свет',d:'Старый фонарь.',src:'Basic'},
{id:'souls',n:'Lantern of Souls',ru:'Фонарь Душ',img:'https://outward.wiki.gg/images/thumb/8/8e/Lantern_of_Souls.png/150px-Lantern_of_Souls.png',st:'Свет, +5 маны',d:'Фонарь душ. Даёт ману.',src:'Unique'},
{id:'glowstone',n:'Glowstone Lantern',ru:'Светящийся Фонарь',img:'https://outward.wiki.gg/images/thumb/8/8e/Glowstone_Lantern.png/150px-Glowstone_Lantern.png',st:'Яркий свет, +3 защита',d:'Светящийся камень.',src:'Unique'},
{id:'candle',n:'Candle Lantern',ru:'Свечной Фонарь',img:'https://outward.wiki.gg/images/thumb/8/8e/Candle_Lantern.png/150px-Candle_Lantern.png',st:'Свет',d:'Свечной фонарь.',src:'Basic'},
{id:'torch_lantern',n:'Torch',ru:'Факел',img:'https://outward.wiki.gg/images/thumb/8/8e/Torch.png/150px-Torch.png',st:'Свет, поджигание',d:'Факел.',src:'Basic'},
{id:'miners',n:"Miner's Lantern",ru:'Шахтёрский Фонарь',img:'https://outward.wiki.gg/images/thumb/8/8e/Miner%27s_Lantern.png/150px-Miner%27s_Lantern.png',st:'Свет, +5 защита',d:'Шахтёрский фонарь.',src:'Unique'},
{id:'alchemy',n:'Alchemy Lantern',ru:'Алхимический Фонарь',img:'https://outward.wiki.gg/images/thumb/8/8e/Alchemy_Lantern.png/150px-Alchemy_Lantern.png',st:'Свет, +3 маны',d:'Алхимический фонарь.',src:'Unique'},
{id:'rustic',n:'Rustic Lantern',ru:'Деревенский Фонарь',img:'https://outward.wiki.gg/images/thumb/8/8e/Rustic_Lantern.png/150px-Rustic_Lantern.png',st:'Свет',d:'Деревенский фонарь.',src:'Basic'},
{id:'fancy',n:'Fancy Lantern',ru:'Красивый Фонарь',img:'https://outward.wiki.gg/images/thumb/8/8e/Fancy_Lantern.png/150px-Fancy_Lantern.png',st:'Яркий свет',d:'Красивый фонарь.',src:'Basic'},
{id:'primitive',n:'Primitive Lantern',ru:'Примитивный Фонарь',img:'https://outward.wiki.gg/images/thumb/8/8e/Primitive_Lantern.png/150px-Primitive_Lantern.png',st:'Свет',d:'Примитивный фонарь.',src:'Basic'}];