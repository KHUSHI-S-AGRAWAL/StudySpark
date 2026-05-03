# 📚 StudySpark 

**StudySpark** is an ultimate AI-powered study assistant built to transform passive reading into an interactive learning experience. By leveraging the advanced reasoning capabilities of the Google Gemini API, StudySpark allows students to upload their lecture notes, past papers, and syllabuses to instantly generate tailored study plans, dynamic quizzes, and deep analytical insights.

It features a stunning, custom-built dark mode interface engineered directly inside Streamlit, utilizing custom JavaScript injections for fluid animations and a native Text-to-Speech engine.
LIVE DEMO:https://canva.link/7olnuwk4txf7jsk


DEPLOYED SITE:https://studyspark-zeeg.onrender.com/
---

## ✨ Core Features

*   **📊 AI Pattern Analytics:** Automatically scans your past papers to generate a data-driven dashboard. Identifies the most frequently asked topics, assigns importance scores, and charts question types to tell you exactly what you need to prioritize.
*   **📅 Smart Study Planner:** Just input how many days you have until your exam. StudySpark cross-references your syllabus with past exam patterns to build a highly optimized, day-by-day markdown study schedule.
*   **📝 Document Summary:** Instantly extract the core essence of dense PDFs and lecture notes into a concise, easily readable summary.
*   **🎯 Important Points:** Extracts the most critical bullet points, key concepts, and formulas so you can review exactly what matters without the fluff.
*   **🧠 How to Study Strategy:** Asks the AI to recommend the best customized learning strategy, techniques, and focus areas to master your specific subject matter.
*   **💡 Practice Questions:** Dynamically generates highly probable practice questions based on the most frequently asked concepts in your papers, complete with difficulty levels and detailed solutions.
*   **❓ Interactive Quiz Engine:** Test your knowledge before the exam. StudySpark dynamically generates multiple-choice quizzes based on your specific materials, grading your answers and providing detailed explanations.
*   **👨‍🏫 Smart Tutor Chatbot:** Stuck on a hard concept? Chat directly with your uploaded documents. Ask for simpler explanations, formula breakdowns, or examples, and the context-aware tutor will respond instantly.
*   **🎥 Video Resources:** Prefer visual learning? StudySpark automatically recommends the best YouTube search queries and video resources tailored directly to your syllabus and course materials.
*   **🔊 Native Text-to-Speech (TTS):** Every generated text output comes with a native `🔊 Listen` button. Our custom JavaScript integration bypasses iframe sandboxes to deliver flawless audio reading directly through your browser.

---

## 💻 Tech Stack & UI Highlights

*   **Frontend Interface:** [Streamlit](https://streamlit.io/) with heavy custom CSS overrides.
*   **Aesthetics:** High-fidelity Vercel-inspired dark theme (`#0b1120` Slate and `#38bdf8` Sky Blue).
*   **Responsive Design:** Implements modern `clamp()` typography to ensure pixel-perfect rendering across both desktop monitors and mobile devices.
*   **Animations:** Features GSAP-inspired scrambled text effects and dynamic radial-gradient "Spotlight" hover interactions, engineered via `MutationObserver` injections to survive Streamlit's state reruns.
*   **Backend / AI Engine:** Google Generative AI (`gemini-3-flash-preview` / `gemini-1.5-pro-latest`).
*   **Document Processing:** `PyPDF2` for robust text extraction and `langchain_google_genai` for unstructured image/document parsing. Parallel processing is heavily utilized to drastically reduce loading times for large document batches.

---

## 🚀 Installation & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/StudySpark.git
cd StudySpark
```

### 2. Create a virtual environment
It is recommended to use a virtual environment to manage dependencies.
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
You must provide a Google Gemini API Key to power the AI features. Create a `.env` file in the root directory:
```env
GOOGLE_API_KEY="your_gemini_api_key_here"
```

### 5. Run the Application
Start the Streamlit server:
```bash
streamlit run app.py
```
The application will automatically open in your default browser at `http://localhost:8501`.

---

## 🎨 UI Note for Developers
Streamlit heavily sandboxes custom HTML/JS. If you wish to extend the Text-to-Speech engine or the Spotlight hover effects, refer to the custom `MutationObserver` logic and the Base64 injection functions located near the top of `app.py`. They are specifically designed to safely bypass React's `dangerouslySetInnerHTML` event listener stripping and the `iframe` security sandboxes.

---
*Happy Studying!* 🚀
