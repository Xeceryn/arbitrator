ALTER TABLE "opportunity" RENAME COLUMN "exchangeBuyId" TO "buyExchangeId";--> statement-breakpoint
ALTER TABLE "opportunity" RENAME COLUMN "exchangeSellId" TO "sellExchangeId";--> statement-breakpoint
ALTER TABLE "opportunity" ADD CONSTRAINT "opportunity_buyExchangeId_exchange_id_fkey" FOREIGN KEY ("buyExchangeId") REFERENCES "exchange"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "opportunity" ADD CONSTRAINT "opportunity_sellExchangeId_exchange_id_fkey" FOREIGN KEY ("sellExchangeId") REFERENCES "exchange"("id") ON DELETE CASCADE ON UPDATE CASCADE;