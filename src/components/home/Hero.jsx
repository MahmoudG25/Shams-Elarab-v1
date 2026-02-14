import React from 'react';
import { Link } from 'react-router-dom';

// Use placeholders or imported images. Using placeholders for demonstration if actual assets aren't all available,
// or we can reuse the same image multiple times to simulate the effect.
const sliderImages = [
  // Column 1
  [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBTKmWhez9b101sSoIDiSGoQ4OzhrimMSQtb_PJbzgpnGBdLWWqm8wp-_e7Ed9gB1UUPm-GsLQf_LqdWUmi_-pVNfvqpVdU9KRqWnUUjcAoG3u_V1L6_C6nNoTpd2GcbjJcLj5DoH5Rfn4lvx2DlM1j9SO8GrZNcRHlDdGQ1VtxZla5RX1UDtSe9FLQdpo6lk8Z6Xpexf8OvSvTTI_a70b_dfC2eWZa5fCuvbFMiPfAXZY8jOmUeunjDuISEC0SdY_nJu91gDw1Cpo",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDVCpBzq7nKMMn0310H0J94wEg1ejsYH1oWYQ5hK8lBTiFk8BgUg9ySLy0bt4GU2nHJDNO7iq4MZJbWDChnE8oLOERo77ICGadg3k1k33Ag6eSiNh9ffy5XynsGN-FvW4ORj0-d54O6zI_bDjBjD9mcRANcnN6gcO0b8yt4I5K7-FkKVAJzgUZK0zR6aQ4q-Z3mrxPETkz07mVXTP3qrtxdcXe41OkjJpnQk_A_qqHka110iFcA_SiOaDGuvWw90IGdJ-NOR6U3Bbw",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBp5ijlG7F4mZjeqlQBVjebdRVtZdNg03WEHAIhydMj0AuBNhN-xbUVRF0O8TqtaNsCPMthz_IjTxfuIAt7VZcwCSkEJWnSeuABc2TUUJi1Fd8XPR-gXd8dDlStG-B_igRJbpxMLYVWaZVgQRxfghlI9RyAs1bOl4D1eZNPZ8o7dYU7bLIw89heumoNtrRguKtymBW2vWBV56YUsXs4CYK0mlMKi0okHNssPDyjaImQRSwE8bEWZMJbaEY02l_gzZ0Bgi1BdYARpjM",
  ],
  // Column 2
  [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBBTXX0HUFOERBieY3zdPe-tCvR-aOcmIncBDHkX79H5gR4Fm0CY78zMLnVdLtYRNk2KsJDEqPbJb25Phi2Mt2gViLIKF_JuCbgtlFezc-4eUdmC0-yVTpvFNibXbryK9nkWuhJpiG86joIFWL-RJfY1GhE3kAVPItzV_qFJ2Dzuya_Ecu4-GwzG4BVcKmHsZrIgIk-ESVtU1u-gzqGu3WQPOfSLEqF1dQyKZqIoWJcd0SZ-Adg7WriPeVKUfIB95M4_LqPi67Qpvw",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCWzp81q3aBT51MdPeHVknhEFfhZivTe6Ndm94jV-M4jOpcE9-SiFzcBSxOstTf0SXbksmwQ8Z4OvteZHZkwvgIwGksO3vNTnW3j9OXwtNDHlrPW3BpAkpr10DAjeXBXtkU6rMXeLK_7EHa7Lr07I9iP-wnPlZ62Q5-u89DmqmXzxlbI8ubyN67PWMfa8cqE3a_ZPzQdENx-NQImTB66Nv7igeFYZ4C-L9DfrHAfrwvOMKZE_sgMlFr9JniHhz0C1VS0VDdbb45VFI",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBlDweBEFcznHGl9FeLXf-2SaPaVumFOFddD7v4iGFtecOlgNyr-mLKubI47pirjpv7Vj9i-Y1GVDYz6R7LV4HpfLQHtil_DD3QE8eZQB8IUKof3jlfxd-ELHH3jqZb_KhATfogr27TbXP6zj0zxkf5_PFKMpOjpSbLmgnrqntjBI-OWKBoDb7p7BbOyGx-j2I6khzy1DY6DpQb5xNk4jAulM5lAbUwW1KNO6BZGsXXkb9VC6WXJbM9wCRJh281zN1nGTMeOqcdYNU",
  ]
];


