import streamlit as st
import os
import json
import pandas as pd
import concurrent.futures
import streamlit.components.v1 as components
from dotenv import load_dotenv
from google import genai
from utils.ingestion import process_pdf, process_image

load_dotenv()
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

st.set_page_config(page_title="StudySpark", page_icon="✨", layout="wide")

st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif !important;
    }

    /* Gradient Headers for a premium AI feel */
    h1, h2 {
        background: linear-gradient(90deg, #38BDF8, #818CF8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        width: max-content;
        max-width: 100%;
    }

    /* Spotlight card styling applied to secondary buttons */
    button[kind="secondary"], 
    [data-testid="stBaseButton-secondary"], 
    [data-testid="baseButton-secondary"] {
        position: relative !important;
        border-radius: 1.2rem !important;
        border: 1px solid #334155 !important;
        background-color: #1E293B !important;
        padding: 2rem !important;
        height: 120px !important;
        overflow: hidden !important;
        --mouse-x: 50%;
        --mouse-y: 50%;
        --spotlight-color: rgba(99, 102, 241, 0.15);
        color: #F8FAFC !important;
        font-size: 1.1rem !important;
        font-weight: 600 !important;
        transition: transform 0.2s, border-color 0.2s !important;
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
        border-color: #6366F1 !important;
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
        background-color: #6366F1 !important;
        color: white !important;
        border: none !important;
        transition: all 0.2s ease-in-out !important;
    }
    button[kind="primary"]:hover,
    [data-testid="stBaseButton-primary"]:hover,
    [data-testid="baseButton-primary"]:hover {
        transform: translateY(-2px) !important;
        background-color: #4F46E5 !important;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3) !important;
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
    }

    // Run once immediately
    updateSpotlight();

    // Set up an observer to attach listeners to new buttons if they appear
    const observer = new MutationObserver(mutations => {
        updateSpotlight();
    });
    observer.observe(parentDoc.body, { childList: true, subtree: true });
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

st.title("✨ StudySpark")
st.markdown("---")

if "full_context" not in st.session_state:
    st.header("Upload Documents")
    st.info("Please upload your PDF/Image documents to get started.")
    
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
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

    st.header("Choose a Feature")
    
    col1, col2, col3 = st.columns(3)
    with col1:
        if st.button("📊 Analytics Dashboard", use_container_width=True, type="secondary"):
            st.session_state.current_feature = "Analytics Dashboard"
    with col2:
        if st.button("📅 Smart Planner", use_container_width=True, type="secondary"):
            st.session_state.current_feature = "Smart Study Planner"
    with col3:
        if st.button("📝 Summary", use_container_width=True, type="secondary"):
            st.session_state.current_feature = "Summary"

    col4, col5, col6 = st.columns(3)
    with col4:
        if st.button("🎯 Important Points", use_container_width=True, type="secondary"):
            st.session_state.current_feature = "Important Points"
    with col5:
        if st.button("🧠 How to Study", use_container_width=True, type="secondary"):
            st.session_state.current_feature = "How to Study"
    with col6:
        if st.button("💡 Practice Qs", use_container_width=True, type="secondary"):
            st.session_state.current_feature = "Practice Questions"
            
    col7, col8, col9 = st.columns(3)
    with col7:
        if st.button("❓ Quiz", use_container_width=True, type="secondary"):
            st.session_state.current_feature = "Quiz"
    with col8:
        if st.button("👨‍🏫 Smart Tutor", use_container_width=True, type="secondary"):
            st.session_state.current_feature = "Smart Tutor"
            
    st.markdown("---")
    
    current_feat = st.session_state.get("current_feature")

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
                st.markdown(resp)

    elif current_feat == "Summary":
        st.header("📝 Document Summary")
        if st.button("Generate Summary", type="primary"):
            with st.spinner("Generating summary..."):
                resp = generate_ai_response("Provide a comprehensive summary of the following notes.", st.session_state.full_context)
                st.markdown(resp)

    elif current_feat == "Important Points":
        st.header("🎯 Important Points")
        if st.button("Extract Important Points", type="primary"):
            with st.spinner("Extracting points..."):
                resp = generate_ai_response("Extract the most important points, key concepts, and critical formulas/facts from these notes. Format as a bulleted list.", st.session_state.full_context)
                st.markdown(resp)

    elif current_feat == "How to Study":
        st.header("🧠 Study Strategy")
        if st.button("Generate Strategy", type="primary"):
            with st.spinner("Strategizing..."):
                resp = generate_ai_response("Based on the provided notes, suggest the best learning strategy, techniques, and focus areas to master this material effectively.", st.session_state.full_context)
                st.markdown(resp)

    elif current_feat == "Practice Questions":
        st.header("💡 Targeted Practice Questions")
        if st.button("Generate Questions", type="primary"):
            with st.spinner("Generating targeted questions..."):
                resp = generate_ai_response("Based on the most frequently asked concepts in the following papers/notes, generate 5 highly probable practice questions. For each question, provide the difficulty level, the topic it relates to, and a detailed solution. Format nicely with markdown headers.", st.session_state.full_context)
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
            with st.form("quiz_form"):
                for i, q in enumerate(quiz_data):
                    st.markdown(f"**Q{i+1}: {q['question']}**")
                    st.radio("Select an option:", q["options"], key=f"quiz_q_{i}", index=None)
                    st.markdown("---")
                
                submitted = st.form_submit_button("Submit Quiz")
                if submitted:
                    st.session_state.quiz_submitted = True
            
            if st.session_state.get("quiz_submitted", False):
                st.subheader("Quiz Results")
                score = 0
                for i, q in enumerate(quiz_data):
                    user_ans = st.session_state.get(f"quiz_q_{i}")
                    correct_ans = q["answer"]
                    if user_ans == correct_ans:
                        score += 1
                        st.success(f"Q{i+1}: Correct! ({correct_ans})")
                    else:
                        st.error(f"Q{i+1}: Incorrect. You answered '{user_ans}'. The correct answer is '{correct_ans}'.")
                    if "explanation" in q:
                        st.info(f"Explanation: {q['explanation']}")
                st.write(f"**Your Score: {score} / {len(quiz_data)}**")
                
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