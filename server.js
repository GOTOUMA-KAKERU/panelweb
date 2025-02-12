const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app); // HTTPサーバー作成
const wss = new WebSocket.Server({ server }); // WebSocketをHTTPサーバーに統合

// public ディレクトリを静的ファイルとして公開
app.use(express.static(path.join(__dirname, 'httdocs/')));

// WebSocketの接続処理
wss.on('connection', (ws) => {
    console.log('WebSocket connected');

    ws.on('message', (message) => {
        console.log(message);
        var typeofmessage = message.slice(0,2);
        if(typeofmessage == "se:"){
            //検索処理
            const serchmessage = message.slice(3);
            //プロキシ処理
            const proxyUrl = "https://duckduckgo.com/ac/?q=" + serchmessage + "&type=list";  // 実際のクエリやパラメータを埋め込む
            console.log(proxyUrl);

            // fetchでHTTPリクエストを送信
            fetch(proxyUrl)
                .then(response => response.json())  // レスポンスをJSONに変換
                .then(data => {
                    console.log('Received proxy data:', data);  // レスポンスデータの確認
                    // クライアントにプロキシ結果を返す
                    ws.send(JSON.stringify(data));
                })
                .catch(error => {
                    console.error('Error during proxy fetch:', error);
                    ws.send(JSON.stringify({ error: 'Failed to fetch proxy data' }));  // エラーメッセージを送信
                });
        }else{

        }
    });

    ws.on('close', () => {
        console.log('WebSocket disconnected');
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});