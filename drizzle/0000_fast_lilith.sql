CREATE TABLE "tic_tac_toe_matches" (
	"matchId" varchar(255) PRIMARY KEY NOT NULL,
	"game" jsonb NOT NULL,
	"xScore" integer NOT NULL,
	"oScore" integer NOT NULL
);
