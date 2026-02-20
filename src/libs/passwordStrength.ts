//Files: src/libs/passwordStrength.ts

/* =====================================================
 * PASSWORD STRENGTH UTILITY
 ===================================================== */

type StrengthLevel = "weak" | "medium" | "strong" | "very-strong";

interface PasswordStrength {
    score: number;
    level: StrengthLevel;
    checks: {
        length: boolean;
        lowercase: boolean;
        uppercase: boolean;
        number: boolean;
        symbol: boolean;
    };
}

const getPasswordStrength = (password: string): PasswordStrength => {
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;

    let level: StrengthLevel = "weak";

    if (score >= 5) level = "very-strong";
    else if (score === 4) level = "strong";
    else if (score === 3) level = "medium";

    return { score, level, checks };
};