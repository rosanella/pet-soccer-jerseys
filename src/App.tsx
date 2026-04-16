import React, { useState } from 'react';
import { 
  Truck, 
  Clock, 
  Ruler, 
  Info, 
  ChevronRight, 
  Check, 
  ShieldCheck, 
  Globe, 
  PawPrint,
  X,
  Camera
} from 'lucide-react';

const PRICING_TABLE: Record<string, number> = {
  "XS": 2, "XS+2\"": 69, "XS+4\"": 70,
  "S": 70, "S+2\"": 71, "S+4\"": 72,
  "M": 72, "M+2\"": 72, "M+4\"": 73,
  "L": 73, "L+2\"": 74, "L+4\"": 75,
  "XL": 75, "XL+2\"": 76, "XL+4\"": 77,
  "2XL": 77, "2XL+2\"": 78, "2XL+4\"": 79,
  "3XL": 80, "3XL+2\"": 81, "3XL+4\"": 81,
  "4XL": 84, "4XL+2\"": 86, "4XL+4\"": 88,
  "5XL": 87, "5XL+2\"": 89, "5XL+4\"": 90,
};

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];

const PRODUCTS = [
  { id: 1, name: "USA 2026 Edition", description: "Home jersey for American pups.", images: ["/images/hero_corgi_usa.jpg", "/images/hero_corgi_usa.jpg"] },
  { id: 2, name: "Mexico 2026 Jersey", description: "Vibrant host nation jersey.", images: ["/images/mexico_pet_jersey.jpg", "/images/mexico_pet_jersey.jpg"] },
  { id: 3, name: "Canada 2026 Jersey", description: "Northern host team style.", images: ["/images/canada_pet_jersey.jpg", "/images/canada_pet_jersey.jpg"] },
  { id: 4, name: "Argentina Champion", description: "The iconic albiceleste stripes.", images: ["/images/argentina_pet_jersey.jpg", "/images/argentina_pet_jersey.jpg"] },
  { id: 5, name: "Brazil Canary", description: "The most legendary soccer yellow.", images: ["/images/brazil_pet_jersey.jpg", "/images/brazil_pet_jersey.jpg"] },
  { id: 6, name: "France Tricolore", description: "European style and precision.", images: ["/images/france_pet_jersey.jpg", "/images/france_pet_jersey.jpg"] },
  { id: 7, name: "England Lionheart", description: "Support the Three Lions.", images: ["/images/england_pet_jersey.jpg", "/images/england_pet_jersey.jpg"] },
  { id: 8, name: "Italy Azzurri", description: "Timeless Mediterranean blue.", images: ["/images/italy_pet_jersey.jpg", "/images/italy_pet_jersey.jpg"] },
];

const Header = () => (
  <header className="bg-white border-b border-gray-100 sticky top-0 z-40 w-full">
    <div className="bg-slate-900 text-white text-[10px] md:text-xs py-2 px-4 flex justify-center gap-6 font-bold uppercase tracking-widest">
      <span className="flex items-center gap-1"><Truck size={14} className="text-blue-400" /> FedEx Express (4-5 Days)</span>
      <span className="flex items-center gap-1"><Clock size={14} className="text-yellow-400" /> 8-Day Custom Prep</span>
      <span className="hidden md:flex items-center gap-1">🇨🇱 Shipped from Chile</span>
    </div>
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img src="/images/logo_4puppies.png" alt="4PUPPIES.CL" className="h-10 md:h-12 w-auto object-contain" />
      </div>
      <div className="flex items-center gap-4">
        <Camera size={20} className="text-gray-400 hover:text-pink-600 cursor-pointer transition-colors" />
        <button className="bg-blue-600 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200">Shop Collection</button>
      </div>
    </div>
  </header>
);

const SizeGuideModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] max-w-xl w-full overflow-hidden shadow-2xl relative p-8 md:p-10">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-100 rounded-2xl text-blue-600"><Ruler size={24} /></div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight leading-none">Size Guide</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Handmade from Chile • International Standards</p>
          </div>
        </div>
        <div className="overflow-x-auto border border-gray-100 rounded-2xl">
          <table className="w-full text-left text-sm md:text-base">
            <thead>
              <tr className="bg-blue-600 text-white"><th className="p-4 uppercase text-[10px] font-black">Size</th><th className="p-4 uppercase text-[10px] font-black">Neck</th><th className="p-4 uppercase text-[10px] font-black">Chest</th><th className="p-4 uppercase text-[10px] font-black">Back</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[["XS", "8.5\"", "11.5\"", "7.5\""], ["S", "9.5\"", "13.5\"", "8.5\""], ["M", "11\"", "15.5\"", "9.5\""], ["L", "12\"", "17.5\"", "11\""], ["XL", "14\"", "20\"", "13\""], ["2XL", "16\"", "23.5\"", "14.5\""], ["3XL", "19\"", "27.5\"", "16.5\""], ["4XL", "22\"", "31\"", "19\""], ["5XL", "23.5\"", "35\"", "21.5\""]].map(([sz, n, c, b]) => (
                <tr key={sz} className="hover:bg-gray-50 transition-colors"><td className="p-4 font-black text-blue-600">{sz}</td><td className="p-4 text-gray-500 font-bold">{n}</td><td className="p-4 text-gray-500 font-bold">{c}</td><td className="p-4 text-gray-500 font-bold">{b}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-xs font-bold uppercase text-blue-600 tracking-widest mb-4 mt-2">✨ Custom length options</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
            <p className="text-[10px] font-black uppercase text-blue-400 mb-1">+2" Extra Back</p>
            <p className="text-[10px] text-blue-800 font-bold leading-tight">For extra coverage on longer pets.</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
            <p className="text-[10px] font-black uppercase text-blue-400 mb-1">+4" Extra Back</p>
            <p className="text-[10px] text-blue-800 font-bold leading-tight">Max length for breeds like Corgis or Dachshunds.</p>
          </div>
        </div>
        <div className="flex gap-3 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
          <Info size={20} className="text-yellow-600 flex-shrink-0" />
          <p className="text-[10px] text-yellow-800 font-bold uppercase italic leading-tight">If between sizes, choose the larger one. You can select the extra length in the "Size & Length" dropdown on each product. Handmade in 8 business days once ordered.</p>
        </div>
      </div>
    </div>
  );
};

