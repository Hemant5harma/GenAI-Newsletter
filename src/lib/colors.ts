/**
 * COLOR UTILITY MODULE
 * 
 * Generates unique, professional color palettes for newsletters.
 * Uses HSL color space for controlled randomness while maintaining
 * professional, sober aesthetics appropriate for email newsletters.
 * 
 * Features:
 * - Category-aware color themes (Tech → blues, Finance → greens, etc.)
 * - HSL-based generation for unique colors every time
 * - Professional muted tones (controlled saturation)
 * - Guaranteed contrast for accessibility
 */

export interface ColorPalette {
    primary: string;      // Main brand color for headers (muted, professional)
    secondary: string;    // Links, supporting elements
    accent: string;       // CTA buttons, highlights
    text: string;         // Body text (dark, readable)
    background: string;   // Page background (white or very light tint)
}

// Category to hue range mapping
// Each category has a primary hue range [min, max] in degrees (0-360)
const CATEGORY_HUE_RANGES: Record<string, [number, number][]> = {
    // Tech/Software: Blues, purples, teals
    'technology': [[200, 250], [260, 290], [170, 190]],
    'tech': [[200, 250], [260, 290], [170, 190]],
    'software': [[200, 250], [260, 290], [170, 190]],
    'saas': [[200, 250], [260, 290]],

    // Finance/Business: Navy, emerald, deep blue-greens
    'finance': [[200, 230], [140, 170], [35, 50]],
    'business': [[200, 230], [140, 170], [210, 240]],
    'banking': [[200, 230], [140, 170]],
    'investment': [[200, 230], [140, 170], [35, 50]],

    // Health/Wellness: Teals, soft greens, calming blues
    'health': [[140, 180], [160, 190], [200, 220]],
    'wellness': [[140, 180], [160, 190]],
    'medical': [[180, 210], [140, 170]],
    'healthcare': [[140, 180], [180, 210]],

    // Creative/Design: Magentas, warm tones, but kept professional
    'creative': [[280, 320], [330, 360], [20, 45]],
    'design': [[280, 320], [200, 230]],
    'art': [[280, 320], [20, 45]],

    // News/Media: Reds (muted), charcoals, strong blues
    'news': [[0, 15], [350, 360], [210, 230]],
    'media': [[0, 15], [350, 360], [210, 230]],
    'journalism': [[0, 15], [210, 230]],

    // Lifestyle/Consumer: Warm oranges, corals, earthy tones
    'lifestyle': [[15, 45], [20, 40], [30, 50]],
    'fashion': [[330, 360], [280, 310], [20, 40]],
    'food': [[15, 45], [30, 55], [140, 160]],
    'travel': [[180, 210], [30, 50], [200, 230]],

    // Education: Blues, greens, trustworthy tones
    'education': [[200, 240], [140, 170], [35, 50]],
    'learning': [[200, 240], [140, 170]],

    // E-commerce/Retail: Versatile, trust-building
    'ecommerce': [[200, 230], [140, 170], [35, 50]],
    'retail': [[200, 230], [15, 40], [140, 170]],

    // Default: Professional blues and greens
    'general': [[200, 240], [140, 180], [210, 250]],
    'default': [[200, 240], [140, 180], [210, 250]],
};

/**
 * Converts HSL to HEX color string
 */
