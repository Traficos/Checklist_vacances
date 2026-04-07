import { config } from "dotenv";
import path from "path";

// Load .env from project root so tests can use Prisma directly
config({ path: path.resolve(__dirname, "../.env") });
