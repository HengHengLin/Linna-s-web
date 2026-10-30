import { defineConfig } from 'vite';
import {generateReading} from './scripts/reading.mjs';
import { generate } from './scripts/content.mjs';

export default defineConfig({
  plugins: [{
    name: 'reviewed-content-watch',
    configureServer(server) {
      server.watcher.add(['content/public','content/reading']);
      const refresh = file => {
        if(file.replaceAll('\\','/').includes('/content/reading/') && file.endsWith('.md')) { try { generateReading(); } catch(error) { server.ws.send({type:'error',err:{message:error.message,stack:'',plugin:'reading-watch'}}); } return; }
        if (!file.replaceAll('\\', '/').includes('/content/public/') || !file.endsWith('.md')) return;
        try { generate(); }
        catch (error) {
          server.ws.send({ type: 'error', err: { message: error.message, stack: '', plugin: 'reviewed-content-watch' } });
        }
      };
      server.watcher.on('add', refresh).on('change', refresh).on('unlink', refresh);
    },
  }],
});
