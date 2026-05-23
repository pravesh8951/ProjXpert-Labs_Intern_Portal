import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Course from "@/models/Course";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");

    await connectToDatabase();

    const query = domain ? { domain } : {};
    const courses = await Course.find(query);

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Fetch courses error:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const cyberRoadmap = {
      title: "Cybersecurity Internship",
      domain: "cybersecurity",
      description: "A 3-month structured cybersecurity internship covering foundations, intermediate ethical hacking, and advanced penetration testing with real-world projects.",
      plans: [
        {
          duration: 1,
          level: "Beginner Foundation",
          price: 999,
          certificateName: "Cybersecurity Foundations Internship Certificate",
        },
        {
          duration: 2,
          level: "Intermediate + Practical",
          price: 1799,
          certificateName: "Cybersecurity Analyst Internship Certificate",
        },
        {
          duration: 3,
          level: "Advanced + Real Projects",
          price: 2499,
          certificateName: "Advanced Cybersecurity Internship Certificate",
        },
      ],
      roadmap: [
        {
          week: 1,
          title: "Cybersecurity Foundations",
          topics: ["Introduction to Cybersecurity", "Types of Hackers", "CIA Triad", "Networking Basics", "IP Addressing", "DNS", "HTTP vs HTTPS", "Ports & Protocols", "Linux Basics", "Virtual Machines"],
          tools: ["Kali Linux", "VirtualBox", "Terminal Basics"],
          assignment: "Install Kali Linux & Configure VM",
          miniProject: "Build personal cybersecurity lab",
        },
        {
          week: 2,
          title: "Web Security Basics",
          topics: ["Web Application Basics", "Client vs Server", "Cookies & Sessions", "Authentication Basics", "OWASP Top 10 Overview", "Burp Suite Introduction", "SQL Injection Intro", "XSS Intro", "CSRF Intro"],
          tools: ["Burp Suite Community", "DVWA", "PortSwigger Labs"],
          assignment: "Solve beginner PortSwigger labs",
          miniProject: "Basic vulnerability testing report",
        },
        {
          week: 3,
          title: "Vulnerability Testing",
          topics: ["Reconnaissance", "Information Gathering", "Subdomain Enumeration", "Directory Bruteforce", "Parameter Discovery"],
          tools: ["Nmap", "Gobuster", "Whois", "Nslookup"],
          assignment: "Scan local test environment",
          miniProject: "Recon report generation",
        },
        {
          week: 4,
          title: "Final Practical + Assessment",
          topics: ["Secure Coding Basics", "Password Security", "MFA", "Intro to API Security", "Career Guidance"],
          tools: ["Password Strength Checkers", "MFA Tools"],
          assignment: "MCQ Test + Practical Lab",
          miniProject: "Secure Login Page or Vulnerability Scanner",
        },
        {
          week: 5,
          title: "Advanced Web Vulnerabilities",
          topics: ["Advanced SQL Injection", "Authentication Vulnerabilities", "JWT Attacks", "File Upload Vulnerabilities", "IDOR"],
          tools: ["Burp Suite Professional (Trial)", "Custom Scripts"],
          assignment: "Exploit vulnerable app safely",
          miniProject: "Advanced Exploitation Report",
        },
        {
          week: 6,
          title: "API Security",
          topics: ["REST APIs", "API Authentication", "Broken Access Control", "API Rate Limiting", "Token Security"],
          tools: ["Postman", "Burp Repeater"],
          assignment: "Secure API Testing Assignment",
          miniProject: "API Vulnerability Scanner",
        },
        {
          week: 7,
          title: "Automation & Security Tools",
          topics: ["SQLMap", "Nikto", "FFUF", "XSStrike", "Automated Recon"],
          tools: ["SQLMap", "Nikto", "FFUF"],
          assignment: "Automated vulnerability scanning task",
          miniProject: "Recon Automation Script",
        },
        {
          week: 8,
          title: "Real-World Assessment",
          topics: ["Report Writing", "Vulnerability Severity", "CVSS Basics", "Responsible Disclosure"],
          tools: ["CVSS Calculator", "Reporting Templates"],
          assignment: "Practical testing lab",
          miniProject: "Web Security Testing Toolkit",
        },
        {
          week: 9,
          title: "Advanced Attacks",
          topics: ["SSRF", "XXE", "Deserialization", "Prototype Pollution", "Web Cache Poisoning", "Race Conditions"],
          tools: ["Advanced PortSwigger Labs"],
          assignment: "Advanced Labs Completion",
          miniProject: "Complex Attack Simulation",
        },
        {
          week: 10,
          title: "Authentication & Access Control",
          topics: ["OAuth Security", "Session Management", "MFA Bypass", "Privilege Escalation", "CORS Misconfigurations"],
          tools: ["OAuth Debuggers", "Session Managers"],
          assignment: "Authentication testing scenarios",
          miniProject: "Auth Security Analyzer",
        },
        {
          week: 11,
          title: "Real-World Pentesting Workflow",
          topics: ["Methodology", "Recon Workflow", "Exploitation Chain", "Reporting", "Scope Handling"],
          tools: ["Pentesting Frameworks"],
          assignment: "Internal pentest simulation",
          miniProject: "Full Web App Audit",
        },
        {
          week: 12,
          title: "Capstone Project",
          topics: ["AI-Powered Vulnerability Scanner", "Secure Internship Portal", "Bug Bounty Automation Toolkit"],
          tools: ["All previous tools", "AI APIs"],
          assignment: "Documentation & Demo Video",
          miniProject: "Final Capstone Presentation",
        },
      ],
    };

    const aiRoadmap = {
      title: "AI Internship Program",
      domain: "ai",
      description: "A comprehensive 3-month beginner-to-advanced AI internship program covering Python, Machine Learning, Deep Learning, NLP, Generative AI, and real-world deployment.",
      plans: [
        {
          duration: 1,
          level: "Beginner Foundation",
          price: 999,
          certificateName: "AI Foundations Internship Certificate",
        },
        {
          duration: 2,
          level: "Intermediate + Practical",
          price: 1799,
          certificateName: "AI Developer Internship Certificate",
        },
        {
          duration: 3,
          level: "Advanced + Real Projects",
          price: 2499,
          certificateName: "Advanced AI Engineer Internship Certificate",
        },
      ],
      roadmap: [
        {
          week: 1,
          title: "Python & Programming Foundations",
          topics: ["Python Basics", "Variables & Data Types", "Control Flow", "Functions & Modules", "Lists, Tuples & Dictionaries", "File I/O", "Error Handling", "OOP Basics", "Virtual Environments", "pip & Package Management"],
          tools: ["Python 3", "VS Code", "Jupyter Notebook"],
          assignment: "Build a CLI Task Manager in Python",
          miniProject: "Personal Expense Tracker CLI App",
        },
        {
          week: 2,
          title: "Data Science Essentials",
          topics: ["NumPy Arrays & Operations", "Pandas DataFrames", "Data Cleaning & Preprocessing", "Exploratory Data Analysis (EDA)", "Data Visualization with Matplotlib", "Seaborn for Statistical Plots", "Handling Missing Data", "Feature Engineering Basics", "CSV & JSON Parsing"],
          tools: ["NumPy", "Pandas", "Matplotlib", "Seaborn"],
          assignment: "EDA on a real-world dataset (Kaggle)",
          miniProject: "COVID-19 / Stock Market Data Analysis Report",
        },
        {
          week: 3,
          title: "Mathematics for AI",
          topics: ["Linear Algebra Basics", "Matrices & Vectors", "Probability & Statistics", "Bayes Theorem", "Gradient & Derivatives", "Cost Functions", "Optimization Basics", "Statistical Distributions"],
          tools: ["NumPy", "SciPy", "Desmos"],
          assignment: "Implement matrix operations from scratch",
          miniProject: "Statistical Analysis Dashboard",
        },
        {
          week: 4,
          title: "Machine Learning Fundamentals",
          topics: ["What is Machine Learning?", "Supervised vs Unsupervised Learning", "Linear Regression", "Logistic Regression", "Decision Trees", "K-Nearest Neighbors", "Model Evaluation Metrics", "Train/Test Split", "Cross Validation", "Overfitting & Underfitting"],
          tools: ["Scikit-learn", "Jupyter Notebook", "Google Colab"],
          assignment: "Build a House Price Predictor",
          miniProject: "Spam Email Classifier",
        },
        {
          week: 5,
          title: "Advanced Machine Learning",
          topics: ["Random Forests", "Support Vector Machines", "Gradient Boosting (XGBoost)", "Clustering (K-Means, DBSCAN)", "Dimensionality Reduction (PCA)", "Hyperparameter Tuning", "Pipeline & Feature Selection", "Ensemble Methods"],
          tools: ["Scikit-learn", "XGBoost", "Optuna"],
          assignment: "Build customer segmentation model",
          miniProject: "Movie Recommendation System",
        },
        {
          week: 6,
          title: "Deep Learning & Neural Networks",
          topics: ["Perceptrons & Activation Functions", "Feedforward Neural Networks", "Backpropagation", "Loss Functions", "Optimizers (SGD, Adam)", "Batch Normalization", "Dropout & Regularization", "TensorFlow/Keras Basics", "Model Training & Evaluation"],
          tools: ["TensorFlow", "Keras", "Google Colab GPU"],
          assignment: "Build a digit recognizer (MNIST)",
          miniProject: "Handwritten Character Recognition App",
        },
        {
          week: 7,
          title: "Computer Vision with CNNs",
          topics: ["Convolutional Neural Networks", "Convolution & Pooling Layers", "Image Classification", "Transfer Learning (ResNet, VGG)", "Data Augmentation", "Object Detection Intro", "Image Preprocessing", "YOLO Overview"],
          tools: ["TensorFlow", "OpenCV", "Keras"],
          assignment: "Fine-tune a pre-trained model on custom data",
          miniProject: "Real-Time Object Detection App",
        },
        {
          week: 8,
          title: "Natural Language Processing",
          topics: ["Text Preprocessing", "Tokenization & Stemming", "Bag of Words & TF-IDF", "Word Embeddings (Word2Vec, GloVe)", "Sentiment Analysis", "Text Classification", "Named Entity Recognition", "Sequence Models (RNN, LSTM)"],
          tools: ["NLTK", "spaCy", "Hugging Face Tokenizers"],
          assignment: "Build a sentiment analysis pipeline",
          miniProject: "News Article Classifier",
        },
        {
          week: 9,
          title: "Transformers & LLMs",
          topics: ["Attention Mechanism", "Transformer Architecture", "BERT & GPT Overview", "Fine-tuning Pre-trained Models", "Hugging Face Transformers Library", "Text Generation", "Question Answering", "Prompt Engineering Basics"],
          tools: ["Hugging Face", "PyTorch", "Transformers Library"],
          assignment: "Fine-tune BERT for text classification",
          miniProject: "AI-Powered Chatbot with Transformers",
        },
        {
          week: 10,
          title: "Generative AI & Prompt Engineering",
          topics: ["Generative AI Overview", "GPT Models & API Usage", "Prompt Engineering Techniques", "Chain-of-Thought Prompting", "RAG (Retrieval Augmented Generation)", "LangChain Basics", "Vector Databases (Pinecone, Chroma)", "Building AI Agents"],
          tools: ["OpenAI API", "LangChain", "Pinecone", "ChromaDB"],
          assignment: "Build a RAG-based Q&A system",
          miniProject: "AI Document Assistant with LangChain",
        },
        {
          week: 11,
          title: "MLOps & AI Deployment",
          topics: ["Model Serialization (Pickle, ONNX)", "REST APIs with FastAPI", "Docker Basics for ML", "Model Monitoring", "CI/CD for ML Pipelines", "Cloud Deployment (AWS/GCP)", "Streamlit & Gradio UIs", "MLflow Experiment Tracking"],
          tools: ["FastAPI", "Docker", "Streamlit", "MLflow"],
          assignment: "Deploy an ML model as a REST API",
          miniProject: "End-to-End ML Pipeline with CI/CD",
        },
        {
          week: 12,
          title: "Capstone Project",
          topics: ["AI-Powered Resume Screener", "Intelligent Study Planner", "Real-Time Fraud Detection System", "AI Healthcare Assistant", "Full-Stack AI Application"],
          tools: ["All previous tools", "Cloud APIs", "Git & GitHub"],
          assignment: "Documentation, Demo Video & Presentation",
          miniProject: "Final Capstone Presentation",
        },
      ],
    };

    // Seed both courses
    const [cyberCourse, aiCourse] = await Promise.all([
      Course.findOneAndUpdate(
        { domain: "cybersecurity" },
        cyberRoadmap,
        { upsert: true, new: true }
      ),
      Course.findOneAndUpdate(
        { domain: "ai" },
        aiRoadmap,
        { upsert: true, new: true }
      ),
    ]);

    return NextResponse.json({ success: true, courses: { cybersecurity: cyberCourse, ai: aiCourse } });
  } catch (error) {
    console.error("Seed course error:", error);
    return NextResponse.json({ error: "Failed to seed course" }, { status: 500 });
  }
}
