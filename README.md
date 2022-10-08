# 後端Server - for 前端電子商務網站


這是一個為<a href="https://www.ruanpin23.com/#/portfolioShow">電子商務前端專案</a>所建立的後端Server。

配合前端專案可執行接收請求、返回使用者所請求的資訊。

僅提供作品集使用，不做任何商業性質用途



## 功能
<ul>
    <li>/signUp - 提供註冊功能，並儲存使用者至DB </li>
    <li>/signIn - 提供登入功能 </li>
    <li>/buyAction - 提供下訂單功能，並儲存訂單資訊至DB </li>
    <li>/getOrderHistory - 存取資料庫並取得使用者歷史訂單資訊 </li>
</ul>

## 使用技術和第三方套件

<ul>
    <li>Express - 後端Server框架 for Node.js </li>
    <li>mongoose - 作為在Node.js環境中連接至MongoDB的library </li>
    <li>bcrypt - 使用者密碼加密 </li>    
    <li>jsonwebtoken - 生成token </li>
</ul>


## 目錄結構說明
```
|-- Server
    |-- .gitignore
    |-- index.js
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- models
        |-- users.js

```

## 如何執行

注意：需安裝MongoDB(v6.0.1)並先執行資料庫，再執行此後端專案才可提供前端註冊/登入/訂單建立/訂單查詢等功能。

###安裝此專案需要的第三方套件
```
npm install 
```

###執行此後端專案
```
node index.js
```

