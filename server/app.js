const express = require("express");
const app = express();
const cors = require("cors");

let subs = ["Computer", "Math", "English"];

let AllSubjectForToday = [
  {
    subName: "Computer",
    done: false,
    topic: [
      {
        type: "Read",
        done: false,
        des: "Study my print programe.",
        lenDes:
          "I have taught you how to print a line or a word. And how to print variable that stores a line (string) in it.",
      },
      {
        type: "Read",
        done: false,
        des: "Open chapter 2. Read the 2nd page.",
      },
      {
        type: "Write",
        done: false,
        des: "Write a simple print programe to print out 3 lines",
      },

      {
        type: "Quiz",
        done: false,
        des: "Finish the quiz",
        lenDes: "Finish the quiz. scroll to bottom to start",
      },
    ],
    question: [
      {
        type: "ANS",
        qtext: "What is a hard disk of computer ?",
        reference: "Chapter 2 page 6",
      },
      {
        type: "Q",
        qtext: "Describe some features of RAM.",
        reference: "Chapter 2 page 10",
      },
      {
        type: "Q",
        qtext: "1024 Bit = ? Bytes ",
        reference: "",
      },
    ],
  },
  {
    subName: "Math",
    done: true,
    topic: [
      {
        type: "Write",
        done: true,
        des:
          "Chapter 3, page 49. you have to solve from problem number 3 to 10, can leave problem number 6",
      },

      {
        type: "Quiz",
        done: true,
        des: "Finish the quiz",
        lenDes: "Finish the quiz. scroll to bottom to start",
      },
    ],
    question: [
      {
        type: "ANS",
        qtext: "Some Awosme Math ?",
        reference: "Chapter 2 page 6",
      },
      {
        type: "Q",
        qtext: "Some Awosme Math 2?",
        reference: "Chapter 2 page 10",
      },
      {
        type: "Q",
        qtext: "what is 1 + -1 = ?",
        reference: "",
      },
    ],
  },
  {
    subName: "English",
    done: false,
    topic: [
      {
        type: "Write",
        done: false,
        des: "Write a small 10 line pragraph on a day that you were sad.",
      },
      {
        type: "Read",
        done: false,
        des:
          "Read story on page 10 of your book. find 10 words that you don't the meaning of",
      },
    ],
    question: [],
  },
];

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  "I am Here!";
});

app.get("/sub", (req, res) => {
  res.send(subs);
});

app.post("/all/:sname", (req, res) => {
  let OneSub = AllSubjectForToday.find(
    (sub) => sub.subName === req.params.sname
  );
  OneSub.topic = req.body;
  let isAllDone = OneSub.topic.reduce((x, a) => x && a.done, true);
  OneSub.done = isAllDone;
  setTimeout(() => {
    res.send("ok");
  }, 1500);
});

app.get("/all/:sname", (req, res) => {
  let OneSub = AllSubjectForToday.find(
    (sub) => sub.subName === req.params.sname
  );
  res.send(OneSub);
});
app.get("/all", (req, res) => {
  res.send(AllSubjectForToday);
});

app.listen(process.env.PORT || 5000, () => {
  console.log("server is listening");
});
