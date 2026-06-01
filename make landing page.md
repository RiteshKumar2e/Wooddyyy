# Wooddyyy Landing Page & Design System Documentation

Welcome to **Wooddyyy**! This document explains how the landing page and custom hand-crafted design system are implemented, how the components interact, and how to use and extend them in the future.

---

## 🎨 Theme: "Cozy Recycled Paper & Honey Sand"
Wooddyyy's styling is **100% human-made and tactile (light-theme only)**. It moves away from cold, AI-generated glossy vector boxes and implements a cozy physical desk aesthetic.

### Key Visual Pillars
1. **Yellowish Cream Palette**: Built on warm butter-paper tones (`#FCFAF2`) and buttercream card backgrounds (`#FFFDF9`), contrasted with deep organic charcoal ink (`#2D2C24`).
2. **Double Sketch Outlines**: Uses irregular CSS borders (`border-radius: 255px 25px 225px 25px/25px 225px 25px 255px`) which makes cards and inputs look like they are sketched inside a student's sketchbook.
3. **Playful 2D Solid Shadows**: Uses rigid charcoal block shadows (`box-shadow: 4px 4px 0px var(--wood-ink)`) that translate smoothly on hover rather than standard gradient drop-shadows.
4. **Google Font System**:
   - `Fredoka`: Rounded, warm headers representing wood carvings.
   - `Quicksand`: A soft, legible sans-serif for textbooks and core body paragraphs.
   - `Caveat`: A beautiful cursive handwritten font for notebooks, tape accents, and notes.

---

## 📂 File Architecture

The implementation spans 4 core files in the `fortend` (frontend) directory:

```
fortend/
├── src/
│   ├── component/
│   │   └── navbar.jsx      # Cozy Tree stump branding & mobile menu
│   ├── pages/
│   │   └── landing.jsx     # Interactive desk widget, checkboxes & notes
│   ├── App.jsx             # Shell wrapper integrating navbar & landing
│   ├── index.css           # Global design system & typography setup
│   └── App.css             # Emptied to avoid global rule clashes
└── make landing page.md     # This comprehensive guide
```

---

## 🔬 Core Code Details

### 1. Global Styling & Hand-Sketched Classes
Defined in `fortend/src/index.css`, this file sets up our light-yellowish variables, paper grains, and sketched animations.

#### Custom Outlines & Solid 2D Shadows
```css
/* Sketchy Double Outline */
.sketch-border {
  border: 2.5px solid var(--wood-ink) !important;
  border-radius: 255px 25px 225px 25px/25px 225px 25px 255px !important;
}

/* Solid 2D Tactile Shadow */
.sketch-shadow {
  box-shadow: 4px 4px 0px var(--wood-ink);
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Pushdown interactive animation */
.sketch-shadow:hover {
  transform: translate(-3px, -3px);
  box-shadow: 7px 7px 0px var(--wood-ink);
}
.sketch-shadow:active {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0px var(--wood-ink);
}
```

---

### 2. Brand Identity: `navbar.jsx`
Located in `fortend/src/component/navbar.jsx`, it renders a clean header bar with a customized **sprouting tree-stump SVG** representing educational growth.

#### Brand Sprouts Logo
```jsx
<svg className="logo-svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
  {/* Tree rings stump */}
  <path d="M18 3C9.7 3 3 8.4 3 15C3 21.6 9.7 27 18 27C26.3 27 33 21.6 33 15C33 8.4 26.3 3 18 3Z" stroke="#2D2C24" strokeWidth="2.5" fill="#FFFDF9" />
  {/* Sprout growing from rings */}
  <path d="M18 3.5V0" stroke="#2D2C24" strokeWidth="2" strokeLinecap="round" />
  <path d="M18 1.5C18.8 0.5 20 0 21 0" stroke="#2D2C24" strokeWidth="1.8" />
</svg>
```

#### Mobile Responsiveness State
Utilizes React `useState` to toggle the sketchy mobile hamburger navigation drawer:
```jsx
const [isOpen, setIsOpen] = useState(false);
const toggleMenu = () => setIsOpen(!isOpen);
```

---

### 3. Interactive Mechanics: `landing.jsx`
Located in `fortend/src/pages/landing.jsx`, this file drives the core user experience using React state.

#### ☕ Cozy Tea Cup Sip Engine
Allows users to sip tea. Decrements cup level sips, removes steam animations, and triggers a prompt to refill when empty.
```jsx
const [teaSips, setTeaSips] = useState(3);
const drinkTea = () => {
  if (teaSips > 0) setTeaSips(teaSips - 1);
};
const refillTea = () => setTeaSips(3);
```

#### ⌛ Hourglass Focus Timer
Simulates gravity and sand dropping. Flips sand pile layers through a ticking intervals engine.
```jsx
const [hourlySand, setHourlySand] = useState(100);
const flipHourglass = () => {
  setHourlySand(0);
  let current = 0;
  const interval = setInterval(() => {
    current += 10;
    if (current >= 100) {
      setHourlySand(100);
      clearInterval(interval);
    } else {
      setHourlySand(current);
    }
  }, 150);
};
```

#### 🪴 Sprouting Nursery Engine (Reacting to Checkboxes)
Whenever the user ticks off a task in their study planner, the progress percentage updates. The pot seedling reacts visually by growing new leaves and blooming a yellow flower once progress reaches `100%`!
```jsx
// Calculate percentage of tasks marked as completed
const completedCount = tasks.filter(t => t.completed).length;
const progressPercent = Math.round((completedCount / tasks.length) * 100) || 0;
```
Leaves are dynamically rendered in the plant pot SVG container based on `progressPercent`:
```jsx
{/* Stem */}
<path d="M30 70C30 50 28 35 30 15" stroke="#2C5E3B" strokeWidth="3.5" />
{/* Small Leaf Sprout (Always visible) */}
<path d="M30 50C20 45 12 45 10 48C8 51 14 55 30 53" fill="#E8F3D6" stroke="#2D2C24" />
{/* Middle Leaf (Visible if >= 25% complete) */}
{progressPercent >= 25 && <path d="M30 40C40 35..." fill="#A4D0A4" />}
{/* Flowering Blossom! (Visible only at 100% complete) */}
{progressPercent === 100 && (
  <g transform="translate(23, -5)">
    <circle cx="7" cy="7" r="5" fill="#E6A817" />
  </g>
)}
```

#### 📝 Interactive Sketch Post-It Note
Users can select a background color (Yellow, Pink, or Green) and live-type messages inside a warm notepad tape mockup. Textarea content utilizes the `.handwritten` (`Caveat`) font:
```jsx
const [noteContent, setNoteContent] = useState('Keep it slow. Focus is a seedling.');
const [noteType, setNoteType] = useState('yellow'); // yellow | pink | green
```

---

## 🚀 Running and Extending

### 1. How to run the local server
Run the development environment from the `fortend` directory:
```bash
cd fortend
npm install
npm run dev
```

### 2. How to extend into multi-page views
Currently, `App.jsx` handles state layout directly. If you want to connect pages like `student/dashboard.jsx` or `student/quiz.jsx`:
1. Integrate React router: `npm install react-router-dom`.
2. Configure routers in `App.jsx`.
3. Carry the global sketch system variables (e.g. `var(--wood-accent)`, `var(--wood-shadow)`) across your sub-pages to maintain design consistency.
