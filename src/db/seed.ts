import { faker } from "@faker-js/faker";
import { sql } from "drizzle-orm";
import { db } from "./index";

const LANGUAGES = [
	"javascript",
	"typescript",
	"python",
	"java",
	"go",
	"rust",
	"ruby",
	"php",
	"sql",
	"html",
	"css",
	"json",
];

const VERDICTS = [
	"needs_urgent_help",
	"serious_problems",
	"needs_improvement",
	"acceptable",
];

const SEVERITIES = ["error", "warning", "info"];

const CODE_TEMPLATES: Record<string, string[]> = {
	javascript: [
		"function foo() { return 1 }",
		"var x = 1; var y = 2; var z = 3; var a = 4; var b = 5;",
		"const arr = [1,2,3]; arr.forEach(x => console.log(x));",
		"if (x == 1) { doSomething(); } else { doOther(); }",
		"for (var i = 0; i < 10; i++) { console.log(i); }",
	],
	typescript: [
		"const x: number = 1;",
		"interface User { name: string; age: number; }",
		"type Foo = string | number;",
		"function fn<T>(arg: T): T { return arg; }",
	],
	python: [
		"def foo(): return 1",
		"x = 1; y = 2; z = 3",
		"for i in range(10): print(i)",
		"if x == 1: pass",
		"class Foo: pass",
	],
	java: [
		"public class Main { public static void main(String[] args) {} }",
		"int x = 1;",
		"for (int i = 0; i < 10; i++) {}",
	],
	go: ["func main() {}", "var x int = 1", "if err != nil { return err }"],
	rust: ["fn main() {}", "let x = 1;", "impl Trait for Struct {}"],
};

const ISSUE_TITLES = [
	"Missing error handling",
	"Variable naming unclear",
	"Code duplication",
	"Missing type annotations",
	"Unused variable",
	"Magic numbers",
	"No comments",
	"Complex conditional",
	"Missing null check",
	"Inefficient loop",
];

const ISSUE_DESCRIPTIONS = [
	"This code does not handle potential errors that may occur.",
	"The variable name does not clearly indicate its purpose.",
	"Similar code blocks are repeated multiple times.",
	"Type annotations would improve code clarity.",
	"This variable is declared but never used.",
	"Hardcoded values should be extracted to constants.",
	"Adding comments would help future maintainers.",
	"This conditional logic is hard to follow.",
	"This could cause a null reference exception.",
	"This loop could be optimized using a different approach.",
];

const SUGGESTION_EXPLANATIONS = [
	"Consider adding proper error handling with try-catch blocks.",
	"Rename this variable to something more descriptive.",
	"Extract this repeated logic into a reusable function.",
	"Add type annotations to improve code readability.",
	"Remove this unused variable to clean up the code.",
	"Define this value as a constant with a meaningful name.",
	"Add comments explaining the purpose of this code block.",
	"Simplify this conditional into multiple smaller conditions.",
	"Add a null check before accessing this value.",
	"Consider using a more efficient iteration method.",
];

function getRandomElement<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function getScoreFromVerdict(verdict: string): number {
	switch (verdict) {
		case "needs_urgent_help":
			return faker.number.int({ min: 0, max: 3 });
		case "serious_problems":
			return faker.number.int({ min: 4, max: 6 });
		case "needs_improvement":
			return faker.number.int({ min: 7, max: 8 });
		case "acceptable":
			return faker.number.int({ min: 9, max: 10 });
		default:
			return faker.number.int({ min: 0, max: 10 });
	}
}

function generateCode(language: string): string {
	const templates = CODE_TEMPLATES[language] || CODE_TEMPLATES.javascript;
	const template = getRandomElement(templates);

	const lines = template.split("\n");
	const lineCount = faker.number.int({ min: 3, max: 15 });

	const repeatedLines: string[] = [];
	for (let i = 0; i < lineCount; i++) {
		repeatedLines.push(getRandomElement(lines));
	}

	return repeatedLines.join("\n");
}

function generateRoastQuote(verdict: string): string {
	const quotes: Record<string, string[]> = {
		needs_urgent_help: [
			"This code was written during a blackout",
			"I've seen better code in a fortune cookie",
			"This is why we can't have nice things",
			"Even my cat could write better code",
			"This belongs in a museum of bad decisions",
		],
		serious_problems: [
			"This needs some serious refactoring",
			"Not terrible, but ouch",
			"This code has issues, but nothing a weekend won't fix",
			"Technically it works, technically",
			"I've seen worse, but not recently",
		],
		needs_improvement: [
			"Almost there, just needs some polish",
			"Not bad, but could be better",
			"Decent code, just needs some tweaks",
			"Getting warmer, keep going",
			"This has potential",
		],
		acceptable: [
			"Not bad at all!",
			"Clean and functional",
			"This will do the job",
			"Solid work here",
			"You can ship this",
		],
	};

	return getRandomElement(quotes[verdict] || quotes.acceptable);
}

async function seed() {
	console.log("🌱 Starting seed...");

	await db.execute(
		sql`TRUNCATE TABLE suggestions, issues, submissions RESTART IDENTITY CASCADE`,
	);

	console.log("Cleared existing data");

	const submissionIds: string[] = [];

	for (let i = 0; i < 100; i++) {
		const language = getRandomElement(LANGUAGES);
		const verdict = getRandomElement(VERDICTS);
		const score = getScoreFromVerdict(verdict);
		const code = generateCode(language);
		const lineCount = code.split("\n").length;
		const roastQuote = generateRoastQuote(verdict);

		const id = faker.string.uuid();

		const result = await db.execute(sql`
      INSERT INTO submissions (id, code, language, score, verdict, roast_quote, line_count)
      VALUES (${id}, ${code}, ${language}, ${score}, ${verdict}, ${roastQuote}, ${lineCount})
      RETURNING id
    `);

		const submissionId = result.rows[0]?.id as string;
		submissionIds.push(submissionId);

		const issueCount = faker.number.int({ min: 1, max: 5 });
		for (let j = 0; j < issueCount; j++) {
			const severity = getRandomElement(SEVERITIES);
			const issueId = faker.string.uuid();
			await db.execute(sql`
        INSERT INTO issues (id, submission_id, title, description, severity, line_number)
        VALUES (${issueId}, ${submissionId}, ${getRandomElement(ISSUE_TITLES)}, ${getRandomElement(ISSUE_DESCRIPTIONS)}, ${severity}, ${faker.number.int({ min: 1, max: lineCount })})
      `);
		}

		const suggestionCount = faker.number.int({ min: 0, max: 3 });
		for (let j = 0; j < suggestionCount; j++) {
			const suggestionId = faker.string.uuid();
			await db.execute(sql`
        INSERT INTO suggestions (id, submission_id, original_code, suggested_code, explanation)
        VALUES (${suggestionId}, ${submissionId}, ${code.slice(0, 50)}, ${generateCode(language).slice(0, 50)}, ${getRandomElement(SUGGESTION_EXPLANATIONS)})
      `);
		}

		if ((i + 1) % 10 === 0) {
			console.log(`  Created ${i + 1} submissions...`);
		}
	}

	console.log("✅ Seed completed!");
	console.log(`  Created 100 submissions with issues and suggestions`);
}

seed()
	.catch((error) => {
		console.error("Seed failed:", error);
		process.exit(1);
	})
	.finally(() => {
		process.exit(0);
	});
