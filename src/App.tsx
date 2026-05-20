import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Info, Plus, ThumbsUp, X, Volume2, VolumeX, Maximize,
  ChevronLeft, ChevronRight, Search, Bell, Heart, Smile, Star,
  Cake, Gift, PartyPopper, Sparkles, Crown, Sun, LogOut, Loader2
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  name: string;
  iconName: string;
  colorClass: string;
  colorHex: string;
}

interface MemoryItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  coverUrl: string;
  videoUrl: string;
  match: string;
  year: string;
  duration: string;
  genre: string;
  cast: string;
  mood: string;
}

const DEFAULT_PROFILES: Profile[] = [
  { id: "sarah", name: "Sarah", iconName: "gift", colorClass: "bg-[#E50914]", colorHex: "#E50914" },
  { id: "bestfriend", name: "Best Friend", iconName: "heart", colorClass: "bg-[#1F80E0]", colorHex: "#1F80E0" }
];

type ActiveTab = "home" | "shows" | "movies" | "new" | "story";

const PROFILE_ICONS: Record<string, LucideIcon> = {
  smile: Smile,
  heart: Heart,
  star: Star,
  cake: Cake,
  gift: Gift,
  popper: PartyPopper,
  sparkles: Sparkles,
  crown: Crown,
  sun: Sun
};

const COLOR_OPTIONS = [
  { name: "Red", class: "bg-[#E50914]", hex: "#E50914" },
  { name: "Blue", class: "bg-[#1F80E0]", hex: "#1F80E0" },
  { name: "Orange", class: "bg-[#F27E1C]", hex: "#F27E1C" },
  { name: "Green", class: "bg-[#46D369]", hex: "#46D369" },
  { name: "Purple", class: "bg-[#802BE0]", hex: "#802BE0" },
  { name: "Turquoise", class: "bg-[#1FBCE0]", hex: "#1FBCE0" }
];

