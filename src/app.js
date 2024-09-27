import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/asset.js';

const app = express();
const server = createServer(app);
const PORT = 3000;

app.use(express.json())
app.use(express.urlencoded({ extended : false }));
app.use(express.static('public')) // express의 기능 - 정적 파일 서빙
initSocket(server);

app.get('/', (req, res) => {
    res.send('Hello world!')
})

server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`)
    // 서버가 시동될때 CDN을 읽어야 하니까 여기쯤에 파일 리딩 구문이 들어가야 한다

try {
    const assets = await loadGameAssets();
    console.log(assets);
    console.log('Assets loaded successfully');
} catch (e) {
    console.log('Failed to load game assets: ', e)
}
});
