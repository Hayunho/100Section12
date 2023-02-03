const fs = require("fs");
const path = require("path");

const express = require("express");
const uuid = require("uuid");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public")); // "public"폴더 안에 정적 CSS, JS 파일 등을 사용한다
app.use(express.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  // const htmlFilePath = path.join(__dirname, "views", "index.html");
  // res.sendFile(htmlFilePath);

  res.render("index");
});

app.get("/restaurants", function (req, res) {
  // const htmlFilePath = path.join(__dirname, "views", "restaurants.html");
  // res.sendFile(htmlFilePath);

  const filePath = path.join(__dirname, "data", "restaurants.json");

  const fileData = fs.readFileSync(filePath);
  const storedRestaurants = JSON.parse(fileData);

  res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
  });
});

app.get("/restaurants/:rid", function (req, res) {
  // /restaurant/r1        :rid --> req.params.rid          :id --> req.params.id
  const restaurantId = req.params.rid;
  const filePath = path.join(__dirname, "data", "restaurants.json");

  const fileData = fs.readFileSync(filePath);
  const storedRestaurants = JSON.parse(fileData);

  for (const restaurant of storedRestaurants) {
    if (restaurant.id === restaurantId) {
      return res.render("restaurant-detail", { restaurant: restaurant });
    }
  }

  res.render("404"); //restaurant/rid 가 없는 경우 404 render
});

app.get("/recommend", function (req, res) {
  // const htmlFilePath = path.join(__dirname, "views", "recommend.html");
  // res.sendFile(htmlFilePath);

  res.render("recommend");
});

app.post("/recommend", function (req, res) {
  const restaurant = req.body;
  restaurant.id = uuid.v4();
  const filePath = path.join(__dirname, "data", "restaurants.json");

  const fileData = fs.readFileSync(filePath);
  const storedRestaurants = JSON.parse(fileData);

  storedRestaurants.push(restaurant);

  fs.writeFileSync(filePath, JSON.stringify(storedRestaurants));

  res.redirect("/confirm");
}); // recommend페이지에서 submit시 데이터 저장

app.get("/confirm", function (req, res) {
  // const htmlFilePath = path.join(__dirname, "views", "confirm.html");
  // res.sendFile(htmlFilePath);

  res.render("confirm");
});

app.get("/about", function (req, res) {
  // const htmlFilePath = path.join(__dirname, "views", "about.html");
  // res.sendFile(htmlFilePath);

  res.render("about");
});

app.use(function (req, res) {
  res.render("404");
}); // 아예 주소자체가 틀린 경우 404 page

app.listen(3000);
