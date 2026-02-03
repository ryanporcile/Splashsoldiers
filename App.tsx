
import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  Star, 
  Phone, 
  Clock, 
  Facebook, 
  MapPin, 
  CheckCircle2, 
  Menu, 
  X, 
  ChevronRight,
  ShieldCheck,
  Award,
  Heart,
  ExternalLink,
  Send,
  Loader2,
  Signal,
  Mail,
  Zap,
  Radio,
  Scan,
  Maximize2,
  Target,
  ShieldAlert
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- CONFIGURATION ---
const COMMAND_CONFIG = {
  ACCESS_KEY: "30dcce93-7c2f-4ff2-b591-a7224229e3ed", 
  FACEBOOK_URL: "https://facebook.com",
  PHONE: "(754) 779-3659",
  HOURS: "08:00 AM - 08:00 PM",
};

// --- Sub-Components ---

const QuoteModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'loading' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'Roof Restoration Mission',
    address: '',
    details: ''
  });
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');
    setUploadProgress(10);

    try {
      // Create a fresh instance for the request
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `The user ${formData.name} is requesting a ${formData.service} mission at ${formData.address}. Phone: ${formData.phone}. 
        Write a very brief (2 sentences), professional, military-themed confirmation message as 'Splash Soldiers HQ'. 
        Mention that Mason or Connor will be reviewing the coordinates for deployment shortly.`,
      });

      setUploadProgress(40);

      const web3FormsPromise = fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: COMMAND_CONFIG.ACCESS_KEY,
          subject: `NEW MISSION REQUEST: ${formData.service} - ${formData.name}`,
          from_name: "Splash Soldiers Portal",
          name: formData.name,
          phone: formData.phone,
          service: formData.service,
          address: formData.address,
          message: formData.details || "No additional notes provided.",
        }),
      });

      setUploadProgress(70);
      await web3FormsPromise;
      setUploadProgress(100);
      
      setAiAnalysis(response.text || "Mission briefing received. HQ is reviewing the coordinates.");
      setTimeout(() => setStep('success'), 800);
    } catch (error) {
      console.error("Transmission Interrupted", error);
      setAiAnalysis("Briefing received at primary relay. HQ Mason and Connor are standing by.");
      setStep('success');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl shadow-electric/30 animate-in zoom-in-95 duration-500">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-zinc-900 overflow-hidden">
            <div 
                className="h-full bg-electric-blue transition-all duration-500 ease-out shadow-[0_0_10px_#00f2ff]" 
                style={{ width: `${uploadProgress}%` }}
            ></div>
        </div>
        
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-all hover:rotate-90 z-10">
          <X size={28} />
        </button>

        {step === 'form' && (
          <div className="p-8 md:p-14">
            <div className="mb-10 flex flex-col gap-2">
              <div className="flex items-center gap-2 electric-blue">
                  <Radio size={16} className="animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Encrypted Uplink: Active</span>
              </div>
              <h2 className="text-5xl font-oswald uppercase italic font-black tracking-tight">Mission <span className="electric-blue">Uplink</span></h2>
              <p className="text-gray-500 text-sm font-medium">Transmit your coordinates for immediate tactical assessment.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Client Identity</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Full Name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all placeholder:text-gray-700 text-white"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Comm Frequency</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="(000) 000-0000"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all placeholder:text-gray-700 text-white"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Operation Type</label>
                <div className="relative">
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-electric-blue appearance-none cursor-pointer text-white"
                      value={formData.service}
                      onChange={(e) => setFormData({...formData, service: e.target.value})}
                    >
                      <option className="bg-zinc-950">Roof Restoration Mission</option>
                      <option className="bg-zinc-950">Driveway & Patio Blast</option>
                      <option className="bg-zinc-950">Full Property Clearing</option>
                      <option className="bg-zinc-950">Siding/Exterior Sanitization</option>
                    </select>
                    <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-gray-600 pointer-events-none" size={20} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Target Site (Address)</label>
                <input 
                  required
                  type="text" 
                  placeholder="Street Address, City, State"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all placeholder:text-gray-700 text-white"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <button type="submit" className="group w-full bg-electric-blue text-black py-5 rounded-2xl font-black uppercase italic tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-electric flex items-center justify-center gap-4 text-lg mt-4">
                DEPLOY BRIEFING <Send size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        )}

        {step === 'loading' && (
          <div className="p-24 flex flex-col items-center justify-center text-center space-y-10">
            <div className="relative">
                <div className="absolute inset-0 bg-electric-blue/20 blur-3xl rounded-full animate-pulse"></div>
                <Loader2 className="w-24 h-24 electric-blue animate-spin relative z-10" strokeWidth={1} />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Signal className="electric-blue animate-bounce" size={32} />
                </div>
            </div>
            <div className="space-y-3">
                <h3 className="text-3xl font-oswald uppercase italic font-black tracking-widest">Transmitting...</h3>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest animate-pulse">Establishing secure link to Mason & Connor</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-14 text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-28 h-28 bg-electric-blue/10 rounded-[40%] flex items-center justify-center mx-auto border border-electric-blue/30 shadow-electric relative">
              <CheckCircle2 size={56} className="electric-blue" />
              <div className="absolute -inset-4 bg-electric-blue/5 blur-xl rounded-full animate-pulse"></div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-5xl font-oswald uppercase italic font-black">Mission <span className="electric-blue">Confirmed</span></h3>
              <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl relative">
                 <div className="absolute top-0 left-0 w-1 h-full bg-electric-blue/40"></div>
                 <p className="text-gray-300 italic text-lg leading-relaxed">"{aiAnalysis}"</p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-full py-5 border border-white/10 rounded-2xl uppercase font-black italic tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Back to Base
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Header: React.FC<{ onOpenQuote: () => void }> = ({ onOpenQuote }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black/95 backdrop-blur-md py-4 border-b border-white/5 shadow-2xl' : 'bg-transparent py-8'}`}>
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer">
          <Droplets className="w-10 h-10 electric-blue group-hover:scale-110 transition-transform duration-500" />
          <div className="flex flex-col -space-y-1">
            <span className="text-2xl font-black font-oswald tracking-tighter uppercase italic leading-none">
              Splash <span className="electric-blue">Soldiers</span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500">Elite Pressure Division</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {['Home', 'Services', 'Reviews', 'About'].map((item) => (
            <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="relative text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-electric-blue transition-colors group"
            >
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-electric-blue transition-all group-hover:w-full shadow-electric"></span>
            </a>
          ))}
          <button onClick={onOpenQuote} className="bg-electric-blue text-black px-8 py-3 rounded-xl font-black uppercase text-[11px] italic hover:scale-105 hover:brightness-110 active:scale-95 transition-all shadow-electric">
            Deploy Request
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden electric-blue p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[88px] bg-black/98 backdrop-blur-3xl z-40 p-10 flex flex-col gap-8 animate-in slide-in-from-right-full duration-500">
          {['Home', 'Services', 'Reviews', 'About'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} className="text-6xl font-oswald uppercase italic font-black border-b border-white/5 pb-4">
                {item}
            </a>
          ))}
          <button onClick={() => { setIsMenuOpen(false); onOpenQuote(); }} className="mt-auto bg-electric-blue text-black p-8 rounded-3xl font-black text-3xl uppercase italic shadow-electric">
            Free Quote
          </button>
        </div>
      )}
    </header>
  );
};