const MEMORIES_DATA: Record<string, MemoryItem[]> = {
  trending: [
    {
      id: "mem-first",
      title: "Our First Memory",
      tagline: "Where it all began. The spark of a beautiful connection.",
      description: "A walk down memory lane to the very first moment we crossed paths. The laughter, the nervous smiles, and the instant realization that this was the start of something special.",
      coverUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      match: "98%",
      year: "2025",
      duration: "4m",
      genre: "Heartwarming, Nostalgic",
      cast: "You, Sarah",
      mood: "Sentimental, Sweet"
    },
    {
      id: "mem-talks",
      title: "Late Night Talks",
      tagline: "Deeper conversations under a canopy of stars.",
      description: "Those endless night-owl chats where we solved the world's mysteries, shared our deepest fears, and built a foundation of trust that will never be broken.",
      coverUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      match: "99%",
      year: "2025",
      duration: "5m",
      genre: "Intimate, Personal",
      cast: "You, Your Friends",
      mood: "Reflective, Cozy"
    },
    {
      id: "mem-birthday",
      title: "Birthday Surprise",
      tagline: "The planning, the secrecy, and the perfect reaction.",
      description: "Go behind the scenes of the most elaborate surprise party of the year. Relive the look of sheer disbelief and joy when the lights clicked on!",
      coverUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      match: "97%",
      year: "2025",
      duration: "3m",
      genre: "Joyful, Energetic",
      cast: "The Whole Squad",
      mood: "Exciting, Hilarious"
    },
    {
      id: "mem-adventure",
      title: "The Adventure",
      tagline: "Spontaneous road trips and unforgettable escapes.",
      description: "Getting lost on purpose. Capturing the wind in our hair, the music blasting, and the absolute freedom of exploring new horizons together.",
      coverUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      match: "96%",
      year: "2025",
      duration: "7m",
      genre: "Adventure, Cinematic",
      cast: "The Roadtrip Crew",
      mood: "Inspiring, Uplifting"
    },
    {
      id: "mem-jokes",
      title: "Inside Jokes",
      tagline: "Laughter that makes your stomach hurt.",
      description: "A compilation of the absolute silliest, most inexplicable things we've ever laughed about. Warning: High risk of contagious giggles.",
      coverUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      match: "95%",
      year: "2025",
      duration: "2m",
      genre: "Comedy, Whimsical",
      cast: "The Comedy Duo",
      mood: "Goofy, Wacky"
    },
    {
      id: "mem-quiet",
      title: "Quiet Mornings",
      tagline: "Comfort in the simple, shared silence.",
      description: "The beauty of doing absolutely nothing, together. Cozy blankets, steam rising from coffee mugs, and the warmth of simple presence.",
      coverUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      match: "94%",
      year: "2025",
      duration: "6m",
      genre: "Peaceful, Slow-paced",
      cast: "You, Sarah",
      mood: "Calm, Dreamy"
    }
  ],
  picks: [
    {
      id: "mem-bigday",
      title: "The Big Day",
      tagline: "Celebrating the milestone with sheer elegance.",
      description: "A cinematic capture of the birthday itself. From the gorgeous decor to the tearful toasts, it is a tribute to another spectacular year of life.",
      coverUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      match: "99%",
      year: "2025",
      duration: "8m",
      genre: "Grand, Celebration",
      cast: "Sarah, Family, Friends",
      mood: "Emotional, Triumphant"
    },
    {
      id: "mem-wishes",
      title: "Wishes From Friends",
      tagline: "Warm messages compiled with infinite love.",
      description: "A heartwarming montage of your favorite people sharing their favorite memories, inside jokes, and sincerest blessings for your journey ahead.",
      coverUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      match: "98%",
      year: "2025",
      duration: "12m",
      genre: "Compilation, Heartfelt",
      cast: "The Whole World",
      mood: "Uplifting, Emotional"
    },
    {
      id: "mem-cake",
      title: "Cake & Confetti",
      tagline: "Make a wish, blow out the candles, throw the sparkles.",
      description: "The climax of the celebration! Slow-motion shots of sparklers, flying confetti, and the sweet struggle to blow out trick candles.",
      coverUrl: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=600&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      match: "97%",
      year: "2025",
      duration: "2m",
      genre: "Festive, Hyperactive",
      cast: "Sarah, The Bakers",
      mood: "Sparkling, Fun"
    },
    {
      id: "mem-year",
      title: "Year In Review",
      tagline: "365 days of growth, smiles, and triumph.",
      description: "A fast-cut, energetic recap of the past year. Highlighting the peaks, the lessons, the friendships, and the moments that defined your latest chapter.",
      coverUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      match: "96%",
      year: "2025",
      duration: "10m",
      genre: "Documentary, Inspiring",
      cast: "Sarah",
      mood: "Powerful, Motivating"
    }
  ],
  laughter: [
    {
      id: "mem-karaoke",
      title: "Bad Karaoke Night",
      tagline: "Screaming lyrics off-key with absolute pride.",
      description: "The microphones were too loud, the singing was terrible, but the energy was unmatched. Witness the historic performance of our favorite power ballad.",
      coverUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      match: "94%",
      year: "2025",
      duration: "4m",
      genre: "Musical, Comedy",
      cast: "The Karaoke Rockstars",
      mood: "Silly, Loud"
    },
    {
      id: "mem-dance",
      title: "Dance Off",
      tagline: "Awkward moves that will be remembered forever.",
      description: "When the beat dropped, all coordination left the building. Enjoy this multi-cam capture of some of the most highly questionable dance floor maneuvers in history.",
      coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      match: "93%",
      year: "2025",
      duration: "3m",
      genre: "High Energy, Hilarious",
      cast: "The Floor Shakers",
      mood: "Absurd, Playful"
    },
    {
      id: "mem-pranks",
      title: "The Ultimate Prank",
      tagline: "Gullible moments caught in full resolution.",
      description: "It took three weeks of preparation, a fake delivery guy, and absolute poker faces. Watch the precise second when the puzzle pieces clicked in their head.",
      coverUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      match: "92%",
      year: "2025",
      duration: "5m",
      genre: "Prank, Comedy",
      cast: "The Pranksters",
      mood: "Mischievous, Hysterical"
    }
  ]
};

const FEATURED_HERO: MemoryItem = {
  id: "mem-featured",
  title: "Made For Sarah",
  tagline: "A beautiful personalized celebration journey.",
  description: "A heartfelt journey crafted just for you. Every scene, every moment, every memory designed with love. Press play and let the celebration begin.",
  coverUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80",
  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  match: "98%",
  year: "2025",
  duration: "1 Season",
  genre: "Heartwarming, Personal, Celebration",
  cast: "You, Your Friends, Your Family",
  mood: "Heartfelt, Uplifting"
};



