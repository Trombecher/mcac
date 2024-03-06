export function createIndex<Row, Key extends keyof Row>(table: Set<Row>, index: Key) {
    const map = new Map<Row[Key], Row>();
    table.forEach(row => map.set(row[index], row));
    return map;
}

export enum ItemKind {
    Helmet = "Helmet",
    Chestplate = "Chestplate",
    Leggings = "Leggings",
    Boots = "Boots",
    Elytra = "Elytra",
    Axe = "Axe",
    Pickaxe = "Pickaxe",
    Shovel = "Shovel",
    Hoe = "Hoe",
    Sword = "Sword",
    Bow = "Bow",
    Crossbow = "Crossbow",
    Trident = "Trident",
    Shield = "Shield",
    Shears = "Shears",
    FishingRod = "Fishing Rod",
    FlintAndSteel = "Flint And Steel",
    CarrotOnAStick = "Carrot On A Stick",
    WarpedFungusOnAStick = "Warped Fungus On A Stick",
    Compass = "Compass",
    Book = "Book",
    CarvedPumpkin = "Carved Pumpkin",
    Head = "Head",
    RecoveryCompass = "Recovery Compass",
    Brush = "Brush"
}

export enum EnchantmentKind {
    // @ts-ignore
    Mending = "Mending",
    Unbreaking = "Unbreaking",
    CurseOfBinding = "Curse Of Binding",
    CurseOfVanishing = "Curse Of Vanishing",
    Protection = "Protection",
    BlastProtection = "Blast Protection",
    FireProtection = "Fire Protection",
    ProjectileProtection = "Projectile Protection",
    Thorns = "Thorns",
    Respiration = "Respiration",
    AquaAffinity = "Aqua Affinity",
    SwiftSneak = "Swift Sneak",
    DepthStrider = "Depth Strider",
    FrostWalker = "Frost Walker",
    FeatherFalling = "Feather Falling",
    SoulSpeed = "Soul Speed",
    SweepingEdge = "Sweeping Edge",
    Sharpness = "Sharpness",
    Smite = "Smite",
    BaneOfArthropods = "Bane Of Arthropods",
    Knockback = "Knockback",
    FireAspect = "Fire Aspect",
    Looting = "Looting",
    SilkTouch = "Silk Touch",
    Efficiency = "Efficiency",
    Fortune = "Fortune",
    Power = "Power",
    Punch = "Punch",
    Flame = "Flame",
    // @ts-ignore
    Infinity = "Infinity",
    LuckOfTheSea = "Luck Of The Sea",
    Lure = "Lure",
    Impaling = "Impaling",
    Riptide = "Riptide",
    Loyalty = "Loyalty",
    Channeling = "Channeling",
    Multishot = "Multishot",
    Piercing = "Piercing",
    QuickCharge = "Quick Charge",
}

