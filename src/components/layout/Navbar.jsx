import React, { useState } from 'react';
import logo from '../../assets/000.svg';
import { Link, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { FaSearch } from 'react-icons/fa';

const Navbar = ({ data }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (!searchQuery.trim()) return;

      setIsSearching(true);
      try {
        const order = await orderService.findOrder(searchQuery);
        if (order) {
          navigate('/checkout/review', { state: { order } });
          setSearchQuery('');
        } else {
          alert('لم يتم العثور على طلب بهذا الرقم أو رقم الهاتف.');
        }
      } catch (error) {
        console.error("Search error:", error);
        alert('حدث خطأ غير متوقع.');
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-white/95 backdrop-blur-md border-b border-border-light h-20">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/">
            <img src={logo} alt={data.logo} className="h-12 w-auto object-contain" />
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-lg font-medium text-body-text/80">
          {data.links.map((link, index) => (
            <Link key={index} to={link.href} className="hover:text-primary transition-colors">
              {link.text}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Order Status Search */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-primary focus-within:bg-white transition-all w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="تتبع طلبك (رقم الطلب / الهاتف)"
              className="bg-transparent border-none outline-none text-sm w-full text-heading-brown placeholder-gray-400"
              disabled={isSearching}
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="text-gray-400 hover:text-primary transition-colors"
            >
              {isSearching ? <span className="animate-spin block w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></span> : <FaSearch />}
            </button>
          </div>

          <button className="bg-heading-brown text-white px-6 py-2.5 rounded-full font-bold hover:bg-primary transition-colors shadow-lg shadow-heading-brown/10 whitespace-nowrap hidden sm:block">
            {data.cta}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
