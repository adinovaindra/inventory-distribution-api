import app from "./app";
import { env } from "./config/env";
import "./jobs/workers/contract.worker";

const PORT = env.PORT;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
