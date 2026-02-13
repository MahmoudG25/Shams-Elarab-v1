import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa6';
import ProductSummaryCard from '../../components/checkout/ProductSummaryCard';
import CloudAccessCard from '../../components/checkout/CloudAccessCard';
import { courseService } from '../../services/courseService';
import { roadmapService } from '../../services/roadmapService';

const OrderSuccess = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchOrderAndProduct = async () => {
      // Try to get order from state, otherwise fallback to local storage (latest order)
      let foundOrder = location.state?.order;
      if (!foundOrder) {
        const orders = JSON.parse(localStorage.getItem('shams_orders') || '[]');
        if (orders.length > 0) {
          foundOrder = orders[orders.length - 1];
        }
      }
      setOrder(foundOrder);

      if (foundOrder) {
        try {
          let fetchedProduct = null;
          if (foundOrder.productType === 'course') {
            fetchedProduct = await courseService.getCourseById(foundOrder.productId);
          } else if (foundOrder.productType === 'track') {
            fetchedProduct = await roadmapService.getRoadmapById(foundOrder.productId);
          }
          setProduct(fetchedProduct);
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      }
    };
    fetchOrderAndProduct();
  }, [location.state]);

  if (!order || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link to="/" className="text-primary hover:underline">العودة للرئيسية</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-alt pt-28 pb-12 px-4">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Success Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <FaCheck className="text-5xl text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-heading-brown mb-4">
            تمت عملية الشراء بنجاح
          </h1>
          <p className="text-lg text-gray-500 flex items-center justify-center gap-2">
            شكراً لانضمامك إلينا. تفاصيل طلبك
            <span className="font-bold bg-white border border-gray-200 px-3 py-1 rounded-lg text-sm mx-1">#{order.orderId}</span>
            تم إرسالها إلى بريدك الإلكتروني.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cloud Access - Takes 2/3 width on large screens */}
          <div className="lg:col-span-2 order-2 lg:order-1 animate-fade-in-up delay-100">
            <CloudAccessCard />
          </div>

          {/* Product Summary - Takes 1/3 width */}
          <div className="order-1 lg:order-2 animate-fade-in-up delay-200">
            {/* We need to extract the card content logic or make ProductSummaryCard completely dynamic. 
                            If ProductSummaryCard was purely presentational, we could pass props.
                            Let's assume we update ProductSummaryCard to take props, OR we create a wrapper. 
                            Actually, I should update ProductSummaryCard to take 'product' as prop.
                        */}
            <ProductSummaryCardWrapper product={product} type={order.productType} />
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>هل تواجه مشكلة في الوصول للمحتوى؟</p>
          <button className="text-primary font-bold hover:underline mt-2 flex items-center justify-center gap-2 mx-auto">
            <span className="material-symbols-outlined text-lg">support_agent</span>
            تواصل مع فريق الدعم الفني
          </button>
          <p className="mt-8 text-xs text-gray-400">© 2026 منصة شمس العرب التعليمية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </div>
  );
};

// Wrapper or modified component. Since I can't modify ProductSummaryCard in the same tool call easily without risk (it's separate file), 
// I'll create a local version or assume ProductSummaryCard will be updated. 
// Ideally I should update ProductSummaryCard.jsx to accept props. 
// For now, I will modify ProductSummaryCard in the next step to accept props, 
// and here I will use it as if it accepts them.
// Wait, I can define a local functional component if I want, but better to use the imported one.
// Let's pass the product prop to ProductSummaryCard.

const ProductSummaryCardWrapper = ({ product, type }) => {
  // This is just a placeholder to show intent. 
  // I will actually pass these props to the real ProductSummaryCard in the JSX above.
  return <ProductSummaryCard product={product} type={type} />;
};


export default OrderSuccess;
