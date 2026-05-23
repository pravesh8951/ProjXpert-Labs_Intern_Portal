const fs = require('fs');
const data = [
  {
    "question": "What does CPU stand for?",
    "options": [
      "Central Processing Unit",
      "Computer Personal Unit",
      "Central Program Utility",
      "Control Processing User"
    ],
    "correctAnswer": "Central Processing Unit",
    "category": "Computer Basics",
    "difficulty": "Easy"
  },
  {
    "question": "Which company developed Windows OS?",
    "options": [
      "Apple",
      "Microsoft",
      "Google",
      "IBM"
    ],
    "correctAnswer": "Microsoft",
    "category": "Technology",
    "difficulty": "Easy"
  },
  {
    "question": "Which language is mainly used for AI development?",
    "options": [
      "Python",
      "HTML",
      "CSS",
      "PHP"
    ],
    "correctAnswer": "Python",
    "category": "Programming",
    "difficulty": "Easy"
  },
  {
    "question": "What does RAM stand for?",
    "options": [
      "Random Access Memory",
      "Read Access Memory",
      "Rapid Access Module",
      "Random Allocation Memory"
    ],
    "correctAnswer": "Random Access Memory",
    "category": "Computer Basics",
    "difficulty": "Easy"
  },
  {
    "question": "Which symbol is used for comments in Python?",
    "options": [
      "//",
      "#",
      "<!-- -->",
      "/* */"
    ],
    "correctAnswer": "#",
    "category": "Programming",
    "difficulty": "Easy"
  },
  {
    "question": "Which of these is an operating system?",
    "options": [
      "Linux",
      "Python",
      "Chrome",
      "Wi-Fi"
    ],
    "correctAnswer": "Linux",
    "category": "Technology",
    "difficulty": "Easy"
  },
  {
    "question": "What is phishing?",
    "options": [
      "A hacking technique",
      "A gaming platform",
      "A browser",
      "A programming language"
    ],
    "correctAnswer": "A hacking technique",
    "category": "Cybersecurity",
    "difficulty": "Easy"
  },
  {
    "question": "Which protocol is used for secure websites?",
    "options": [
      "HTTP",
      "HTTPS",
      "FTP",
      "SMTP"
    ],
    "correctAnswer": "HTTPS",
    "category": "Networking",
    "difficulty": "Easy"
  },
  {
    "question": "What is the brain of the computer?",
    "options": [
      "RAM",
      "Hard Disk",
      "CPU",
      "Motherboard"
    ],
    "correctAnswer": "CPU",
    "category": "Computer Basics",
    "difficulty": "Easy"
  },
  {
    "question": "Which device is used to input text?",
    "options": [
      "Monitor",
      "Keyboard",
      "Speaker",
      "Printer"
    ],
    "correctAnswer": "Keyboard",
    "category": "Hardware",
    "difficulty": "Easy"
  },
  {
    "question": "Which one is a web browser?",
    "options": [
      "Chrome",
      "Windows",
      "Linux",
      "Python"
    ],
    "correctAnswer": "Chrome",
    "category": "Internet",
    "difficulty": "Easy"
  },
  {
    "question": "What does URL stand for?",
    "options": [
      "Uniform Resource Locator",
      "Universal Resource Link",
      "Uniform Reference Line",
      "User Resource Locator"
    ],
    "correctAnswer": "Uniform Resource Locator",
    "category": "Internet",
    "difficulty": "Easy"
  },
  {
    "question": "Which of these is a database?",
    "options": [
      "MongoDB",
      "HTML",
      "CSS",
      "React"
    ],
    "correctAnswer": "MongoDB",
    "category": "Database",
    "difficulty": "Easy"
  },
  {
    "question": "Which keyword is used to define a function in Python?",
    "options": [
      "function",
      "func",
      "define",
      "def"
    ],
    "correctAnswer": "def",
    "category": "Programming",
    "difficulty": "Easy"
  },
  {
    "question": "Which company created ChatGPT?",
    "options": [
      "Google",
      "Microsoft",
      "OpenAI",
      "Meta"
    ],
    "correctAnswer": "OpenAI",
    "category": "AI",
    "difficulty": "Easy"
  },
  {
    "question": "Which data structure stores key-value pairs in Python?",
    "options": [
      "List",
      "Tuple",
      "Dictionary",
      "Set"
    ],
    "correctAnswer": "Dictionary",
    "category": "Programming",
    "difficulty": "Easy"
  },
  {
    "question": "Which HTML tag is used for hyperlinks?",
    "options": [
      "<link>",
      "<a>",
      "<href>",
      "<url>"
    ],
    "correctAnswer": "<a>",
    "category": "Web Development",
    "difficulty": "Easy"
  },
  {
    "question": "What is malware?",
    "options": [
      "Safe software",
      "Harmful software",
      "Gaming software",
      "Design software"
    ],
    "correctAnswer": "Harmful software",
    "category": "Cybersecurity",
    "difficulty": "Easy"
  },
  {
    "question": "Which one is a cloud platform?",
    "options": [
      "AWS",
      "Excel",
      "PowerPoint",
      "Photoshop"
    ],
    "correctAnswer": "AWS",
    "category": "Cloud Computing",
    "difficulty": "Easy"
  },
  {
    "question": "What does AI stand for?",
    "options": [
      "Artificial Intelligence",
      "Automated Interface",
      "Artificial Internet",
      "Advanced Integration"
    ],
    "correctAnswer": "Artificial Intelligence",
    "category": "AI",
    "difficulty": "Easy"
  },
  {
    "question": "Which command is used to install packages in Python?",
    "options": [
      "install",
      "pip install",
      "python add",
      "pkg install"
    ],
    "correctAnswer": "pip install",
    "category": "Programming",
    "difficulty": "Easy"
  },
  {
    "question": "Which company owns Android?",
    "options": [
      "Apple",
      "Google",
      "Samsung",
      "Nokia"
    ],
    "correctAnswer": "Google",
    "category": "Technology",
    "difficulty": "Easy"
  },
  {
    "question": "What is GitHub mainly used for?",
    "options": [
      "Video editing",
      "Code hosting",
      "Gaming",
      "Music streaming"
    ],
    "correctAnswer": "Code hosting",
    "category": "Development Tools",
    "difficulty": "Easy"
  },
  {
    "question": "Which language is used for web page styling?",
    "options": [
      "Python",
      "Java",
      "CSS",
      "C++"
    ],
    "correctAnswer": "CSS",
    "category": "Web Development",
    "difficulty": "Easy"
  },
  {
    "question": "Which one is NOT a programming language?",
    "options": [
      "Java",
      "Python",
      "HTML",
      "Monitor"
    ],
    "correctAnswer": "Monitor",
    "category": "Programming",
    "difficulty": "Easy"
  },
  {
    "question": "What is the purpose of a firewall?",
    "options": [
      "Increase internet speed",
      "Protect network security",
      "Store files",
      "Play games"
    ],
    "correctAnswer": "Protect network security",
    "category": "Cybersecurity",
    "difficulty": "Easy"
  },
  {
    "question": "Which company developed the iPhone?",
    "options": [
      "Samsung",
      "Apple",
      "Google",
      "Microsoft"
    ],
    "correctAnswer": "Apple",
    "category": "Technology",
    "difficulty": "Easy"
  },
  {
    "question": "What does WWW stand for?",
    "options": [
      "World Wide Web",
      "World Web Window",
      "Wide World Web",
      "Web World Wide"
    ],
    "correctAnswer": "World Wide Web",
    "category": "Internet",
    "difficulty": "Easy"
  },
  {
    "question": "Which one is used to style web pages?",
    "options": [
      "HTML",
      "Python",
      "CSS",
      "MongoDB"
    ],
    "correctAnswer": "CSS",
    "category": "Web Development",
    "difficulty": "Easy"
  },
  {
    "question": "Which Python library is used for data analysis?",
    "options": [
      "NumPy",
      "Pandas",
      "TensorFlow",
      "Flask"
    ],
    "correctAnswer": "Pandas",
    "category": "AI",
    "difficulty": "Easy"
  },
  {
    "question": "Which symbol is used for ID selector in CSS?",
    "options": [
      ".",
      "#",
      "*",
      "@"
    ],
    "correctAnswer": "#",
    "category": "Web Development",
    "difficulty": "Easy"
  },
  {
    "question": "Which technology is used to create dynamic web pages?",
    "options": [
      "JavaScript",
      "HTML",
      "CSS",
      "Excel"
    ],
    "correctAnswer": "JavaScript",
    "category": "Web Development",
    "difficulty": "Easy"
  },
  {
    "question": "What is an IP address used for?",
    "options": [
      "Identifying devices on a network",
      "Playing games",
      "Creating videos",
      "Designing graphics"
    ],
    "correctAnswer": "Identifying devices on a network",
    "category": "Networking",
    "difficulty": "Easy"
  },
  {
    "question": "Which one is an example of social engineering?",
    "options": [
      "Phishing",
      "Coding",
      "Database creation",
      "Cloud storage"
    ],
    "correctAnswer": "Phishing",
    "category": "Cybersecurity",
    "difficulty": "Easy"
  },
  {
    "question": "What does VPN stand for?",
    "options": [
      "Virtual Private Network",
      "Verified Public Network",
      "Virtual Program Node",
      "Variable Private Node"
    ],
    "correctAnswer": "Virtual Private Network",
    "category": "Networking",
    "difficulty": "Easy"
  },
  {
    "question": "Which Python library is popular for machine learning?",
    "options": [
      "Scikit-learn",
      "Bootstrap",
      "Express",
      "Laravel"
    ],
    "correctAnswer": "Scikit-learn",
    "category": "AI",
    "difficulty": "Easy"
  },
  {
    "question": "Which company owns YouTube?",
    "options": [
      "Meta",
      "Google",
      "Amazon",
      "Netflix"
    ],
    "correctAnswer": "Google",
    "category": "Technology",
    "difficulty": "Easy"
  },
  {
    "question": "What is debugging?",
    "options": [
      "Removing errors from code",
      "Writing documentation",
      "Designing UI",
      "Installing software"
    ],
    "correctAnswer": "Removing errors from code",
    "category": "Programming",
    "difficulty": "Easy"
  },
  {
    "question": "Which HTML tag is used for images?",
    "options": [
      "<img>",
      "<image>",
      "<pic>",
      "<src>"
    ],
    "correctAnswer": "<img>",
    "category": "Web Development",
    "difficulty": "Easy"
  },
  {
    "question": "What is machine learning?",
    "options": [
      "A method where computers learn from data",
      "A hardware device",
      "A gaming engine",
      "A networking protocol"
    ],
    "correctAnswer": "A method where computers learn from data",
    "category": "AI",
    "difficulty": "Easy"
  },
  {
    "question": "Which database is NoSQL?",
    "options": [
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Oracle"
    ],
    "correctAnswer": "MongoDB",
    "category": "Database",
    "difficulty": "Easy"
  }
];

const formatted = data.map(q => ({
  question: q.question,
  options: q.options,
  answer: q.options.indexOf(q.correctAnswer),
  category: q.category.toLowerCase().replace(/ /g, '_')
}));

const tsContent = `export const easyQuestions = ${JSON.stringify(formatted, null, 2)};\n`;
fs.writeFileSync('src/data/questions.ts', tsContent);
console.log('Saved to src/data/questions.ts');
