// Shared API Key Manager for Round-Robin Load Balancing
// This ensures all API routes use the same rotation

const GEMINI_API_KEYS = [
    "AIzaSyBywGVFyHsJH1l29miHTiX_nowKeavqve8",  // Key 1
    "AIzaSyChZhUPKM99U_ekJu8UPNShacJ0gwD-_g0",  // Key 2
    "AIzaSyDpUSHlde4Oc3Nd0dSoj37TYpD6BKXL4IE",  // Key 3
    "AIzaSyCiDUXc40WhItCeIHDZUCDJFfrerRl6KoI",  // Key 4
    "AIzaSyCamgSamyMltpFrvbbVhrphLzR4roeTSIg",  // Key 5
    "AIzaSyBHG9ssXEN9wjz_8e3-e3voJ-QwUkgJnF0",  // Key 6
    "AIzaSyCBAqUNj7PPrPYLtzDwtJLmuzs79yDwD74",  // Key 7
];

// In-memory counter persists across requests in same server instance
let currentKeyIndex = 0;

export const getNextApiKey = () => {
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
