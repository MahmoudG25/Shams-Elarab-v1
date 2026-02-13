import logo from '../../assets/000.svg';
import { Link } from 'react-router-dom';

const Navbar = ({ data }) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-white/95 backdrop-blur-md border-b border-border-light h-20">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt={data.logo} className="h-12 w-auto object-contain" />
        </div>
        <div className="hidden md:flex items-center gap-8 text-lg font-medium text-body-text/80">
          {data.links.map((link, index) => (
            <Link key={index} to={link.href} className="hover:text-primary transition-colors">
              {link.text}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">

          <button className="bg-heading-brown text-white px-6 py-2.5 rounded-full font-bold hover:bg-primary transition-colors shadow-lg shadow-heading-brown/10">
            {data.cta}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
