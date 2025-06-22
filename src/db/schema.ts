
import { jsonb, pgTable, varchar, integer } from "drizzle-orm/pg-core";

export const messagesTable = pgTable("messages", {
    messageId:varchar({length:255}).primaryKey(),
    content: d.text().notNull(),
    xScore:integer().notNull(),
    oScore:integer().notNull(),
    matchName:varchar({length:255}).notNull(),
})


 id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    content: d.text().notNull(),
    chatId: d.integer().notNull().references(() => chats.id), // assuming you already have a chats table
    authorId: d.integer(), // optional, if you want to associate with a user
    createdAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  }),
