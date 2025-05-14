import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

// Set environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Log environment
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Current directory: ${process.cwd()}`);

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Prepare the Next.js app
app.prepare()
  .then(() => {
    console.log('Next.js app prepared');
    
    // Create HTTP server
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });

    // Socket functionality has been removed
    console.log('Socket.IO functionality has been disabled');

    // Start the server
    server.listen(port, (err) => {
      if (err) {
        console.error('Error starting server:', err);
        throw err;
      }
      console.log(`> Ready on http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error preparing Next.js app:', err);
    process.exit(1);
  });