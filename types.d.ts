/**
 * Outward Character Builder — Type Definitions
 * Generated from outward_db.zip (outward.wiki.gg, 2026-10-25)
 */

/** Skill tier: 1=basic, 2=breakthrough, 3=advanced, special=quest/trainer */
export type Tier = 1 | 2 | 3 | 'special';

export type SkillType = 'Active' | 'Passive' | 'Toggle';

export type RequirementLogic = 'all' | 'any';

/** Structured skill requirement */
export interface SkillRequirement {
  /** Skill IDs that must be learned. Empty = no dependency. */
  skills: string[];
  /** 'all' = every skill required, 'any' = at least one */
  logic: RequirementLogic;
  /** Original wiki prereq string (for debug/display) */
  raw: string;
  /** Quest/NPC requirement (not a learnable skill) */
  quest?: string;
}

export interface SkillCost {
  /** Silver cost (0 for breakthrough/medal skills) */
  silver: number;
  /** true = costs 1 Breakthrough Point (Tier 2 only) */
  breakthrough: boolean;
}

export interface Skill {
  /** snake_case unique ID, e.g. "shamanic_resonance" */
  id: string;
  /** Display name, e.g. "Shamanic Resonance" */
  name: string;
  /** Short description */
  description: string;
  /** Full effects text (may contain wiki markup) */
  effects: string;
  tier: Tier;
  /** Parent class name, null for special skills */
  parentClass: string | null;
  skillType: SkillType;
  /** Subcategory: Boon, Hex, Infusion, etc. */
  subtype: string;
  /** Local image path */
  image: string;
  cost: SkillCost;
  requirements: SkillRequirement;
  /** For mutually exclusive Tier 3 pairs */
  exclusiveGroup?: string;
  trainer: string;
  location: string;
  isDlc: boolean;
  sourceUrl: string;
  /** Optional resource costs */
  manaCost?: string;
  staminaCost?: string;
  healthCost?: string;
  cooldown?: string;
}

/** Skill IDs grouped by tier */
export interface ClassSkills {
  tier1: string[];
  tier2: string[];
  tier3: string[];
}

export interface ClassTree {
  id: string;
  name: string;
  description: string;
  teacher: string;
  location: string;
  isDlc: boolean;
  /** false for Weapon Master / Specialist (DLC) */
  hasBreakthrough: boolean;
  image: string;
  skills: ClassSkills;
}

export interface TierInfo {
  tier: Tier;
  label: string;
  mechanics: string;
  costsBreakthrough: boolean;
  unlockRequirement?: string;
}

/** Root data structure */
export interface OutwardData {
  classes: ClassTree[];
  skills: Skill[];
  specialSkills: string[];
  tiers: TierInfo[];
}

/** Character build state */
export interface CharacterBuild {
  /** Up to 3 class IDs with Breakthrough learned */
  selectedClasses: string[];
  /** All learned skill IDs */
  skills: string[];
  /** Number of Breakthrough Points spent (max 3) */
  breakthroughPointsUsed: number;
}

/** Result of skill learnability check */
export interface ValidationResult {
  canLearn: boolean;
  /** Human-readable reasons why skill is blocked */
  reasons: string[];
  /** Skills that would be locked out if this is learned */
  conflicts: string[];
}
