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
		`function calculateSum(arr) {
	let sum = 0;
	for (let i = 0; i < arr.length; i++) {
		sum += arr[i];
	}
	return sum;
}`,
		`function getUser(id) {
	const user = db.find(u => u.id === id);
	if (!user) return null;
	return user.name;
}`,
		`const config = {
	apiUrl: '/api/v1',
	timeout: 5000,
	retries: 3,
	debug: true
};`,
		`function processData(items) {
	return items
		.filter(item => item.active)
		.map(item => item.value);
}`,
		`const result = data.reduce((acc, curr) => {
	acc.sum += curr.amount;
	return acc;
}, { sum: 0 });`,
		`async function fetchData(url) {
	try {
		const response = await fetch(url);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Failed to fetch:', error);
		return null;
	}
}`,
		`class UserService {
	constructor(db) {
		this.db = db;
	}

	async findById(id) {
		return await this.db.users.find(id);
	}
}`,
	],
	typescript: [
		`type ApiResponse<T> = {
	data: T;
	status: number;
	message: string;
};`,
		`interface User {
	id: string;
	name: string;
	email: string;
	createdAt: Date;
}`,
		`async function fetchUser(id: string): Promise<User | null> {
	const res = await api.get(id);
	return res.data;
}`,
		`const users: User[] = data.map((item) => ({
	id: item._id,
	name: item.user_name,
	email: item.email,
	createdAt: new Date()
}));`,
		`function validateInput(value: unknown): value is string {
	return typeof value === 'string' && value.length > 0;
}`,
		`interface Config {
	apiUrl: string;
	timeout: number;
	retries: number;
	headers?: Record<string, string>;
}`,
		`function processItems<T>(items: T[]): T[] {
	return items.filter(item => item !== null);
}`,
	],
	python: [
		`def calculate_total(prices):
	total = 0
	for price in prices:
		total += price
	return total`,
		`class DataProcessor:
	def __init__(self, data):
		self.data = data
		self.result = None

	def process(self):
		self.result = [x for x in self.data if x > 0]
		return self.result`,
		`users = [
	{'id': i, 'name': f'User {i}', 'active': i % 2 == 0}
	for i in range(10)
]`,
		`def get_by_id(items, id):
	result = next((x for x in items if x['id'] == id), None)
	return result`,
		`import json

data = json.loads(response.text)
filtered = [x for x in data if x.get('status') == 'active']`,
		`def fetch_users():
	import requests
	response = requests.get('/api/users')
	return response.json()

users = fetch_users()`,
		`class Calculator:
	@staticmethod
	def add(a, b):
		return a + b

	@staticmethod
	def multiply(a, b):
		return a * b`,
	],
	java: [
		`public class UserService {
	private final UserRepository repo;

	public UserService(UserRepository r) {
		this.repo = r;
	}

	public Optional<User> findById(Long id) {
		return repo.findById(id);
	}
}`,
		`List<String> names = users.stream()
	.filter(u -> u.isActive())
	.map(User::getName)
	.collect(Collectors.toList());`,
		`public int calculateSum(List<Integer> numbers) {
	int sum = 0;
	for (int n : numbers) {
		sum += n;
	}
	return sum;
}`,
		`public class Product {
	private String id;
	private String name;
	private BigDecimal price;

	public Product(String id, String name, BigDecimal price) {
		this.id = id;
		this.name = name;
		this.price = price;
	}
}`,
		`@Override
public List<Order> findRecentOrders(Long userId) {
	return entityManager.createQuery(
		"SELECT o FROM Order o WHERE o.user.id = :userId",
		Order.class
	).setParameter("userId", userId).getResultList();
}`,
	],
	go: [
		`func processItems(items []Item) []Result {
	results := make([]Result, 0)
	for _, item := range items {
		if item.Active {
			results = append(results, Result{
				ID: item.ID,
				Value: item.Value
			})
		}
	}
	return results
}`,
		`type Config struct {
	URL      string
	Timeout  int
	Retries  int
}

var cfg = Config{
	URL:     os.Getenv("API_URL"),
	Timeout: 5000,
	Retries: 3
}`,
		`func main() {
	data, err := json.Marshal(config)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(string(data))
}`,
		`func (s *Service) FetchUser(id string) (*User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	return s.client.Get(ctx, "/users/"+id)
}`,
		`func validateEmail(email string) bool {
	pattern := "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
	matched, _ := regexp.MatchString(pattern, email)
	return matched
}`,
	],
	rust: [
		`fn process_items(items: Vec<Item>) -> Vec<Result> {
	items
		.into_iter()
		.filter(|i| i.active)
		.map(|i| Result {
			id: i.id,
			value: i.value
		})
		.collect()
}`,
		`let users: Vec<User> = data
	.iter()
	.map(|item| User {
		id: item._id.clone(),
		name: item.user_name.clone(),
		email: item.user_name.clone()
	})
	.collect();`,
		`impl Display for Error {
	fn fmt(&self, f: &mut Formatter) -> fmt::Result {
		write!(f, "Error: {}", self.message)
	}
}`,
		`struct Config {
	api_url: String,
	timeout: u64,
	retries: u32,
}

impl Default for Config {
	fn default() -> Self {
		Self {
			api_url: String::from("http://localhost:3000"),
			timeout: 5000,
			retries: 3,
		}
	}
}`,
		`pub fn fetch_data(url: &str) -> Result<String, reqwest::Error> {
	let response = reqwest::blocking::get(url)?;
	Ok(response.text()?)
}`,
	],
	ruby: [
		`def calculate_sum(arr)
	arr.reduce(0) { |sum, n| sum + n }
end`,
		`users = User.where(active: true).map { |u|
	{ id: u.id, name: u.name }
}`,
		`class DataProcessor
	def initialize(data)
		@data = data
	end

	def process
		@data.select(&:active).map(&:value)
	end
end`,
		`result = items.reduce({ sum: 0 }) { |acc, item|
	acc[:sum] += item[:amount]
	acc
}`,
		`require 'json'

data = JSON.parse(response.body)
filtered = data.select { |i| i['status'] == 'active' }`,
		`class UserService
	def initialize(repository)
		@repository = repository
	end

	def find_by_id(id)
		@repository.find(id)
	end
end`,
	],
	php: [
		`function calculateSum($arr) {
	$sum = 0;
	foreach ($arr as $n) {
		$sum += $n;
	}
	return $sum;
}`,
		`$users = array_filter($data, fn($u) => $u['active']);
$names = array_map(fn($u) => $u['name'], $users);`,
		`$config = [
	'apiUrl' => '/api/v1',
	'timeout' => 5000,
	'retries' => 3,
	'debug' => true
];`,
		`class DataProcessor {
	private $data;

	public function __construct($data) {
		$this->data = $data;
	}

	public function process() {
		return array_map(
			fn($i) => $i['value'],
			array_filter($this->data, fn($i) => $i['active'])
		);
	}
}`,
		`$result = array_reduce($items, fn($acc, $item) => [
	'sum' => $acc['sum'] + $item['amount']
], ['sum' => 0]);`,
		`public function fetchUser(int $id): ?User {
	$user = $this->repository->find($id);
	if ($user === null) {
		throw new UserNotFoundException("User not found");
	}
	return $user;
}`,
	],
	sql: [
		`SELECT
	u.id,
	u.name,
	u.email
FROM users u
WHERE u.active = true
ORDER BY u.created_at DESC`,
		`SELECT
	COUNT(*) as total,
	AVG(score) as avg_score
FROM submissions
WHERE status = 'completed'
GROUP BY category`,
		`INSERT INTO users (id, name, email, created_at)
VALUES (
	gen_random_uuid(),
	'John',
	'john@example.com',
	NOW()
)`,
		`UPDATE users
SET last_login = NOW(),
	login_count = login_count + 1
WHERE id = $1
RETURNING *`,
		`DELETE FROM sessions
WHERE expires_at < NOW();

SELECT * FROM users
WHERE id NOT IN (
	SELECT user_id FROM sessions
)`,
		`CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_products_category ON products(category);`,
		`WITH ranked_users AS (
	SELECT
		id,
		name,
		ROW_NUMBER() OVER (ORDER BY created_at DESC) as rn
	FROM users
)
SELECT * FROM ranked_users WHERE rn <= 10;`,
	],
	html: [
		`<div class="card">
	<h2>Welcome</h2>
	<p>User data loaded successfully.</p>
</div>`,
		`<nav>
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/about">About</a></li>
		<li><a href="/contact">Contact</a></li>
	</ul>
</nav>`,
		`<form action="/submit" method="POST">
	<input type="text" name="username" placeholder="Enter username"/>
	<button type="submit">Submit</button>
</form>`,
		`<table>
	<thead>
		<tr>
			<th>ID</th>
			<th>Name</th>
			<th>Status</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>1</td>
			<td>Item One</td>
			<td>Active</td>
		</tr>
	</tbody>
</table>`,
		`<div id="app">
	<header>
		<h1>Dashboard</h1>
	</header>
	<main>
		<section class="stats">Loading...</section>
	</main>
</div>`,
		`<div class="container">
	<div class="sidebar">
		<h3>Navigation</h3>
		<ul>
			<li><a href="/dashboard">Dashboard</a></li>
			<li><a href="/settings">Settings</a></li>
		</ul>
	</div>
	<div class="content">
		<h2>Welcome</h2>
	</div>
</div>`,
	],
	css: [
		`.container {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding: 1rem;
}`,
		`.card {
	background: #1a1a1a;
	border: 1px solid #2a2a2a;
	border-radius: 8px;
	padding: 1rem;
}`,
		`.button {
	background: #10b981;
	color: #0a0a0a;
	padding: 0.5rem 1rem;
	border: none;
	cursor: pointer;
}`,
		`.grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 1rem;
}`,
		`@media (max-width: 768px) {
	.grid {
		grid-template-columns: 1fr;
	}
}`,
		`.card {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	align-items: center;
	justify-content: center;
	padding: 1.5rem;
	background-color: var(--bg-color);
	border-radius: var(--border-radius);
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}`,
	],
	json: [
		`{
	"id": "1",
	"name": "John",
	"email": "john@example.com",
	"active": true,
	"score": 85
}`,
		`{
	"users": [
		{"id": 1, "name": "Alice"},
		{"id": 2, "name": "Bob"}
	],
	"total": 2
}`,
		`{
	"config": {
		"apiUrl": "/api/v1",
		"timeout": 5000,
		"retries": 3
	},
	"debug": true
}`,
		`{
	"data": [
		{"id": "a1", "value": 100},
		{"id": "a2", "value": 200}
	],
	"count": 2
}`,
		`{
	"result": {
		"success": true,
		"message": "Operation completed",
		"timestamp": "2024-01-15T10:30:00Z"
	}
}`,
		`{
	"pagination": {
		"page": 1,
		"perPage": 10,
		"total": 100
	},
	"items": [
		{"id": 1, "name": "Item 1"},
		{"id": 2, "name": "Item 2"}
	]
}`,
	],
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

function shuffleArray<T>(arr: T[]): T[] {
	const shuffled = [...arr];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
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
	const shuffledTemplates = shuffleArray(templates);
	const lineCount = faker.number.int({ min: 3, max: 6 });

	const selectedTemplates: string[] = [];
	for (let i = 0; i < lineCount && i < shuffledTemplates.length; i++) {
		selectedTemplates.push(shuffledTemplates[i]);
	}

	return selectedTemplates.join("\n\n");
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
