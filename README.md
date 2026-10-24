# Outward Character Builder

Character builder for **Outward Definitive Edition**. Plan your build, manage Breakthrough Points, and explore skill trees.

## Features

- **13 classes** (8 base + 5 DLC) with full skill trees
- **164 skills** with prerequisites, tiers, and costs
- **Breakthrough Point tracking** (3 per character, permanent)
- **Mutually exclusive skill pairs** (Tier 3 choices)
- **Special skills** — quest rewards, trainer skills, faction skills
- **Mobile-friendly** — touch-optimized UI, responsive layout
- **Undo/Redo** — full history support
- **Export/Import** — share builds as JSON

## Quick Start

```bash
# Serve locally (required for data loading)
cd outward_builder
python -m http.server 8080
# Open http://localhost:8080
```

Or deploy to GitHub Pages / any static host.

## Project Structure

```
outward_builder/
├── index.html              # Entry point
├── style.css               # Mobile-first responsive styles
├── types.d.ts              # TypeScript type definitions
├── data/
│   └── skills.json         # Parsed game data (164 skills, 13 classes)
├── images/                 # 177 skill/class icons
└── js/
    ├── validation.js       # Skill learnability checks
    ├── state.js            # Build state, undo/redo, import/export
    ├── main.js             # App initialization
    └── ui/
        └── skillTree.js    # Skill tree rendering, tooltips
```

## Data Source

Parsed from [outward.wiki.gg](https://outward.wiki.gg) via MediaWiki API. See `data/skills.json` for structured data.

## Game Mechanics

| Tier | Description |
|------|-------------|
| **Tier 1** | Basic skills (50–100 silver), no restrictions |
| **Tier 2** | Breakthrough — costs 1 of 3 Breakthrough Points, permanent |
| **Tier 3** | Advanced — requires Tier 2 in same tree, paired choices are mutually exclusive |
| **Special** | Quest rewards, trainer skills, faction skills (no class required) |

**Weapon Master** and **Specialist** (DLC) have no Breakthrough — all skills available after unlocking the teacher.

## Mobile Controls

| Action | Desktop | Mobile |
|--------|---------|--------|
| Learn/unlearn skill | Click | Double-tap |
| View skill details | Hover | Single tap |
| Close tooltip | Move mouse away | Tap outside |

## License

Game data © Nine Dots Studio. Code is MIT licensed.
