import { randomUUID } from "node:crypto";
import {
	integer,
	pgEnum,
	pgTable,
	smallint,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const languageEnum = pgEnum("language", [
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
]);

export const verdictEnum = pgEnum("verdict", [
	"needs_urgent_help",
	"serious_problems",
	"needs_improvement",
	"acceptable",
]);

export const severityEnum = pgEnum("severity", ["error", "warning", "info"]);

export const submissions = pgTable("submissions", {
	id: uuid()
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	code: text().notNull(),
	language: languageEnum().notNull(),
	score: smallint().notNull(),
	verdict: verdictEnum().notNull(),
	roastQuote: text("roast_quote").notNull(),
	lineCount: integer("line_count").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const issues = pgTable("issues", {
	id: uuid()
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	submissionId: uuid("submission_id")
		.references(() => submissions.id)
		.notNull(),
	title: text().notNull(),
	description: text().notNull(),
	severity: severityEnum().notNull(),
	lineNumber: integer("line_number"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const suggestions = pgTable("suggestions", {
	id: uuid()
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	submissionId: uuid("submission_id")
		.references(() => submissions.id)
		.notNull(),
	originalCode: text("original_code").notNull(),
	suggestedCode: text("suggested_code").notNull(),
	explanation: text().notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
