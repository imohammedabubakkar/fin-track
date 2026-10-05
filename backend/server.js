// Production entry point. Build the TypeScript backend first with `npm run build`.
import "./dist/server.js";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Fin-Track backend is running successfully"
  });
});

// your existing API routes below