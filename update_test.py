import re

with open('test_progress.js', 'r', encoding='utf-8') as f:
    text = f.read()

new_tests = """
// 20. Topic Practice creates history record
mode = 'topicPractice';
drillTopics = ['Blood Relations'];
currentQuiz = allQuestions.filter(q => q.subtopic === 'Blood Relations').slice(0, 10);
userAnswers = {};
calculateTopicPracticeResults();
history = JSON.parse(localStorage.getItem('govcrackexam-drill-v1'));
assert(history.topicPractices && history.topicPractices.length === 1, "Topic Practice creates history record.");

// 21. Multiple topic practices are preserved
calculateTopicPracticeResults();
history = JSON.parse(localStorage.getItem('govcrackexam-drill-v1'));
assert(history.topicPractices.length === 2, "Multiple topic practices are preserved.");

// 22. History is ordered newest first
assert(history.topicPractices[0].timestamp >= history.topicPractices[1].timestamp, "Topic Practice History is ordered newest first.");

// 23. Maximum 50 topic practice records
for(let i=0; i<55; i++) {
    mode = 'topicPractice';
    calculateTopicPracticeResults();
}
history = JSON.parse(localStorage.getItem('govcrackexam-drill-v1'));
assert(history.topicPractices.length === 50, "Maximum 50 topic practice records.");
"""

# Insert before reset block
idx = text.find('// 18. Reset requires confirmation')
text = text[:idx] + new_tests + '\n' + text[idx:]

# Update the reset block tests
text = text.replace('assert(beforeReset.drills && beforeReset.drills.length > 0, "BEFORE RESET: drills contains history.");', 
                    'assert(beforeReset.drills && beforeReset.drills.length > 0, "BEFORE RESET: drills contains history.");\nassert(beforeReset.topicPractices && beforeReset.topicPractices.length > 0, "BEFORE RESET: topicPractices contains history.");')

text = text.replace('assert(afterReset.drills && afterReset.drills.length === 0, "AFTER RESET: drills is [].");',
                    'assert(afterReset.drills && afterReset.drills.length === 0, "AFTER RESET: drills is [].");\nassert(afterReset.topicPractices && afterReset.topicPractices.length === 0, "AFTER RESET: topicPractices is [].");')

with open('test_progress.js', 'w', encoding='utf-8') as f:
    f.write(text)
