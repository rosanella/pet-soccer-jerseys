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
  Search,
  FileText,
  ExternalLink,
  RefreshCcw,
  Package,
  Printer
} from 'lucide-react';

const PRICING_TABLE: Record<string, number> = {
  "XS": 3, "XS+2\"": 4, "XS+4\"": 5,
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
  { id: 8, name: "Spain La Roja", description: "The powerful red of Spain.", images: ["/images/spain_front.jpg", "/images/spain_back.jpg"] },
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
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  if (!isOpen) return null;

  const INCHES_DATA = [["XS", "8.5\"", "11.5\"", "7.5\""], ["S", "9.5\"", "13.5\"", "8.5\""], ["M", "11\"", "15.5\"", "9.5\""], ["L", "12\"", "17.5\"", "11\""], ["XL", "14\"", "20\"", "13\""], ["2XL", "16\"", "23.5\"", "14.5\""], ["3XL", "19\"", "27.5\"", "16.5\""], ["4XL", "22\"", "31\"", "19\""], ["5XL", "23.5\"", "35\"", "21.5\""]];
  const CM_DATA = [["XS", "22", "30", "20"], ["S", "25", "35", "22"], ["M", "28", "40", "25"], ["L", "31", "45", "28"], ["XL", "36", "52", "34"], ["2XL", "42", "60", "38"], ["3XL", "49", "70", "43"], ["4XL", "56", "80", "49"], ["5XL", "60", "90", "55"]];

  const currentData = unit === 'inches' ? INCHES_DATA : CM_DATA;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-[3rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-8 md:p-12 custom-scrollbar">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-100 rounded-[1.5rem] text-blue-600 shadow-sm"><Ruler size={28} /></div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">{unit === 'inches' ? 'Size Guide' : 'Cuadro de Tallas'}</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">{unit === 'inches' ? 'International Standards' : 'Medidas de Referencia'}</p>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner">
            <button 
              onClick={() => setUnit('inches')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${unit === 'inches' ? 'bg-white text-blue-600 shadow-md transform scale-105' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Inches
            </button>
            <button 
              onClick={() => setUnit('cm')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${unit === 'cm' ? 'bg-white text-blue-600 shadow-md transform scale-105' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {unit === 'inches' ? 'Centimeters' : 'Centímetros'}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-4">
            <div className="overflow-hidden border border-gray-100 rounded-[2rem] shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-4 uppercase text-[10px] font-black tracking-widest">{unit === 'inches' ? 'Size' : 'Talla'}</th>
                    <th className="p-4 uppercase text-[10px] font-black tracking-widest">{unit === 'inches' ? 'Neck' : 'Cuello'} ({unit})</th>
                    <th className="p-4 uppercase text-[10px] font-black tracking-widest">{unit === 'inches' ? 'Chest' : 'Pecho'} ({unit})</th>
                    <th className="p-4 uppercase text-[10px] font-black tracking-widest">{unit === 'inches' ? 'Back' : 'Largo'} ({unit})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentData.map(([sz, n, c, b]) => (
                    <tr key={sz} className="hover:bg-blue-50/30 transition-colors"><td className="p-4 font-black text-slate-900">{sz}</td><td className="p-4 text-gray-500 font-bold">{n}</td><td className="p-4 text-gray-500 font-bold">{c}</td><td className="p-4 text-gray-500 font-bold">{b}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100/50">
              <p className="text-[9px] font-black text-red-500 uppercase tracking-widest text-center leading-relaxed">
                {unit === 'inches' 
                  ? "* If between sizes, choose the larger one. Measurements may vary 0.5-1\"."
                  : "* Si tu mascota está entre tallas, elige la más grande. Puede haber variaciones de 1 a 2 cm."}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-widest border-b border-blue-100 pb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> 
                  {unit === 'inches' ? 'Largo / Length' : 'Largo:'}
                </h4>
                <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
                  {unit === 'inches' 
                    ? "Measure from collar to base of tail. Calculate the garment to be at least 1\" shorter than the pet."
                    : "Medir del collar a la base de la cola, y calcule que la prenda sea al menos 2 cm más corta que la mascota."}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-widest border-b border-blue-100 pb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> 
                  {unit === 'inches' ? 'Pecho / Chest' : 'Pecho:'}
                </h4>
                <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
                  {unit === 'inches' 
                    ? "Measure the widest part of the chest. The garment should be at least 1\" wider than the pet."
                    : "Medir contorno del pecho de la parte más ancha, la prenda debe ser al menos 2 o 3 cm más ancho que la mascota."}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-widest border-b border-blue-100 pb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> 
                  {unit === 'inches' ? 'Cuello / Neck' : 'Cuello:'}
                </h4>
                <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
                  {unit === 'inches' 
                    ? "Measure the collar area. The garment's neck can be smaller as it stretches and adjusts."
                    : "Medir el collar. El cuello de la prenda puede ser más chico que la mascota porque estira y ajusta."}
                </p>
              </div>
            </div>

            <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-xl shadow-blue-100">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">{unit === 'inches' ? 'Custom Options' : 'Opciones de Largo'}</h4>
               <p className="text-xs font-black leading-tight italic uppercase tracking-tighter">
                 {unit === 'inches' 
                   ? "We offer +2\" or +4\" extra length for Doxies & Corgis!"
                   : "¡Ofrecemos +5cm o +10cm de largo extra para Salchichas y Corgis!"}
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TermsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [lang, setLang] = useState<'en' | 'es'>('en');
  if (!isOpen) return null;

  const content = {
    en: {
      title: "Store Policies",
      subtitle: "International Shipping & Terms",
      sections: [
        {
          id: "01",
          title: "Customs, Duties & Taxes (DDU)",
          text: "All international orders are shipped DDU (Delivered Duty Unpaid). 4Puppies.cl does not collect VAT, GST, or any import taxes at checkout. The recipient is solely responsible for paying any local customs duties or taxes required by their country's authorities. Failure to pay these fees will result in the package being returned or abandoned; no refunds will be issued for shipping costs."
        },
        {
          id: "02",
          title: "Production & Preparation Time",
          text: "Our products are handcrafted with care. Please allow 8 to 10 business days for order preparation before shipping. By purchasing, you acknowledge and accept this processing time."
        },
        {
          id: "03",
          title: "Sizing, Colors & Returns",
          list: [
            "Sizing: We provide a detailed Size Chart for every product. It is the customer's responsibility to measure their pet correctly. We do not offer exchanges or returns for sizing errors.",
            "Colors: Please note that actual product colors may vary slightly from what appears on your screen due to monitor settings and lighting.",
            "Final Sale: All international sales are final."
          ]
        },
        {
          id: "04",
          title: "Cancellation Policy",
          text: "You may request a full cancellation and refund only within 24 hours of placing your order. After 24 hours, production begins, and cancellations will no longer be accepted."
        },
        {
          id: "05",
          title: "Shipping & Delivery (FedEx)",
          list: [
            "Carrier: We ship via FedEx Express (estimated 4 to 5 business days).",
            "Tracking Responsibility: Customers are responsible for monitoring their shipment using the provided tracking number. It is essential to ensure someone is available for delivery and to respond promptly to any customs inquiries.",
            "Delays: 4Puppies.cl is not responsible for delays caused by the carrier, weather, or customs clearance. Claims must be filed directly with FedEx.",
            "Address: We do not ship to P.O. Boxes. A physical address and a contact phone number are required.",
            "Shipping Damage: If your package arrives damaged, you must report it to us within 48 hours of delivery, including photos of the damaged packaging and product."
          ]
        },
        {
          id: "06",
          title: "Unclaimed or Returned Packages",
          text: "If a package is returned due to failed delivery attempts (customer not home), incorrect address, or refusal to pay customs duties, the customer must pay a new shipping fee for reshipment. Original shipping fees are non-refundable."
        }
      ],
      button: "Understood"
    },
    es: {
      title: "Políticas de la Tienda",
      subtitle: "Envíos Internacionales y Términos",
      sections: [
        {
          id: "01",
          title: "Aduanas, Aranceles e Impuestos (DDU)",
          text: "Todos los pedidos internacionales se envían DDU (Entrega con Derechos No Pagados). 4Puppies.cl no recauda IVA, GST ni ningún impuesto de importación al momento de la compra. El destinatario es el único responsable de pagar cualquier arancel aduanero local o impuesto requerido por las autoridades de su país. El impago de estas tasas resultará en la devolución o abandono del paquete; no se realizarán reembolsos por gastos de envío."
        },
        {
          id: "02",
          title: "Tiempo de Producción y Preparación",
          text: "Nuestros productos están hechos a mano con cuidado. Por favor, considere de 8 a 10 días hábiles para la preparación del pedido antes del envío. Al comprar, usted reconoce y acepta este tiempo de procesamiento."
        },
        {
          id: "03",
          title: "Tallas, Colores y Devoluciones",
          list: [
            "Tallas: Proporcionamos una Tabla de Tallas detallada para cada producto. Es responsabilidad del cliente medir a su mascota correctamente. No ofrecemos cambios ni devoluciones por errores de talla.",
            "Colores: Tenga en cuenta que los colores reales del producto pueden variar ligeramente de lo que aparece en su pantalla debido a la configuración del monitor y la iluminación.",
            "Venta Final: Todas las ventas internacionales son finales."
          ]
        },
        {
          id: "04",
          title: "Política de Cancelación",
          text: "Puede solicitar una cancelación total y reembolso solo dentro de las 24 horas posteriores a la realización de su pedido. Después de 24 horas, comienza la producción y ya no se aceptarán cancelaciones."
        },
        {
          id: "05",
          title: "Envío y Entrega (FedEx)",
          list: [
            "Transportista: Enviamos a través de FedEx Express (estimado de 4 a 5 días hábiles).",
            "Responsabilidad de Seguimiento: El cliente es responsable de monitorear su envío con el número proporcionado. Es esencial asegurar que alguien esté disponible para la entrega y responder rápido a cualquier consulta de aduanas.",
            "Retrasos: 4Puppies.cl no es responsable de los retrasos causados por el transportista, el clima o el despacho de aduanas. Las reclamaciones deben presentarse directamente ante FedEx.",
            "Dirección: No enviamos a casillas de correo (P.O. Boxes). Se requiere una dirección física y un número de teléfono de contacto.",
            "Daños en el Envío: Si su paquete llega dañado, debe informarnos dentro de las 48 horas posteriores a la entrega, incluyendo fotos del embalaje y del producto dañado."
          ]
        },
        {
          id: "06",
          title: "Paquetes No Reclamados o Devueltos",
          text: "Si un paquete es devuelto debido a intentos de entrega fallidos (cliente no se encuentra en casa), dirección incorrecta o negativa a pagar aranceles aduaneros, el cliente deberá pagar una nueva tarifa de envío para el reenvío. Los gastos de envío originales no son reembolsables."
        }
      ],
      button: "Entendido"
    }
  };

  const current = content[lang];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl relative flex flex-col scale-in-center">
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600"><FileText size={24} /></div>
            <div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-none">{current.title}</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{current.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200">
            <button onClick={() => setLang('en')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-blue-600'}`}>English</button>
            <button onClick={() => setLang('es')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${lang === 'es' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-blue-600'}`}>Español</button>
          </div>
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-200 rounded-full transition-colors hidden md:block"><X size={24} /></button>
        </div>
        
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-sm text-gray-600 leading-relaxed custom-scrollbar">
          {current.sections.map((sec) => (
            <section key={sec.id} className="space-y-2">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-[11px] flex items-center gap-2">
                <span className="text-blue-600">{sec.id}.</span> {sec.title}
              </h3>
              {sec.text && <p className="pl-6">{sec.text}</p>}
              {sec.list && (
                <ul className="pl-6 space-y-2 list-disc list-outside text-gray-500">
                  {sec.list.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              )}
            </section>
          ))}
          
          <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 italic flex gap-4">
             <Info className="flex-shrink-0 text-blue-600" size={20} />
             <p className="text-[11px] font-bold text-blue-800">
               {lang === 'en' 
                 ? "By purchasing, you agree to these terms and confirm you have checked our Size Guide."
                 : "Al comprar, usted acepta estos términos y confirma que ha revisado nuestra Guía de Tallas."
               }
             </p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-gray-100 flex gap-4">
          <button onClick={onClose} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg active:scale-[0.98]">
            {current.button}
          </button>
        </div>
      </div>
    </div>
  );
};

const CheckoutModal = ({ isOpen, onClose, product, orderDetails, onOpenTerms }: { isOpen: boolean, onClose: () => void, product: any, orderDetails: any, onOpenTerms: () => void }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    zipcode: '',
    country: ''
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
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
      // Create Stripe Checkout Session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product,
          orderDetails,
          customerData: formData
        })
      });
      
      const session = await response.json();
      
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error("Failed to create checkout session");
      }
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
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">FedEx Worldwide Express Delivery</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Full Name</label>
            <input required type="text" className="w-full bg-slate-50 border-2 border-transparent p-3 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" 
              value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Email</label>
              <input required type="email" className="w-full bg-slate-50 border-2 border-transparent p-3 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Phone (+Code)</label>
              <input required type="tel" className="w-full bg-slate-50 border-2 border-transparent p-3 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" 
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Country</label>
            <input required type="text" placeholder="e.g. France, USA, UK" className="w-full bg-slate-50 border-2 border-transparent p-3 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" 
              value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Address & House #</label>
            <input required type="text" placeholder="Street name and number" className="w-full bg-slate-50 border-2 border-transparent p-3 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" 
              value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Town/City</label>
              <input required type="text" className="w-full bg-slate-50 border-2 border-transparent p-3 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" 
                value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">State/Zip</label>
              <input required type="text" className="w-full bg-slate-50 border-2 border-transparent p-3 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" 
                value={formData.zipcode} onChange={e => setFormData({...formData, zipcode: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Region</label>
              <input required type="text" className="w-full bg-slate-50 border-2 border-transparent p-3 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" 
                value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} />
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

          <div className="flex items-start gap-3 p-2 group cursor-pointer" onClick={() => setAgreedToTerms(!agreedToTerms)}>
            <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${agreedToTerms ? 'bg-blue-600 border-blue-600' : 'border-gray-200 group-hover:border-blue-400'}`}>
              {agreedToTerms && <Check size={14} className="text-white" strokeWidth={4} />}
            </div>
            <p className="text-[10px] font-bold text-gray-500 leading-tight">
              I have read and agree to the <button type="button" onClick={(e) => { e.stopPropagation(); onOpenTerms(); }} className="text-blue-600 underline font-black">International Shipping & Store Policies</button>.
            </p>
          </div>

          <button disabled={isSubmitting || !agreedToTerms} type="submit" className={`w-full font-black py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98] uppercase tracking-[0.1em] text-sm flex items-center justify-center gap-2 ${
            agreedToTerms && !isSubmitting ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
          }`}>
            {isSubmitting ? 'Connecting...' : 'Secure Checkout with Card'} <ShieldCheck size={18} strokeWidth={3} />
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

const ManualOrderModal = ({ isOpen, onClose, onRefresh }: { isOpen: boolean, onClose: () => void, onRefresh: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', link?: string} | null>(null);
  const [formData, setFormData] = useState({
    customerName: '', email: '', phone: '', address: '', city: '', region: '', zipcode: '', country: '',
    items: [
      { name: '', details: '', price: '', size: '' },
      { name: '', details: '', price: '', size: '' },
      { name: '', details: '', price: '', size: '' }
    ],
    shippingCost: '45',
    paymentMethod: 'stripe'
  });

  if (!isOpen) return null;

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    const itemsTotal = formData.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    return itemsTotal + (parseFloat(formData.shippingCost) || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);
    
    try {
      const total = calculateTotal();
      // Combine multiple items into single strings for the database
      const combinedProducts = formData.items.filter(i => i.name).map(i => i.name).join(' + ');
      const combinedDetails = formData.items.filter(i => i.name).map(i => i.details).join(' | ');
      const combinedSizes = formData.items.filter(i => i.name).map(i => i.size).join(', ');

      const resp = await fetch('/api/admin/create-manual-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          productName: combinedProducts,
          petName: combinedDetails, // Using this for combined details in manual
          sizeKey: combinedSizes,
          total: total
        })
      });
      const data = await resp.json();
      if (data.success) {
        if (formData.paymentMethod === 'paid') {
          alert("Order registered as PAID! 🤘");
          onRefresh();
          onClose();
        } else {
          setStatusMessage({ type: 'success', link: data.paymentUrl });
          onRefresh();
        }
      }
    } catch (err) {
      alert("Error creating order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[3rem] max-w-3xl w-full max-h-[90vh] overflow-y-auto p-10 shadow-3xl relative custom-scrollbar">
        <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400">
          <X size={24} />
        </button>
        
        <div className="mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100"><FileText size={24} /></div>
            Create <span className="text-blue-600">Manual Order</span>
          </h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 ml-14">Generate payments for custom sales</p>
        </div>
        
        {statusMessage?.type === 'success' && statusMessage.link ? (
          <div className="bg-blue-50 p-10 rounded-[2.5rem] border border-blue-100 text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl scale-110"><Check size={40} strokeWidth={3} /></div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Order Successfully Created!</h3>
              <p className="text-sm font-bold text-slate-500 mt-1">Copy and send this link to your customer via DM or WhatsApp</p>
            </div>
            <div className="flex gap-3 bg-white p-2 rounded-2xl border border-blue-100 shadow-inner">
              <input readOnly value={statusMessage.link} className="flex-grow bg-transparent p-4 rounded-xl text-xs font-mono font-bold text-blue-600" />
              <button 
                onClick={() => { navigator.clipboard.writeText(statusMessage.link!); alert("Link copied to clipboard! 📋"); }}
                className="bg-blue-600 text-white px-8 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-all active:scale-95"
              >
                Copy Link
              </button>
            </div>
            <button onClick={onClose} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all">Done, Back to Dashboard</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Customer Info */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.2em] flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div> Customer Information
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <input required placeholder="Full Name" className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} />
                <input required placeholder="Email Address" type="email" className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <input required placeholder="Phone Number (+56...)" className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                <input placeholder="Country" className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <input placeholder="City" className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                <input placeholder="Region/State" className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} />
                <input placeholder="ZIP / Postal Code" className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" value={formData.zipcode} onChange={e => setFormData({...formData, zipcode: e.target.value})} />
              </div>
              <input required placeholder="Street Address & House Number" className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>

            {/* Products Selection */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.2em] flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div> Product Selection (Up to 3)
              </h4>
              <div className="space-y-3">
                {formData.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-3 p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                    <div className="col-span-1 flex items-center justify-center font-black text-slate-300">#{idx+1}</div>
                    <input placeholder="Team/Product" className="col-span-4 bg-white border border-slate-200 p-3 rounded-xl text-xs font-bold outline-none focus:border-blue-400" value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)} />
                    <input placeholder="Pet Info (Leo #10)" className="col-span-3 bg-white border border-slate-200 p-3 rounded-xl text-xs font-bold outline-none focus:border-blue-400" value={item.details} onChange={e => updateItem(idx, 'details', e.target.value)} />
                    <input placeholder="Size" className="col-span-2 bg-white border border-slate-200 p-3 rounded-xl text-xs font-bold outline-none focus:border-blue-400 text-center" value={item.size} onChange={e => updateItem(idx, 'size', e.target.value)} />
                    <div className="col-span-2 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input placeholder="Price" type="number" className="w-full bg-white border border-slate-200 p-3 pl-6 rounded-xl text-xs font-black text-blue-600 outline-none focus:border-blue-400" value={item.price} onChange={e => updateItem(idx, 'price', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals and Payment */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest leading-none">Payment Method</p>
                  <div className="flex flex-col gap-3">
                    <label className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer border-2 transition-all ${formData.paymentMethod === 'stripe' ? 'bg-blue-600 border-white shadow-lg' : 'bg-slate-800 border-transparent hover:bg-slate-700'}`}>
                      <input type="radio" value="stripe" checked={formData.paymentMethod === 'stripe'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="hidden" />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'stripe' ? 'border-white bg-white' : 'border-slate-500'}`}>{formData.paymentMethod === 'stripe' && <div className="w-2 h-2 bg-blue-600 rounded-full" />}</div>
                      <span className="text-xs font-black uppercase tracking-widest">Stripe Link</span>
                    </label>
                    <label className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer border-2 transition-all ${formData.paymentMethod === 'paypal' ? 'bg-blue-600 border-white shadow-lg' : 'bg-slate-800 border-transparent hover:bg-slate-700'}`}>
                      <input type="radio" value="paypal" checked={formData.paymentMethod === 'paypal'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="hidden" />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'paypal' ? 'border-white bg-white' : 'border-slate-500'}`}>{formData.paymentMethod === 'paypal' && <div className="w-2 h-2 bg-blue-600 rounded-full" />}</div>
                      <span className="text-xs font-black uppercase tracking-widest">PayPal Link</span>
                    </label>
                    <label className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer border-2 transition-all ${formData.paymentMethod === 'paid' ? 'bg-green-600 border-white shadow-lg' : 'bg-slate-800 border-transparent hover:bg-slate-700'}`}>
                      <input type="radio" value="paid" checked={formData.paymentMethod === 'paid'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="hidden" />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'paid' ? 'border-white bg-white' : 'border-slate-500'}`}>{formData.paymentMethod === 'paid' && <div className="w-2 h-2 bg-green-600 rounded-full" />}</div>
                      <span className="text-xs font-black uppercase tracking-widest">Already Paid (No Link)</span>
                    </label>
                  </div>
                </div>

                <div className="bg-slate-800 p-6 rounded-3xl space-y-4 border border-slate-700">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Shipping Cost</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-black">$</span>
                      <input type="number" className="bg-slate-700 border-none p-2 w-20 rounded-lg text-right font-black outline-none focus:ring-1 focus:ring-blue-500" value={formData.shippingCost} onChange={e => setFormData({...formData, shippingCost: e.target.value})} />
                    </div>
                  </div>
                  <div className="border-t border-slate-700 pt-4 flex justify-between items-center">
                    <span className="text-blue-400 font-black uppercase tracking-widest text-xs">Final Total</span>
                    <span className="text-3xl font-black text-white italic tracking-tighter">${calculateTotal()}.00<span className="text-[10px] not-italic text-slate-500 ml-1 uppercase">USD</span></span>
                  </div>
                </div>
              </div>

              <button disabled={isSubmitting} type="submit" className={`w-full font-black py-6 rounded-2xl uppercase tracking-[0.2em] text-sm transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] ${formData.paymentMethod === 'paid' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {isSubmitting ? 'Processing Order...' : (formData.paymentMethod === 'paid' ? 'Complete Paid Order' : 'Generate Payment Link')} 
                {!isSubmitting && <ChevronRight size={20} strokeWidth={3} />}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const AdminOrders = ({ onBack }: { onBack: () => void }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'paid' | 'shipped' | 'delivered' | 'abandoned'>('paid');
  const [trackingInputs, setTrackingInputs] = useState<Record<number, string>>({});
  const [manualOrderOpen, setManualOrderOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      const resp = await fetch('/api/admin/orders');
      const data = await resp.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleTrack = async (orderId: number) => {
    const trackingNumber = trackingInputs[orderId];
    if (!trackingNumber) return alert("Please enter tracking number");

    try {
      const resp = await fetch(`/api/admin/orders/${orderId}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber })
      });
      if (resp.ok) {
        alert("Tracking sent to customer! 📧");
        fetchOrders();
      }
    } catch (error) {
      alert("Error sending tracking");
    }
  };

  const handleDeleteOrder = async (id: number) => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone. ⚠️")) return;
    try {
      const resp = await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
      if (resp.ok) {
        fetchOrders();
      }
    } catch (error) {
      alert("Error deleting order");
    }
  };

  const printPackingSlip = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Packing Slip - Order #${order.id}</title>
          <style>
            @page { size: letter; margin: 0.5in; }
            body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.5; padding: 20px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
            .shop-info h1 { margin: 0; color: #000; font-size: 28px; font-weight: 900; }
            .order-info { text-align: right; }
            .order-info h2 { margin: 0; font-size: 20px; }
            .sections { display: flex; gap: 50px; margin-bottom: 40px; }
            .section-title { font-weight: bold; text-transform: uppercase; font-size: 12px; color: #666; margin-bottom: 10px; border-bottom: 1px solid #eee; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .items-table th { text-align: left; background: #f9f9f9; padding: 10px; font-size: 12px; border-bottom: 1px solid #ddd; }
            .items-table td { padding: 15px 10px; border-bottom: 1px solid #eee; font-size: 14px; }
            .totals { margin-left: auto; width: 250px; }
            .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
            .grand-total { border-top: 2px solid #000; margin-top: 10px; padding-top: 10px; font-weight: bold; font-size: 18px; }
            .footer { margin-top: 100px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="shop-info">
              <h1>4PUPPIES.CL</h1>
              <p>Custom Pet Apparel<br/>globalshop.4puppies.cl</p>
            </div>
            <div class="order-info">
              <h2>Pedido n.º ${order.id}</h2>
              <p>Fecha: ${new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div class="sections">
            <div style="flex: 1;">
              <div class="section-title">Enviar a:</div>
              <p><strong>${order.customer_name}</strong><br/>
              ${order.address}<br/>
              ${order.city}, ${order.region} ${order.zipcode || ''}<br/>
              ${order.country}</p>
            </div>
            <div style="flex: 1;">
              <div class="section-title">Detalles del Pago:</div>
              <p>Pagado con: Stripe Checkout<br/>
              Estado: ${order.status.toUpperCase()}</p>
            </div>
          </div>

          <div class="section-title">Artículos del Pedido</div>
          <table class="items-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Talla</th>
                <th>Personalización</th>
                <th style="text-align: right;">Precio</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${order.product_name}</strong></td>
                <td>${order.size_key}</td>
                <td>Nombre: ${order.pet_name} | Número: ${order.pet_number || 'N/A'}</td>
                <td style="text-align: right;">USD ${order.total}</td>
              </tr>
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row"><span>Subtotal:</span> <span>USD ${order.total}</span></div>
            <div class="total-row"><span>Envío:</span> <span>USD 0.00</span></div>
            <div class="total-row grand-total"><span>Total del pedido:</span> <span>USD ${order.total}</span></div>
          </div>

          <div class="footer">
            <p>¡Gracias por confiar en 4Puppies para vestir a tu mascota!<br/>
            Síguenos en Instagram @4puppies.cl</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
              <Truck className="text-blue-600" size={32} /> Order <span className="text-blue-600">Fulfillment</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage sales & FedEx tracking</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('paid')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'paid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Paid
            </button>
            <button 
              onClick={() => setActiveTab('shipped')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'shipped' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Shipped
            </button>
            <button 
              onClick={() => setActiveTab('delivered')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'delivered' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Delivered
            </button>
            <button 
              onClick={() => setActiveTab('abandoned')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'abandoned' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Abandoned
            </button>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={async () => {
                const btn = document.activeElement as HTMLButtonElement;
                if (btn) btn.disabled = true;
                try {
                  await fetch('/api/admin/sync-tracking', { method: 'POST' });
                  alert("FedEx sync complete! Emails sent if items were delivered. 🚚");
                  fetchOrders();
                } catch (e) {
                  alert("Sync failed");
                } finally {
                  if (btn) btn.disabled = false;
                }
              }}
              className="bg-white border-2 border-slate-100 text-slate-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <RefreshCcw size={14} /> Sync FedEx Status
            </button>
            <button onClick={() => setManualOrderOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2">
              <FileText size={14} /> Custom Sale
            </button>
            <button onClick={onBack} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">Back to Site</button>
          </div>
        </div>

        <ManualOrderModal isOpen={manualOrderOpen} onClose={() => setManualOrderOpen(false)} onRefresh={fetchOrders} />

        {loading ? <p className="text-center py-20 font-bold text-gray-400">Loading orders...</p> : (
          <div className="grid gap-6">
            {orders.length === 0 && <p className="text-center py-10 text-gray-400 font-bold">No orders found.</p>}
            {orders.filter(o => 
              (activeTab === 'paid' && (o.status === 'paid' || o.status === 'completed')) ||
              (activeTab === 'shipped' && o.status === 'shipped') ||
              (activeTab === 'delivered' && o.status === 'delivered') ||
              (activeTab === 'abandoned' && o.status === 'pending')
            ).length === 0 && !loading && <p className="text-center py-10 text-gray-400 font-bold">No orders in this category.</p>}
            
            {orders.filter(o => 
              (activeTab === 'paid' && (o.status === 'paid' || o.status === 'completed')) ||
              (activeTab === 'shipped' && o.status === 'shipped') ||
              (activeTab === 'delivered' && o.status === 'delivered') ||
              (activeTab === 'abandoned' && o.status === 'pending')
            ).map((order) => (
              <div key={order.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-8">
                <div className="flex-grow space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-black text-slate-900 uppercase text-lg leading-none">
                        <span className="text-blue-600 mr-2">#{order.id}</span>
                        {order.customer_name}
                      </h4>
                      <p className="text-xs font-bold text-blue-600">{order.email} • {order.phone}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        order.status === 'shipped' ? 'bg-green-100 text-green-600' : 
                        order.status === 'delivered' ? 'bg-blue-100 text-blue-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {order.status}
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => printPackingSlip(order)}
                          className="p-1.5 text-slate-300 hover:text-blue-600 transition-colors"
                          title="Print Packing Slip"
                        >
                          <Printer size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                          title="Delete Order"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Product Details</p>
                      <p className="text-sm font-bold text-slate-900">{order.product_name} ({order.size_key})</p>
                      <p className="text-sm font-bold text-slate-600 italic">Pet: {order.pet_name} (#{order.pet_number})</p>
                    </div>
                    <div className="space-y-1 text-right md:text-left">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Amount Paid</p>
                      <p className="text-xl font-black text-blue-600 leading-none">${order.total}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="md:col-span-2 pt-3 border-t border-gray-200">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Shipping Address</p>
                      <p className="text-xs font-medium text-slate-700 leading-relaxed">{order.address}</p>
                    </div>
                  </div>
                </div>

                {activeTab !== 'abandoned' && activeTab !== 'delivered' && (
                  <div className="lg:w-80 flex flex-col justify-center gap-4 bg-blue-50/30 p-6 rounded-[2rem] border border-blue-50">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-blue-600 uppercase tracking-widest ml-1">FedEx Tracking #</label>
                      <input 
                        type="text" 
                        placeholder="Enter Number"
                        className="w-full bg-white border-2 border-transparent p-3 rounded-xl text-sm font-black focus:border-blue-600 outline-none transition-all"
                        value={trackingInputs[order.id] || order.tracking_number || ''}
                        onChange={(e) => setTrackingInputs({...trackingInputs, [order.id]: e.target.value})}
                      />
                    </div>
                    <button 
                      onClick={() => handleTrack(order.id)}
                      className="w-full bg-blue-600 text-white font-black py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                    >
                      Send Tracking Email <Check size={14} />
                    </button>
                    {order.tracking_number && (
                      <a 
                        href={`https://www.fedex.com/fedextrack/?trknbr=${order.tracking_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center justify-center gap-1 hover:underline"
                      >
                        View on FedEx <ExternalLink size={12} />
                      </a>
                    )}
                    {order.status === 'shipped' && (
                      <button 
                        onClick={async () => {
                          if (confirm("Mark as DELIVERED manually and send confirmation email? 🐾")) {
                            await fetch(`/api/admin/orders/${order.id}/deliver`, { method: 'POST' });
                            fetchOrders();
                          }
                        }}
                        className="w-full bg-green-50 text-green-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-100 transition-all flex items-center justify-center gap-2"
                      >
                        <Check size={14} strokeWidth={3} /> Mark Delivered
                      </button>
                    )}
                  </div>
                )}
                {order.status === 'delivered' && (
                  <div className="lg:w-80 flex flex-col justify-center gap-4 bg-slate-50 p-6 rounded-[2rem]">
                    <div className="w-full bg-slate-200 text-slate-500 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-default">
                      <Package size={16} /> Order Completed
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 text-center uppercase">Delivered at {order.delivered_at ? new Date(order.delivered_at).toLocaleDateString() : 'N/A'}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeReviewId, setActiveReviewId] = useState<number | null>(null);
  const [adminView, setAdminView] = useState<'none' | 'reviews' | 'orders' | 'success'>(
    window.location.pathname === '/admin-reviews' ? 'reviews' : 
    window.location.pathname === '/admin-orders' ? 'orders' : 
    window.location.pathname === '/success' ? 'success' : 'none'
  );

  useEffect(() => {
    fetchReviews();
    // Handle URL changes
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin-reviews') setAdminView('reviews');
      else if (path === '/admin-orders') setAdminView('orders');
      else if (path === '/success') setAdminView('success');
      else setAdminView('none');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    if (path === '/admin-reviews') setAdminView('reviews');
    else if (path === '/admin-orders') setAdminView('orders');
    else if (path === '/success') setAdminView('success');
    else setAdminView('none');
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

  if (adminView === 'reviews') return <AdminReviews onBack={() => navigateTo('/')} />;
  if (adminView === 'orders') return <AdminOrders onBack={() => navigateTo('/')} />;

  if (adminView === 'success') {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6">
        <div className="bg-white max-w-lg w-full rounded-[3rem] shadow-2xl p-10 md:p-14 text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-8">
            <Check size={40} strokeWidth={3} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">
            Payment <span className="text-green-500">Successful!</span>
          </h1>
          <p className="text-gray-500 font-bold text-lg leading-relaxed">
            Thank you for your order! 🎉
          </p>
          <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 text-sm text-gray-600 space-y-3">
            <p>Your payment has been securely processed by Stripe.</p>
            <p>Our tailors are already reviewing your custom pet details. <b>Production takes 8-10 business days.</b></p>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic">
            You will receive a confirmation email shortly.
          </p>
          <button 
            onClick={() => navigateTo('/')}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl uppercase tracking-widest hover:bg-black transition-all shadow-xl mt-4"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
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
              CUSTOM <br /><span className="text-blue-600">FOOTBALL</span><br />PET JERSEYS.
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
            <button 
              onClick={() => setTermsModalOpen(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 underline font-black transition-colors"
            >
              TERMS & CONDITIONS • SHIPPING POLICY
            </button>
            <span className="mt-4 text-[9px] opacity-70">NOT AFFILIATED WITH FIFA. ALL DESIGNS ARE CUSTOM FAN ART.</span>
          </p>
        </div>
      </footer>
      <SizeGuideModal isOpen={sizeModalOpen} onClose={() => setSizeModalOpen(false)} />
      {selectedProduct && (
        <CheckoutModal 
          isOpen={checkoutModalOpen} 
          onClose={() => setCheckoutModalOpen(false)} 
          product={selectedProduct} 
          orderDetails={orderDetails} 
          onOpenTerms={() => setTermsModalOpen(true)}
        />
      )}
      <ReviewModal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} onRefresh={fetchReviews} />
      <AllReviewsModal isOpen={allReviewsOpen} onClose={() => setAllReviewsOpen(false)} reviews={reviews} onZoom={setFullscreenImage} />
      <TermsModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
      <FullscreenImageModal imageUrl={fullscreenImage} onClose={() => setFullscreenImage(null)} />
    </div>
  );
}
