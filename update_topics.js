const fs = require('fs');

const topicsData = {
    "Coded Language": {
        slug: "coded-language",
        title: "SSC CGL Coded Language Practice",
        whatTests: "Coded Language questions test your ability to decipher hidden patterns or rules used to transform a word, letter, or number into another format.",
        approach: "Write down the alphabet with corresponding position numbers (1-26). Check for common transformations like fixed shifts (e.g., +2, -1), reversed alphabets, or vowel/consonant specific rules.",
        patterns: "Letter-to-letter coding (shifting), letter-to-number coding (position values), and substitution coding (replacing specific words).",
        mistakes: "Ignoring reverse positional values or assuming the same shift applies to all letters without verifying the entire word."
    },
    "Letter-cluster Analogy / Series": {
        slug: "letter-cluster-analogy-series",
        title: "SSC CGL Letter-cluster Analogy / Series Practice",
        whatTests: "This topic evaluates your pattern recognition skills using groups of alphabets that follow a specific progression or relational logic.",
        approach: "Identify the positional difference between corresponding letters in the clusters. If A goes to C (+2), check if the second letter follows a similar or progressing pattern (+3, +4).",
        patterns: "Constant addition/subtraction, alternating series, opposite letters (A-Z, B-Y), and vowel-based shifts.",
        mistakes: "Calculating the shift from the first to the second letter incorrectly, or failing to notice a two-step alternating series."
    },
    "Syllogism": {
        slug: "syllogism",
        title: "SSC CGL Syllogism Reasoning Practice",
        whatTests: "Syllogism tests your deductive reasoning by asking you to derive conclusions from a given set of statements, regardless of known facts.",
        approach: "Always use Venn Diagrams. Represent 'All' as a circle inside another, 'Some' as overlapping circles, and 'No' as disjoint circles. A conclusion is only true if it must be true in every possible valid diagram.",
        patterns: "Statements involving All, Some, No, and Some Not. Advanced patterns include Possibility cases.",
        mistakes: "Assuming 'Some A are B' implies 'Some A are not B' (it does not), or treating a possible conclusion as a definite conclusion."
    },
    "Blood Relations": {
        slug: "blood-relations",
        title: "SSC CGL Blood Relations Practice",
        whatTests: "Blood Relations questions assess your ability to comprehend and map out family trees and complex relationships based on conversational or coded clues.",
        approach: "Draw a family tree diagram. Use distinct symbols for males (e.g., squares) and females (e.g., circles). Use horizontal lines for siblings/spouses and vertical lines for different generations.",
        patterns: "Pointing/Dialogue based ('He is the son of...'), Puzzle based (family tree descriptions), and Coded relations ('A + B means A is father of B').",
        mistakes: "Assuming gender based purely on a name, or misinterpreting 'only son' vs 'only child'."
    },
    "Dictionary Order": {
        slug: "dictionary-order",
        title: "SSC CGL Dictionary Order Practice",
        whatTests: "This topic tests your vocabulary organization and speed in arranging words exactly as they would appear in an English dictionary.",
        approach: "Compare words letter by letter from left to right. Once you find the first differing letter, arrange the words based on the alphabetical order of that letter.",
        patterns: "Standard alphabetical arrangement, reverse dictionary order, or identifying which word comes in a specific position (e.g., third).",
        mistakes: "Rushing and skipping a letter, especially when the first 3-4 letters of multiple words are identical."
    },
    "Mathematical Operations": {
        slug: "mathematical-operations",
        title: "SSC CGL Mathematical Operations Practice",
        whatTests: "Tests your basic numeracy and ability to apply the BODMAS rule accurately when standard mathematical signs are swapped or coded.",
        approach: "Always decode the symbols first and rewrite the entire equation clearly. Then, strictly apply BODMAS (Brackets, Orders, Division, Multiplication, Addition, Subtraction).",
        patterns: "Sign substitution ('+' means '-'), interchanging two signs or numbers to balance an equation, and missing operators.",
        mistakes: "Calculating left-to-right instead of using BODMAS, or forgetting to write down the newly substituted signs correctly."
    },
    "Number/Figure Series": {
        slug: "number-figure-series",
        title: "SSC CGL Number/Figure Series Practice",
        whatTests: "Tests your numerical and spatial pattern recognition. You must identify the hidden rule governing a sequence of numbers or geometric figures.",
        approach: "For numbers: calculate the difference (and double difference) between adjacent terms. Check for squares, cubes, or prime numbers. For figures: track the rotation, movement, or addition/deletion of elements step-by-step.",
        patterns: "Arithmetic progressions, geometric progressions, alternating series, and rotational symmetry in figures.",
        mistakes: "Stopping at the first difference when a double-difference is required, or misjudging clockwise vs anti-clockwise rotation in figures."
    },
    "Classification (Odd One Out)": {
        slug: "classification-odd-one-out",
        title: "SSC CGL Classification (Odd One Out) Practice",
        whatTests: "Evaluates your ability to group items based on common characteristics and identify the single outlier that does not share that logic.",
        approach: "Find the common rule that binds three out of the four options together. The correct answer is the one that violates this specific rule.",
        patterns: "Number pairs (e.g., squares, multiples), word categories (e.g., capitals, synonyms), and letter groups (e.g., vowel presence, positional shifts).",
        mistakes: "Choosing an option because it looks unique in one specific way, without first establishing the concrete rule that unites the other three."
    },
    "Analogy (Word/Number)": {
        slug: "analogy-word-number",
        title: "SSC CGL Analogy (Word/Number) Practice",
        whatTests: "Analogy questions test your ability to understand the precise relationship between a pair of words or numbers and apply that same relationship to a new pair.",
        approach: "Define the relationship in the first pair using a simple sentence (e.g., 'A is a tool used by B'). Apply that exact sentence structure to the options to find the match.",
        patterns: "Synonyms/Antonyms, Worker-Tool, Cause-Effect, and Number relationships (e.g., n : n² + 1).",
        mistakes: "Reversing the order of the relationship (e.g., matching Tool-Worker when the original was Worker-Tool) or ignoring secondary mathematical rules."
    }
};

