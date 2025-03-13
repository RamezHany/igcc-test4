// وقت انتهاء الجلسة (30 دقيقة = 1800000 مللي ثانية)
const SESSION_DURATION = 1800000;

// التحقق من حالة تسجيل الدخول
function checkAuthentication() {
    const authenticated = localStorage.getItem('adminAuthenticated');
    const loginTime = localStorage.getItem('adminLoginTime');
    const currentTime = new Date().getTime();
    
    // إذا لم يكن المستخدم مسجل دخوله أو انتهت صلاحية الجلسة
    if (authenticated !== 'true' || !loginTime || (currentTime - loginTime) > SESSION_DURATION) {
        // إزالة بيانات الجلسة القديمة
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminLoginTime');
        
        // توجيه المستخدم إلى صفحة تسجيل الدخول
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// تحديث وقت الجلسة عند كل نشاط للمستخدم
function refreshSession() {
    if (localStorage.getItem('adminAuthenticated') === 'true') {
        const currentTime = new Date().getTime();
        const loginTime = parseInt(localStorage.getItem('adminLoginTime'));
        
        // إذا كان الوقت المتبقي أقل من 5 دقائق، قم بتحديث وقت الجلسة
        if ((currentTime - loginTime) > (SESSION_DURATION - 300000)) {
            localStorage.setItem('adminLoginTime', currentTime);
        }
    }
}

// التحقق عند تحميل الصفحة
window.addEventListener('load', function() {
    checkAuthentication();
    
    // تحديث الجلسة عند تفاعل المستخدم مع الصفحة
    ['click', 'mousemove', 'keypress'].forEach(function(event) {
        document.addEventListener(event, refreshSession);
    });
});
