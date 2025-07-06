CREATE TYPE "public"."DeliveryStatus" AS ENUM('PENDING', 'DELIVERED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."Plan" AS ENUM('FREE', 'PRO');--> statement-breakpoint
CREATE TABLE "event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"formattedMessage" text NOT NULL,
	"userId" uuid NOT NULL,
	"name" text NOT NULL,
	"fields" jsonb NOT NULL,
	"deliveryStatus" "DeliveryStatus" DEFAULT 'PENDING',
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	"eventCategoryId" uuid
);
--> statement-breakpoint
CREATE TABLE "eventCategory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"color" integer NOT NULL,
	"emoji" text,
	"userId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "eventCategory_name_userId_unique" UNIQUE("name","userId")
);
--> statement-breakpoint
CREATE TABLE "quota" (
	"id" uuid NOT NULL,
	"year" integer NOT NULL,
	"month" integer NOT NULL,
	"count" integer DEFAULT 0,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "quota_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"externalId" text,
	"quotaLimit" integer NOT NULL,
	"plan" "Plan" DEFAULT 'FREE' NOT NULL,
	"email" text NOT NULL,
	"apiKey" uuid DEFAULT gen_random_uuid() NOT NULL,
	"discordId" text,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_externalId_unique" UNIQUE("externalId"),
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_apiKey_unique" UNIQUE("apiKey")
);
--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_eventCategoryId_eventCategory_id_fk" FOREIGN KEY ("eventCategoryId") REFERENCES "public"."eventCategory"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventCategory" ADD CONSTRAINT "eventCategory_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quota" ADD CONSTRAINT "quota_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_createdAt_index" ON "event" USING btree ("createdAt");--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_apiKey_index" ON "user" USING btree ("email","apiKey");