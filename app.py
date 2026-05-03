import streamlit as st
import os
import json
import base64
import pandas as pd
import concurrent.futures
import streamlit.components.v1 as components
from dotenv import load_dotenv
from google import genai
from utils.ingestion import process_pdf, process_image

load_dotenv()
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def get_base64_image(image_path):
    if not os.path.exists(image_path):
        return ""
    with open(image_path, "rb") as f:
        data = f.read()
    return base64.b64encode(data).decode()

def render_listen_button(text):
    b64_text = base64.b64encode(text.encode('utf-8')).decode('utf-8')
    html_code = f"""<div style="display:flex; justify-content:flex-end; gap: 8px; margin-bottom: 10px;"><button class="audio-listen-btn" data-text="{b64_text}" style="background:#38bdf8; color:#0b1120; border:none; border-radius:6px; padding:8px 16px; cursor:pointer; font-weight:bold; font-family: sans-serif; transition: 0.2s;">🔊 Listen</button><button class="audio-stop-btn" style="background:#ef4444; color:#ffffff; border:none; border-radius:6px; padding:8px 16px; cursor:pointer; font-weight:bold; font-family: sans-serif; transition: 0.2s;">⏹️ Stop</button></div>"""
    st.markdown(html_code, unsafe_allow_html=True)

book_icon_b64 = get_base64_image("book_icon.png")
icon_img_tag = f'<img src="data:image/png;base64,{book_icon_b64}" style="width: clamp(80px, 15vw, 120px); margin-bottom: 0.5rem;">' if book_icon_b64 else '<div style="font-size: clamp(4rem, 10vw, 6rem); margin-bottom: 0.5rem; text-align: center;">✨</div>'
icon_img_tag_inline = f'<img src="data:image/png;base64,{book_icon_b64}" style="width: clamp(35px, 6vw, 45px); vertical-align: middle; margin-right: 10px; margin-bottom: 8px;">' if book_icon_b64 else '✨'

st.set_page_config(page_title="StudySpark", page_icon="📚", layout="wide")

