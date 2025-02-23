const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser'); // 追加

const app = express();
const server = http.createServer(app); // HTTPサーバー作成
const wss = new WebSocket.Server({ server }); // WebSocketをHTTPサーバーに統合
app.use(cookieParser());  // これでcookie-parserが有効になります

// ミドルウェアの設定
app.use(express.json()); // JSONリクエストボディをパースする
app.use(cookieParser()); // クッキーをパースする

// 認証ミドルウェア
function authenticate(req, res, next) {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.redirect('/login'); // クッキーがない場合はログインページへ
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // ユーザー情報をリクエストにセット
        next(); // 認証OKなら次へ
    } catch (err) {
        res.clearCookie('auth_token'); // トークンが無効なら削除
        return res.redirect('/login'); // 再ログインを促す
    }
}

// /appsで静的ファイルを公開 (http://localhost:3000/apps)
app.use('/@dash', authenticate, express.static(path.join(__dirname, 'htdocs')));

// ルートでmain/index.htmlを公開 (http://localhost:3000)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main', 'index.html'));
});
app.get('/top.webp', (req, res) => {
    res.sendFile(path.join(__dirname, 'main', 'top.webp'));
});

//認証の処理
const SECRET_KEY = '241116kwt'; // 秘密鍵を設定
app.use('/login', express.static(path.join(__dirname, 'login_signin')));
app.post('/login/auth', (req, res) => {
    const { user, pass } = req.body;
    console.log(user);
    console.log(pass);

    // ユーザー認証処理（仮）
    if (user === 'test' && pass === '1234') {
        const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: '1d' });
        res.cookie('auth_token', token, { httpOnly: true, secure: true }); // クッキーに保存
        return res.json({ message: 'Login successful' });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
});



// WebSocketの接続処理
wss.on('connection', (ws) => {
    console.log('WebSocket connected');

    ws.on('message', (message) => {
        const messageutf8 = message.toString("utf-8");
        var typeofmessage = messageutf8.slice(0,3);
        const bodyofmessage = messageutf8.slice(3);

        if(typeofmessage == "se:"){
            //検索処理
            console.log(bodyofmessage);

            //プロキシ処理
            const proxyUrl = "https://duckduckgo.com/ac/?q=" + bodyofmessage + "&type=list";  // 実際のクエリやパラメータを埋め込む

            // fetchでHTTPリクエストを送信
            fetch(proxyUrl)
                .then(response => response.json())  // レスポンスをJSONに変換
                .then(data => {
                    //console.log('Received proxy data:', data);  // レスポンスデータの確認
                    
                    // クライアントにプロキシ結果を返す
                    ws.send(JSON.stringify(data));
                })
                .catch(error => {
                    console.error('Error during proxy fetch:', error);
                    ws.send(JSON.stringify({ error: 'Failed to fetch proxy data' }));  // エラーメッセージを送信
                });
        }else{
            console.error("errer");
        }
    });

    ws.on('close', () => {
        console.log('WebSocket disconnected');
    });
});


//サーバーを起動
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is started at http://localhost:${PORT}`);
});


//console上での終了操作
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
console.log('終了はqと入力');

rl.on('line', (input) => {
    if (input.trim() === 'q') {
        console.log('終了します。');
        rl.close();
        process.exit(0);
    }
});