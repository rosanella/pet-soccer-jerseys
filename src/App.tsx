import React, { useState, useEffect } from 'react';
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
  Camera,
  MessageSquare,
  Star,
  Upload,
  Search
} from 'lucide-react';

const PRICING_TABLE: Record<string, number> = {
  "XS": 68, "XS+2\"": 69, "XS+4\"": 70,
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
  { id: 1, name: "USA 2026 Edition", description: "Home jersey for American pups.", images: ["/images/usa_front.jpg", "/images/usa_back.jpg"] },
  { id: 2, name: "Mexico 2026 Jersey", description: "Vibrant host nation jersey.", images: ["/images/mexico_front.jpg", "/images/mexico_back.jpg"] },
  { id: 3, name: "Canada 2026 Jersey", description: "Northern host team style.", images: ["/images/canada_pet_jersey.jpg", "/images/canada_pet_jersey.jpg"] },
  { id: 4, name: "Argentina Champion", description: "The iconic albiceleste stripes.", images: ["/images/argentina_front.jpg", "/images/argentina_back.jpg"] },
  { id: 5, name: "Brazil Canary", description: "The most legendary soccer yellow.", images: ["/images/brazil_pet_jersey.jpg", "/images/brazil_pet_jersey.jpg"] },
  { id: 6, name: "Colombia El Tricolor", description: "The vibrant yellow of South American sun.", images: ["/images/colombia_front.jpg", "/images/colombia_back.jpg"] },
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
      <div className="flex items-center gap-3">
        <img src="/images/logo_4puppies.png" alt="4PUPPIES.CL" className="h-12 md:h-16 w-auto object-contain" />
        <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 uppercase leading-none">4PUPPIES.CL</span>
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <a href="https://instagram.com/4puppies.cl" target="_blank" rel="noopener noreferrer" className="p-1">
          <Camera size={22} className="text-gray-400 hover:text-pink-600 cursor-pointer transition-colors" />
        </a>
        <button 
          onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
          className="hidden sm:block bg-blue-600 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          Shop Collection
        </button>
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

const ReviewModal = ({ isOpen, onClose, onRefresh }: { isOpen: boolean, onClose: () => void, onRefresh: () => void }) => {
  const [formData, setFormData] = useState({ customerName: '', comment: '', stars: 5 });
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('customerName', formData.customerName);
    data.append('comment', formData.comment);
    data.append('stars', formData.stars.toString());
    if (image) data.append('image', image);

    try {
      await fetch('/api/reviews', { method: 'POST', body: data });
      alert("Review submitted! It will appear once approved by our team.");
      onRefresh();
      onClose();
    } catch (error) {
      alert("Error submitting review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] max-w-lg w-full overflow-hidden shadow-2xl relative p-8 md:p-10">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-2xl text-blue-600"><Star size={24} /></div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight leading-none">Share your Experience</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Upload a photo of your pet!</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Your Name</label>
              <input required type="text" className="w-full bg-slate-50 border-2 border-transparent p-3 rounded-xl text-sm font-bold outline-none" 
                value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Rating</label>
              <select className="w-full bg-slate-50 border-2 border-transparent p-3 rounded-xl text-sm font-bold outline-none"
                value={formData.stars} onChange={e => setFormData({...formData, stars: parseInt(e.target.value)})}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Your Comment</label>
            <textarea required className="w-full bg-slate-50 border-2 border-transparent p-3 rounded-xl text-sm font-bold outline-none h-24" 
              value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Pet Photo</label>
            <div className="relative">
              <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} className="hidden" id="pet-upload" />
              <label htmlFor="pet-upload" className="w-full border-2 border-dashed border-gray-200 p-6 rounded-2xl flex flex-col items-center gap-2 cursor-pointer hover:bg-slate-50 transition-all">
                <Upload size={24} className="text-blue-600" />
                <span className="text-xs font-bold text-gray-500">{image ? image.name : "Select Pet Photo"}</span>
              </label>
            </div>
          </div>
          <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-sm transition-all shadow-xl shadow-blue-100">
            {isSubmitting ? 'Uploading...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

const FullscreenImageModal = ({ imageUrl, onClose }: { imageUrl: string | null, onClose: () => void }) => {
  if (!imageUrl) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-sm transition-all" onClick={onClose}>
      <button onClick={onClose} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all">
        <X size={24} />
      </button>
      <img 
        src={imageUrl} 
        className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 object-contain" 
        alt="Review detail" 
      />
    </div>
  );
};

const AllReviewsModal = ({ isOpen, onClose, reviews, onZoom }: { isOpen: boolean, onClose: () => void, reviews: any[], onZoom: (url: string) => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Pup <span className="text-blue-600">Parents</span></h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">What they're saying about us</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-900">
            <X size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-8 bg-slate-50/50">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {reviews.map((rev, i) => (
              <div key={i} className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 space-y-4 hover:scale-105 transition-all duration-300">
                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 cursor-zoom-in relative group/img">
                  <img 
                    src={rev.pet_image_url || "/images/hero_corgi_usa.jpg"} 
                    className="w-full h-full object-cover group-hover/img:scale-110 transition-all duration-500" 
                    onClick={() => onZoom(rev.pet_image_url || "/images/hero_corgi_usa.jpg")}
                    alt="Happy pet" 
                  />
                  <div className="absolute bottom-2 right-2 bg-white/80 p-1.5 rounded-lg text-slate-900 opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none">
                    <Search size={14} />
                  </div>
                </div>
                <div className="flex text-yellow-400 gap-0.5">
                  {[...Array(rev.stars)].map((_, j) => <Star key={j} size={10} fill="currentColor" />)}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-900 leading-tight italic">"{rev.comment}"</p>
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest pt-1">— {rev.customer_name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminReviews = ({ onBack }: { onBack: () => void }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllReviews = async () => {
    try {
      const resp = await fetch('/api/reviews/all'); // Need to add this endpoint
      const data = await resp.json();
      setReviews(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const approveReview = async (id: number) => {
    await fetch(`/api/reviews/${id}/approve`, { method: 'POST' });
    fetchAllReviews();
  };

  const deleteReview = async (id: number) => {
    if (confirm("Delete this review?")) {
      await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      fetchAllReviews();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">Review <span className="text-blue-600">Moderation</span></h1>
          <button onClick={onBack} className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-slate-900 transition-all">Back to Site</button>
        </div>
        
        {loading ? <p className="text-center font-bold text-gray-400 py-20">Loading pending reviews...</p> : (
          <div className="grid gap-4">
            {reviews.length === 0 && <p className="text-center text-gray-400 font-bold py-10">No reviews to manage.</p>}
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img src={rev.pet_image_url} alt="Pet" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow space-y-1 text-center md:text-left">
                  <div className="flex justify-center md:justify-start text-yellow-400 mb-1">
                    {[...Array(rev.stars)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                  <h4 className="font-black text-slate-900 uppercase tracking-tight">{rev.customer_name}</h4>
                  <p className="text-sm text-gray-500 italic">"{rev.comment}"</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Status: <span className={rev.status === 'approved' ? 'text-green-500' : 'text-orange-500'}>{rev.status}</span></p>
                </div>
                <div className="flex gap-2">
                  {rev.status !== 'approved' && (
                    <button onClick={() => approveReview(rev.id)} className="bg-green-500 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all">Approve</button>
                  )}
                  <button onClick={() => deleteReview(rev.id)} className="bg-red-50 text-red-500 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all text-red-100">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [allReviewsOpen, setAllReviewsOpen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeReviewId, setActiveReviewId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(window.location.pathname === '/admin-reviews');

  useEffect(() => {
    fetchReviews();
    // Handle URL changes
    const handlePopState = () => setIsAdmin(window.location.pathname === '/admin-reviews');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setIsAdmin(path === '/admin-reviews');
  };

  const fetchReviews = async () => {
    try {
      const resp = await fetch('/api/reviews');
      const data = await resp.json();
      setReviews(data);
    } catch (error) {
      console.error(error);
    }
  };

  const startCheckout = (product: any, details: any) => {
    setSelectedProduct(product);
    setOrderDetails(details);
    setCheckoutModalOpen(true);
  };

  if (isAdmin) {
    return <AdminReviews onBack={() => navigateTo('/')} />;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans selection:bg-blue-600 selection:text-white">
      <Header />
      <section className="relative pt-6 md:pt-16 pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 md:space-y-8 text-center lg:text-left z-10">
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
              <button 
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-blue-200 uppercase tracking-tighter hover:bg-blue-700 transition-all active:scale-95"
              >
                Shop Collection
              </button>
              <button onClick={() => setSizeModalOpen(true)} className="bg-white border-2 border-gray-100 text-gray-800 px-10 py-5 rounded-2xl font-black text-lg shadow-sm uppercase tracking-tighter hover:bg-slate-50 transition-all active:scale-95">Size Guide</button>
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-square rounded-[4rem] overflow-hidden border-[12px] border-white shadow-2xl rotate-1 bg-slate-100">
              <video 
                autoPlay 
                muted 
                loop 
                playsInline 
                poster="/images/hero_corgi_usa.jpg"
                className="w-full h-full object-cover"
              >
                <source src="/images/Dog_model.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
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

          {/* Custom Team Request Section */}
          <div className="mt-24 p-8 md:p-12 bg-slate-900 rounded-[3rem] text-center space-y-6 border border-slate-800 shadow-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-600/20">
              <MessageSquare size={14} /> Custom Requests
            </div>
            <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
              Don't see your <br /><span className="text-blue-500">favorite team?</span>
            </h3>
            <p className="text-slate-400 font-bold italic max-w-lg mx-auto text-sm md:text-base">
              "We handle custom orders for any team or national selection. Contact us directly to start your custom pet jersey!"
            </p>
            <div className="pt-4">
              <a 
                href="https://instagram.com/4puppies.cl" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl text-xs md:text-sm"
              >
                DM TO INSTAGRAM <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
          <div className="text-center space-y-2">
            <h4 className="text-xs font-black uppercase text-blue-600 tracking-[0.3em]">Customer Love</h4>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Pet Parents <span className="text-blue-600">Reviews</span>.</h2>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-10 snap-x no-scrollbar -mx-4 px-4">
            {reviews.length > 0 ? reviews.map((rev, i) => (
              <div 
                key={i} 
                onClick={() => setActiveReviewId(activeReviewId === rev.id ? null : rev.id)}
                className={`flex-shrink-0 w-[55%] md:w-64 bg-slate-50 p-5 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4 snap-start text-left transition-all duration-500 cursor-pointer group ${
                  activeReviewId === rev.id ? 'scale-110 z-20 shadow-2xl bg-white border-blue-100 !mx-4' : 'opacity-80 md:opacity-100 hover:scale-105 hover:opacity-100 hover:bg-white hover:border-blue-50'
                }`}
              >
                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-200 relative group/img">
                  <img 
                    src={rev.pet_image_url || "/images/hero_corgi_usa.jpg"} 
                    onClick={(e) => {
                      if (activeReviewId === rev.id) {
                        e.stopPropagation();
                        setFullscreenImage(rev.pet_image_url || "/images/hero_corgi_usa.jpg");
                      }
                    }}
                    className={`w-full h-full object-cover transition-all duration-700 group-hover/img:scale-110 ${
                      activeReviewId === rev.id ? 'grayscale-0 scale-100 cursor-zoom-in' : 'grayscale'
                    }`} 
                    alt="Happy pet" 
                  />
                  {activeReviewId === rev.id && (
                    <div className="absolute bottom-2 right-2 bg-white/80 p-1.5 rounded-lg text-slate-900 opacity-0 group-hover/img:opacity-100 transition-opacity">
                      <Search size={14} />
                    </div>
                  )}
                </div>
                <div className="flex text-yellow-400 gap-0.5">
                  {[...Array(rev.stars)].map((_, j) => <Star key={j} size={12} fill="currentColor" />)}
                </div>
                <div className="space-y-1">
                  <p className={`text-[11px] font-bold text-gray-500 leading-tight italic transition-all group-hover:text-slate-900 ${
                    activeReviewId === rev.id ? 'text-slate-900 line-clamp-none' : 'line-clamp-2'
                  }`}>
                    "{rev.comment}"
                  </p>
                  <p className="text-[10px] font-black uppercase text-slate-900 tracking-widest pt-1">— {rev.customer_name}</p>
                </div>
              </div>
            )) : (
              <p className="text-center w-full text-slate-400 font-bold italic py-10">Be the first to review!</p>
            )}
          </div>
          
          <div className="text-center flex flex-col items-center gap-4">
            <button onClick={() => setReviewModalOpen(true)} className="bg-blue-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              Write a Review
            </button>
            <button onClick={() => setAllReviewsOpen(true)} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-all">
              See what other pup parents are saying 🐾 <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>
      <footer className="py-20 bg-slate-50 text-center space-y-12">
        <div className="flex flex-col items-center gap-4">
          <img src="/images/logo_4puppies.png" alt="4PUPPIES.CL" className="h-16 md:h-24 w-auto object-contain" />
          <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 uppercase leading-none">4PUPPIES.CL</h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Premium Pet Apparel</p>
        </div>
        <div className="flex flex-wrap justify-center gap-10 font-black text-[10px] uppercase tracking-widest text-slate-400">
           <span className="flex items-center gap-2"><Check size={14} className="text-blue-600" /> Secure Payments</span>
           <span className="flex items-center gap-2"><Check size={14} className="text-blue-600" /> FedEx International Express</span>
        </div>
        <div className="space-y-4 px-6">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose max-w-xl mx-auto flex flex-col gap-1">
            <span>© 2026 4PUPPIES.CL</span>
            <span>SANTIAGO, CHILE</span>
            <span>EXPRESS DELIVERY TO USA</span>
            <span className="mt-2 text-[9px] opacity-70">NOT AFFILIATED WITH FIFA. ALL DESIGNS ARE CUSTOM FAN ART.</span>
          </p>
        </div>
      </footer>
      <SizeGuideModal isOpen={sizeModalOpen} onClose={() => setSizeModalOpen(false)} />
      {selectedProduct && <CheckoutModal isOpen={checkoutModalOpen} onClose={() => setCheckoutModalOpen(false)} product={selectedProduct} orderDetails={orderDetails} />}
      <ReviewModal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} onRefresh={fetchReviews} />
      <AllReviewsModal isOpen={allReviewsOpen} onClose={() => setAllReviewsOpen(false)} reviews={reviews} onZoom={setFullscreenImage} />
      <FullscreenImageModal imageUrl={fullscreenImage} onClose={() => setFullscreenImage(null)} />
    </div>
  );
}