st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif !important;
    }

    /* Pull content to the absolute top */
    .stApp > header {
        display: none !important;
    }
    .stApp [data-testid="stAppViewBlockContainer"],
    .block-container {
        padding-top: 1rem !important;
        margin-top: 0 !important;
        padding-bottom: 0rem !important;
    }

    /* Make all default text globally bolder and visible */
    p, span, label, li, div {
        font-weight: 500 !important;
    }

    /* Gradient Headers for a premium dark feel */
    h1, h2 {
        background: linear-gradient(90deg, #38bdf8, #818cf8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        width: max-content;
        max-width: 100%;
        font-weight: 800 !important;
    }

    /* Spotlight card styling applied to secondary buttons */
    button[kind="secondary"], 
    [data-testid="stBaseButton-secondary"], 
    [data-testid="baseButton-secondary"] {
        position: relative !important;
        border-radius: 1.2rem !important;
        border: 1px solid #334155 !important;
        background-color: #1e293b !important;
        padding: 2rem !important;
        min-height: 120px !important;
        height: auto !important;
        overflow: hidden !important;
        --mouse-x: 50%;
        --mouse-y: 50%;
        --spotlight-color: rgba(56, 189, 248, 0.1);
        color: #ffffff !important;
        transition: transform 0.2s, border-color 0.2s !important;
    }

    button[kind="secondary"] p,
    [data-testid="stBaseButton-secondary"] p,
    [data-testid="baseButton-secondary"] p {
        font-size: 1.8rem !important;
        font-weight: 800 !important;
        margin: 0 !important;
    }

    button[kind="secondary"]::before, 
    [data-testid="stBaseButton-secondary"]::before, 
    [data-testid="baseButton-secondary"]::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 80%) !important;
        opacity: 0 !important;
        transition: opacity 0.5s ease !important;
        pointer-events: none !important;
        z-index: 0 !important;
    }

    button[kind="secondary"]:hover::before,
    [data-testid="stBaseButton-secondary"]:hover::before,
    [data-testid="baseButton-secondary"]:hover::before,
    button[kind="secondary"]:focus-within::before,
    [data-testid="stBaseButton-secondary"]:focus-within::before,
    [data-testid="baseButton-secondary"]:focus-within::before {
        opacity: 1 !important;
    }
    
    button[kind="secondary"]:hover,
    [data-testid="stBaseButton-secondary"]:hover,
    [data-testid="baseButton-secondary"]:hover {
        transform: translateY(-4px) !important;
        border-color: #38bdf8 !important;
    }

    button[kind="secondary"] > div,
    [data-testid="stBaseButton-secondary"] > div,
    [data-testid="baseButton-secondary"] > div {
        position: relative !important;
        z-index: 1 !important;
    }

    /* Keep primary buttons standard but nice */
    button[kind="primary"],
    [data-testid="stBaseButton-primary"],
    [data-testid="baseButton-primary"] {
        border-radius: 8px !important;
        background-color: #38bdf8 !important;
        color: #0b1120 !important;
        border: none !important;
        font-weight: 700 !important;
        transition: all 0.2s ease-in-out !important;
        overflow: hidden !important;
        margin-top: 10px !important;
    }
    button[kind="primary"]:hover,
    [data-testid="stBaseButton-primary"]:hover,
    [data-testid="baseButton-primary"]:hover {
        transform: translateY(-2px) !important;
        background-color: #7dd3fc !important;
        box-shadow: 0 4px 14px rgba(56, 189, 248, 0.4) !important;
    }

    /* BorderGlow styling for Upload Dropzone */
    [data-testid="stFileUploaderDropzone"] {
        --edge-proximity: 0;
        --cursor-angle: 45deg;
        --edge-sensitivity: 30;
        --color-sensitivity: calc(var(--edge-sensitivity) + 20);
        --border-radius: 12px;
        --glow-padding: 30px;
        --cone-spread: 25;
        --card-bg: #1e293b;

        position: relative !important;
        border-radius: var(--border-radius) !important;
        isolation: isolate !important;
        transform: translate3d(0, 0, 0.01px) !important;
        border: 1px solid #334155 !important;
        background: var(--card-bg) !important;
        overflow: visible !important;
    }

    [data-testid="stFileUploaderDropzone"]::before,
    [data-testid="stFileUploaderDropzone"]::after,
    [data-testid="stFileUploaderDropzone"] > .edge-light {
        content: "" !important;
        position: absolute !important;
        inset: 0 !important;
        border-radius: inherit !important;
        transition: opacity 0.25s ease-out !important;
        z-index: -1 !important;
    }

    [data-testid="stFileUploaderDropzone"]:not(:hover):not(.sweep-active)::before,
    [data-testid="stFileUploaderDropzone"]:not(:hover):not(.sweep-active)::after,
    [data-testid="stFileUploaderDropzone"]:not(:hover):not(.sweep-active) > .edge-light {
        opacity: 0 !important;
        transition: opacity 0.75s ease-in-out !important;
    }

    [data-testid="stFileUploaderDropzone"]::before {
        border: 1px solid transparent !important;
        background:
            linear-gradient(var(--card-bg) 0 100%) padding-box,
            linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box,
            radial-gradient(at 80% 55%, #102d65 0px, transparent 50%) border-box,
            radial-gradient(at 69% 34%, #2755ab 0px, transparent 50%) border-box,
            radial-gradient(at 8% 6%, #102d65 0px, transparent 50%) border-box,
            radial-gradient(at 41% 38%, #366ac7 0px, transparent 50%) border-box,
            radial-gradient(at 86% 85%, #102d65 0px, transparent 50%) border-box,
            radial-gradient(at 82% 18%, #2755ab 0px, transparent 50%) border-box,
            radial-gradient(at 51% 4%, #366ac7 0px, transparent 50%) border-box,
            linear-gradient(#102d65 0 100%) border-box !important;

        opacity: calc((var(--edge-proximity) - var(--color-sensitivity)) / (100 - var(--color-sensitivity))) !important;

        mask-image: conic-gradient(from var(--cursor-angle) at center, black calc(var(--cone-spread) * 1%), transparent calc((var(--cone-spread) + 15) * 1%), transparent calc((100 - var(--cone-spread) - 15) * 1%), black calc((100 - var(--cone-spread)) * 1%)) !important;
        -webkit-mask-image: conic-gradient(from var(--cursor-angle) at center, black calc(var(--cone-spread) * 1%), transparent calc((var(--cone-spread) + 15) * 1%), transparent calc((100 - var(--cone-spread) - 15) * 1%), black calc((100 - var(--cone-spread)) * 1%)) !important;
    }

    [data-testid="stFileUploaderDropzone"]::after {
        border: 1px solid transparent !important;
        background:
            radial-gradient(at 80% 55%, #102d65 0px, transparent 50%) padding-box,
            radial-gradient(at 69% 34%, #2755ab 0px, transparent 50%) padding-box,
            radial-gradient(at 8% 6%, #102d65 0px, transparent 50%) padding-box,
            radial-gradient(at 41% 38%, #366ac7 0px, transparent 50%) padding-box,
            radial-gradient(at 86% 85%, #102d65 0px, transparent 50%) padding-box,
            radial-gradient(at 82% 18%, #2755ab 0px, transparent 50%) padding-box,
            radial-gradient(at 51% 4%, #366ac7 0px, transparent 50%) padding-box,
            linear-gradient(#102d65 0 100%) padding-box !important;

        mask-image: linear-gradient(to bottom, black, black), radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%), radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%), radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%), radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%), radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%), conic-gradient(from var(--cursor-angle) at center, transparent 5%, black 15%, black 85%, transparent 95%) !important;
        
        mask-composite: subtract, add, add, add, add, add !important;
        -webkit-mask-composite: source-out, source-over, source-over, source-over, source-over, source-over !important;
        opacity: calc(0.5 * (var(--edge-proximity) - var(--color-sensitivity)) / (100 - var(--color-sensitivity))) !important;
        mix-blend-mode: multiply !important;
    }

    [data-testid="stFileUploaderDropzone"] > .edge-light {
        inset: calc(var(--glow-padding) * -1) !important;
        pointer-events: none !important;
        z-index: 1 !important;

        mask-image: conic-gradient(from var(--cursor-angle) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%) !important;
        -webkit-mask-image: conic-gradient(from var(--cursor-angle) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%) !important;

        opacity: calc((var(--edge-proximity) - var(--edge-sensitivity)) / (100 - var(--edge-sensitivity))) !important;
        mix-blend-mode: darken !important;
    }

    [data-testid="stFileUploaderDropzone"] > .edge-light::before {
        content: "" !important;
        position: absolute !important;
        inset: var(--glow-padding) !important;
        border-radius: inherit !important;
        box-shadow:
            inset 0 0 0 1px rgba(16, 45, 101, 1),
            inset 0 0 1px 0 rgba(16, 45, 101, 0.6),
            inset 0 0 3px 0 rgba(16, 45, 101, 0.5),
            inset 0 0 6px 0 rgba(16, 45, 101, 0.4),
            inset 0 0 15px 0 rgba(16, 45, 101, 0.3),
            inset 0 0 25px 2px rgba(16, 45, 101, 0.2),
            inset 0 0 50px 2px rgba(16, 45, 101, 0.1),
            0 0 1px 0 rgba(16, 45, 101, 0.6),
            0 0 3px 0 rgba(16, 45, 101, 0.5),
            0 0 6px 0 rgba(16, 45, 101, 0.4),
            0 0 15px 0 rgba(16, 45, 101, 0.3),
            0 0 25px 2px rgba(16, 45, 101, 0.2),
            0 0 50px 2px rgba(16, 45, 101, 0.1) !important;
    }
    h1#scramble-title {
        margin: 0 auto !important;
        font-size: clamp(5rem, 15vw, 10rem) !important;
        color: #ffffff;
        text-shadow: 0 0 30px rgba(56, 189, 248, 0.4);
        background: none;
        -webkit-text-fill-color: initial;
    }
    
    h1#scramble-title span {
        display: inline-block;
        min-width: 0.5rem;
    }
</style>
""", unsafe_allow_html=True)

components.html(
    """
    <script>
    const parentDoc = window.parent.document;
    
    function updateSpotlight() {
        const buttons = parentDoc.querySelectorAll('button[kind="secondary"], [data-testid="stBaseButton-secondary"], [data-testid="baseButton-secondary"]');
        buttons.forEach(btn => {
            if (!btn.spotlightInitialized) {
                btn.addEventListener('mousemove', e => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    btn.style.setProperty('--mouse-x', `${x}px`);
                    btn.style.setProperty('--mouse-y', `${y}px`);
                });
                btn.spotlightInitialized = true;
            }
        });

        const dropzones = parentDoc.querySelectorAll('[data-testid="stFileUploaderDropzone"], [data-testid="stFileUploadDropzone"]');
        dropzones.forEach(dz => {
            if (!dz.querySelector('.edge-light')) {
                const edgeLight = parentDoc.createElement('span');
                edgeLight.className = 'edge-light';
                dz.appendChild(edgeLight);
            }
            if (!dz.glowInitialized) {
                dz.addEventListener('pointermove', e => {
                    const rect = dz.getBoundingClientRect();
                    if(rect.width === 0) return;
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const cx = rect.width / 2;
                    const cy = rect.height / 2;
                    const dx = x - cx;
                    const dy = y - cy;
                    
                    let kx = Infinity, ky = Infinity;
                    if (dx !== 0) kx = cx / Math.abs(dx);
                    if (dy !== 0) ky = cy / Math.abs(dy);
                    const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
                    
                    let degrees = 0;
                    if (dx !== 0 || dy !== 0) {
                        degrees = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
                        if (degrees < 0) degrees += 360;
                    }

                    dz.style.setProperty('--edge-proximity', (edge * 100).toFixed(3));
                    dz.style.setProperty('--cursor-angle', degrees.toFixed(3) + 'deg');
                });
                dz.glowInitialized = true;
            }
        });
    }

    // Run once immediately
    updateSpotlight();

    function initScrambler() {
        const title = parentDoc.querySelector("#scramble-title");
        if (!title || title.dataset.scramblerInitialized) return;
        
        const originalText = title.innerText;
        title.innerHTML = "";
        originalText.split("").forEach(char => {
            const span = parentDoc.createElement("span");
            span.innerText = char;
            span.dataset.char = char;
            span.style.display = "inline-block";
            if (char === " ") span.style.width = "1rem";
            title.appendChild(span);
        });

        if (!parentDoc.scrambleListenerAttached) {
            const radius = 150;
            const chars = ".:/\\\\*+=-_&^%$#@!";
            parentDoc.addEventListener("pointermove", (e) => {
                const currentTitle = parentDoc.querySelector("#scramble-title");
                if (!currentTitle) return;
                
                const spans = currentTitle.querySelectorAll("span");
                if (spans.length === 0) return;
                
                spans.forEach(span => {
                    const rect = span.getBoundingClientRect();
                    if(rect.width === 0) return;
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

                    if (dist < radius) {
                        if (!span.isScrambling && span.dataset.char !== " ") {
                            span.isScrambling = true;
                            let iterations = 0;
                            const maxIterations = Math.floor(Math.random() * 10) + 5;
                            const interval = setInterval(() => {
                                span.innerText = chars[Math.floor(Math.random() * chars.length)];
                                iterations++;
                                if (iterations >= maxIterations) {
                                    clearInterval(interval);
                                    span.innerText = span.dataset.char;
                                    span.isScrambling = false;
                                }
                            }, 40);
                        }
                    }
                });
            });
            parentDoc.scrambleListenerAttached = true;
        }
        title.dataset.scramblerInitialized = "true";
    }

    // Inject native TTS handler into main window
    if (!parentDoc.getElementById('tts-handler')) {
        const script = parentDoc.createElement('script');
        script.id = 'tts-handler';
        script.innerHTML = `
            window.addEventListener('playAudioEvent', (e) => {
                window.speechSynthesis.cancel();
                const text = decodeURIComponent(escape(window.atob(e.detail)));
                const msg = new SpeechSynthesisUtterance(text);
                window.speechSynthesis.speak(msg);
            });
            window.addEventListener('stopAudioEvent', () => {
                window.speechSynthesis.cancel();
            });
        `;
        parentDoc.head.appendChild(script);
    }

    // Global Audio Listeners
    function initAudioListeners() {
        const listenBtns = parentDoc.querySelectorAll('.audio-listen-btn');
        listenBtns.forEach(btn => {
            if (!btn.audioInitialized) {
                btn.addEventListener('click', () => {
                    const b64 = btn.getAttribute('data-text');
                    if (b64) {
                        const event = new parentDoc.defaultView.CustomEvent('playAudioEvent', { detail: b64 });
                        parentDoc.defaultView.dispatchEvent(event);
                    }
                });
                btn.audioInitialized = true;
            }
        });

        const stopBtns = parentDoc.querySelectorAll('.audio-stop-btn');
        stopBtns.forEach(btn => {
            if (!btn.audioInitialized) {
                btn.addEventListener('click', () => {
                    const event = new parentDoc.defaultView.CustomEvent('stopAudioEvent');
                    parentDoc.defaultView.dispatchEvent(event);
                });
                btn.audioInitialized = true;
            }
        });
    }

    initScrambler();
    initAudioListeners();

    // Set up an observer to attach listeners to new buttons if they appear
    const observer = new MutationObserver(mutations => {
        updateSpotlight();
        initScrambler();
        initAudioListeners();
    });
    observer.observe(parentDoc.body, { childList: true, subtree: true });

    // TextType Animation Logic for Landing Page Subtitle
    if (!parentDoc.textTypeInitialized) {
        const typeTexts = ["Your Ultimate AI-Powered Study Assistant", "Master your syllabus faster", "Generate practice quizzes instantly", "Happy studying!"];
        let typeIndex = 0;
        let charIndex = typeTexts[0].length;
        let isDeleting = false;
        let firstRun = true;
        
        function typeEffect() {
            const subtitle = parentDoc.querySelector(".animated-subtitle");
            if (!subtitle) {
                setTimeout(typeEffect, 500);
                return;
            }
            
            const currentText = typeTexts[typeIndex];
            
            if (isDeleting) {
                subtitle.innerText = currentText.substring(0, charIndex - 1) + "_";
                charIndex--;
            } else {
                subtitle.innerText = currentText.substring(0, charIndex + 1) + "_";
                charIndex++;
            }
            
            let speed = isDeleting ? 50 : 75;
            
            if (!isDeleting && charIndex === currentText.length) {
                speed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                typeIndex = (typeIndex + 1) % typeTexts.length;
                speed = 500;
            }
            
            if (firstRun) {
                speed = 2000;
                isDeleting = true;
                firstRun = false;
            }
            
            setTimeout(typeEffect, speed);
        }
        
        setTimeout(typeEffect, 1000);
        parentDoc.textTypeInitialized = true;
    }
    </script>
    """,
    height=0,
    width=0,
)


@st.cache_data(show_spinner=False)
def generate_ai_response(prompt, context):
    full_prompt = f"{prompt}\nContext: {context[:15000]}"
    response = client.models.generate_content(model="gemini-3-flash-preview", contents=full_prompt)
    return response.text

@st.cache_data(show_spinner=False)
def generate_analytics(papers_context, syllabus_context):
    syl_prompt = f"Syllabus Context: {syllabus_context[:5000]}\n\n" if syllabus_context else ""
    prompt = f"""You are an AI exam analyst. Based on the provided papers/notes and syllabus, generate a JSON analysis.
    The JSON must strictly have this structure:
    {{
        "topics": [
            {{"name": "Topic 1", "frequency": 5, "importance_score": 85, "in_syllabus": true}},
            {{"name": "Topic 2", "frequency": 3, "importance_score": 50, "in_syllabus": false}}
        ],
        "question_types": [
            {{"type": "MCQ", "percentage": 40}},
            {{"type": "Short Answer", "percentage": 60}}
        ],
        "coverage_gaps": ["List of topics in syllabus but missing in papers"]
    }}
    {syl_prompt}
    Papers Context: {papers_context[:10000]}
    Return ONLY valid JSON.
    """
    response = client.models.generate_content(model="gemini-3-flash-preview", contents=prompt)
    resp_text = response.text.strip()
    if resp_text.startswith("```json"): resp_text = resp_text[7:]
    if resp_text.endswith("```"): resp_text = resp_text[:-3]
    return json.loads(resp_text.strip())

def process_file_parallel(uploaded_file):
    temp_path = f"temp_{uploaded_file.name}"
    with open(temp_path, "wb") as f:
        f.write(uploaded_file.getbuffer())
    
    if temp_path.lower().endswith(".pdf"):
        chunks = process_pdf(temp_path)
    else:
        chunks = process_image(temp_path, client)
        
    text = " ".join([c.page_content for c in chunks]) if chunks else ""
    os.remove(temp_path)
    return text

if "started" not in st.session_state:
    st.session_state.started = False

if not st.session_state.started:
    st.markdown("""
        <style>
        @keyframes slideFadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animated-subtitle {
            animation: slideFadeIn 1s ease-out forwards;
            animation-delay: 0.3s;
            opacity: 0;
            color: #ffffff;
            margin-top: 1rem;
            font-size: clamp(1.2rem, 4vw, 1.8rem);
        }
        .animated-text {
            animation: slideFadeIn 1s ease-out forwards;
            animation-delay: 0.6s;
            opacity: 0;
            max-width: 600px;
            margin: 0 auto;
            color: #e0e6ed;
            margin-top: 1rem;
            font-size: clamp(0.9rem, 2vw, 1.1rem);
            padding: 0 1rem;
        }
        </style>
    """, unsafe_allow_html=True)
    
    st.markdown(f"""
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 15vh; margin-bottom: 2rem; text-align: center; padding: 0 1rem;">
            <div style="text-align: center;">{icon_img_tag}</div>
            <h1 id="scramble-title" style="margin: 0; padding: 0;">StudySpark</h1>
            <h3 class="animated-subtitle">Your Ultimate AI-Powered Study Assistant</h3>
            <p class="animated-text">
                Transform your notes and syllabus into an interactive learning experience. Upload your documents to instantly generate analytics, smart summaries, practice quizzes, and get personalized video recommendations.
            </p>
        </div>
    """, unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns([1, 1, 1])
    with col2:
        if st.button("🚀 Let's Get Started", type="primary", use_container_width=True):
            st.session_state.started = True
            st.rerun()
    st.stop()

current_feat = st.session_state.get("current_feature")

if not current_feat:
    st.markdown(f"<h1 style='display: flex; align-items: center; margin-bottom: 0; padding-bottom: 0;'>{icon_img_tag_inline} StudySpark</h1>", unsafe_allow_html=True)
    st.markdown("---")

if "full_context" not in st.session_state:
    st.markdown("<h2 style='text-align: center; color: #ffffff;'>Upload Documents</h2>", unsafe_allow_html=True)
    st.markdown("<p style='text-align: center; color: #e0e6ed; margin-bottom: 2rem;'>Please upload your PDF/Image documents to get started.</p>", unsafe_allow_html=True)
    
    with st.container():
        uploaded_files = st.file_uploader(
            "Upload Papers/Notes (PDF/Image)", 
            type=["pdf", "png", "jpg", "jpeg"], 
            accept_multiple_files=True
        )
        syllabus_files = st.file_uploader(
            "Upload Syllabus (PDF/Image - Optional)", 
            type=["pdf", "png", "jpg", "jpeg"], 
            accept_multiple_files=True
        )

        if st.button("Process Documents", use_container_width=True, type="primary"):
            if uploaded_files:
                with st.spinner("Processing Documents in parallel..."):
                    with concurrent.futures.ThreadPoolExecutor() as executor:
                        papers_text_list = list(executor.map(process_file_parallel, uploaded_files))
                    st.session_state.full_context = " ".join(papers_text_list)
                    
                    if syllabus_files:
                        with concurrent.futures.ThreadPoolExecutor() as executor:
                            syllabus_text_list = list(executor.map(process_file_parallel, syllabus_files))
                        st.session_state.syllabus_context = " ".join(syllabus_text_list)
                    else:
                        st.session_state.syllabus_context = ""
                        
                    st.rerun()
            else:
                st.warning("Please upload at least one paper/note to proceed.")

else:
    with st.sidebar:
        st.header("⚙️ Controls")
        if st.button("🗑️ Start Over", use_container_width=True, type="primary"):
            for key in list(st.session_state.keys()):
                del st.session_state[key]
            st.rerun()
        st.markdown("---")
        st.success("✅ Documents Loaded")
        st.write(f"**Context size:** {len(st.session_state.full_context)} chars")
        if st.session_state.get("syllabus_context"):
            st.write(f"**Syllabus size:** {len(st.session_state.syllabus_context)} chars")

    if not current_feat:
        st.markdown("<div style='display: flex; justify-content: center; margin-top: 1rem; margin-bottom: 2rem;'><h2>Choose a Feature</h2></div>", unsafe_allow_html=True)
        
        col1, col2, col3 = st.columns(3)
        with col1:
            st.button("📊 Analytics Dashboard", use_container_width=True, type="secondary", on_click=lambda: st.session_state.update({"current_feature": "Analytics Dashboard"}))
        with col2:
            st.button("📅 Smart Planner", use_container_width=True, type="secondary", on_click=lambda: st.session_state.update({"current_feature": "Smart Study Planner"}))
        with col3:
            st.button("📝 Summary", use_container_width=True, type="secondary", on_click=lambda: st.session_state.update({"current_feature": "Summary"}))

        col4, col5, col6 = st.columns(3)
        with col4:
            st.button("🎯 Important Points", use_container_width=True, type="secondary", on_click=lambda: st.session_state.update({"current_feature": "Important Points"}))
        with col5:
            st.button("🧠 How to Study", use_container_width=True, type="secondary", on_click=lambda: st.session_state.update({"current_feature": "How to Study"}))
        with col6:
            st.button("💡 Practice Qs", use_container_width=True, type="secondary", on_click=lambda: st.session_state.update({"current_feature": "Practice Questions"}))
                
        col7, col8, col9 = st.columns(3)
        with col7:
            st.button("❓ Quiz", use_container_width=True, type="secondary", on_click=lambda: st.session_state.update({"current_feature": "Quiz"}))
        with col8:
            st.button("👨‍🏫 Smart Tutor", use_container_width=True, type="secondary", on_click=lambda: st.session_state.update({"current_feature": "Smart Tutor"}))
        with col9:
            st.button("🎥 Video Resources", use_container_width=True, type="secondary", on_click=lambda: st.session_state.update({"current_feature": "Video Resources"}))
    else:
        st.button("⬅️ Back to Features", type="primary", on_click=lambda: st.session_state.update({"current_feature": None}))
        st.markdown("---")
            
    if current_feat == "Analytics Dashboard":
        st.header("📊 AI Pattern Analytics")
        with st.spinner("Analyzing historical patterns..."):
            try:
                data = generate_analytics(st.session_state.full_context, st.session_state.syllabus_context)
                
                st.subheader("Topic Frequency & Importance")
                df_topics = pd.DataFrame(data.get("topics", []))
                if not df_topics.empty:
                    st.bar_chart(df_topics.set_index("name")[["frequency", "importance_score"]])
                
                col1, col2 = st.columns(2)
                with col1:
                    st.subheader("Question Types")
                    df_qtypes = pd.DataFrame(data.get("question_types", []))
                    if not df_qtypes.empty:
                        st.bar_chart(df_qtypes.set_index("type"))
                with col2:
                    st.subheader("Coverage Gaps")
                    if data.get("coverage_gaps"):
                        for gap in data["coverage_gaps"]:
                            st.warning(f"⚠️ {gap}")
                    else:
                        st.success("No significant coverage gaps identified.")
            except Exception as e:
                st.error("Failed to generate analytics.")
                st.error(str(e))

    elif current_feat == "Smart Study Planner":
        st.header("📅 Smart Study Planner")
        days = st.number_input("Days available for study", 1, 60, 14, key="planner_days")
        if st.button("Generate Smart Schedule", type="primary"):
            with st.spinner("Optimizing schedule..."):
                syl_prompt = f"Syllabus Context: {st.session_state.syllabus_context[:5000]}\n\n" if st.session_state.get("syllabus_context") else ""
                prompt = f"Create a {days}-day smart study timetable. Output a detailed, prioritized schedule format using markdown tables. Emphasize coverage of any syllabus gaps and heavily-weighted past topics.\n{syl_prompt}"
                resp = generate_ai_response(prompt, st.session_state.full_context)
                render_listen_button(resp)
                st.markdown(resp)

    elif current_feat == "Summary":
        st.header("📝 Document Summary")
        if st.button("Generate Summary", type="primary"):
            with st.spinner("Generating summary..."):
                resp = generate_ai_response("Provide a comprehensive summary of the following notes.", st.session_state.full_context)
                render_listen_button(resp)
                st.markdown(resp)

    elif current_feat == "Important Points":
        st.header("🎯 Important Points")
        if st.button("Extract Important Points", type="primary"):
            with st.spinner("Extracting points..."):
                resp = generate_ai_response("Extract the most important points, key concepts, and critical formulas/facts from these notes. Format as a bulleted list.", st.session_state.full_context)
                render_listen_button(resp)
                st.markdown(resp)

    elif current_feat == "How to Study":
        st.header("🧠 Study Strategy")
        if st.button("Generate Strategy", type="primary"):
            with st.spinner("Strategizing..."):
                resp = generate_ai_response("Based on the provided notes, suggest the best learning strategy, techniques, and focus areas to master this material effectively.", st.session_state.full_context)
                render_listen_button(resp)
                st.markdown(resp)

    elif current_feat == "Practice Questions":
        st.header("💡 Targeted Practice Questions")
        if st.button("Generate Questions", type="primary"):
            with st.spinner("Generating targeted questions..."):
                resp = generate_ai_response("Based on the most frequently asked concepts in the following papers/notes, generate 5 highly probable practice questions. For each question, provide the difficulty level, the topic it relates to, and a detailed solution. Format nicely with markdown headers.", st.session_state.full_context)
                render_listen_button(resp)
                st.markdown(resp)

    elif current_feat == "Quiz":
        st.header("❓ Practice Quiz")
        if "quiz_data" not in st.session_state:
            num_q = st.slider("Number of questions", 3, 10, 5, key="quiz_q_count")
            if st.button("Create Quiz", type="primary"):
                with st.spinner("Generating quiz..."):
                    prompt = f"Generate {num_q} Multiple Choice Questions. Respond strictly in valid JSON format as a list of dictionaries. Each dictionary must have: 'question', 'options' (list of 4 strings), 'answer' (exact string of correct option), 'explanation'."
                    resp_text = generate_ai_response(prompt, st.session_state.full_context)
                    try:
                        if resp_text.startswith("```json"): resp_text = resp_text[7:]
                        if resp_text.endswith("```"): resp_text = resp_text[:-3]
                        st.session_state.quiz_data = json.loads(resp_text.strip())
                        st.session_state.quiz_submitted = False
                        st.rerun()
                    except Exception as e:
                        st.error("Failed to parse quiz data.")
        else:
            quiz_data = st.session_state.quiz_data
            if not st.session_state.get("quiz_submitted", False):
                with st.form("quiz_form"):
                    for i, q in enumerate(quiz_data):
                        st.markdown(f"**Q{i+1}: {q['question']}**")
                        st.radio("Select an option:", q["options"], key=f"quiz_q_{i}", index=None)
                        st.markdown("---")
                    
                    submitted = st.form_submit_button("Submit Quiz")
                    if submitted:
                        st.session_state.quiz_submitted = True
                        st.rerun()
            else:
                st.subheader("Quiz Results")
                score = 0
                for i, q in enumerate(quiz_data):
                    user_ans = st.session_state.get(f"quiz_q_{i}")
                    correct_ans = q["answer"]
                    
                    st.markdown(f"### **Q{i+1}: {q['question']}**")
                    for opt in q["options"]:
                        if opt == correct_ans:
                            st.success(f"✅ **{opt}** (Correct Answer)")
                        elif opt == user_ans and user_ans != correct_ans:
                            st.error(f"❌ **{opt}** (Your Answer)")
                        else:
                            st.markdown(f"- {opt}")
                    
                    if user_ans == correct_ans:
                        score += 1
                        
                    if "explanation" in q:
                        st.info(f"💡 **Explanation:** {q['explanation']}")
                    st.markdown("---")
                    
                st.markdown(f"### **Final Score: {score} / {len(quiz_data)}**")
                
                if st.button("Generate New Quiz", type="primary"):
                    del st.session_state.quiz_data
                    st.session_state.quiz_submitted = False
                    st.rerun()

    elif current_feat == "Smart Tutor":
        st.header("👨‍🏫 Smart Tutor")
        if "chat_history" not in st.session_state:
            st.session_state.chat_history = []
        for msg in st.session_state.chat_history:
            st.chat_message(msg["role"]).write(msg["content"])
        if prompt := st.chat_input("Ask a question about your notes..."):
            st.session_state.chat_history.append({"role": "user", "content": prompt})
            st.chat_message("user").write(prompt)
            with st.spinner("Thinking..."):
                resp = generate_ai_response(f"You are a Smart Tutor. Answer the user's question based on the provided context.\nUser Question: {prompt}", st.session_state.full_context)
                st.session_state.chat_history.append({"role": "assistant", "content": resp})
                st.chat_message("assistant").write(resp)
                render_listen_button(resp)

    elif current_feat == "Video Resources":
        st.header("🎥 Recommended Video Resources")
        st.info("Get personalized YouTube video recommendations based on the core concepts in your notes.")
        if st.button("Find YouTube Videos", type="primary"):
            with st.spinner("Analyzing notes and finding best video topics..."):
                prompt = """Identify the 5 most important, difficult, or core concepts from the provided context. 
                For each concept, provide a direct YouTube search link formatted as markdown.
                Format exactly like this for each concept:
                ### [Concept Name]
                **Why it's important:** [Brief explanation of the concept]
                
                🔗 [Watch YouTube Tutorials](https://www.youtube.com/results?search_query=[Format+Query+With+Plus+Signs])
                
                ---
                """
                resp = generate_ai_response(prompt, st.session_state.full_context)
                st.markdown(resp)