const CheckoutModal = ({ isOpen, onClose, product, orderDetails }: { isOpen: boolean, onClose: () => void, product: any, orderDetails: any }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    address: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullOrder = {
      ...formData,
      ...orderDetails,
      productName: product.name,
      total: orderDetails.price
    };

    try {
      // POST to our backend to save order and send email
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullOrder)
      });
      
      const { orderId } = await response.json();
      
      // After saving, redirect to PayPal
      const businessEmail = "rosanella.galindo@gmail.com"; 
      const itemName = `${product.name} (Pet: ${orderDetails.petName})`;
      const params = new URLSearchParams({
        cmd: "_xclick",
        business: businessEmail,
        item_name: itemName,
        amount: orderDetails.price.toString(),
        currency_code: "USD",
        no_shipping: "2",
        custom: orderId.toString(), // Send order ID to PayPal
        notify_url: "https://globalshop.4puppies.cl/api/paypal-webhook", // Your webhook URL
        return: window.location.origin
      });

      window.location.href = `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;
    } catch (error) {
      console.error(error);
      alert("There was an error processing your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] max-w-lg w-full overflow-hidden shadow-2xl relative p-8 md:p-10">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-2xl text-blue-600"><Truck size={24} /></div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight leading-none">Shipping Details</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">FedEx Express Shipping to USA</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Full Name</label>
            <input required type="text" className="w-full bg-slate-50 border-2 border-transparent p-3 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" 
              value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Delivery Address (USA)</label>
            <textarea required className="w-full bg-slate-50 border-2 border-transparent p-3 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all h-24" 
              value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Email</label>
              <input required type="email" className="w-full bg-slate-50 border-2 border-transparent p-3 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Phone</label>
              <input required type="tel" className="w-full bg-slate-50 border-2 border-transparent p-3 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" 
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase text-blue-600">
              <span>Order Summary</span>
              <span>{product.name}</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs font-bold text-gray-600">Size {orderDetails.key} • Pet: {orderDetails.petName} (#{orderDetails.petNumber})</p>
              </div>
              <p className="text-xl font-black text-blue-600">${orderDetails.price}.00</p>
            </div>
          </div>

          <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98] uppercase tracking-[0.1em] text-sm flex items-center justify-center gap-2">
            {isSubmitting ? 'Processing...' : 'Proceed to PayPal'} <ChevronRight size={18} strokeWidth={3} />
          </button>
        </form>
      </div>
    </div>
  );
};

const ProductCard = ({ product, onOpenSizeChart, onStartCheckout }: { product: any, onOpenSizeChart: () => void, onStartCheckout: (product: any, orderDetails: any) => void }) => {
  const [size, setSize] = useState("M");
  const [extra, setExtra] = useState("None");
  const [petName, setPetName] = useState("");
  const [petNumber, setPetNumber] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const key = extra === "None" ? size : `${size}${extra}`;
  const price = PRICING_TABLE[key] || 72;

  const handleBuy = () => {
    if (!petName || !petNumber) return alert("Please enter Pet Name and Number!");
    onStartCheckout(product, { key, price, petName, petNumber });
  };

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-100 flex flex-col h-full group transition-shadow hover:shadow-2xl">
      <div className="relative aspect-[4/5] overflow-hidden" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={() => setIsHovered(!isHovered)}>
        <img src={isHovered ? product.images[1] : product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase">2026 World Cup</div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/95 backdrop-blur px-4 py-2 rounded-2xl shadow-xl inline-block border border-gray-50">
            <p className="text-[9px] font-black uppercase text-gray-400 tracking-tighter mb-1">Final Price (Incl. Shipping)</p>
            <p className="text-xl font-black text-blue-600 leading-none tracking-tighter">${price}.00 USD</p>
          </div>
        </div>
      </div>
      <div className="p-6 md:p-8 flex flex-col flex-grow space-y-5">
        <h3 className="text-lg font-black uppercase tracking-tight leading-none text-gray-900">{product.name}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-blue-600/50 tracking-widest ml-1">Pet Name</label>
            <input type="text" placeholder="Leo" className="w-full bg-slate-50 border-2 border-transparent p-3 rounded-xl text-sm font-black focus:bg-white focus:border-blue-600 outline-none transition-all" value={petName} onChange={e => setPetName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-blue-600/50 tracking-widest ml-1">Fav #</label>
            <input type="text" placeholder="10" maxLength={2} className="w-full bg-slate-50 border-2 border-transparent p-3 rounded-xl text-sm font-black focus:bg-white focus:border-blue-600 outline-none transition-all text-center" value={petNumber} onChange={e => setPetNumber(e.target.value)} />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center ml-1">
            <label className="text-[9px] font-black uppercase text-blue-600/50 tracking-widest">Size & Length</label>
            <button onClick={onOpenSizeChart} className="text-[9px] font-black uppercase text-blue-600 underline underline-offset-2">Chart</button>
          </div>
          <select className="w-full bg-blue-50/50 border-2 border-transparent p-3 rounded-xl text-sm font-black text-blue-700 outline-none hover:border-blue-100 transition-all cursor-pointer" value={key} onChange={e => {
            const v = e.target.value;
            if (v.includes('+')) { const [s, ex] = v.split('+'); setSize(s); setExtra(`+${ex}`); }
            else { setSize(v); setExtra("None"); }
          }}>
            {SIZES.map(s => (
              <React.Fragment key={s}>
                <option value={s}>{s} Standard</option>
                <option value={`${s}+2\"`}>{s} + 2" Extra Back</option>
                <option value={`${s}+4\"`}>{s} + 4" Extra Back</option>
              </React.Fragment>
            ))}
          </select>
        </div>
        <button onClick={handleBuy} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98] uppercase tracking-[0.1em] text-sm flex items-center justify-center gap-2">
          Buy Now <ChevronRight size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const startCheckout = (product: any, details: any) => {
    setSelectedProduct(product);
    setOrderDetails(details);
    setCheckoutModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans selection:bg-blue-600 selection:text-white">
      <Header />
      <section className="relative pt-12 pb-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-50 shadow-sm">
              <Globe size={14} /> 4PUPPIES.CL Global Shop
            </div>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] text-gray-900 uppercase">
              CUSTOM <br /><span className="text-blue-600">FOOTBALL</span><br />JERSEYS.
            </h2>
            <p className="text-base md:text-xl text-gray-500 font-bold max-w-xl mx-auto lg:mx-0 italic">
              Handmade in Chile • FedEx Express to USA (4-5 days) • Premium Athletic Mesh • 8-Day Prep Time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <a href="#products" className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-blue-200 uppercase tracking-tighter">Shop Collection</a>
              <button onClick={() => setSizeModalOpen(true)} className="bg-white border-2 border-gray-100 text-gray-800 px-10 py-5 rounded-2xl font-black text-lg shadow-sm uppercase tracking-tighter">Size Guide</button>
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-square rounded-[4rem] overflow-hidden border-[12px] border-white shadow-2xl rotate-1">
              <img src="/images/hero_corgi_usa.jpg" alt="Hero Pet" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>
      <div className="bg-slate-900 py-16 text-white text-center md:text-left">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col md:flex-row items-center gap-5"><div className="p-4 bg-blue-600 rounded-3xl"><Truck size={28} /></div><div><h4 className="font-black uppercase tracking-tight text-xl leading-none mb-1">FedEx Express</h4><p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">4-5 Day Delivery to USA</p></div></div>
          <div className="flex flex-col md:flex-row items-center gap-5"><div className="p-4 bg-blue-600 rounded-3xl"><Clock size={28} /></div><div><h4 className="font-black uppercase tracking-tight text-xl leading-none mb-1">8-Day Prep</h4><p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Handmade Custom Tailoring</p></div></div>
          <div className="flex flex-col md:flex-row items-center gap-5"><div className="p-4 bg-blue-600 rounded-3xl"><ShieldCheck size={28} /></div><div><h4 className="font-black uppercase tracking-tight text-xl leading-none mb-1">Secure Payments</h4><p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Safe Checkout via PayPal</p></div></div>
        </div>
      </div>
      <section id="products" className="py-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <div className="inline-block p-1 bg-blue-600 rounded-full w-20" />
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85]">World Cup <br /><span className="text-blue-600 italic">2026 Edition</span>.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.map(p => <ProductCard key={p.id} product={p} onOpenSizeChart={() => setSizeModalOpen(true)} onStartCheckout={startCheckout} />)}
          </div>
        </div>
      </section>
      <footer className="py-20 bg-slate-50 text-center space-y-12">
        <div className="flex flex-col items-center gap-4">
          <img src="/images/logo_4puppies.png" alt="4PUPPIES.CL" className="h-12 md:h-16 w-auto object-contain" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Premium Pet Apparel</p>
        </div>
        <div className="flex flex-wrap justify-center gap-10 font-black text-[10px] uppercase tracking-widest text-slate-400">
           <span className="flex items-center gap-2"><Check size={14} className="text-blue-600" /> Secure Payments</span>
           <span className="flex items-center gap-2"><Check size={14} className="text-blue-600" /> FedEx International Express</span>
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose max-w-xl mx-auto">
          © 2026 4PUPPIES.CL • SANTIAGO, CHILE • EXPRESS DELIVERY TO USA. <br />
          NOT AFFILIATED WITH FIFA. ALL DESIGNS ARE CUSTOM FAN ART.
        </p>
      </footer>
      <SizeGuideModal isOpen={sizeModalOpen} onClose={() => setSizeModalOpen(false)} />
      {selectedProduct && <CheckoutModal isOpen={checkoutModalOpen} onClose={() => setCheckoutModalOpen(false)} product={selectedProduct} orderDetails={orderDetails} />}
    </div>
  );
}
