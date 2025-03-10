from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
import re
import string
import os
import pandas as pd
import numpy as np
from transformers import (
    T5Tokenizer, 
    T5ForConditionalGeneration, 
    DistilBertTokenizer, 
    DistilBertModel
)
from sklearn.metrics.pairwise import cosine_similarity

# Initialize FastAPI app
app = FastAPI(title="JD-CV Matching API", version="1.0")

# -------------------------------------------------
# Helper Functions (as implemented in your notebook)
# -------------------------------------------------

def text_cleaning(text: str) -> str:
    """Clean and normalize text for embedding."""
    if text is None:
        return ""
    text = text.lower().strip()
    try:
        import contractions
        text = contractions.fix(text)
    except ImportError:
        pass
    text = re.sub(r'http\S+|www\S+|https\S+', '', text)
    text = re.sub(r'\S+@\S+', '', text)
    text = re.sub(r'\b\d{1,3}[-./]?\d{1,3}[-./]?\d{1,4}\b', '', text)
    translator = str.maketrans('', '', string.punctuation)
    text = text.translate(translator)
    text = re.sub(r'[^a-zA-Z]', ' ', text)
    return text.strip()

# -----------------------------------------------
# Skills Extraction Model (e.g., fine-tuned T5-small)
# -----------------------------------------------
# Replace the path below with the correct folder for your fine-tuned model
SKILL_MODEL_DIR = "./fine_tuned_t5_small"  # Update if necessary
tokenizer_extraction = T5Tokenizer.from_pretrained(SKILL_MODEL_DIR)
model_extraction = T5ForConditionalGeneration.from_pretrained(SKILL_MODEL_DIR)
model_extraction.eval()

def generate_skills(job_description: str, tokenizer, model) -> str:
    """
    Extract skills from a job description using the fine-tuned T5 model.
    """
    input_text = "extract skills: " + job_description
    input_ids = tokenizer.encode(input_text, return_tensors="pt", truncation=True)
    input_ids = input_ids.to(model.device)
    outputs = model.generate(input_ids, max_length=128, num_beams=4, early_stopping=True)
    generated_skills = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return generated_skills

# -----------------------------------------------
# Embedding Model for Candidate CVs (DistilBERT)
# -----------------------------------------------
embedding_model_name = "distilbert-base-uncased"
tokenizer_embedding = DistilBertTokenizer.from_pretrained(embedding_model_name)
model_embedding = DistilBertModel.from_pretrained(embedding_model_name)
model_embedding.eval()

def get_embedding(text: str):
    """Generate an embedding for a given text using DistilBERT (mean pooling)."""
    tokens = tokenizer_embedding(text, padding=True, truncation=True, return_tensors="pt")
    tokens = tokens.to(model_embedding.device)
    with torch.no_grad():
        outputs = model_embedding(**tokens)
    embedding = outputs.last_hidden_state.mean(dim=1).numpy()[0]
    return embedding

# -----------------------------------------------
# Candidate Matching Function
# -----------------------------------------------
def match_candidate(job_desc: str, candidate_cv: str):
    """
    Given a job description and a candidate's CV, compute the cosine similarity
    between their embeddings.
    """
    # Clean and optionally augment the job description using skills extraction
    clean_job_desc = text_cleaning(job_desc)
    extracted_skills = generate_skills(clean_job_desc, tokenizer_extraction, model_extraction)
    # Combine original JD with extracted skills
    combined_jd = clean_job_desc + " " + extracted_skills

    # Generate embeddings for the combined job description and the candidate CV
    jd_embedding = get_embedding(combined_jd)
    cv_embedding = get_embedding(text_cleaning(candidate_cv))
    
    similarity = cosine_similarity([jd_embedding], [cv_embedding])[0][0]
    return similarity

# -------------------------------------------------
# Pydantic Models for API Endpoints
# -------------------------------------------------
class JobDescriptionInput(BaseModel):
    job_description: str

class CandidateMatchInput(BaseModel):
    job_description: str
    candidate_cv: str

# -------------------------------------------------
# API Endpoints
# -------------------------------------------------

@app.post("/extract_skills")
def extract_skills_endpoint(input_data: JobDescriptionInput):
    """Endpoint to extract skills from a job description."""
    clean_jd = text_cleaning(input_data.job_description)
    skills = generate_skills(clean_jd, tokenizer_extraction, model_extraction)
    return {"extracted_skills": skills}

@app.post("/match_candidate")
def match_candidate_endpoint(data: CandidateMatchInput):
    """Endpoint to compute matching score between a job description and a candidate CV."""
    similarity = match_candidate(data.job_description, data.candidate_cv)
    return {"similarity_score": float(similarity)}

# Optionally, you can add an endpoint for batch processing or more advanced functionalities

# -------------------------------------------------
# To run the server, use: uvicorn this_script_name:app --host 0.0.0.0 --port 8000
# -------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