const Hero = ({ data }) => {
  // Data mapping from CMS fields
  const title = data?.title || 'أفضل منصة لتعلم البرمجة';
  const subtitle = data?.subtitle || data?.description || 'تعلم من الصفر حتى الاحتراف';
  const ctaText = data?.ctaText || data?.cta_primary || 'تصفح المسارات';
  const bgImage = data?.bgImage;

  return (
    <header className="relative pt-24 pb-16 overflow-hidden bg-surface-white min-h-[85vh] flex items-center">
      {/* Background Image Hook (if present) */}
      {bgImage && (
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <img src={bgImage} alt="Background" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* RIGHT SIDE: Text Content */}
        <div className="space-y-8 order-2 lg:order-1 text-right">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background-alt border border-primary/20 text-heading-brown font-medium text-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            {data?.badge || 'مسارات احترافية'}
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-[1.15] text-heading-brown">
              {title}
            </h1>
            <p className="text-xl lg:text-2xl text-body-text leading-relaxed max-w-xl">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start pt-4">
            <Link to={data?.ctaLink || '/courses'}>
              <button className="px-10 py-4 bg-primary hover:bg-gold-cta text-white font-bold text-xl rounded-card shadow-soft hover:shadow-hover transition-all transform hover:-translate-y-1 w-full sm:w-auto">
                <span className="flex items-center justify-center gap-2">
                  {ctaText}
                  <span className="material-symbols-outlined rtl:rotate-180">arrow_back</span>
                </span>
              </button>
            </Link>
          </div>

          {/* Trust Indicators / Stat */}

        </div>

        {/* LEFT SIDE: Vertical Infinite Slider */}
        <div className="relative order-1 lg:order-2 h-[500px] lg:h-[600px] overflow-hidden -mx-6 lg:mx-0 mask-linear-gradient">
          {/* Gradient Masks */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-surface-white to-transparent z-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface-white to-transparent z-10"></div>

          <div className="grid grid-cols-2 gap-4 h-full w-full">
            {/* Column 1 - Scroll Up */}
            <div className="relative h-full overflow-hidden">
              <div className="animate-scroll-up flex flex-col gap-4 absolute top-0 left-0 w-full">
                {/* Use dynamic images if available, else placeholders */}
                {(() => {
                  const allImages = (data?.images && data.images.length > 0) ? data.images : sliderImages.flat();
                  // If we have very few images, duplicate them more to ensure smooth scroll
                  const col1Images = allImages.length > 0 ? allImages.slice(0, Math.ceil(allImages.length / 2)) : sliderImages[0];
                  // Ensure enough content for loop
                  const displayImages = [...col1Images, ...col1Images, ...col1Images, ...col1Images];

                  return displayImages.map((src, i) => (
                    <div key={i} className="w-full relative rounded-card overflow-hidden shadow-soft aspect-[3/4] group">
                      <img src={src} alt="student" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Column 2 - Scroll Down */}
            <div className="relative h-full overflow-hidden mt-12 lg:mt-20">
              <div className="animate-scroll-down flex flex-col gap-4 absolute top-[-50%] left-0 w-full">
                {(() => {
                  const allImages = (data?.images && data.images.length > 0) ? data.images : sliderImages.flat();
                  const col2Images = allImages.length > 0 ? allImages.slice(Math.ceil(allImages.length / 2)) : sliderImages[1];
                  // Ensure enough content for loop
                  // If col2 is empty (e.g. only 1 image total), use col1 again or placeholder
                  const finalCol2 = col2Images.length > 0 ? col2Images : (allImages.length > 0 ? allImages : sliderImages[1]);
                  const displayImages = [...finalCol2, ...finalCol2, ...finalCol2, ...finalCol2];

                  return displayImages.map((src, i) => (
                    <div key={i} className="w-full relative rounded-card overflow-hidden shadow-soft aspect-[3/4] group">
                      <img src={src} alt="student" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Hero;