for (const [topic, data] of Object.entries(topicsData)) {
    const filename = data.slug + '.html';
    if (!fs.existsSync(filename)) continue;
    
    let html = fs.readFileSync(filename, 'utf8');
    
    const contentToInject = `
                <h1>${data.title}</h1>
                
                <h2>What this topic tests</h2>
                <p>${data.whatTests}</p>
                
                <h2>How to Approach This Topic</h2>
                <p>${data.approach}</p>
                
                <h2>Common Question Patterns</h2>
                <p>${data.patterns}</p>
                
                <h2>Common Mistakes</h2>
                <p>${data.mistakes}</p>
                
                <h2>Practice with GovCrackExam</h2>
                <p>The GovCrackExam platform contains verified SSC CGL questions for <strong>${topic}</strong>. You can take a full diagnostic quiz to identify your weak areas, and then practice specifically with targeted drills.</p>
                
                <div class="info-box" style="margin: 25px 0;">
                    <strong>Disclaimer:</strong>
                    <p style="margin-bottom: 0;">The questions in the current bank are based on a verified subset of the supplied SSC CGL corpus. Frequency weights used for prioritization are project-level corpus-derived prioritization weights, not universal SSC CGL statistics.</p>
                </div>
                
                <div class="actions" style="margin-top: 30px; display: flex; flex-direction: column; gap: 15px;">
                    <a href="index.html?practice=${encodeURIComponent(topic)}" class="primary-btn" style="text-decoration: none; text-align: center; display: block;">Practice ${topic}</a>
                    <a href="index.html" class="secondary-btn" style="text-decoration: none; text-align: center; display: block;">Start Weak-Topic Drill</a>
                    <a href="index.html" class="secondary-btn" style="text-decoration: none; text-align: center; display: block; background-color: var(--primary-color); color: white; border: 1px solid var(--primary-color);">Start Full Reasoning Practice</a>
                    <a href="index.html" class="secondary-btn" style="text-decoration: none; text-align: center; display: block; border: none; background-color: transparent; text-decoration: underline;">View Progress</a>
                </div>
`;

    html = html.replace(/<div class="topic-content">([\s\S]*?)<div class="related-topics">/, '<div class="topic-content">' + contentToInject + '<div class="related-topics">');
    fs.writeFileSync(filename, html);
}
