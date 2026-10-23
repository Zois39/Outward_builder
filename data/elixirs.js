const ELIXIRS=[
{id:'assassin_elixir',n:'Assassin Elixir',ru:'Эликсир Ассасина',img:'https://outward.wiki.gg/images/thumb/8/8e/Assassin_Elixir.png/150px-Assassin_Elixir.png',ic:'🧪',d:'Скорость, Скрытность, Сильное отравление оружия',dur:'∞',wt:1.0},
{id:'golem_elixir',n:'Golem Elixir',ru:'Эликсир Голема',img:'https://outward.wiki.gg/images/thumb/8/8e/Golem_Elixir.png/150px-Golem_Elixir.png',ic:'🧪',d:'Импакт, Одержимость, Дисциплина',dur:'∞',wt:0.5},
{id:'stoneflesh_elixir',n:'Stoneflesh Elixir',ru:'Эликсир Каменной Плоти',img:'https://outward.wiki.gg/images/thumb/8/8e/Stoneflesh_Elixir.png/150px-Stoneflesh_Elixir.png',ic:'🧪',d:'Физическая атака, Сопротивление импакту, Ярость',dur:'∞',wt:0.5},
{id:'survivor_elixir',n:'Survivor Elixir',ru:'Эликсир Выжившего',img:'https://outward.wiki.gg/images/thumb/8/8e/Survivor_Elixir.png/150px-Survivor_Elixir.png',ic:'🧪',d:'Восстанавливает 20 сгоревшей выносливости, защита от погоды, восстановление выносливости 3',dur:'∞',wt:0.5},
{id:'warrior_elixir',n:'Warrior Elixir',ru:'Эликсир Воина',img:'https://outward.wiki.gg/images/thumb/8/8e/Warrior_Elixir.png/150px-Warrior_Elixir.png',ic:'🧪',d:'Дисциплина, Импакт, Физическая атака',dur:'∞',wt:0.5},
{id:'peacemaker_elixir',n:'Peacemaker Elixir',ru:'Эликсир Миротворца',img:'https://outward.wiki.gg/images/thumb/8/8e/Peacemaker_Elixir.png/150px-Peacemaker_Elixir.png',ic:'🧪',d:'+20 ко всем характеристикам (навык)',dur:'∞',wt:0.5},
{id:'fire_rag',n:'Fire Rag',ru:'Огненная Тряпка',img:'https://outward.wiki.gg/images/thumb/8/8e/Fire_Rag.png/150px-Fire_Rag.png',ic:'🔥',d:'Инфузия огня',dur:'∞',wt:0.2},
{id:'ice_rag',n:'Ice Rag',ru:'Ледяная Тряпка',img:'https://outward.wiki.gg/images/thumb/8/8e/Ice_Rag.png/150px-Ice_Rag.png',ic:'❄️',d:'Инфузия мороза',dur:'∞',wt:0.2},
{id:'bolt_rag',n:'Bolt Rag',ru:'Громовая Тряпка',img:'https://outward.wiki.gg/images/thumb/8/8e/Bolt_Rag.png/150px-Bolt_Rag.png',ic:'⚡',d:'Инфузия молнии',dur:'∞',wt:0.2},
{id:'poison_rag',n:'Poison Rag',ru:'Ядовитая Тряпка',img:'https://outward.wiki.gg/images/thumb/8/8e/Poison_Rag.png/150px-Poison_Rag.png',ic:'☠️',d:'Инфузия яда',dur:'∞',wt:0.2},
{id:'fire_varnish',n:'Fire Varnish',ru:'Огненный Лак',img:'https://outward.wiki.gg/images/thumb/8/8e/Fire_Varnish.png/150px-Fire_Varnish.png',ic:'🔥',d:'Сильная инфузия огня',dur:'∞',wt:0.5},
{id:'ice_varnish',n:'Ice Varnish',ru:'Ледяной Лак',img:'https://outward.wiki.gg/images/thumb/8/8e/Ice_Varnish.png/150px-Ice_Varnish.png',ic:'❄️',d:'Сильная инфузия мороза',dur:'∞',wt:0.5},
{id:'bolt_varnish',n:'Bolt Varnish',ru:'Громовой Лак',img:'https://outward.wiki.gg/images/thumb/8/8e/Bolt_Varnish.png/150px-Bolt_Varnish.png',ic:'⚡',d:'Сильная инфузия молнии',dur:'∞',wt:0.5},
{id:'poison_varnish',n:'Poison Varnish',ru:'Ядовитый Лак',img:'https://outward.wiki.gg/images/thumb/8/8e/Poison_Varnish.png/150px-Poison_Varnish.png',ic:'☠️',d:'Сильная инфузия яда',dur:'∞',wt:0.5},
{id:'dark_varnish',n:'Dark Varnish',ru:'Тёмный Лак',img:'https://outward.wiki.gg/images/thumb/8/8e/Dark_Varnish.png/150px-Dark_Varnish.png',ic:'🌑',d:'Инфузия разложения',dur:'∞',wt:0.5},
{id:'spiritual_varnish',n:'Spiritual Varnish',ru:'Духовный Лак',img:'https://outward.wiki.gg/images/thumb/8/8e/Spiritual_Varnish.png/150px-Spiritual_Varnish.png',ic:'✨',d:'Сильная инфузия эфира',dur:'∞',wt:0.5}
];