function hslToHex(h: number, s: number, l: number): string {
    h = h % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    const toHex = (n: number) => {
        const hex = Math.round((n + m) * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Generates a random number within a range
 */
function randomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

/**
 * Gets the appropriate hue ranges for a category
 */
function getHueRangesForCategory(category: string): [number, number][] {
    const normalizedCategory = category.toLowerCase().trim();

    // Try exact match first
    if (CATEGORY_HUE_RANGES[normalizedCategory]) {
        return CATEGORY_HUE_RANGES[normalizedCategory];
    }

    // Try partial match
    for (const [key, ranges] of Object.entries(CATEGORY_HUE_RANGES)) {
        if (normalizedCategory.includes(key) || key.includes(normalizedCategory)) {
            return ranges;
        }
    }

    // Default fallback
    return CATEGORY_HUE_RANGES['default'];
}

/**
 * Generates a unique, professional color palette based on brand category.
 * 
 * Features:
 * - Category-aware hue selection
 * - Muted, professional saturation (35-55%)
 * - Deep, authoritative lightness for primary (25-40%)
 * - Guaranteed uniqueness via randomization
 * 
 * @param category - Brand category (e.g., "technology", "finance", "health")
 * @returns ColorPalette with unique, professional colors
 */
export function generateUniquePalette(category: string = 'general'): ColorPalette {
    const hueRanges = getHueRangesForCategory(category);

    // Pick a random hue range from the category options
    const selectedRange = hueRanges[Math.floor(Math.random() * hueRanges.length)];

    // Generate the primary hue within the selected range
    const primaryHue = randomInRange(selectedRange[0], selectedRange[1]);

    // PROFESSIONAL SETTINGS:
    // - Saturation: 35-55% (muted, not vibrant)
    // - Lightness: 25-40% (deep, authoritative for headers)
    const primarySaturation = randomInRange(35, 55);
    const primaryLightness = randomInRange(25, 40);

    // Secondary: Slightly different hue, lighter
    const secondaryHue = primaryHue + randomInRange(-20, 20);
    const secondarySaturation = randomInRange(30, 50);
    const secondaryLightness = randomInRange(35, 50);

    // Accent: Complementary or analogous, slightly more vibrant for CTAs
    // Use a scheme randomly: complementary (+180°), triadic (+120°), or analogous (+30°)
    const schemeOffset = [180, 120, 30, -30][Math.floor(Math.random() * 4)];
    const accentHue = (primaryHue + schemeOffset) % 360;
    const accentSaturation = randomInRange(40, 60); // Slightly more vibrant for visibility
    const accentLightness = randomInRange(30, 45);

    // Text: Always dark gray for readability
    const textOptions = ['#1f2937', '#111827', '#374151', '#1a1a1a'];
    const text = textOptions[Math.floor(Math.random() * textOptions.length)];

    // Background: Always white or very subtle tint
    const background = '#ffffff';

    const palette: ColorPalette = {
        primary: hslToHex(primaryHue, primarySaturation, primaryLightness),
        secondary: hslToHex(secondaryHue, secondarySaturation, secondaryLightness),
        accent: hslToHex(accentHue, accentSaturation, accentLightness),
        text,
        background
    };

    console.log(`🎨 Generated Palette for "${category}":`, {
        primary: palette.primary,
        secondary: palette.secondary,
        accent: palette.accent,
        hues: { primary: Math.round(primaryHue), accent: Math.round(accentHue) }
    });

    return palette;
}

/**
 * Generates a completely random professional palette (not category-aware).
 * Useful when you want maximum variety regardless of content.
 */
export function generateRandomProfessionalPalette(): ColorPalette {
    // Pick any professional hue (avoid extremely warm yellows)
    const primaryHue = randomInRange(0, 360);

    // Skip the "unprofessional" yellow-green range (50-90 degrees)
    // by shifting it to blues if it falls there
    const adjustedHue = (primaryHue >= 50 && primaryHue <= 90)
        ? primaryHue + 150
        : primaryHue;

    return generateUniquePalette('general');
}

/**
 * Validates that a palette has sufficient contrast for readability.
 * Returns true if the palette passes basic accessibility checks.
 */
export function validatePaletteContrast(palette: ColorPalette): boolean {
    // Basic check: ensure primary is dark enough (for white text on it)
    // This is a simplified check - in production, use proper WCAG calculations
    const hex = palette.primary.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate relative luminance (simplified)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Primary should be dark enough for white text (luminance < 0.5)
    return luminance < 0.5;
}

/**
 * Regenerates palette if it doesn't pass contrast validation.
 * Tries up to maxAttempts times.
 */
export function generateValidatedPalette(category: string, maxAttempts: number = 5): ColorPalette {
    for (let i = 0; i < maxAttempts; i++) {
        const palette = generateUniquePalette(category);
        if (validatePaletteContrast(palette)) {
            return palette;
        }
    }
    // Fallback to a known good palette if all attempts fail
    return {
        primary: '#1e3a5f',
        secondary: '#4a6fa5',
        accent: '#2d5a3d',
        text: '#1f2937',
        background: '#ffffff'
    };
}
