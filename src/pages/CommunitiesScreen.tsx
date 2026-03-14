import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { SkillCard } from '../components/SkillCard';
import { ConstellationDivider } from '../components/ConstellationDivider';
import { ConstellationBackground } from '../components/ConstellationBackground';

export function CommunitiesScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="h-full overflow-y-auto custom-scrollbar relative"
    >
      <ConstellationBackground />

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-surface-200">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8 text-sm font-medium text-ink-500">
            <a href="#" className="text-ink-900">Find a Buddy</a>
            <a href="#" className="hover:text-ink-900 transition-colors">Shared Learning</a>
            <a href="#" className="hover:text-ink-900 transition-colors">Communities</a>
          </div>
          <button className="bg-primary-500 text-white px-5 py-2.5 rounded-xl hover:bg-primary-600 transition-colors font-medium text-sm">Share a skill</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <section className="mb-16 text-left max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-ink-900 mb-4">
            Learn and grow, <br/><span className="text-primary-500">together.</span>
          </h1>
          <p className="text-lg text-ink-500 leading-relaxed">
            Connect with students to trade skills. No pressure, just shared learning.
          </p>
          <div className="mt-8 flex gap-3">
            <div className="relative flex-grow max-w-sm">
              <input 
                type="text" 
                className="w-full border border-surface-200 rounded-2xl focus:ring-primary-400 focus:border-primary-400 py-3.5 px-5 text-sm" 
                placeholder="Search skills (e.g. Python, Pottery...)"
              />
            </div>
            <button className="bg-surface-100 px-7 py-3.5 rounded-2xl font-medium hover:bg-surface-200 transition-all text-sm">Browse</button>
          </div>
        </section>

        <ConstellationDivider className="mb-12 mt-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          <SkillCard 
            name="Sarah Chen"
            role="Design Student · 2km away"
            canHelp={['UI/UX Design', 'Pottery']}
            wantsToLearn={['Python', 'Cooking']}
            avatar="https://picsum.photos/seed/sarah/100/100"
          />
          <SkillCard 
            name="Marcus Wright"
            role="Software Engineer · 5km away"
            canHelp={['Python', 'React']}
            wantsToLearn={['Guitar', 'Photography']}
            avatar="https://picsum.photos/seed/marcus/100/100"
          />
          <SkillCard 
            name="Elena Rossi"
            role="Chef · 1km away"
            canHelp={['Italian Cooking', 'Gardening']}
            wantsToLearn={['Web Basics', 'Yoga']}
            avatar="https://picsum.photos/seed/elena/100/100"
          />
          <SkillCard 
            name="Jordan Blake"
            role="Music Producer · 10km away"
            canHelp={['Audio Editing', 'Piano']}
            wantsToLearn={['Graphic Design']}
            avatar="https://picsum.photos/seed/jordanb/100/100"
          />
          <div className="border-2 border-dashed border-surface-200 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary-300 transition-colors">
            <div className="w-14 h-14 rounded-full bg-surface-50 flex items-center justify-center mb-4 group-hover:bg-primary-50">
              <Plus className="w-6 h-6 text-ink-400 group-hover:text-primary-500" />
            </div>
            <h3 className="font-medium text-ink-800">Add your profile</h3>
            <p className="text-sm text-ink-500 mt-1">Join the community and start exchanging</p>
          </div>
        </div>
      </div>

      <footer className="border-t border-surface-200 mt-20 py-12">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-ink-400">© 2026 CampusPulse. Shared learning for everyone.</div>
          <div className="flex gap-8 text-sm text-ink-500">
            <a href="#" className="hover:text-ink-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-ink-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-ink-900 transition-colors">Community Guidelines</a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
