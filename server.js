const express = require('express');
const path = require('path');
const http = require('http');//httpsサーバー
const WebSocket = require('ws');//websocket
const jwt = require('jsonwebtoken');//JWTキーを使ったログイン
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const crypto = require('crypto');//乱数発生用
const { Client } = require('pg');

const app = express();
const server = http.createServer(app); // HTTPサーバー作成
const wss = new WebSocket.Server({ server }); // WebSocketをHTTPサーバーに統合
app.use(cookieParser());  // これでcookie-parserが有効になります
const sessionStore = new Map();//ログイン中セッションの管理
// ミドルウェアの設定
app.use(express.urlencoded({ extended: true }));

// 認証ミドルウェア
function authenticate(req, res, next) {
    const token = req.cookies.auth_token;
    const sessionId = req.cookies.session_id;
    if (!token) {
        return res.redirect('/login'); // クッキーがない場合はログインページへ
    }
    if(sessionId || sessionStore.has(sessionId)){
        req.user = sessionStore.get(sessionId);
        console.log("セッションを使ったログインがありました");
        next(); // 認証OKなら次へ
    }else{
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            req.user = decoded; // ユーザー情報をリクエストにセット
            console.log("JWTを使ったログインがありました");

            // セッションIDを作成（例：ランダムな文字列やUUID）
            const sessionId = crypto.randomUUID();
            // セッション情報をMapに格納
            sessionStore.set(sessionId, { user: 'test'});
            // セッションIDをクッキーとしてクライアントに送信
            res.cookie('session_id', sessionId, { httpOnly: true, secure: true });
            
            next(); // 認証OKなら次へ
        } catch (err) {
            res.clearCookie('auth_token'); // トークンが無効なら削除
            return res.redirect('/@dash'); // 再ログインを促す
        }
    }
}

// /静的ファイルを公開 (http://localhost:3000/)
app.use('/@dash', authenticate, express.static(path.join(__dirname, 'htdocs')));
app.use('/others', express.static(path.join(__dirname, 'others')));

app.use('/',express.static(path.join(__dirname, 'main')));

//ログイン
const SECRET_KEY = '241116kwt'; // 秘密鍵を設定
app.use('/login', express.static(path.join(__dirname, 'login')));
app.post('/login/auth', (req, res) => {
    const { user, pass } = req.body;
    console.log(user);
    console.log(pass);

    // ユーザー認証処理（仮）
    if (user == 'test' && pass == '1234') {
        const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: '1d' });
        res.clearCookie('auth_token'); // cookieを削除
        res.cookie('auth_token', token, { httpOnly: true, secure: true }); // クッキーに保存

                // セッションIDを作成（例：ランダムな文字列やUUID）
                const sessionId = crypto.randomUUID();
                // セッション情報をMapに格納
                sessionStore.set(sessionId, { user: 'test'});
                // セッションIDをクッキーとしてクライアントに送信
                res.cookie('session_id', sessionId, { httpOnly: true, secure: true });

        return res.redirect('/@dash'); 
    } else {
        console.log(user);
        return res.redirect('/login');
    }
});

//ログアウト

app.get('/logout/auth', (req, res) => {
    res.clearCookie("auth_token");
    res.clearCookie("session_id");
    res.redirect('/login');
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