export default function App() {
  const [flowState, setFlowState] = useState<"landing" | "loading" | "profiles" | "dashboard">("landing");
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem("gift_binge_profiles");
    return saved ? JSON.parse(saved) : DEFAULT_PROFILES;
  });
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);

  // Custom states
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MemoryItem | null>(null);
  const [playingItem, setPlayingItem] = useState<MemoryItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showAddProfileModal, setShowAddProfileModal] = useState(false);

  // New profile form
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileIcon, setNewProfileIcon] = useState("smile");
  const [newProfileColor, setNewProfileColor] = useState(COLOR_OPTIONS[0]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-redirect checks for ?gift=true or similar
  useEffect(() => {
    // Save profiles if changed
    localStorage.setItem("gift_binge_profiles", JSON.stringify(profiles));
  }, [profiles]);

  const handleStartExperience = () => {
    setFlowState("loading");
    setTimeout(() => {
      setFlowState("profiles");
    }, 2800); // 2.8s loader animation
  };

  const handleSelectProfile = (profile: Profile) => {
    setActiveProfile(profile);
    setFlowState("dashboard");
    toast.success(`Welcome to Netflix, ${profile.name}!`);
  };

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) {
      toast.error("Please enter a profile name");
      return;
    }
    const newProf: Profile = {
      id: `prof-${Date.now()}`,
      name: newProfileName,
      iconName: newProfileIcon,
      colorClass: newProfileColor.class,
      colorHex: newProfileColor.hex
    };
    setProfiles([...profiles, newProf]);
    setNewProfileName("");
    setShowAddProfileModal(false);
    toast.success(`Profile "${newProf.name}" created successfully!`);
  };

  // Video controls
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleVideoEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleVideoEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleVideoEnded);
    };
  }, [playingItem]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          toast.error("Failed to play video");
        });
      }
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    if (videoRef.current) {
      videoRef.current.currentTime = percentage * duration;
      setProgress(percentage * 100);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleLogOutProfile = () => {
    setActiveProfile(null);
    setFlowState("profiles");
    setShowProfileDropdown(false);
  };

  // Profile icon helper
  const renderProfileIcon = (iconName: string, sizeClass = "w-6 h-6") => {
    const IconComponent = PROFILE_ICONS[iconName] || Smile;
    return <IconComponent className={sizeClass} />;
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans antialiased overflow-x-hidden preserve-color">

      {/* ── LANDING PAGE SCREEN ── */}
      {flowState === "landing" && (
        <div className="relative min-h-screen flex flex-col justify-between z-10 overflow-hidden">
          {/* Cinematic blurred background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80')", filter: "blur(6px) brightness(0.35)", transform: "scale(1.05)" }}
          />
          {/* Dark vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 pointer-events-none" />

          {/* Header — just the Netflix logo, no badge/exit */}
          <header className="relative z-10 flex items-center px-6 md:px-12 pt-6 md:pt-8">
            <span className="text-3xl md:text-4xl font-extrabold text-[#E50914] tracking-tighter uppercase italic select-none">NETFLIX</span>
          </header>

          {/* Hero Content */}
          <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 gap-5 py-20">
            {/* Eyebrow tagline — plain white/gray, NOT red */}
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs md:text-sm font-semibold text-gray-300 tracking-[0.3em] uppercase"
            >
              LIMITED SERIES PREMIERES TODAY
            </motion.span>

            {/* Title — mixed case, NOT italic, NOT all-caps; second line in red */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight leading-[1.05]"
            >
              A Gift Made<br />
              <span className="text-[#E50914]">Just For You.</span>
            </motion.h1>

            {/* Subtitle — lighter weight */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-gray-200 max-w-xl leading-relaxed font-normal"
            >
              Lights, camera, celebration. Step inside your very own Netflix —
              every scroll, every scene, hand-picked with love.
            </motion.p>

            {/* CTA — rectangular button with play icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-4"
            >
              <button
                onClick={handleStartExperience}
                className="inline-flex items-center gap-3 bg-[#E50914] hover:bg-[#c0060f] text-white text-base md:text-lg font-bold px-10 py-4 rounded-md shadow-[0_4px_24px_rgba(229,9,20,0.45)] transition-all hover:scale-[1.03] active:scale-95"
              >
                <Play className="w-5 h-5 fill-white" />
                Start Experience
              </button>
            </motion.div>

            {/* Sub-footer note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-[10px] text-gray-500 tracking-[0.25em] uppercase mt-2"
            >
              No sign-in required &nbsp;·&nbsp; Press play to begin
            </motion.p>
          </main>

          {/* "Made with Emergent" badge — bottom right */}
          <footer className="relative z-10 flex justify-end px-6 pb-5 md:px-12">
            <span className="text-[10px] text-gray-600 tracking-widest uppercase">Made with Emergent</span>
          </footer>
        </div>
      )}

      {/* ── NETFLIX LOGO APP LOADER SCREEN ── */}
      {flowState === "loading" && (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 20], opacity: [1, 1, 0] }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            {/* Massive Glowing Netflix Red 'N' */}
            <span className="text-8xl md:text-[14rem] font-black text-[#E50914] select-none tracking-tighter drop-shadow-[0_0_35px_rgba(229,9,20,0.8)] leading-none font-serif">
              N
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-20 flex flex-col items-center gap-3"
          >
            <Loader2 className="animate-spin text-red-600 w-8 h-8" />
            <span className="text-[10px] font-black tracking-[0.25em] text-red-500 uppercase">STREAMING MEMORIES</span>
          </motion.div>
        </div>
      )}

      {/* ── PROFILE SELECTION SCREEN ── */}
      {flowState === "profiles" && (
        <div className="relative min-h-screen bg-[#141414] flex flex-col justify-center items-center p-6 md:p-12 z-20">

          {/* Top Logo */}
          <div className="absolute top-8 left-8 flex items-center gap-2 select-none">
            <span className="text-3xl font-extrabold text-[#E50914] uppercase tracking-tighter italic">NETFLIX</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl text-center space-y-10"
          >
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">Who's celebrating today?</h1>

            {/* Profile Grid */}
            <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center items-start gap-8 mt-10">
              {profiles.map((profile, i) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleSelectProfile(profile)}
                  className="flex flex-col items-center gap-3 group cursor-pointer"
                >
                  {/* Square Profile block */}
                  <div className={`w-28 h-28 sm:w-36 sm:h-36 ${profile.colorClass} border-4 border-transparent group-hover:border-white transition-all duration-200 shadow-lg rounded-md flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all" />
                    {renderProfileIcon(profile.iconName, "w-12 h-12 sm:w-16 sm:h-16 text-white group-hover:scale-110 transition-transform duration-200")}
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-400 group-hover:text-white transition-colors uppercase tracking-widest">{profile.name}</span>
                </motion.div>
              ))}

              {/* Add Profile Block */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: profiles.length * 0.1 }}
                onClick={() => setShowAddProfileModal(true)}
                className="flex flex-col items-center gap-3 group cursor-pointer"
              >
                <div className="w-28 h-28 sm:w-36 sm:h-36 border-4 border-dashed border-gray-600 group-hover:border-white group-hover:bg-white/5 transition-all duration-200 shadow-lg rounded-md flex flex-col items-center justify-center relative">
                  <Plus className="w-10 h-10 text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm sm:text-base font-medium text-gray-500 group-hover:text-white transition-colors uppercase tracking-widest">Add Profile</span>
              </motion.div>
            </div>

            {/* Manage Profiles button */}
            <div className="pt-10">
              <button
                onClick={() => toast.info("Profile customization active. Click any profile to view, or Add Profile to create new ones.")}
                className="px-6 py-2 border-2 border-gray-600 hover:border-white text-gray-400 hover:text-white font-bold text-xs uppercase tracking-[0.2em] transition-all rounded"
              >
                MANAGE PROFILES
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── ADD PROFILE INTERACTIVE DIALOG MODAL ── */}
      <AnimatePresence>
        {showAddProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddProfileModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-xl bg-[#141414] border border-gray-800 rounded-lg p-8 shadow-2xl z-10 text-white"
            >
              <button
                onClick={() => setShowAddProfileModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-2"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-3xl font-bold tracking-tight mb-2">Create Profile</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-6">Add a custom profile for your celebration</p>

              <form onSubmit={handleAddProfile} className="space-y-6">

                {/* Profile Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Celebrant's Name</label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="Enter Name..."
                    className="w-full bg-[#333] border-none px-4 py-3 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-red-600 rounded-md"
                  />
                </div>

                {/* Profile Icon Picker */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Custom Icon</label>
                  <div className="grid grid-cols-5 gap-3 bg-black/45 p-4 border border-gray-800 rounded-md">
                    {Object.keys(PROFILE_ICONS).map((iconKey) => {
                      const IconComp = PROFILE_ICONS[iconKey];
                      const active = newProfileIcon === iconKey;
                      return (
                        <button
                          key={iconKey}
                          type="button"
                          onClick={() => setNewProfileIcon(iconKey)}
                          className={`aspect-square flex items-center justify-center rounded-md border-2 transition-all ${active ? "border-red-600 bg-red-600/10" : "border-gray-800 bg-[#222] hover:bg-[#333] text-gray-400 hover:text-white"}`}
                          title={`Select ${iconKey}`}
                        >
                          <IconComp className="w-6 h-6" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Profile Color Picker */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pick Profile Theme Color</label>
                  <div className="flex flex-wrap gap-3 bg-black/45 p-4 border border-gray-800 rounded-md">
                    {COLOR_OPTIONS.map((col) => {
                      const active = newProfileColor.hex === col.hex;
                      return (
                        <button
                          key={col.hex}
                          type="button"
                          onClick={() => setNewProfileColor(col)}
                          className={`w-10 h-10 rounded-md border-2 transition-all flex items-center justify-center ${col.class} ${active ? "border-white scale-110" : "border-transparent opacity-75 hover:opacity-100"}`}
                          title={`Color ${col.name}`}
                        >
                          {active && <span className="w-2 h-2 bg-white rounded-full" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex gap-4 pt-4 border-t border-gray-800">
                  <button
                    type="submit"
                    className="flex-1 bg-[#E50914] hover:bg-[#b80710] font-black uppercase text-xs tracking-widest py-4 rounded-md transition-all"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddProfileModal(false)}
                    className="flex-1 bg-[#333] hover:bg-[#444] font-black uppercase text-xs tracking-widest py-4 rounded-md transition-all text-white border border-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── NETFLIX-STYLE DENSITY MAIN DASHBOARD SCREEN ── */}
      {flowState === "dashboard" && activeProfile && (
        <div className="min-h-screen relative z-10 pb-20">

          {/* Sticky Header Nav — transparent, slim, with subtitle */}
          <header className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent px-4 md:px-10 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6 md:gap-8">
              {/* Logo + subtitle stacked absolute layout to keep nav aligned with logo */}
              <div
                onClick={() => setFlowState("profiles")}
                className="cursor-pointer select-none relative py-1"
              >
                <span className="text-2xl md:text-3xl font-extrabold text-[#E50914] italic tracking-tighter leading-none block">NETFLIX</span>
                <p className="absolute left-0 -bottom-4 text-[12px] md:text-[12px] font-bold tracking-[0.25em] uppercase text-gray-300 leading-none whitespace-nowrap">
                  A Special Gift Presents
                </p>
              </div>

              {/* Middle Navigation options — mixed case, perfectly aligned with the main logo */}
              <nav className="hidden md:flex items-center gap-5 ml-2">
                {([
                  { id: "home", label: "Home" },
                  { id: "shows", label: "Shows" },
                  { id: "movies", label: "Movies" },
                  { id: "new", label: "New & Popular" },
                  { id: "story", label: "Our Story" }
                ] satisfies { id: ActiveTab; label: string }[]).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (tab.id === "story") {
                        toast.info("Thank you for sharing your story! Hand-crafted with lots of love.");
                      }
                    }}
                    className={`text-sm font-medium transition-colors ${activeTab === tab.id ? "text-white" : "text-gray-400 hover:text-gray-200"}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-4 md:gap-5">

              {/* Search icon (not full bar) */}
              <button
                onClick={() => setSearchQuery(searchQuery ? "" : " ")}
                className="text-gray-400 hover:text-white transition-colors"
                title="Search memories"
              >
                <Search className="w-5 h-5" />
              </button>

              <span className="hidden md:block text-sm font-medium text-gray-300 hover:text-white cursor-pointer transition-colors">Kids</span>
              <Bell className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />

              {/* Profile Avatar — colored icon + name */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 group focus:outline-none"
                >
                  <div className={`w-8 h-8 rounded-md ${activeProfile.colorClass} flex items-center justify-center relative overflow-hidden border-2 border-white/30`}>
                    {renderProfileIcon(activeProfile.iconName, "w-4 h-4 text-white")}
                  </div>
                  <span className="hidden md:block text-sm font-semibold text-white">{activeProfile.name}</span>
                </button>

                {/* Profile Selector dropdown menu */}
                <AnimatePresence>
                  {showProfileDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowProfileDropdown(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-3 w-56 bg-black border border-gray-800 rounded-md p-2 shadow-2xl z-50 text-white"
                      >
                        <div className="px-3 py-2 border-b border-gray-800 mb-2">
                          <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Active Profile</span>
                          <div className="flex items-center gap-2 mt-1">
                            <div className={`w-6 h-6 rounded ${activeProfile.colorClass} flex items-center justify-center`}>
                              {renderProfileIcon(activeProfile.iconName, "w-3 h-3 text-white")}
                            </div>
                            <span className="text-sm font-bold uppercase tracking-wider">{activeProfile.name}</span>
                          </div>
                        </div>

                        {/* Profiles loop list */}
                        <div className="space-y-1 mb-2">
                          <span className="px-3 text-[10px] font-black tracking-widest text-gray-500 uppercase block mb-1">Switch Profiles</span>
                          {profiles.filter(p => p.id !== activeProfile.id).map(p => (
                            <button
                              key={p.id}
                              onClick={() => {
                                handleSelectProfile(p);
                                setShowProfileDropdown(false);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-white/5 rounded flex items-center gap-2 transition-all"
                            >
                              <div className={`w-6 h-6 rounded ${p.colorClass} flex items-center justify-center`}>
                                {renderProfileIcon(p.iconName, "w-3 h-3 text-white")}
                              </div>
                              <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">{p.name}</span>
                            </button>
                          ))}
                        </div>

                        {/* Sign Out of Profile */}
                        <button
                          onClick={handleLogOutProfile}
                          className="w-full text-left px-3 py-2 hover:bg-red-600/10 hover:text-red-500 rounded flex items-center gap-2 border-t border-gray-900 pt-2 transition-all font-black text-xs uppercase tracking-widest text-gray-400"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Sign Out Profile
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </header>

          {/* ── MAIN DYNAMIC HERO SECTION BANNER ── */}
          <section className="relative w-full bg-black overflow-hidden flex items-end pt-16" style={{ minHeight: '70vh' }}>
            {/* Background Cover */}
            <div className="absolute inset-0">
              <img
                src={FEATURED_HERO.coverUrl}
                alt=""
                className="w-full h-full object-cover opacity-70"
              />
              {/* Bottom fade so content is readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent" />
              {/* Left fade */}
              <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-[#141414]/90 to-transparent" />
            </div>

            {/* Content box — bottom-left aligned like the reference */}
            <div className="relative z-10 max-w-2xl px-6 md:px-12 pb-12 md:pb-16 flex flex-col gap-3 md:gap-4">

              {/* Title — mixed case, NOT italic, NOT all-caps */}
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.0] tracking-tight">
                Made For {activeProfile.name}
              </h1>

              {/* Metadata — inline plain text, dot-separated */}
              <div className="flex items-center gap-2 flex-wrap text-sm">
                <span className="font-bold text-green-500">{FEATURED_HERO.match} Match</span>
                <span className="text-gray-300">{FEATURED_HERO.year}</span>
                <span className="text-gray-300">1 Season</span>
                <span className="text-gray-300">Personal</span>
              </div>

              <p className="text-sm md:text-base text-gray-200 leading-relaxed font-normal max-w-lg">
                {activeProfile.name === "Sarah"
                  ? FEATURED_HERO.description
                  : `A custom-curated streaming library designed specifically for ${activeProfile.name}. Discover, play, and celebrate every spectacular moment.`
                }
              </p>

              {/* Action buttons — white PLAY, gray MORE INFO */}
              <div className="flex items-center gap-3 mt-1">
                <button
                  onClick={() => {
                    const heroWithCustomTitle = { ...FEATURED_HERO, title: `Made For ${activeProfile.name}` };
                    setPlayingItem(heroWithCustomTitle);
                    setIsPlaying(true);
                  }}
                  className="bg-white hover:bg-gray-200 text-black px-7 py-2.5 rounded font-bold text-sm flex items-center gap-2 transition-all active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" /> Play
                </button>
                <button
                  onClick={() => {
                    const heroWithCustomTitle = { ...FEATURED_HERO, title: `Made For ${activeProfile.name}` };
                    setSelectedItem(heroWithCustomTitle);
                  }}
                  className="bg-white/25 hover:bg-white/35 text-white px-7 py-2.5 rounded backdrop-blur-sm font-bold text-sm flex items-center gap-2 border border-white/10 transition-all active:scale-95"
                >
                  <Info className="w-4 h-4" /> More Info
                </button>
              </div>
            </div>
          </section>

          {/* ── ROW SLIDERS / CARDS ── */}
          <main className="px-6 md:px-12 space-y-12 relative z-20">

            {/* Filtered memories search list */}
            {searchQuery.trim().length > 0 ? (
              <div className="space-y-4">
                <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Search Results for "{searchQuery}"</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.values(MEMORIES_DATA).flat().filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.tagline.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="group cursor-pointer bg-zinc-900 border border-white/5 hover:border-white/20 rounded-md overflow-hidden transition-all duration-300 flex flex-col"
                    >
                      <div className="relative aspect-video">
                        <img src={item.coverUrl} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-lg"><Play className="w-4 h-4 fill-current" /></div>
                        </div>
                      </div>
                      <div className="p-3 bg-zinc-900 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-black text-green-500 uppercase">{item.match} Match</span>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider mt-1">{item.title}</h4>
                        </div>
                        <span className="text-[9px] text-gray-500 mt-2 block">{item.year} · {item.duration} · {item.genre}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Row 1: Trending In Your Heart */}
                <CardRow
                  title="Trending In Your Heart"
                  items={MEMORIES_DATA.trending}
                  onSelect={setSelectedItem}
                />
                {/* Row 2: Top Picks For Your Birthday */}
                <CardRow
                  title={`Top Picks For ${activeProfile.name}'s Birthday`}
                  items={MEMORIES_DATA.picks}
                  onSelect={setSelectedItem}
                />

                {/* Row 3: Memories We Made */}
                <CardRow
                  title="Memories We Made"
                  items={MEMORIES_DATA.trending.slice().reverse()}
                  onSelect={setSelectedItem}
                />

                {/* Row 4: Because You Love To Laugh */}
                <CardRow
                  title="Because You Love To Laugh"
                  items={MEMORIES_DATA.laughter}
                  onSelect={setSelectedItem}
                />

                {/* Row 5: Continue Celebrating */}
                <CardRow
                  title="Continue Celebrating"
                  items={MEMORIES_DATA.picks.slice().reverse()}
                  onSelect={setSelectedItem}
                />
              </>
            )}

          </main>

        </div>
      )}

      {/* ── FULL CUSTOM MORE INFO MODAL DIALOG ── */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl z-10 text-white max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2.5 rounded-full border border-white/10 z-20 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Cover top banner */}
              <div className="relative aspect-video w-full">
                <img
                  src={selectedItem.coverUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                {/* Large Center Play Pulse */}
                <button
                  onClick={() => {
                    setPlayingItem(selectedItem);
                    setIsPlaying(true);
                  }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-white hover:bg-gray-200 text-black rounded-full flex items-center justify-center shadow-2xl transition-transform active:scale-95 group"
                >
                  <Play className="w-8 h-8 fill-current ml-1 group-hover:scale-110 transition-transform" />
                </button>

                <div className="absolute bottom-6 left-6 md:left-10">
                  <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter drop-shadow-md text-shadow">
                    {selectedItem.title}
                  </h2>
                </div>
              </div>

              {/* Grid content */}
              <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 bg-zinc-950">
                {/* Left details */}
                <div className="md:col-span-8 space-y-5">

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-black text-green-500">{selectedItem.match} Match</span>
                    <span className="text-sm font-semibold text-gray-400">{selectedItem.year}</span>
                    <span className="text-xs border border-zinc-700 px-1.5 py-0.5 rounded font-black tracking-wider uppercase text-zinc-400 bg-white/5">{selectedItem.duration}</span>
                    <span className="text-xs border border-red-500/50 text-red-500 px-1.5 py-0.5 rounded font-black tracking-wider uppercase bg-red-500/10">HD</span>
                  </div>

                  <p className="text-base text-gray-300 leading-relaxed font-semibold">
                    {selectedItem.description}
                  </p>

                  {/* Add action row */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setPlayingItem(selectedItem);
                        setIsPlaying(true);
                      }}
                      className="bg-white hover:bg-gray-200 text-black px-6 py-2.5 rounded font-black text-xs uppercase tracking-widest flex items-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-current" /> Play Video
                    </button>

                    <button
                      onClick={() => toast.success(`"${selectedItem.title}" added to your memory watchlist!`)}
                      className="w-10 h-10 rounded-full border border-gray-700 hover:border-white bg-black/40 flex items-center justify-center transition-colors"
                      title="Add to watchlist"
                    >
                      <Plus className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => toast.success(`Liked "${selectedItem.title}"! Thanks for loving this memory.`)}
                      className="w-10 h-10 rounded-full border border-gray-700 hover:border-white bg-black/40 flex items-center justify-center transition-colors"
                      title="Like memory"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                  </div>

                </div>

                {/* Right cast info details */}
                <div className="md:col-span-4 space-y-4 text-sm border-l border-zinc-900 md:pl-8">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block">Cast:</span>
                    <span className="font-semibold text-gray-300">{selectedItem.cast}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block">Genres:</span>
                    <span className="font-semibold text-gray-300">{selectedItem.genre}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block">This show is:</span>
                    <span className="font-semibold text-gray-300">{selectedItem.mood}</span>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── FULL CUSTOM EMBEDDED HTML5 VIDEO PLAYER DIALOG MODAL ── */}
      <AnimatePresence>
        {playingItem && (
          <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center p-0 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl bg-zinc-950 aspect-video z-10 flex flex-col justify-between overflow-hidden shadow-2xl rounded-none md:rounded-lg border border-zinc-900"
            >

              {/* Back button */}
              <button
                onClick={() => {
                  if (videoRef.current) videoRef.current.pause();
                  setPlayingItem(null);
                  setIsPlaying(false);
                }}
                className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 hover:bg-black/90 text-white px-4 py-2 border border-white/10 rounded-full font-black text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Dashboard
              </button>

              {/* Close Button top right */}
              <button
                onClick={() => {
                  if (videoRef.current) videoRef.current.pause();
                  setPlayingItem(null);
                  setIsPlaying(false);
                }}
                className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/90 text-white p-2 border border-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* HTML5 Video Layer */}
              <div
                onClick={handlePlayPause}
                className="w-full h-full relative cursor-pointer group/player flex items-center justify-center bg-black"
              >
                <video
                  ref={videoRef}
                  src={playingItem.videoUrl}
                  className="w-full h-full object-contain"
                  playsInline
                  autoPlay={isPlaying}
                />

                {/* Big play button overlays when paused */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center shadow-2xl transform scale-100 hover:scale-105 active:scale-95 transition-all">
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </div>
                  </div>
                )}
              </div>

              {/* ── CUSTOM NETFLIX MEDIA CONTROLS BAR ── */}
              <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex flex-col gap-3 pointer-events-auto">

                {/* Timeline Progress Bar red */}
                <div
                  onClick={handleProgressChange}
                  className="h-1.5 bg-white/20 hover:h-2.5 rounded-full cursor-pointer relative overflow-hidden transition-all duration-150 group/timeline"
                >
                  <div
                    className="h-full bg-[#E50914] rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="w-3.5 h-3.5 bg-[#E50914] rounded-full absolute right-[-4px] top-1/2 -translate-y-1/2 border border-white scale-0 group-hover/timeline:scale-100 transition-transform duration-100 shadow" />
                  </div>
                </div>

                {/* Bottom row actions controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">

                    {/* Play Pause */}
                    <button
                      onClick={handlePlayPause}
                      className="text-white hover:text-red-500 transition-colors"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                      ) : (
                        <Play className="w-6 h-6 fill-current" />
                      )}
                    </button>

                    {/* Mute Unmute */}
                    <button
                      onClick={handleToggleMute}
                      className="text-white hover:text-red-500 transition-colors"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </button>

                    {/* Time Counter duration */}
                    <span className="text-xs font-bold text-gray-300 tracking-wider">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                  </div>

                  {/* Title display track label */}
                  <span className="hidden md:block text-xs font-black tracking-[0.25em] text-red-500 uppercase select-none">
                    {playingItem.title.toUpperCase()}
                  </span>

                  <div className="flex items-center gap-6">
                    {/* Fullscreen control */}
                    <button
                      onClick={handleFullscreen}
                      className="text-white hover:text-red-500 transition-colors"
                      title="Fullscreen"
                    >
                      <Maximize className="w-5 h-5" />
                    </button>
                  </div>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

/* ── HIGH FIDELITY CARDROW SLIDER ROW COMPONENT ── */
interface CardRowProps {
  title: string;
  items: MemoryItem[];
  onSelect: (item: MemoryItem) => void;
}

function CardRow({ title, items, onSelect }: CardRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmt = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmt : scrollLeft + scrollAmt,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="space-y-3 relative group/row">

      {/* Title */}
      <h3 className="text-lg md:text-xl font-bold tracking-tight text-white select-none">
        {title}
      </h3>

      {/* Slider view row wrap */}
      <div className="relative">

        {/* Left Arrow Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-[-24px] inset-y-0 z-30 w-10 bg-black/50 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity border-r border-white/5 text-white"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Outer scrolling row */}
        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory px-1 scroll-smooth"
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
              onClick={() => onSelect(item)}
              className="flex-shrink-0 w-44 sm:w-56 aspect-[16/10] bg-zinc-900 rounded-md overflow-hidden transition-all duration-300 cursor-pointer relative group/card snap-start select-none"
              whileHover={{
                scale: 1.05,
                y: -4,
                zIndex: 10,
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.6), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
              }}
            >
              {/* Cover Card img */}
              <img
                src={item.coverUrl}
                alt=""
                className="w-full h-full object-cover"
              />

              {/* Always-visible bottom label (like the reference) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                <span className="text-[9px] text-gray-400 mt-0.5">{item.year} · HD · Family</span>
              </div>

              {/* Hover play circle */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
                <div className="w-10 h-10 bg-white/90 text-black rounded-full flex items-center justify-center shadow-lg">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-[-24px] inset-y-0 z-30 w-10 bg-black/50 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity border-l border-white/5 text-white"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

      </div>
    </div>
  );
}
