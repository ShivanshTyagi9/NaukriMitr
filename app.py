import streamlit as st
import requests
import pdfplumber
import tempfile

# Base URL of your API server
BASE_URL = "http://localhost:8000"

def extract_text_from_pdf(file):
    """Extract text from a PDF file using pdfplumber."""
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()

st.title("JD-CV Matching Interface")

st.write("Upload a candidate's resume (PDF) and enter a job description to get a matching score.")

# File uploader for candidate resume
uploaded_file = st.file_uploader("Upload Candidate Resume (PDF)", type=["pdf"])

# Text area for job description input
job_description = st.text_area("Enter Job Description:")

if st.button("Match Candidate"):
    if uploaded_file is not None and job_description:
        # Save the uploaded file to a temporary file
        with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
            tmp_file.write(uploaded_file.read())
            tmp_file_path = tmp_file.name
        
        # Extract text from the PDF resume
        candidate_cv = extract_text_from_pdf(tmp_file_path)
        
        # Prepare payload for candidate matching endpoint
        payload = {
            "job_description": job_description,
            "candidate_cv": candidate_cv
        }
        
        # Call the /match_candidate endpoint
        try:
            response = requests.post(f"{BASE_URL}/match_candidate", json=payload)
            response.raise_for_status()
            result = response.json()
            similarity_score = result.get("similarity_score")
            st.success(f"Similarity Score: {similarity_score:.4f}")
        except Exception as e:
            st.error(f"Error during candidate matching: {e}")
    else:
        st.warning("Please upload a resume file and enter a job description.")
        
# Optional: An endpoint to test skills extraction from a JD
if st.button("Extract Skills from JD"):
    if job_description:
        payload = {"job_description": job_description}
        try:
            response = requests.post(f"{BASE_URL}/extract_skills", json=payload)
            response.raise_for_status()
            result = response.json()
            extracted_skills = result.get("extracted_skills")
            st.success(f"Extracted Skills: {extracted_skills}")
        except Exception as e:
            st.error(f"Error during skills extraction: {e}")
    else:
        st.warning("Please enter a job description to extract skills.")

st.markdown("---")
st.markdown("**Note:** Ensure your API server is running at the specified `BASE_URL`.")
