import re

with open('css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Add webkit overflow scrolling to progress-table-container and ensure table doesn't crush text
old_table_container = """.progress-table-container {
    overflow-x: auto;
    margin-bottom: 25px;
}
.progress-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
}"""

new_table_container = """.progress-table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin-bottom: 25px;
}
.progress-table {
    width: 100%;
    min-width: 500px; /* Force scroll on mobile rather than crushing */
    border-collapse: collapse;
    font-size: 0.9rem;
}"""
if old_table_container in css:
    css = css.replace(old_table_container, new_table_container)


# 2. Add word-wrap to prevent horizontal overflow in text elements
word_wrap = """
.question-text, .option, .explanation-card, p, h1, h2, h3, h4, .review-item, .mistake-item {
    word-break: break-word;
    overflow-wrap: break-word;
}
"""
css += word_wrap

# 3. Add styles for Topic Practice score-circle (since they were missing)
score_styles = """
.score-circle {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-card);
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    margin: 20px 0;
}

.score-number {
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--primary-color);
    margin-bottom: 10px;
}

.score-label {
    font-size: 1.2rem;
    color: var(--text-muted);
}
"""
css += score_styles

# 4. Comprehensive mobile breakpoints
mobile_media_queries = """
@media (max-width: 600px) {
    header {
        padding: 15px 0;
        margin-bottom: 20px;
    }
    
    header h1 {
        font-size: 1.5rem;
    }
    
    .question-container {
        padding: 15px;
    }
    
    .card, .review-item, .mistake-item {
        padding: 15px;
    }
    
    .question-text {
        font-size: 1.1rem;
        margin-bottom: 20px;
    }
    
    .option {
        padding: 12px 15px;
        font-size: 0.95rem;
    }
    
    button {
        padding: 12px 20px; /* Better touch target */
        width: 100%;
        margin-bottom: 10px;
    }
    
    .quiz-controls {
        flex-direction: column;
        gap: 10px;
    }
    
    .quiz-controls button {
        width: 100%;
        margin-bottom: 0;
    }
    
    .actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .actions button, .actions a.primary-btn, .actions a.secondary-btn {
        width: 100%;
        margin-bottom: 0;
        display: block;
        box-sizing: border-box;
    }
    
    .progress-summary {
        grid-template-columns: 1fr;
    }
    
    .topic-stats {
        grid-template-columns: 1fr 1fr;
    }
}
"""
css += mobile_media_queries

# 5. Fix min-width for very small screens like 320px so they don't break
# We add it to the body
body_fix = """
body {
    min-width: 320px;
    overflow-x: hidden;
}
"""
css = css.replace("body {", body_fix + "body {\n")

with open('css/styles.css', 'w', encoding='utf-8') as f:
    f.write(css)
