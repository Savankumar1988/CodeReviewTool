import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import fileUpload from "express-fileupload";
import portfinder from "portfinder";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  abortOnLimit: true,
  createParentPath: true,
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  console.log('Starting server initialization...');
  const server = await registerRoutes(app);
  console.log('Routes registered successfully');

  // Health check endpoint for Docker
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    console.log('Setting up Vite in development mode...');
    try {
      await setupVite(app, server);
      console.log('Vite setup completed successfully');
    } catch (error) {
      console.error('Failed to setup Vite:', error);
      process.exit(1);
    }
  } else {
    serveStatic(app);
  }

  // Find an available port starting from a base port
  // Configure portfinder
  portfinder.basePort = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  portfinder.highestPort = 9000;

  try {
    console.log('Finding available port...');
    const port = await portfinder.getPortPromise();
    console.log(`Port ${port} is available`);
    server.listen({
      port,
      host: "0.0.0.0"
      // Listen on all network interfaces for Docker compatibility
    }, () => {
      log(`serving on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to find an available port:', err);
    // Fallback to a high port as last resort
    const fallbackPort = 9876;
    server.listen({
      port: fallbackPort,
      host: "0.0.0.0"
    }, () => {
      log(`serving on fallback port ${fallbackPort}`);
    });
  }
})();
