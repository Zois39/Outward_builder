const BTDD=[
{id:'sham_res',n:'Shamanic Resonance',ru:'Шаманский Резонанс',tr:'Cabal Hermit',d:'Баффы (Boons) в 2 раза сильнее. Маст-хэв.',r:'S'},
{id:'feather',n:'Feather Dodge',ru:'Перевёртыш',tr:'Rogue Engineer',d:'-50% стоимость уклонения.',r:'S'},
{id:'sb_aw',n:"Spellblade's Awakening",ru:'Пробуждение Заклинателя',tr:'Spellblade',d:'+15 ко всем статам.',r:'A'},
{id:'surv_res',n:"Survivor's Resilience",ru:'Живучесть Выжившего',tr:'Hunter',d:'+40 макс. HP.',r:'A'},
{id:'steadfast',n:'Steadfast Ascetic',ru:'Непоколебимый Аскет',tr:'Warrior Monk',d:'+40 макс. выносливости.',r:'A'},
{id:'swift_foot',n:'Swift Foot',ru:'Быстрая Нога',tr:'Mercenary',d:'+10% скорость передвижения.',r:'A'},
{id:'leyline',n:'Leyline Connection',ru:'Связь с Лей-Линиями',tr:'Rune Sage',d:'+0.15 маны/сек.',r:'A'},
{id:'bloodlust',n:'Bloodlust',ru:'Жажда Крови',tr:'Hex Mage',d:'+10% скорость/урон после килла.',r:'B'},
{id:'sacred_fumes',n:'Sacred Fumes',ru:'Священный Дым',tr:'Primal Ritualist',d:'Дымовые шашки = бонусы.',r:'B'},
{id:'specialist_aw',n:"Specialist's Awakening",ru:'Пробуждение Специалиста',tr:'Specialist',d:'+10% ко всем статам.',r:'A'}];

// Фракции: sorobor (Соробор) совместим со всеми, остальные конфликтуют между собой
const FCDD=[
{id:'levant',n:'Heroic Kingdom of Levant',ru:'Героическое Королевство Левант',b:'+15% ко всему урону',d:'Индивидуализм. Награды: Alchemical Experiment, Zagis Armor.',conflicts:['blue','holy']},
{id:'blue',n:'Blue Chamber Collective',ru:'Синяя Палата',b:'+40 HP / +25 маны',d:'Семья. Награды: Blood of Giants, Ancestor\'s Memories.',conflicts:['levant','holy']},
{id:'holy',n:'Holy Mission of Elatt',ru:'Святая Миссия Элатта',b:'Защита и экономия',d:'Вера. Награды: Acceptance, Sanctified Protection.',conflicts:['levant','blue']},
{id:'sorobor',n:'Sorobor Academy',ru:'Академия Соробор',b:'Кулдауны и экономика',d:'Знания. Награды: Logistics Expert, Preferential Treatment.',conflicts:[]}];

const QBDD=[
{id:'peace',n:'Peacemaker Elixir',ru:'Эликсир Миротворца',s:'Финал любой фракции',d:'+20 ко всем статам.',t:'positive',fac:null},
{id:'blood_g',n:'Blood of Giants',ru:'Кровь Великанов',s:'Синяя Палата — Ash Giants',d:'+40 макс. HP.',t:'positive',fac:'blue'},
{id:'anc_mem',n:"Ancestor's Memories",ru:'Память Предков',s:'Синяя Палата — Whispering Bones',d:'+25 макс. маны.',t:'positive',fac:'blue'},
{id:'alchem',n:'Alchemical Experiment',ru:'Алхимический Эксперимент',s:'Левант — Mouths to Feed',d:'+15% ко всему урону.',t:'positive',fac:'levant'},
{id:'logist',n:'Logistics Expert',ru:'Эксперт по Логистике',s:'Соробор — Cloak and Dagger',d:'-10% кулдаунов, +5% скорость.',t:'positive',fac:'sorobor'},
{id:'pref',n:'Preferential Treatment',ru:'Преференциальное Обращение',s:'Соробор',d:'-15% цены покупки, +15% продажи.',t:'positive',fac:'sorobor'},
{id:'accept',n:'Acceptance',ru:'Принятие',s:'Святая Миссия — Truth and Purpose',d:'+8 защиты от холода/жары.',t:'positive',fac:'holy'},
{id:'sanct',n:'Sanctified Protection',ru:'Священная Защита',s:'Святая Миссия',d:'+2 физ. защиты.',t:'positive',fac:'holy'},
{id:'divine',n:'Divine Assistance',ru:'Божественная Помощь',s:'Святая Миссия — Doubts and Secrets',d:'-10% стоимость действий.',t:'positive',fac:'holy'},
{id:'exalted',n:'Exalted',ru:'Возвышенный',s:'Святая Миссия — Hallowed Peacemaker',d:'x2 урон, -30% стоимость, НО Life Drain Sickness!',t:'special',fac:'holy'},
{id:'painful',n:'Painful Sacrifice',ru:'Болезненная Жертва',s:'Святая Миссия — Questions and Corruption',d:'-15 макс. выносливости.',t:'negative',fac:'holy'},
{id:'sacrifice',n:'Sacrifice',ru:'Жертва',s:'Святая Миссия',d:'-7 макс. выносливости.',t:'negative',fac:'holy'}];

