import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, MapPin, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { FieldGroup } from '../components/FieldGroup';
import { eventCategories, campusLocations, durations } from '../data/mockData';

export function CreateEventScreen() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    building: '',
    room: '',
    customLocation: '',
    duration: 30,
    maxAttendees: 5,
    tags: [] as string[],
    startsIn: 'now',
  });
  const [tagInput, setTagInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const selectedBuilding = campusLocations.find(l => l.building === form.building);

  function updateForm(field: string, value: any) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function addTag() {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim()) && form.tags.length < 5) {
      updateForm('tags', [...form.tags, tagInput.trim()]);
      setTagInput('');
    }
  }

  function removeTag(tag: string) {
    updateForm('tags', form.tags.filter(t => t !== tag));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  const locationDisplay = form.building 
    ? `${form.building}${form.room ? ` · ${form.room}` : ''}`
    : form.customLocation || 'Choose a location';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full overflow-y-auto custom-scrollbar"
    >
      <div className="max-w-2xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-10 block text-center sm:text-left transition-all">
          <h2 className="text-3xl font-bold text-ink-900 tracking-tight">Start a gathering</h2>
          <p className="text-ink-500 mt-2 text-sm sm:text-base font-medium">Plan something casual and ping nearby students.</p>
        </div>

        {/* Success Banner */}
        <AnimatePresence>
          {submitted && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 bg-emerald-50 border border-emerald-400/20 text-emerald-500 rounded-2xl flex items-center gap-3"
            >
              <Check className="w-5 h-5" />
              <div>
                <p className="font-semibold text-sm">Event created!</p>
                <p className="text-xs opacity-80">Pinging 12 people nearby…</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Event Name */}
          <FieldGroup label="What are we doing?" required>
            <input
              type="text"
              value={form.title}
              onChange={e => updateForm('title', e.target.value)}
              placeholder="e.g. Chill study session for midterms..."
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-surface-200 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
            />
          </FieldGroup>

          {/* Category */}
          <FieldGroup label="Pick a vibe" required>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {eventCategories.map(cat => {
                const Icon = cat.icon;
                const isSelected = form.category === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => updateForm('category', cat.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium",
                      isSelected 
                        ? "border-primary-400 bg-primary-50 text-primary-600 scale-[1.03] shadow-sm" 
                        : cn("border-transparent", cat.color, "hover:border-surface-300")
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </FieldGroup>

          {/* Description */}
          <FieldGroup label="Any details?">
            <textarea
              value={form.description}
              onChange={e => updateForm('description', e.target.value)}
              placeholder="Give people a quick idea of what to expect…"
              rows={3}
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-surface-200 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all resize-none"
            />
          </FieldGroup>

          {/* Location */}
          <FieldGroup label="Where to?" required>
            <button
              type="button"
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-white border text-sm transition-all",
                form.building || form.customLocation
                  ? "border-primary-200 text-ink-800"
                  : "border-surface-200 text-ink-400"
              )}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span>{locationDisplay}</span>
              </div>
              <ChevronDown className={cn("w-4 h-4 text-ink-400 transition-transform", showLocationPicker && "rotate-180")} />
            </button>

            <AnimatePresence>
              {showLocationPicker && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 p-4 bg-white border border-surface-200 rounded-xl space-y-4">
                    {/* Building Grid */}
                    <div>
                      <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2.5 block">Building</label>
                      <div className="grid grid-cols-2 gap-2">
                        {campusLocations.map(loc => (
                          <button
                            key={loc.building}
                            type="button"
                            onClick={() => updateForm('building', loc.building === loc.building ? '' : loc.building)}
                            className={cn(
                              "px-3 py-2 rounded-lg text-xs font-medium transition-all border",
                              form.building === loc.building
                                ? "bg-primary-500 text-white border-primary-500"
                                : "bg-surface-50 text-ink-600 border-surface-200 hover:border-primary-200"
                            )}
                          >
                            {loc.building}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Room Selector */}
                    {selectedBuilding && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2.5 block">
                          Specific Area
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {selectedBuilding.rooms.map(room => (
                            <button
                              key={room}
                              type="button"
                              onClick={() => updateForm('room', form.room === room ? '' : room)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                                form.room === room
                                  ? "bg-primary-100 text-primary-700 border-primary-200"
                                  : "bg-surface-50 text-ink-500 border-surface-200 hover:border-primary-200"
                              )}
                            >
                              {room}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Custom Location */}
                    <div className="pt-3 border-t border-surface-200">
                      <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2 block">Or type a custom location</label>
                      <input
                        type="text"
                        value={form.customLocation}
                        onChange={e => { updateForm('customLocation', e.target.value); updateForm('building', ''); updateForm('room', ''); }}
                        placeholder="e.g. The bench by the fountain"
                        className="w-full px-3 py-2.5 rounded-lg bg-surface-50 border border-surface-200 text-sm placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </FieldGroup>

          {/* Timing Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Start Time */}
            <FieldGroup label="When">
              <div className="flex gap-2">
                {['now', '15min', '30min', '1hr'].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateForm('startsIn', opt)}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all border",
                      form.startsIn === opt
                        ? "bg-primary-500 text-white border-primary-500 shadow-sm"
                        : "bg-white text-ink-600 border-surface-200 hover:border-primary-200"
                    )}
                  >
                    {opt === 'now' ? 'Now' : opt === '15min' ? '15m' : opt === '30min' ? '30m' : '1h'}
                  </button>
                ))}
              </div>
            </FieldGroup>

            {/* Duration */}
            <FieldGroup label="For how long?">
              <div className="grid grid-cols-3 gap-2">
                {durations.map(d => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => updateForm('duration', d.value)}
                    className={cn(
                      "py-2.5 rounded-xl text-xs font-semibold transition-all border",
                      form.duration === d.value
                        ? "bg-primary-500 text-white border-primary-500 shadow-sm"
                        : "bg-white text-ink-600 border-surface-200 hover:border-primary-200"
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </FieldGroup>
          </div>

          {/* Max Attendees */}
          <FieldGroup label="Max People">
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => updateForm('maxAttendees', Math.max(2, form.maxAttendees - 1))}
                className="w-10 h-10 rounded-full bg-white border border-surface-200 text-ink-600 text-lg font-bold hover:border-primary-200 transition-colors flex items-center justify-center"
              >
                −
              </button>
              <span className="text-3xl font-bold text-primary-500 w-10 text-center">{form.maxAttendees}</span>
              <button
                type="button"
                onClick={() => updateForm('maxAttendees', Math.min(50, form.maxAttendees + 1))}
                className="w-10 h-10 rounded-full bg-white border border-surface-200 text-ink-600 text-lg font-bold hover:border-primary-200 transition-colors flex items-center justify-center"
              >
                +
              </button>
              <span className="text-xs text-ink-400 ml-2">people max</span>
            </div>
          </FieldGroup>

          {/* Tags */}
          <FieldGroup label="Tags" hint="Add up to 5 tags to help people find your event">
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); }}}
                placeholder="e.g. chill, midterm-prep, newbies-welcome"
                className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-surface-200 text-sm placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
              <button
                type="button"
                onClick={addTag}
                disabled={!tagInput.trim()}
                className="px-4 py-2.5 bg-surface-100 text-ink-600 rounded-xl text-sm font-medium hover:bg-surface-200 transition-colors disabled:opacity-40"
              >
                Add
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-medium border border-primary-100">
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-primary-800">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </FieldGroup>

          {/* Location Info */}
          <div className="p-4 bg-surface-100 rounded-xl flex items-center gap-3 text-sm text-ink-500">
            <MapPin className="w-4 h-4 text-primary-400 shrink-0" />
            <span>Your proximity will be shared with attendees so they can find you.</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!form.title.trim() || !form.category}
            className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl shadow-sm shadow-primary-500/20 transition-all duration-200 active:scale-[0.98] text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Send invites to nearby students
          </button>
        </form>
      </div>
    </motion.div>
  );
}
