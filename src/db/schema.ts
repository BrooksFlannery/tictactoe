
import { jsonb, pgTable, varchar, integer } from "drizzle-orm/pg-core";
import type { GameState } from "../gameEngine";

export const matchesTable = pgTable("tic_tac_toe_matches", {
    matchId:varchar({length:255}).primaryKey(),
    game:jsonb().$type<GameState>().notNull(),
    xScore:integer().notNull(),
    oScore:integer().notNull()
})
