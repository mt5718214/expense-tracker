# 老爸的記帳本


## 功能

- 可查看所有支出
- 可以依照支出類別篩選特定資料
- 可新增、刪除和修改任一筆支出

## 使用工具

- mongoDB
- mongoose
- Node.js
- Express
- Express-Handlebars
- nodemon
- body-parser
- method-overrid
- handlebars-helpers

## 安裝

1.開啟終端機並執行:

```
git clone https://github.com/mt5718214/expense-tracker.git
```

2.輸入 cd expense-tracker 切換至本專案資料夾


3.初始化安裝套件

```
npm i   //安裝所有套件
```

```
npm run seed  //導入預設開支資訊以及分類
```

4.終端機顯示以下資訊代表成功與資料庫連接
mongoose connected!
done!

```
npm run dev  //啟動程式
```

5.終端機顯示以下資訊代表啟動成功
Express is running on http://localhost:3000
mongoose connected!

伺服器已經成功連線並運作於 http://localhost:3000
