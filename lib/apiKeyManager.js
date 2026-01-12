// Shared API Key Manager for Round-Robin Load Balancing
// API keys are loaded from environment variables for security

// Load API keys from environment variables
const GEMINI_API_KEYS = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
    process.env.GEMINI_API_KEY_5,
    process.env.GEMINI_API_KEY_6,
    process.env.GEMINI_API_KEY_7,
].filter(Boolean); // Remove any undefined keys

// In-memory counter persists across requests in same server instance
let currentKeyIndex = 0;

export const getNextApiKey = () => {
    if (GEMINI_API_KEYS.length === 0) {
        console.error("[API Key Manager] No API keys configured!");
        return null;
    }
    const key = GEMINI_API_KEYS[currentKeyIndex];
    const keyNum = currentKeyIndex + 1;
    currentKeyIndex = (currentKeyIndex + 1) % GEMINI_API_KEYS.length;
    console.log(`[API Key Manager] Using Key #${keyNum} of ${GEMINI_API_KEYS.length}`);
    return key;
};

export const getCurrentKeyInfo = () => ({
    currentIndex: currentKeyIndex,
    totalKeys: GEMINI_API_KEYS.length
});
