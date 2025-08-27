ALTER TABLE "exchange" ADD COLUMN "registeredOnCmc" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "exchange" ADD CONSTRAINT "exchange_cmcId_unique" UNIQUE("cmcId");