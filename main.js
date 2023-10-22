const express = require("express");
const morgan = require("morgan");
const { authMiddlewere, authMiddleware } = require("./extras/JWT");
require("./database/connnections");
const cors = require("cors");
const port = 4000;
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cors());
//Landing Routes
app.use("/public", require("./routes/publicRoute"));
app.use("/admin", require("./routes/adminRoute"));
app.use("/transaction", require("./routes/transactionRoute"));
app.use("/itAdmin", require("./routes/ItAdminRoute"));

app.listen(port, () => {
  console.log(`Server Strated at port ${port}`);
});
