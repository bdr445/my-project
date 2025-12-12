// functions/index.js

const functions = require('firebase-functions');
// نحتاج مكتبة node-fetch لإرسال طلب التحقق إلى Google.
const fetch = require('node-fetch');
const logger = require('firebase-functions/logger');

// إعداد خيارات عامة للدوال
functions.setGlobalOptions({ maxInstances: 10 });


// 🚨🚨 إعدادات reCAPTCHA السرية 🚨🚨

// جلب المفتاح السري باستخدام functions.config() (الطريقة القديمة التي ستتوقف في مارس 2026)
// يجب تعيين هذا السر عبر الأمر: firebase functions:config:set recaptcha.secret="YOUR_SECRET_KEY"
const RECAPTCHA_SECRET_KEY = functions.config().recaptcha?.secret;

// معرف مشروعك في Firebase (كما هو)
const PROJECT_ID = 'to-do-for-school-ee688';


// ----------------------------------------------------------------------
// دالة التحقق من reCAPTCHA Enterprise
// ----------------------------------------------------------------------
// هذه الدالة قابلة للاستدعاء من ملف login.js في المتصفح.
exports.verifyRecaptcha = functions.https.onCall(async (data, context) => {

    // 1. استلام البيانات من المتصفح
    const { recaptchaToken, action } = data;

    if (!RECAPTCHA_SECRET_KEY) {
        logger.error("RECAPTCHA Secret Key is missing from configuration. Run 'firebase functions:config:set'.");
        // إرجاع خطأ آمن للمتصفح
        throw new functions.https.HttpsError('internal', 'Internal server configuration error.');
    }

    // 2. تجهيز الطلب لواجهة برمجة تطبيقات reCAPTCHA Enterprise
    const recaptchaUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/${PROJECT_ID}/assessments?key=${RECAPTCHA_SECRET_KEY}`;

    try {
        const recaptchaResponse = await fetch(recaptchaUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event: {
                    token: recaptchaToken,
                    siteKey: '6LdxliUsAAAAAOH1QPdoEBa4nYH1qips2gVvbXTt', // مفتاح الموقع العام
                    expectedAction: action // 'login' أو 'signup'
                }
            })
        });

        const recaptchaResult = await recaptchaResponse.json();

        // 3. تحليل النتيجة
        const score = recaptchaResult.riskAnalysis?.score;
        const isValid = recaptchaResult.tokenProperties?.valid;

        // التحقق من صحة الرمز ومن أن درجة الأمان مقبولة (0.7 هو الحد الأدنى المقترح)
        if (isValid && score >= 0.7) {
            logger.info(`reCAPTCHA Success. Action: ${action}, Score: ${score}`);
            return { success: true };
        } else {
            // تسجيل محاولة البوت المحظورة
            logger.warn(`Blocked Bot Attempt! Action: ${action}, Score: ${score}, Reasons: ${recaptchaResult.riskAnalysis?.reasons?.join(', ')}`);
            // إرجاع فشل لإيقاف عملية تسجيل الدخول في المتصفح
            return { success: false, score: score };
        }

    } catch (error) {
        logger.error("Error during reCAPTCHA verification:", error);
        // إرجاع خطأ عام بدلاً من إظهار تفاصيل الخطأ للمستخدم
        throw new functions.https.HttpsError('internal', 'Security check failed due to a server error.');
    }
});