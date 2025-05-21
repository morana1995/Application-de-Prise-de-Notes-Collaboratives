export const tailwindStandardClasses = {
  // Notes
  "note-content": "overflow-hidden line-clamp-3",

  // Sidebar
  "sidebar-item":
    "flex items-center gap-3 px-3 py-2 rounded-md text-[#403f45] hover:bg-[#f5f5f5] hover:text-[#1a1a1a] transition-colors",
  "sidebar-item.active":
    "bg-[#f5f5f5] text-[#1a1a1a] font-medium",

  // Couleurs (fond / texte)
  "bg-background": "bg-[#f2f2f2]",
  "text-foreground": "text-[#0b0d11]",
  "bg-primary": "bg-[#9b87f5]",
  "text-primary": "text-[#9b87f5]",
  "border-input": "border-[#e4e4e7]",
  "bg-muted": "bg-[#f2f4f6]",
  "text-muted-foreground": "text-[#697386]",
  "bg-accent": "bg-[#e5deff]",

  // Sidebar spécifiques
  "bg-sidebar": "bg-[#f2f2f2]",
  "text-sidebar-foreground": "text-[#403f45]",
  "bg-sidebar-primary": "bg-[#9b87f5]",
  "text-sidebar-primary-foreground": "text-[#fafafa]",
  "bg-sidebar-accent": "bg-[#f5f5f5]",
  "text-sidebar-accent-foreground": "text-[#1a1a1a]",

  // Animations
  "animate-fade-in": "animate-in fade-in",
  "animate-pulse": "animate-pulse",
  "animate-caret-blink": "animate-pulse", // Même animation

  // Effets / transformations
  "backdrop-blur-sm": "backdrop-blur-sm",
  "backdrop-blur-xl": "backdrop-blur-xl",
  "backdrop-blur-2xl": "backdrop-blur-2xl",

  // Dégradés et effets de fond
  "bg-gradient-to-r from-primary/10 to-accent/10":
    "bg-gradient-to-r from-[#9b87f5]/10 to-[#e5deff]/10",

  "glass-morphism":
    "backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]",

  "neo-blur":
    "backdrop-blur-2xl bg-black/40 border border-white/10",

  // Texte avec dégradé
  "text-gradient":
    "bg-gradient-to-br from-white via-white/90 to-white/70 bg-clip-text text-transparent",

  "text-gradient-primary":
    "bg-gradient-to-br from-[#9b87f5] via-[#9b87f5]/80 to-[#9b87f5]/60 bg-clip-text text-transparent",
};
