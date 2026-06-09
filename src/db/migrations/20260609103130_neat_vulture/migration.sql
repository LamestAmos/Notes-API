CREATE TYPE "user-role" AS ENUM('user', 'admin');
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" text NOT NULL UNIQUE,
	"passwordHash" text NOT NULL,
	"role" "user-role" DEFAULT 'user'::"user-role" NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
