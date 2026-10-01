import React, { useState, useEffect } from 'react';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// إعداد اتصال قاعدة البيانات باستخدام الرابط والمفتاح الخاصين بمشروعك
const supabaseUrl = 'https://dbirhmmmsuupxlgssmaj.supabase.co';
const supabaseAnonKey = 'sb_publishable_elnwKhu3CG-QucLSudz9tA_1PruPFrS';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function StudentDashboard() {
  const [isArabic, setIsArabic] = useState(true);
  
  // حالات تفاعلية لجلب المستحقات من قاعدة البيانات
  const [sessionCost, setSessionCost] = useState(0); 
  const [isLoading, setIsLoading] = useState(true);

  // وظيفة جلب البيانات تلقائياً بمجرد فتح الطالب للوحة التحكم
  useEffect(() => {
    async function fetchLatestSession() {
      try {
        // جلب أحدث تكلفة حصة تم حسابها من جدول sessions
        const { data, error } = await supabase
          .from('sessions')
          .select('calculated_cost')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;
        
        // إذا وجد بيانات، قم بتحديث المبلغ في الشاشة
        if (data && data.length > 0) {
          setSessionCost(data[0].calculated_cost);
        }
      } catch (error) {
        console.error('حدث خطأ أثناء الاتصال بقاعدة البيانات:', error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLatestSession();
  }, []);

  return (
    <div className={`min-h-screen bg-gray-50 p-6 ${isArabic ? 'rtl text-right' : 'ltr text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isArabic ? 'أكاديمية Jebali للرياضيات' : 'Jebali Math Academy'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isArabic ? 'لوحة متابعة الطالب: أحمد سيد' : 'Student Dashboard: Ahmed Sayed'}
          </p>
        </div>
        <button 
          onClick={() => setIsArabic(!isArabic)} 
          className="px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition"
        >
          {isArabic ? 'English' : 'العربية'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-orange-500 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-2 py-1 rounded">
              {isArabic ? 'المستحقات المالية والتسديد' : 'Billing & Invoice'}
            </span>
            <h3 className="text-3xl font-extrabold text-gray-800 mt-4">
              {isLoading ? '...' : `${sessionCost} EGP`}
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              {isArabic ? 'حصة اليوم: (قيد الانتظار)' : 'Today\'s Session (Unpaid)'}
            </p>
          </div>
          <a 
            href="https://ipn.eg" 
            target="_blank" 
            rel="noreferrer"
            className="w-full text-center py-3 mt-6 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-md shadow-orange-100"
          >
            {isArabic ? 'سداد فوري عبر InstaPay' : 'Pay via InstaPay'}
          </a>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500 lg:col-span-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded">
            {isArabic ? 'مؤشر إنجاز المنهج الكلي' : 'Overall Curriculum Progress'}
          </span>
          <div className="flex justify-between items-center mt-4 mb-2">
            <span className="text-sm font-bold text-gray-700">Unit 1: Numbers (IGCSE Year 9)</span>
            <span className="text-sm font-bold text-emerald-600">20%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '20%' }}></div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm font-medium text-gray-700">Place value up to billion (NUM-01)</span>
              <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg">
                {isArabic ? 'مكتمل وتحت التقييم' : 'Completed / Evaluating'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
