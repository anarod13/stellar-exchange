import inquirer from "inquirer";

const questions = [
  {
    choices: ["Testnet", "Public"],
    name: "stellarNetwork",
    message: "In which nwtwork are you working?",
    type: "list",
  },
  {
    type: "input",
    name: "asset",
    message: "Which asset wuld you like?",
  },
  { type: "input", name: "amount", message: "How much?" },
];
function receiveAssetInputs() {
  inquirer.prompt(questions).then((answers) => {
    console.log(
      `Hi ${answers.asset},${answers.amount}, ${answers.stellarNetwork}!`
    );
  });
}
receiveAssetInputs();