export const enchantmentData: {
    [kind in EnchantmentKind]: {
        maxLevel: number,
        itemMultiplier: number,
        applicableToBookAnd: Set<ItemKind>,
        incompatibleWith: Set<EnchantmentKind>
    }
} = {
    [EnchantmentKind.FrostWalker]: {
        itemMultiplier: 4,
        maxLevel: 2,
        applicableToBookAnd: new Set([ItemKind.Boots]),
        incompatibleWith: new Set([EnchantmentKind.DepthStrider])
    },
    [EnchantmentKind.LuckOfTheSea]: {
        itemMultiplier: 4,
        maxLevel: 3,
        applicableToBookAnd: new Set([ItemKind.FishingRod]),
        incompatibleWith: new Set(),
    },
    [EnchantmentKind.ProjectileProtection]: {
        itemMultiplier: 2,
        maxLevel: 4,
        incompatibleWith: new Set([
            EnchantmentKind.Protection,
            EnchantmentKind.FireProtection,
            EnchantmentKind.BlastProtection
        ]),
        applicableToBookAnd: new Set([
            ItemKind.Helmet,
            ItemKind.Boots,
            ItemKind.Chestplate,
            ItemKind.Leggings
        ])
    },
    [EnchantmentKind.QuickCharge]: {
        itemMultiplier: 2,
        maxLevel: 3,
        applicableToBookAnd: new Set([ItemKind.Crossbow]),
        incompatibleWith: new Set()
    },
    [EnchantmentKind.SilkTouch]: {
        itemMultiplier: 8,
        maxLevel: 1,
        incompatibleWith: new Set([EnchantmentKind.Fortune]),
        applicableToBookAnd: new Set([
            ItemKind.Pickaxe,
            ItemKind.Shovel,
            ItemKind.Axe,
            ItemKind.Hoe
        ])
    },
    [EnchantmentKind.SoulSpeed]: {
        itemMultiplier: 8,
        maxLevel: 3,
        applicableToBookAnd: new Set([ItemKind.Boots]),
        incompatibleWith: new Set()
    },
    [EnchantmentKind.SweepingEdge]: {
        itemMultiplier: 4,
        maxLevel: 3,
        applicableToBookAnd: new Set([ItemKind.Sword]),
        incompatibleWith: new Set()
    },
    [EnchantmentKind.SwiftSneak]: {
        itemMultiplier: 8,
        maxLevel: 3,
        applicableToBookAnd: new Set([ItemKind.Leggings]),
        incompatibleWith: new Set()
    },
    [EnchantmentKind.Flame]: {
        itemMultiplier: 4,
        maxLevel: 1,
        incompatibleWith: new Set(),
        applicableToBookAnd: new Set([ItemKind.Bow])
    },
    [EnchantmentKind.Fortune]: {
        itemMultiplier: 4,
        maxLevel: 3,
        applicableToBookAnd: new Set([
            ItemKind.Pickaxe,
            ItemKind.Shovel,
            ItemKind.Axe,
            ItemKind.Hoe
        ]),
        incompatibleWith: new Set([EnchantmentKind.SilkTouch])
    },
    [EnchantmentKind.Impaling]: {
        itemMultiplier: 4,
        maxLevel: 5,
        incompatibleWith: new Set(),
        applicableToBookAnd: new Set([ItemKind.Trident])
    },
    [EnchantmentKind.Infinity]: {
        itemMultiplier: 8,
        maxLevel: 1,
        applicableToBookAnd: new Set([ItemKind.Bow]),
        incompatibleWith: new Set([EnchantmentKind.Mending])
    },
    [EnchantmentKind.Knockback]: {
        itemMultiplier: 2,
        maxLevel: 2,
        incompatibleWith: new Set(),
        applicableToBookAnd: new Set([ItemKind.Sword])
    },
    [EnchantmentKind.Looting]: {
        itemMultiplier: 4,
        maxLevel: 3,
        applicableToBookAnd: new Set([ItemKind.Sword]),
        incompatibleWith: new Set()
    },
    [EnchantmentKind.Loyalty]: {
        itemMultiplier: 1,
        maxLevel: 3,
        applicableToBookAnd: new Set([ItemKind.Trident]),
        incompatibleWith: new Set([EnchantmentKind.Riptide])
    },
    [EnchantmentKind.Lure]: {
        itemMultiplier: 4,
        maxLevel: 3,
        applicableToBookAnd: new Set([ItemKind.FishingRod]),
        incompatibleWith: new Set()
    },
    [EnchantmentKind.Mending]: {
        itemMultiplier: 4,
        maxLevel: 1,
        incompatibleWith: new Set([EnchantmentKind.Infinity]),
        applicableToBookAnd: new Set([
            ItemKind.Sword,
            ItemKind.Pickaxe,
            ItemKind.Shovel,
            ItemKind.Axe,
            ItemKind.Hoe,
            ItemKind.FishingRod,
            ItemKind.Helmet,
            ItemKind.Chestplate,
            ItemKind.Leggings,
            ItemKind.Boots,
            ItemKind.Bow,
            ItemKind.Shears,
            ItemKind.FlintAndSteel,
            ItemKind.CarrotOnAStick,
            ItemKind.WarpedFungusOnAStick,
            ItemKind.Shield,
            ItemKind.Elytra,
            ItemKind.Trident,
            ItemKind.Crossbow,
            ItemKind.Brush
        ])
    },
    [EnchantmentKind.Multishot]: {
        itemMultiplier: 4,
        maxLevel: 1,
        applicableToBookAnd: new Set([ItemKind.Crossbow]),
        incompatibleWith: new Set([EnchantmentKind.Piercing]),
    },
    [EnchantmentKind.Piercing]: {
        itemMultiplier: 1,
        maxLevel: 4,
        incompatibleWith: new Set([EnchantmentKind.Multishot]),
        applicableToBookAnd: new Set([ItemKind.Crossbow])
    },
    [EnchantmentKind.Power]: {
        itemMultiplier: 1,
        maxLevel: 5,
        applicableToBookAnd: new Set([ItemKind.Bow]),
        incompatibleWith: new Set()
    },
    [EnchantmentKind.Protection]: {
        itemMultiplier: 1,
        maxLevel: 4,
        incompatibleWith: new Set([
            EnchantmentKind.BlastProtection,
            EnchantmentKind.FireProtection,
            EnchantmentKind.ProjectileProtection
        ]),
        applicableToBookAnd: new Set([
            ItemKind.Helmet,
            ItemKind.Chestplate,
            ItemKind.Leggings,
            ItemKind.Boots
        ])
    },
    [EnchantmentKind.Punch]: {
        itemMultiplier: 4,
        maxLevel: 2,
        applicableToBookAnd: new Set([ItemKind.Bow]),
        incompatibleWith: new Set()
    },
    [EnchantmentKind.Respiration]: {
        itemMultiplier: 4,
        maxLevel: 3,
        applicableToBookAnd: new Set([ItemKind.Helmet]),
        incompatibleWith: new Set()
    },
    [EnchantmentKind.Riptide]: {
        itemMultiplier: 4,
        maxLevel: 3,
        applicableToBookAnd: new Set([ItemKind.Trident]),
        incompatibleWith: new Set([
            EnchantmentKind.Loyalty,
            EnchantmentKind.Channeling
        ])
    },
    [EnchantmentKind.Sharpness]: {
        itemMultiplier: 1,
        maxLevel: 5,
        incompatibleWith: new Set([
            EnchantmentKind.Smite,
            EnchantmentKind.BaneOfArthropods
        ]),
        applicableToBookAnd: new Set([
            ItemKind.Sword,
            ItemKind.Axe
        ])
    },
    [EnchantmentKind.Smite]: {
        maxLevel: 5,
        itemMultiplier: 2,
        applicableToBookAnd: new Set([
            ItemKind.Sword,
            ItemKind.Axe
        ]),
        incompatibleWith: new Set([
            EnchantmentKind.Sharpness,
            EnchantmentKind.BaneOfArthropods
        ])
    },
    [EnchantmentKind.Thorns]: {
        maxLevel: 3,
        itemMultiplier: 8,
        incompatibleWith: new Set(),
        applicableToBookAnd: new Set([
            ItemKind.Helmet,
            ItemKind.Chestplate,
            ItemKind.Leggings,
            ItemKind.Boots
        ])
    },
    [EnchantmentKind.Unbreaking]: {
        itemMultiplier: 2,
        maxLevel: 3,
        applicableToBookAnd: new Set([
            ItemKind.Sword,
            ItemKind.Pickaxe,
            ItemKind.Shovel,
            ItemKind.Axe,
            ItemKind.Hoe,
            ItemKind.FishingRod,
            ItemKind.Helmet,
            ItemKind.Chestplate,
            ItemKind.Leggings,
            ItemKind.Boots,
            ItemKind.Bow,
            ItemKind.Shears,
            ItemKind.FlintAndSteel,
            ItemKind.CarrotOnAStick,
            ItemKind.WarpedFungusOnAStick,
            ItemKind.Shield,
            ItemKind.Elytra,
            ItemKind.Trident,
            ItemKind.Crossbow,
            ItemKind.Brush
        ]),
        incompatibleWith: new Set()
    },
    [EnchantmentKind.AquaAffinity]: {
        maxLevel: 1,
        itemMultiplier: 4,
        incompatibleWith: new Set(),
        applicableToBookAnd: new Set([ItemKind.Helmet])
    },
    [EnchantmentKind.BaneOfArthropods]: {
        maxLevel: 5,
        itemMultiplier: 2,
        applicableToBookAnd: new Set([
            ItemKind.Sword,
            ItemKind.Axe
        ]),
        incompatibleWith: new Set([
            EnchantmentKind.Smite,
            EnchantmentKind.Sharpness
        ])
    },
    [EnchantmentKind.BlastProtection]: {
        maxLevel: 4,
        itemMultiplier: 4,
        incompatibleWith: new Set([
            EnchantmentKind.Protection,
            EnchantmentKind.ProjectileProtection,
            EnchantmentKind.FireProtection
        ]),
        applicableToBookAnd: new Set([
            ItemKind.Helmet,
            ItemKind.Chestplate,
            ItemKind.Leggings,
            ItemKind.Boots
        ])
    },
    [EnchantmentKind.Channeling]: {
        maxLevel: 1,
        itemMultiplier: 8,
        applicableToBookAnd: new Set([ItemKind.Trident]),
        incompatibleWith: new Set([EnchantmentKind.Riptide])
    },
    [EnchantmentKind.CurseOfBinding]: {
        maxLevel: 1,
        itemMultiplier: 8,
        incompatibleWith: new Set(),
        applicableToBookAnd: new Set([
            ItemKind.Helmet,
            ItemKind.Chestplate,
            ItemKind.Leggings,
            ItemKind.Boots,
            ItemKind.Elytra,
            ItemKind.CarvedPumpkin,
            ItemKind.Head
        ])
    },
    [EnchantmentKind.CurseOfVanishing]: {
        maxLevel: 1,
        itemMultiplier: 8,
        applicableToBookAnd: new Set([
            ItemKind.Sword,
            ItemKind.Pickaxe,
            ItemKind.Shovel,
            ItemKind.Axe,
            ItemKind.Hoe,
            ItemKind.FishingRod,
            ItemKind.Helmet,
            ItemKind.Chestplate,
            ItemKind.Leggings,
            ItemKind.Boots,
            ItemKind.Bow,
            ItemKind.Shears,
            ItemKind.FlintAndSteel,
            ItemKind.CarrotOnAStick,
            ItemKind.WarpedFungusOnAStick,
            ItemKind.Shield,
            ItemKind.Elytra,
            ItemKind.Trident,
            ItemKind.Crossbow,
            ItemKind.CarvedPumpkin,
            ItemKind.Head,
            ItemKind.Compass,
            ItemKind.RecoveryCompass,
            ItemKind.Brush
        ]),
        incompatibleWith: new Set()
    },
    [EnchantmentKind.DepthStrider]: {
        maxLevel: 3,
        itemMultiplier: 4,
        incompatibleWith: new Set([EnchantmentKind.FrostWalker]),
        applicableToBookAnd: new Set([ItemKind.Boots])
    },
    [EnchantmentKind.Efficiency]: {
        maxLevel: 5,
        itemMultiplier: 1,
        applicableToBookAnd: new Set([
            ItemKind.Pickaxe,
            ItemKind.Shovel,
            ItemKind.Axe,
            ItemKind.Hoe,
            ItemKind.Shears
        ]),
        incompatibleWith: new Set()
    },
    [EnchantmentKind.FeatherFalling]: {
        maxLevel: 4,
        itemMultiplier: 2,
        applicableToBookAnd: new Set([ItemKind.Boots]),
        incompatibleWith: new Set(),
    },
    [EnchantmentKind.FireAspect]: {
        maxLevel: 2,
        itemMultiplier: 4,
        incompatibleWith: new Set(),
        applicableToBookAnd: new Set([ItemKind.Sword])
    },
    [EnchantmentKind.FireProtection]: {
        maxLevel: 4,
        itemMultiplier: 2,
        applicableToBookAnd: new Set([
            ItemKind.Helmet,
            ItemKind.Chestplate,
            ItemKind.Leggings,
            ItemKind.Boots
        ]),
        incompatibleWith: new Set([
            EnchantmentKind.Protection,
            EnchantmentKind.BlastProtection,
            EnchantmentKind.ProjectileProtection
        ])
    }
};

export const enchantmentsApplicableToItem = new Map<ItemKind, Set<EnchantmentKind>>();
Object.keys(enchantmentData).forEach(enchantmentKind => {
    enchantmentData[enchantmentKind as EnchantmentKind].applicableToBookAnd.forEach(itemKind => {
        const set = enchantmentsApplicableToItem.get(itemKind) || new Set();
        set.add(enchantmentKind as EnchantmentKind);
        enchantmentsApplicableToItem.set(itemKind, set);
    });
});
enchantmentsApplicableToItem.set(ItemKind.Book, new Set(Object.keys(enchantmentData) as EnchantmentKind[]))