const Hero: React.FC<{ onOpenQuote: () => void }> = ({ onOpenQuote }) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-black">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-electric-blue/10 blur-[180px] -z-10 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-electric-blue/5 blur-[150px] -z-10 rounded-full"></div>
      
      <div className="container mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-12 relative z-10">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-electric-blue/20 bg-electric-blue/5 text-electric-blue font-black text-[10px] uppercase tracking-[0.4em] shadow-lg animate-bounce-subtle">
            <ShieldCheck size={16} /> Force Certified Excellence
          </div>
          
          <h1 className="text-7xl md:text-[120px] font-black font-oswald uppercase leading-[0.85] italic tracking-tighter">
            Command <br />
            <span className="electric-blue glow-text">The Grime.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-xl leading-relaxed font-medium">
            From tactical roof restoration to high-pressure driveway clearing, Mason and Connor execute every mission with military-grade precision.
          </p>
          
          <div className="flex flex-wrap gap-8 pt-4">
            <button 
              onClick={onOpenQuote}
              className="group bg-electric-blue text-black px-12 py-6 rounded-2xl font-black text-2xl uppercase italic tracking-tighter flex items-center gap-4 hover:scale-105 hover:rotate-1 transition-all shadow-electric"
            >
              DEPLOY SQUAD <ChevronRight className="group-hover:translate-x-3 transition-transform" />
            </button>
            
            <div className="flex items-center gap-5 px-8 py-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl group hover:border-electric-blue/30 transition-all cursor-default">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-black bg-zinc-800 overflow-hidden shadow-xl ring-2 ring-electric-blue/10">
                    <img src={`https://picsum.photos/seed/${i+123}/100/100`} alt="Client" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-electric-blue">
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                  <span className="text-white ml-2 font-black text-xl">4.9/5</span>
                </div>
                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black">37 Google Mission Reports</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative h-full flex items-center justify-center lg:pl-12">
          <div className="absolute inset-0 bg-electric-blue/5 blur-[120px] rounded-full animate-pulse"></div>
          
          <div className="relative w-full aspect-[4/5] rounded-[60px] border border-white/10 overflow-hidden shadow-2xl group ring-1 ring-white/10">
             {/* Realistic Imagery */}
             <img 
               src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop" 
               alt="Pressure Washing" 
               className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
             />
             
             {/* Overlay HUD */}
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
             
             <div className="absolute top-12 left-12 flex flex-col gap-3">
                 <div className="flex gap-2">
                    <div className="px-4 py-2 bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">STATUS: ACTIVE</div>
                    <div className="px-4 py-2 bg-electric-blue/80 backdrop-blur-md border border-electric-blue/20 rounded-full text-[10px] font-black uppercase tracking-widest text-black shadow-lg">TARGET: GRIME</div>
                 </div>
                 <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <Target size={14} className="electric-blue animate-pulse" /> SCANNING PERIMETER...
                 </div>
             </div>

             <div className="absolute bottom-12 left-12 right-12 p-10 bg-zinc-950/60 backdrop-blur-3xl border border-white/10 rounded-[45px] flex justify-between items-center group-hover:border-electric-blue/40 transition-all duration-500">
                <div className="space-y-2">
                    <h3 className="font-black text-3xl font-oswald uppercase italic tracking-tight">Tactical Restoration</h3>
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                        <Scan size={16} className="electric-blue" /> Precision Grade: 100%
                    </p>
                </div>
                <div className="w-16 h-16 rounded-[22px] bg-electric-blue text-black flex items-center justify-center shadow-electric group-hover:rotate-12 transition-transform">
                    <Maximize2 size={32} />
                </div>
             </div>
             <div className="absolute top-0 left-0 w-full h-[2px] bg-electric-blue/50 shadow-[0_0_15px_#00f2ff] animate-scan pointer-events-none"></div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scan {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
        .animate-scan { animation: scan 4s linear infinite; }
        @keyframes bounce-subtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle { animation: bounce-subtle 3s ease-in-out infinite; }
      `}</style>
    </section>
  );
};

const Features: React.FC = () => {
  const stats = [
    { icon: <Clock />, label: "Response", value: "Rapid Deployment", desc: "Short notice missions accepted daily." },
    { icon: <ShieldAlert />, label: "Security", value: "Eco-Strategic", desc: "Safe soft-wash formulas for your home." },
    { icon: <Heart />, label: "Diversity", value: "LGBTQ+ Friendly", desc: "Proudly serving all community sectors." },
    { icon: <Award />, label: "Ranking", value: "4.9 Elite Rating", desc: "Highly recommended by local command." },
  ];

  return (
    <section className="py-24 bg-zinc-950 border-y border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-10 border border-white/5 rounded-[40px] bg-black/30 hover:bg-zinc-900/40 hover:border-electric-blue/20 transition-all group relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 electric-blue group-hover:scale-110 group-hover:border-electric-blue/40 transition-all duration-500">
                {React.cloneElement(stat.icon as React.ReactElement, { size: 32 })}
              </div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 font-black mb-3">{stat.label}</p>
              <h3 className="text-2xl font-oswald uppercase italic font-black mb-3 text-white tracking-tight">{stat.value}</h3>
              <p className="text-gray-500 leading-relaxed text-sm font-medium">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Services: React.FC<{ onOpenQuote: () => void }> = ({ onOpenQuote }) => {
  const services = [
    { 
      title: "Roof Strategic Restoration", 
      desc: "Soft-wash technology that kills algae and mold at the root without damaging shingles.", 
      tag: "Specialized",
      icon: <Target size={24} />
    },
    { 
      title: "Driveway & Patio Blast", 
      desc: "High-pressure units to strip away decades of dirt, oil, and organic growth.", 
      tag: "Heavy Duty",
      icon: <Zap size={24} />
    },
    { 
      title: "Full Exterior Siding Clean", 
      desc: "Comprehensive cleaning for vinyl, brick, and stucco to restore original brilliance.", 
      tag: "Recommended",
      icon: <Droplets size={24} />
    },
  ];

  return (
    <section id="services" className="py-32 bg-black">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-10">
          <div className="max-w-3xl">
            <div className="text-electric-blue font-black text-[10px] uppercase tracking-[0.6em] mb-6 flex items-center gap-4">
                <div className="w-12 h-0.5 bg-electric-blue"></div> Operations Menu
            </div>
            <h2 className="text-7xl md:text-8xl font-oswald uppercase font-black italic leading-[0.9] tracking-tighter">Active <span className="electric-blue">Missions</span></h2>
          </div>
          <p className="text-xl text-gray-500 max-w-sm leading-relaxed font-medium">Select your objective. Mason and Connor are ready for immediate dispatch.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-[55px] bg-zinc-900/30 border border-white/5 p-12 hover:border-electric-blue/30 transition-all duration-500 shadow-2xl">
              <div className="flex justify-between items-start mb-12">
                <div className="w-16 h-16 rounded-3xl bg-electric-blue/5 border border-electric-blue/20 flex items-center justify-center electric-blue group-hover:bg-electric-blue group-hover:text-black transition-all duration-500">
                  {service.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-500 group-hover:text-electric-blue transition-colors">
                  {service.tag}
                </span>
              </div>
              <div className="space-y-6">
                <h3 className="text-4xl font-oswald uppercase italic font-black leading-tight tracking-tight">{service.title}</h3>
                <p className="text-gray-400 text-lg leading-relaxed font-medium">{service.desc}</p>
                <button 
                  onClick={onOpenQuote}
                  className="group/btn flex items-center gap-5 text-white font-black uppercase text-xs tracking-[0.4em] cursor-pointer pt-4"
                >
                  <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover/btn:bg-electric-blue group-hover/btn:text-black group-hover/btn:border-electric-blue transition-all duration-500">
                    <ChevronRight size={22} />
                  </div>
                  Initialize Mission
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials: React.FC = () => {
  const reviews = [
    { 
      name: "Ryan Porcile", 
      text: "I hired Mason and Connor (Splash soldiers) to do my roof, got the job done in no time! They were very professional, highly recommend.",
      role: "Property Owner",
      initials: "RP"
    },
    { 
      name: "Sean Allen", 
      text: "I hired Splash Soldiers to pressure wash my property and they did an amazing job from start to finish. They arrived on time, were able to come out on short notice, and completed the job efficiently.",
      role: "Verified Client",
      initials: "SA"
    }
  ];

  return (
    <section id="reviews" className="py-32 bg-zinc-950 border-y border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div className="max-w-2xl">
            <h2 className="text-7xl font-oswald uppercase font-black italic leading-[0.9] tracking-tighter">Field <span className="electric-blue">Reports</span></h2>
            <p className="text-xl text-gray-500 mt-8 leading-relaxed font-medium">Verified mission briefings from satisfied property commanders.</p>
          </div>
          <div className="flex items-center gap-8 bg-black/60 p-10 rounded-[50px] border border-white/10 backdrop-blur-3xl shadow-2xl">
             <span className="text-7xl font-oswald italic electric-blue font-black tracking-tighter">4.9</span>
             <div className="space-y-3">
                <div className="flex gap-2 text-electric-blue">
                  {[1,2,3,4,5].map(s => <Star key={s} size={24} fill="currentColor" />)}
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[11px] uppercase font-black text-gray-400 tracking-[0.2em]">37 Google Reports</span>
                </div>
             </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {reviews.map((rev, idx) => (
            <div key={idx} className="relative p-12 bg-zinc-900/30 border border-white/5 rounded-[60px] hover:bg-zinc-900/50 hover:border-electric-blue/30 transition-all duration-700 group">
              <div className="flex gap-6 items-center mb-10">
                <div className="w-20 h-20 rounded-3xl bg-zinc-800 flex items-center justify-center text-4xl font-black text-white font-oswald italic border border-white/10 group-hover:border-electric-blue/40 transition-all">
                  {rev.initials}
                </div>
                <div>
                  <h4 className="font-black text-2xl uppercase italic tracking-tighter text-white">{rev.name}</h4>
                  <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">{rev.role}</p>
                </div>
              </div>
              <p className="text-2xl text-gray-300 leading-relaxed font-medium italic">
                "{rev.text}"
              </p>
              <div className="mt-10 flex gap-2 text-electric-blue">
                {[1,2,3,4,5].map(s => <Star key={s} size={20} fill="currentColor" />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About: React.FC = () => {
  return (
    <section id="about" className="py-32 bg-black">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="grid grid-cols-2 gap-8">
              <div className="relative group">
                <img src="https://images.unsplash.com/photo-1521791136064-7986c2959213?q=80&w=2070&auto=format&fit=crop" alt="Work" className="rounded-[50px] border border-white/10 w-full aspect-[3/4] object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
              </div>
              <div className="space-y-8 pt-20">
                <img src="https://images.unsplash.com/photo-1542312589-58d609f20371?q=80&w=2070&auto=format&fit=crop" alt="Cleaning" className="rounded-[50px] border border-white/10 w-full aspect-[3/4] object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                <div className="bg-electric-blue p-12 rounded-[50px] text-black shadow-electric">
                   <h4 className="text-6xl font-oswald uppercase italic font-black leading-none mb-3 tracking-tighter">37+</h4>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] leading-tight">Confirmed Mission <br /> Successes</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-12">
            <div>
                <div className="text-electric-blue font-black text-[10px] uppercase tracking-[0.6em] mb-6 flex items-center gap-4">
                    <div className="w-12 h-0.5 bg-electric-blue"></div> The High Command
                </div>
                <h2 className="text-8xl font-oswald uppercase font-black italic leading-[0.85] tracking-tighter">Mason <br /> & <span className="electric-blue">Connor</span></h2>
            </div>
            <p className="text-2xl text-gray-400 leading-relaxed font-medium">
              Splash Soldiers was forged with a singular objective: delivering high-intensity cleaning with military precision. We don't just wash; we restore property pride.
            </p>
            <div className="space-y-6">
              {[
                "Certified Soft-Wash Tacticians",
                "LGBTQ+ Inclusive Operations",
                "Advanced Eco-Safe Solutions",
                "Precision High-Pressure Units"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 group cursor-default">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                    <CheckCircle2 size={22} className="electric-blue" />
                  </div>
                  <span className="text-xl font-bold uppercase italic tracking-tighter text-gray-400 group-hover:text-white transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/5 pt-32 pb-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-20 mb-32">
          <div className="md:col-span-2 space-y-12">
            <div className="flex items-center gap-4">
              <Droplets className="w-14 h-14 electric-blue" />
              <div className="flex flex-col -space-y-1">
                <span className="text-5xl font-black font-oswald tracking-tighter uppercase italic leading-none">
                  Splash <span className="electric-blue">Soldiers</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-600">Elite Cleaning Division</span>
              </div>
            </div>
            <p className="text-gray-500 max-w-sm leading-relaxed text-xl font-medium">
              Elite pressure washing for property owners who demand strategic precision and absolute results.
            </p>
            <div className="flex gap-6">
              <a href={COMMAND_CONFIG.FACEBOOK_URL} className="w-16 h-16 rounded-[24px] bg-zinc-900 border border-white/10 flex items-center justify-center hover:bg-electric-blue hover:text-black transition-all shadow-xl duration-500">
                <Facebook size={28} />
              </a>
              <a href={`tel:${COMMAND_CONFIG.PHONE}`} className="w-16 h-16 rounded-[24px] bg-zinc-900 border border-white/10 flex items-center justify-center hover:bg-electric-blue hover:text-black transition-all shadow-xl duration-500">
                <Phone size={28} />
              </a>
            </div>
          </div>
          <div className="space-y-10">
            <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/50">Contact HQ</h4>
            <div className="space-y-8">
              <a href={`tel:${COMMAND_CONFIG.PHONE}`} className="flex items-center gap-5 text-gray-400 hover:text-electric-blue transition-colors text-xl font-black italic tracking-tight">
                <Phone size={20} className="electric-blue" />
                {COMMAND_CONFIG.PHONE}
              </a>
              <div className="flex items-center gap-5 text-gray-400 text-xl font-black italic tracking-tight">
                <Mail size={20} className="electric-blue" />
                facebook.com/splash
              </div>
              <div className="flex items-center gap-5 text-gray-400 text-xl font-black italic tracking-tight">
                <Clock size={20} className="electric-blue" />
                {COMMAND_CONFIG.HOURS}
              </div>
            </div>
          </div>
          <div className="space-y-10">
            <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/50">Base Nav</h4>
            <div className="flex flex-col gap-6">
              {['Home', 'Services', 'Reviews', 'About'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-xl font-black text-gray-500 hover:text-white transition-colors italic uppercase tracking-tighter flex items-center gap-3">
                    {item} Base
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.4em]">© 2024 Splash Soldiers Elite. Tactical Deployment Unit.</p>
        </div>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-electric-blue selection:text-black">
      <Header onOpenQuote={() => setIsQuoteOpen(true)} />
      <main>
        <Hero onOpenQuote={() => setIsQuoteOpen(true)} />
        <Features />
        <Services onOpenQuote={() => setIsQuoteOpen(true)} />
        <Testimonials />
        <About />
      </main>
      <Footer />
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
      <div className="md:hidden fixed bottom-10 right-10 z-[60]">
        <a 
            href={`tel:${COMMAND_CONFIG.PHONE}`} 
            className="w-20 h-20 bg-electric-blue text-black rounded-[30px] flex items-center justify-center shadow-electric animate-pulse-slow border-2 border-black/20"
        >
            <Phone size={32} />
        </a>
      </div>
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(0,242,255,0.3); }
          50% { transform: scale(1.05); box-shadow: 0 0 40px rgba(0,242,255,0.5); }
        }
        .animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default App;
