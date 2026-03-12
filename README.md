# 🏎️ F1 Apex — Interactive Formula 1 Experience

**F1 Apex** is an immersive web experience that brings the world of Formula 1 to the browser.  
The project combines **cinematic storytelling, interactive 3D visualization, and race simulation elements** to create an engaging motorsport-themed website.

Users can explore F1 history, inspect car engineering in 3D, explore circuits, and interact with simplified race and garage simulations.

---

# 🚀 Features

## 🏁 Cinematic Race Intro

The experience begins with a **Formula 1 race start sequence** inspired by real race lights.

- Five red lights countdown
- Lights turn green
- Engine rev sound
- A Formula 1 car launches forward with motion blur and smoke
- Smooth transition into the main website

---

## 📖 Scroll-Driven Storytelling

The website uses **scroll-based sections** to guide users through the world of Formula 1.

Sections include:

- Introduction to Formula 1
- Evolution of F1 car design
- Legendary drivers
- Interactive circuits explorer
- Engineering viewer
- Garage simulator

Smooth animations and transitions create a **cinematic storytelling experience**.

---

## 🌍 Interactive Circuits Explorer

Explore famous Formula 1 circuits with **accurate track layouts**.

Features:

- Interactive circuit cards
- Track layout visualization
- Track information
- Animated racing line
- Mini race simulation on selected circuits

Example circuits:

- Monaco Circuit  
- Silverstone Circuit  
- Suzuka Circuit  
- Spa-Francorchamps  
- Monza  

---

## 🔧 3D Engineering Viewer

A **Jarvis-style engineering interface** allows users to inspect the structure of a Formula 1 car.

Users can:

- Rotate the car
- Zoom into components
- Click engineering parts
- View detailed information panels

Inspectable components include:

- Front Wing  
- Rear Wing  
- Halo  
- Sidepods  
- Diffuser  
- Suspension  
- Tyres  
- Engine  
- ERS system  

Includes **Exploded View Mode** for visualizing internal components.

---

## 🏎 Race Simulation

Users can choose a circuit and run a **simplified race simulation**.

Features:

- Track selection grid
- Animated cars moving around circuits
- Basic telemetry indicators

Telemetry elements include:

- Speed
- Lap counter
- Race progress

---

## 🔧 F1 Garage Simulator

A simplified engineering interface where users can adjust car setup parameters.

Adjustable settings:

- Tyre compound
- Front wing angle
- Rear wing angle
- Aerodynamic balance

Performance metrics update dynamically, including:

- Top speed
- Downforce
- Cornering performance
- Estimated lap time

---

## 🔊 Immersive Sound Design

Audio is used to enhance the experience:

- Engine rev during race intro
- Ambient engine sound in hero section
- Interaction sounds in engineering viewer

---

# 🧰 Tech Stack

### Frontend
- React
- TypeScript
- Vite

### Styling
- TailwindCSS

### 3D Rendering
- Three.js
- React Three Fiber

### Animation
- GSAP
- ScrollTrigger

### Data
- JSON datasets for circuits and drivers

---

# 📂 Project Structure

fl-apex-main/

public/

src/
 ├─ assets/  
 ├─ components/  
 │   ├─ 3d/  
 │   ├─ circuits/  
 │   ├─ ui/  
 │   ├─ AnimatedSection.tsx  
 │   ├─ CarViewerSection.tsx  
 │   ├─ CircuitsSection.tsx  
 │   ├─ DriversSection.tsx  
 │   ├─ EngineeringViewer.tsx  
 │   ├─ EvolutionSection.tsx  
 │   ├─ GarageSimulator.tsx  
 │   ├─ HeroSection.tsx  
 │   └─ F1Footer.tsx  
 │  
 ├─ data/  
 ├─ hooks/  
 ├─ lib/  
 ├─ pages/  
 │  
 ├─ App.tsx  
 ├─ main.tsx  
 ├─ App.css  
 └─ index.css  

.gitignore  
package.json  
tailwind.config.ts  
postcss.config.js  
eslint.config.js  
README.md  

---

# ⚡ Installation

Clone the repository:

git clone https://github.com/YOUR_USERNAME/fl-apex.git

Navigate into the project:

cd fl-apex

Install dependencies:

npm install

Run the development server:

npm run dev

Open in browser:

http://localhost:5173

---

# 🚧 Future Improvements

Planned enhancements include:

- Live telemetry HUD (RPM, speed, gear, DRS)
- Real-time Formula 1 data APIs
- Advanced car configurator
- Multiplayer race simulation
- Full season circuit database

---

# 📜 License

This is a Fun learning project intended for **educational and portfolio purposes**.

---

# 🙌 Acknowledgements

Inspired by the engineering, innovation, and excitement of **Formula 1** and modern interactive storytelling experiences.
