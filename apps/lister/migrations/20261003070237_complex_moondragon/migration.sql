CREATE TYPE "exchangeBaseCurrency" AS ENUM('usdt', 'idr');--> statement-breakpoint
CREATE TABLE "chain_link" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "chain_link_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"marketId" integer NOT NULL,
	"chainId" integer NOT NULL,
	"withdrawEnabled" boolean DEFAULT true NOT NULL,
	"depositEnabled" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chain" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "chain_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"code" varchar(255) NOT NULL UNIQUE,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cryptocurrency" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cryptocurrency_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"symbol" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL UNIQUE,
	"logo" varchar(255) NOT NULL,
	"cmcId" integer NOT NULL UNIQUE,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exchange" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "exchange_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"cmcId" integer NOT NULL UNIQUE,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL UNIQUE,
	"logo" varchar(255) NOT NULL,
	"registeredOnCmc" boolean DEFAULT true NOT NULL,
	"baseCurrency" "exchangeBaseCurrency" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "market" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "market_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"exchangeId" integer NOT NULL,
	"cryptocurrencyId" integer NOT NULL,
	"exchangeSymbol" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chain_link" ADD CONSTRAINT "chain_link_marketId_market_id_fkey" FOREIGN KEY ("marketId") REFERENCES "market"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "chain_link" ADD CONSTRAINT "chain_link_chainId_chain_id_fkey" FOREIGN KEY ("chainId") REFERENCES "chain"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "market" ADD CONSTRAINT "market_exchangeId_exchange_id_fkey" FOREIGN KEY ("exchangeId") REFERENCES "exchange"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "market" ADD CONSTRAINT "market_cryptocurrencyId_cryptocurrency_id_fkey" FOREIGN KEY ("cryptocurrencyId") REFERENCES "cryptocurrency"("id") ON DELETE CASCADE ON UPDATE CASCADE;