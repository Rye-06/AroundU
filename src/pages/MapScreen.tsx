import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, Clock, Users, MessageSquare, Plus, X, Sparkles, Send, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { mapEvents, mapIcebreakers } from '../data/mockData';

// Helper to parse '20%' to 20
const getNum = (val: string) => parseFloat(val.replace('%', ''));


export function MapScreen({ onBack, onCreateEvent, onGoToMessages }: { onBack: () => void, onCreateEvent: () => void, onGoToMessages: () => void }) {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedIcebreaker, setSelectedIcebreaker] = useState<string | null>(null);
  
  const [localIcebreakers, setLocalIcebreakers] = useState(mapIcebreakers);
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [showCreateIcebreaker, setShowCreateIcebreaker] = useState(false);
  
  const [newIceText, setNewIceText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePostIcebreaker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIceText.trim()) return;
    
    const newIce = {
      id: `ice-${Date.now()}`,
      author: 'Alex Rivers',
      message: newIceText,
      avatar: 'https://picsum.photos/seed/alex/50/50',
      top: '50%',
      left: '50%',
    };
    
    setLocalIcebreakers([...localIcebreakers, newIce]);
    setNewIceText('');
    setShowCreateIcebreaker(false);
    showToast('Icebreaker dropped on map!');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplyText('');
    setSelectedIcebreaker(null);
    showToast('Reply sent successfully!');
  };

  // Click outside handler for the map background
  const handleMapClick = (e: React.MouseEvent) => {
    // Only dismiss if clicking directly on the map background, not on markers/cards
    if ((e.target as HTMLElement).id === 'map-background') {
      setSelectedEvent(null);
      setSelectedIcebreaker(null);
      setShowFabMenu(false);
    }
  };

  const hasSelection = selectedEvent || selectedIcebreaker;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full w-full bg-primary-50 relative overflow-hidden"
    >
      {/* Interactive Map Background */}
      <div 
        id="map-background"
        className="absolute inset-0 cursor-default"
        onClick={handleMapClick}
      >
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary-200/40 rounded-full blur-[100px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-coral-100/40 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-sm border border-surface-200 flex items-center space-x-2 pointer-events-auto">
          <button onClick={onBack} className="text-ink-500 hover:text-ink-800 transition-colors">
            <Home className="w-5 h-5" />
          </button>
          <span className="text-surface-300">|</span>
          <h1 className="text-lg font-semibold text-ink-600">Campus Map</h1>
        </div>
        <div className="flex gap-3 pointer-events-auto">
          <button className="bg-white/80 backdrop-blur-md p-3 rounded-full shadow-sm border border-surface-200 hover:bg-white transition-colors">
            <Search className="w-5 h-5 text-ink-400" />
          </button>
        </div>
      </header>

      {/* Global Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="absolute top-24 left-1/2 z-50 bg-ink-900 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-3 pointer-events-none"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Markers - Events */}
      {mapEvents.map(event => {
        const Icon = event.icon;
        const isSelected = selectedEvent === event.id;
        
        // Edge containment logic: if too far left/right, adjust transform origin
        const isFarLeft = parseInt(event.left) < 30;
        const isFarRight = parseInt(event.left) > 70;
        
        const isDimmed = hasSelection && !isSelected;
        
        // --- Intuitive Map Pin Logic ---
        
        // 1. Activity Level -> Size & Glow (larger readable sizes)
        let sizeClass = "w-[18px] h-[18px]"; // moderate
        let iconSizeClass = "w-[10px] h-[10px]";
        let glowClass = "shadow-[0_0_10px_rgba(112,147,136,0.2)]";
        
        if (event.activityLevel === 'quiet') {
          sizeClass = "w-[14px] h-[14px]";
          iconSizeClass = "w-[8px] h-[8px]";
          glowClass = ""; // no glow for quiet
        } else if (event.activityLevel === 'high') {
          sizeClass = "w-[22px] h-[22px]";
          iconSizeClass = "w-[12px] h-[12px]";
          glowClass = "shadow-[0_0_12px_rgba(112,147,136,0.3)]"; // gentle halo
        }

        // 2. Group Size -> Ring (thinner, calmer rings)
        let ringClass = "outline outline-1 outline-offset-2 outline-primary-300/30"; // medium ring
        if (event.groupSize === 'small') {
          ringClass = "outline outline-1 outline-offset-[2px] outline-primary-300/20"; // thin ring
        } else if (event.groupSize === 'large') {
          ringClass = "outline outline-1 outline-offset-[3px] outline-dashed outline-primary-400/40"; // broken ring
        }

        return (
          <div 
            key={event.id}
            className={cn("absolute z-10 font-sans transition-opacity duration-700 ease-out group", isSelected ? "z-30" : "hover:z-20", isDimmed ? "opacity-30" : "opacity-100")}
            style={{ top: event.top, left: event.left, transform: 'translate(-50%, -50%)' }} // proper centering
          >
            {/* Quick Hover Label (only shows if NOT selected) */}
            <AnimatePresence>
              {!isSelected && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm border border-surface-200 text-[10px] font-medium text-ink-700">
                    {event.category} group · {event.attendees} people
                  </div>
                </div>
              )}
            </AnimatePresence>

            {/* Inline Popover Card (renders ABOVE the marker when clicked) */}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: "easeOut" }} // exactly 250ms duration
                  className={cn(
                    "absolute bottom-full mb-3 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-surface-200/50 border border-surface-100 p-4",
                    isFarLeft ? "left-0 origin-bottom-left" : isFarRight ? "right-0 origin-bottom-right" : "left-1/2 -translate-x-1/2 origin-bottom"
                  )}
                >
                  <h3 className="font-bold text-ink-900 leading-tight truncate">{event.title}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-ink-500 font-medium">
                    <Clock className="w-3 h-3 text-coral-400" />
                    <span>{event.timeLeft}</span>
                  </div>
                  
                  <p className="mt-2 text-xs text-ink-600 line-clamp-2 leading-relaxed">{event.description}</p>
                  
                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {event.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-surface-100 text-ink-600 text-[10px] font-semibold rounded-md border border-surface-200/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-surface-100 pt-3">
                    <div className="flex -space-x-1.5">
                      {[...Array(Math.min(event.attendees, 3))].map((_, i) => (
                        <img 
                          key={i}
                          src={`https://picsum.photos/seed/map${i}${event.id}/50/50`} 
                          alt="avatar" 
                          className="w-5 h-5 rounded-full border border-white"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                      <span className="w-5 h-5 rounded-full bg-surface-100 border border-white flex items-center justify-center text-[9px] font-bold text-ink-500">
                        +{event.attendees}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => { setSelectedEvent(null); onGoToMessages(); }}
                      className="text-primary-600 hover:text-primary-700 text-[11px] font-bold transition-colors"
                    >
                      join if you'd like
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Marker Itself - Intuitive Node with enlarged hit area */}
            <div 
              className="flex items-center justify-center cursor-pointer relative p-4"
              onClick={(e) => { 
                e.stopPropagation(); 
                setSelectedEvent(isSelected ? null : event.id); 
                setSelectedIcebreaker(null); 
              }}
            >
              <div 
                className={cn(
                  "rounded-full pointer-events-auto transition-transform duration-500 flex items-center justify-center",
                  "bg-primary-500 text-white",
                  sizeClass,
                  glowClass,
                  ringClass,
                  isSelected ? "scale-[1.08]" : "group-hover:scale-[1.06]"
                )}
              >
                <Icon className={cn(iconSizeClass, "opacity-90 stroke-[2.5]")} />
              </div>
            </div>
          </div>
        );
      })}

      {/* Map Markers - Icebreakers */}
      {localIcebreakers.map(ice => {
        const isSelected = selectedIcebreaker === ice.id;
        const isFarLeft = parseInt(ice.left) < 30;
        const isFarRight = parseInt(ice.left) > 70;
        const isDimmed = hasSelection && !isSelected;

        return (
          <div 
            key={ice.id}
            className={cn("absolute z-10 font-sans transition-opacity duration-700 ease-out group", isSelected ? "z-30" : "hover:z-20", isDimmed ? "opacity-30" : "opacity-100")}
            style={{ top: ice.top, left: ice.left, transform: 'translate(-50%, -50%)' }}
          >
            {/* Quick Hover Label */}
            {!isSelected && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm border border-surface-200 text-[10px] font-medium text-ink-700">
                  {ice.author}: "{ice.message.slice(0, 30)}..."
                </div>
              </div>
            )}

            {/* Inline Popover Card */}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={cn(
                    "absolute bottom-full mb-3 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-surface-200/50 border border-surface-100 p-4 text-center",
                    isFarLeft ? "left-0 origin-bottom-left" : isFarRight ? "right-0 origin-bottom-right" : "left-1/2 -translate-x-1/2 origin-bottom"
                  )}
                >
                  <p className="font-bold text-ink-900 text-sm leading-snug">"{ice.message}"</p>
                  <p className="text-[11px] text-ink-500 mt-1">— {ice.author}</p>
                  
                  <form onSubmit={handleSendReply} className="w-full mt-3 bg-surface-50 p-1 rounded-xl border border-surface-200 flex items-center focus-within:ring-2 focus-within:ring-coral-200 transition-all">
                    <input 
                      type="text" 
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Send a reply..."
                      className="w-full bg-transparent border-none text-xs px-2 focus:outline-none placeholder:text-ink-400" 
                    />
                    <button 
                      disabled={!replyText.trim()}
                      type="submit" 
                      className="bg-coral-500 text-white w-7 h-7 rounded-lg flex items-center justify-center hover:bg-coral-600 transition-colors shrink-0 disabled:opacity-40"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Icebreaker Marker - Avatar node with speech indicator */}
            <div 
              className="flex items-center justify-center cursor-pointer pointer-events-auto p-3"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIcebreaker(isSelected ? null : ice.id);
                setSelectedEvent(null);
              }}
            >
              <div className={cn(
                "relative rounded-full transition-transform duration-500",
                isSelected ? "scale-[1.08]" : "group-hover:scale-[1.06]"
              )}>
                <img 
                  src={ice.avatar} 
                  alt={ice.author} 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-coral-400 text-white rounded-full flex items-center justify-center border border-white">
                  <MessageSquare className="w-2 h-2" />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Expandable FAB Wrapper */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 pointer-events-auto">
        <AnimatePresence>
          {showFabMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="flex flex-col items-center gap-3 origin-bottom"
            >
              <button 
                onClick={() => { setShowFabMenu(false); setShowCreateIcebreaker(true); }}
                className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-lg border border-surface-200 hover:border-coral-200 transition-colors group"
              >
                <span className="text-sm font-semibold text-ink-700 group-hover:text-coral-600 transition-colors">Drop Icebreaker</span>
                <div className="w-8 h-8 rounded-full bg-coral-50 flex items-center justify-center text-coral-500 group-hover:scale-105 transition-transform duration-300">
                  <Sparkles className="w-4 h-4" />
                </div>
              </button>

              <button 
                onClick={() => { setShowFabMenu(false); onCreateEvent(); }}
                className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-lg border border-surface-200 hover:border-primary-200 transition-colors group"
              >
                <span className="text-sm font-semibold text-ink-700 group-hover:text-primary-600 transition-colors">Host Event</span>
                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 group-hover:scale-105 transition-transform duration-300">
                  <Plus className="w-4 h-4" />
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={(e) => { e.stopPropagation(); setShowFabMenu(!showFabMenu); }}
          className={cn(
            "w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-500 active:scale-95 group hover:shadow-[0_0_25px_rgba(112,147,136,0.5)] overflow-hidden relative",
            showFabMenu ? "bg-ink-800 text-white shadow-ink-300/50 rotate-45" : "bg-primary-500 text-white hover:bg-primary-600"
          )}
        >
          <div className="absolute inset-0 bg-white/20 scale-0 rounded-full group-hover:animate-ripple z-0 pointer-events-none" />
          <Plus className="w-7 h-7 relative z-10" />
        </button>
      </div>

      {/* Create Icebreaker Modal */}
      <AnimatePresence>
        {showCreateIcebreaker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center px-4 bg-ink-900/40 backdrop-blur-sm pointer-events-auto"
            onClick={(e) => { if ((e.target as HTMLElement).id === 'modal-backdrop') setShowCreateIcebreaker(false); }}
            id="modal-backdrop"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowCreateIcebreaker(false)}
                className="absolute top-4 right-4 text-ink-400 hover:text-ink-600 p-1 transition-colors bg-surface-50 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3 mb-5 text-coral-500">
                <Sparkles className="w-6 h-6" />
                <h2 className="text-xl font-bold text-ink-900">Post an Icebreaker</h2>
              </div>
              <form onSubmit={handlePostIcebreaker}>
                <textarea 
                  autoFocus
                  value={newIceText}
                  onChange={e => setNewIceText(e.target.value)}
                  placeholder="e.g. Anyone else pulling an all-nighter? ☕️"
                  className="w-full bg-surface-50 border border-surface-200 rounded-2xl p-4 text-lg text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-coral-200 resize-none h-32"
                />
                <div className="flex justify-end mt-4">
                  <button 
                    disabled={!newIceText.trim()}
                    type="submit" 
                    className="bg-coral-500 hover:bg-coral-600 text-white font-semibold py-3 px-8 rounded-xl shadow-md shadow-coral-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Post to Map
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
