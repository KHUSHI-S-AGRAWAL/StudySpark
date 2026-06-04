# 📚 StudySpark — AI-Powered Academic Workspace

StudySpark is a next-generation academic engine that ingests study notes, textbook chapters, and exam materials to dynamically build customized student dashboards. Utilizing AI processing frameworks, the platform organizes materials into interactive modules to accelerate comprehension and retention metrics.

---

## 🔮 Key Feature Modules

StudySpark provides an interactive, 3D glassmorphic workspace split into 9 distinct capabilities arranged in a uniform $3 \times 3$ grid structure:

* **📊 Analytics Dashboard:** Evaluates historical paper trend distributions, tracking topic frequency and core emphasis scores on responsive chart visualizers.
* **📅 Smart Planner:** Compiles prioritized calendar roadmaps optimized dynamically against curriculum timeline limits and coverage depth vectors.
* **📝 Summary Sheet:** Parses long text blocks into segmented glass index cards for quick, structured reviews of core concepts.
* **🎯 Important Points:** Extracts critical equations, core formulas, and high-frequency note configurations into a dedicated sidebar stream.
* **🧠 How to Study:** Generates custom algorithmic roadmap strategies indicating core target sequences to tackle material bottlenecks.
* **💡 Practice Qs:** Drafts predictive, high-priority exam question variations modeled against historical test weights.
* **❓ Interactive Quiz:** Runs custom mock evaluation environments complete with real-time feedback scores and inline solution explanations.
* **👨‍🏫 Smart Tutor:** Launches an AI classroom workspace environment for targeted 1-on-1 tutoring sessions.
* **🎥 Video Resources:** Connects specific topic pain-points to relevant YouTube multimedia educational assets that open directly in separate browser tabs.

---

## 🛠️ Technological Architecture

The platform uses a decoupled frontend/backend pipeline unified inside a single repository:

### Frontend Layer
* **Framework:** React.js (Vite Core Compiler Engine)
* **Styling Engine:** Custom Inline Styles + Component-level CSS Modules
* **Animations:** 3D Perspective Transformations (`transform-style: preserve-3d`) & `StarBorder` SVG orbiting border tracking curves
* **HTTP Client:** Axios (Integrated Promise Request-Intercept Architecture)

### Backend Layer
* **Framework:** FastAPI (Asynchronous Python Web Services Framework)
* **Server Engine:** Uvicorn ASGI Web Deployment Driver
* **AI Integration:** Google Gemini API Framework (Text Context Parsers)
* **Data Models:** Pydantic (Strict API Parameter Validation Schemas)

---

## 📁 Repository Directory Structure

```text
StudySpark/
├── .gitignore               # Root Git exclusion filter profiles
├── README.md                # System documentation architecture
├── backend/                 # FastAPI Application Core
│   ├── main.py              # Application entrypoint & endpoint routing matrix
│   ├── requirements.txt     # Python system dependency specifications
│   ├── venv/                # Local virtual environment isolation layout (git ignored)
│   └── services/            # Core processing workers (Quiz, Planner, Workers)
└── frontend/                # React.js Application Core
    ├── package.json         # Node package registration blueprints
    ├── vite.config.js       # Vite build configurations and proxy handlers
    ├── node_modules/        # Vendor package modules (git ignored)
    └── src/
        ├── App.jsx          # Application runtime view router
        ├── components/      # Common navigation structures (Navbar, Zones)
        ├── services/        # Axios API endpoint mapping connectors (api.js)
        └── pages/           # Platform user view route nodes
            ├── features/    # Sub-workspace modules (GlassIcons, StarBorder, Views)
            └── DashboardGrid.jsx  # Main 3x3 interactive dashboard grid
