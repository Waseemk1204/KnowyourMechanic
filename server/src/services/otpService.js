// OTP Service - Handles sending OTPs via SMS
// In development (mock mode), OTPs are logged to console

const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
};

const sendOTP = async (phone, otp, message) => {
    const mode = process.env.OTP_MODE || 'mock';

    if (mode === 'mock') {
        // Development mode - log to console
        console.log('\n' + '='.repeat(50));
        console.log('📱 MOCK OTP SERVICE');
        console.log('='.repeat(50));
        console.log(`Phone: ${phone}`);
        console.log(`OTP: ${otp}`);
        console.log(`Message: ${message}`);
        console.log('='.repeat(50) + '\n');
        return { success: true, mock: true };
    }

    // TODO: Implement real OTP sending via MSG91/Twilio
    // For now, throw error if not in mock mode
    throw new Error('Real OTP sending not implemented yet');
};

export const sendLoginOTP = async (phone) => {
    const otp = generateOTP();
    const message = `Your KnowyourMechanic login OTP is: ${otp}. Valid for 10 minutes.`;
    await sendOTP(phone, otp, message);
    return otp;
};

export const sendServiceVerificationOTP = async (phone, garageName, description, amount) => {
    const otp = generateOTP();
    const message = `KnowyourMechanic: ${garageName} has added a service for you.\n\nService: ${description}\nAmount: ₹${amount}\n\nIf correct, share this OTP with your mechanic: ${otp}\n\nDo NOT share if incorrect.`;
    await sendOTP(phone, otp, message);
    return otp;
};

export default {
    generateOTP,
    sendLoginOTP,
    sendServiceVerificationOTP
};
