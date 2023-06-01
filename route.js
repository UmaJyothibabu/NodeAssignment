// ******************************************************************************
// for GET url => http://localhost:3000/

// for POST url => http://localhost:3000/add (include id for new entries)

// for PUT url => http://localhost:3000/update/:id(can update patientCount,hospitalName,location using the same url just change the body part)
// for PUT url=>http://localhost:3000/update/byName/:name

// for DELETE url=>http://localhost:3000//delete/:id
// for DELETE url=> http://localhost:3000///delete/byName/:name

// *******************************************************************************

const express = require("express");
const router = express.Router();
const fs = require("fs");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// let data = require("./hospitalData.json");
const filePath = "./hospitalData.json";

router.get("/", (req, res) => {
  fs.readFile(filePath, (err, jdata) => {
    if (err) {
      console.error(err);
      return res.status(404).send("Error in reading data");
    }
    //   console.log("File data:", jdata);
    res.send(JSON.parse(jdata));
    // res.send(jdata);
  });
});

router.post("/add", (req, res) => {
  console.log(req.body);
  if (Object.entries(req.body).length === 0) {
    return res.send("request body cant be empty");
  }
  fs.readFile(filePath, (err, jdata) => {
    if (err) {
      console.error(err);
      return res.status(404).send("Error in reading data");
    }
    let data = JSON.parse(jdata);
    data.push(req.body);
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err, data) => {
      if (err) {
        console.error(err);
        return res.send("Error in writting file");
      }
    });
    res.send("Added new item \n" + JSON.stringify(req.body));
  });
});

router.put("/update/:id", (req, res) => {
  let id = parseInt(req.params.id);

  fs.readFile(filePath, (err, jdata) => {
    if (err) {
      console.error(err);
      return res.status(404).send("Error in reading data");
    }
    let data = JSON.parse(jdata);
    let hospital = data.find((item) => item.id === id);
    if (!hospital) return res.status(404).send("Invalid hospital id");
    if (Object.entries(req.body).length === 0) {
      res.send("request body cant be empty");
    } else {
      if (req.body.hospitalName) hospital.hospitalName = req.body.hospitalName;
      if (req.body.patientCount) hospital.patientCount = req.body.patientCount;
      if (req.body.location) hospital.location = req.body.location;
    }
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.send("Updation failed");
      }
      res.json(hospital);
    });
  });
});

router.put("/update/byName/:name", (req, res) => {
  let name = req.params.name.toString();

  fs.readFile(filePath, (err, jdata) => {
    if (err) {
      console.error(err);
      return res.status(404).send("Error in reading data");
    }
    let data = JSON.parse(jdata);
    let hospital = data.find((item) => item.hospitalName === name);
    if (!hospital) return res.status(404).send("Invalid hospital id");
    if (Object.entries(req.body).length === 0) {
      res.send("request body cant be empty");
    } else {
      if (req.body.hospitalName) hospital.hospitalName = req.body.hospitalName;
      if (req.body.patientCount) hospital.patientCount = req.body.patientCount;
      if (req.body.location) hospital.location = req.body.location;
    }
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.send("Updation failed");
      }
      res.json(hospital);
    });
  });
});

router.delete("/delete/:id", (req, res) => {
  let id = parseInt(req.params.id);

  fs.readFile(filePath, (err, jdata) => {
    if (err) {
      console.error(err);
      return res.status(404).send("Error in reading data");
    }
    let data = JSON.parse(jdata);
    let hospital = data.find((item) => item.id === id);
    if (!hospital) return res.status(404).send("Id does not exist");
    let deletedData = data.filter((item) => item.id !== id);
    fs.writeFile(filePath, JSON.stringify(deletedData, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.send("Updation failed");
      }
      res.send({
        status: "deleted successfully",
        item: hospital,
      });
    });
  });
});

router.delete("/delete/byName/:name", (req, res) => {
  let name = req.params.name.toString();

  fs.readFile(filePath, (err, jdata) => {
    if (err) {
      console.error(err);
      return res.status(404).send("Error in reading data");
    }
    let data = JSON.parse(jdata);
    let hospital = data.find((item) => item.hospitalName === name);
    if (!hospital) return res.status(404).send("Hospital not present");
    let deletedData = data.filter((item) => item.hospitalName !== name);
    fs.writeFile(filePath, JSON.stringify(deletedData, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.send("Updation failed");
      }
      res.send({
        status: "deleted successfully",
        item: hospital,
      });
    });
  });
});
module.exports = router;
