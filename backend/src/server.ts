import app from "./app";
import dotenv from "dotenv";
import { testDBConnection } from "./config/bd";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
  await testDBConnection();
});