const CSD=[
{id:'pot_h',n:'Life Potion',ru:'Зелье Жизни',ic:'🧪',d:'Восстанавливает 30 HP'},
{id:'pot_s',n:'Endurance Potion',ru:'Зелье Выносливости',ic:'🧪',d:'Восстанавливает 30 выносливости'},
{id:'pot_m',n:'Mana Potion',ru:'Зелье Маны',ic:'🧪',d:'Восстанавливает 30 маны'},
{id:'band',n:'Bandage',ru:'Бинт',ic:'🩹',d:'Останавливает кровотечение'},
{id:'anti',n:'Antidote',ru:'Противоядие',ic:'💊',d:'Снимает отравление'},
{id:'bread',n:'Bread',ru:'Хлеб',ic:'🍞',d:'Еда. +10 сытости'},
{id:'meat',n:'Meat',ru:'Мясо',ic:'🍖',d:'Еда. +25 сытости'},
{id:'stew',n:'Meat Stew',ru:'Мясное Рагу',ic:'🍲',d:'Еда. +50 сытости, +10 HP'},
{id:'water',n:'Waterskin',ru:'Фляга с Водой',ic:'💧',d:'Вода. +30 жажды'},
{id:'wine',n:'Wine',ru:'Вино',ic:'🍷',d:'Алкоголь. +10 жажды, бафф'},
{id:'torch',n:'Torch',ru:'Факел',ic:'🔥',d:'Освещение, поджигание'},
{id:'trap',n:'Tripwire Trap',ru:'Растяжка',ic:'🪤',d:'Ловушка'},
{id:'flint',n:'Flint & Steel',ru:'Кремень и Сталь',ic:'🔥',d:'Поджигание'},
{id:'ammo',n:'Bullet',ru:'Пуля',ic:'🔸',d:'Боеприпасы для пистолета'},
{id:'arrow',n:'Arrow',ru:'Стрела',ic:'➶',d:'Стрелы для лука'},
{id:'fire_stone',n:'Fire Stone',ru:'Огненный Камень',ic:'🔥',d:'Для огненных заклинаний'},
{id:'ice_stone',n:'Ice Stone',ru:'Ледяной Камень',ic:'❄️',d:'Для ледяных заклинаний'},
{id:'lightning_stone',n:'Lightning Stone',ru:'Громовой Камень',ic:'⚡',d:'Для молний'},
{id:'ethereal_stone',n:'Ethereal Stone',ru:'Эфирный Камень',ic:'✨',d:'Для эфирных заклинаний'},
{id:'decay_stone',n:'Decay Stone',ru:'Камень Разложения',ic:'☠️',d:'Для разложения'},
{id:'smoke_bomb',n:'Smoke Bomb',ru:'Дымовая Шашка',ic:'💨',d:'Дымовая шашка'},
{id:'poison_bomb',n:'Poison Bomb',ru:'Ядовитая Бомба',ic:'☠️',d:'Отравляет врагов'},
{id:'flash_bomb',n:'Flash Bomb',ru:'Световая Бомба',ic:'💥',d:'Ослепляет врагов'},
{id:'explosive_bomb',n:'Explosive Bomb',ru:'Взрывная Бомба',ic:'💣',d:'Взрывной урон'}];