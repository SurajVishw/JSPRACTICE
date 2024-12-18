"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: ["2019-11-18T21:31:17.178Z", "2019-12-23T07:42:02.383Z", "2020-01-28T09:15:04.904Z", "2020-04-01T10:17:24.185Z", "2020-05-08T14:11:59.604Z", "2020-05-27T17:01:17.194Z", "2024-11-27T23:36:17.929Z", "2024-11-30T10:51:36.790Z"],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: ["2019-11-01T13:15:33.035Z", "2019-11-30T09:48:16.867Z", "2019-12-25T06:04:23.907Z", "2020-01-25T14:18:46.235Z", "2020-02-05T16:33:06.386Z", "2020-04-10T14:43:26.374Z", "2020-06-25T18:49:59.371Z", "2020-07-26T12:01:20.894Z"],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// format movement dates

const formateMovementsDate = function (day) {
  const calcPassedDays = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const dayPassed = calcPassedDays(new Date(), day);

  if (dayPassed === 0) {
    return "today";
  } else if (dayPassed === 1) {
    return "yesterday";
  } else if (dayPassed <= 7) {
    return `${dayPassed} days`;
  } else {
    const date = `${day.getDate()}`.padStart(2, 0);
    const month = `${day.getMonth() + 1}`.padStart(2, 0);
    const year = day.getFullYear();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    return `${date}/${month}/${year}`;
  }
};

const logoutTimer = function () {
  let time = 120;

  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      containerApp.classList.remove("active");
    }

    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const move = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  move.forEach(function (mov, i) {
    const balanceStatus = mov > 0 ? "deposit" : "withdrawal";

    const dates = new Date(acc.movementsDates[i]);
    const displayDate = formateMovementsDate(dates);

    const movementHtml = `
    <div class="movements__row">
      <div class="movements__type movements__type--${balanceStatus}">${i + 1} ${balanceStatus}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", movementHtml);
  });
};

const creatUserName = function (accs) {
  accs.forEach((acc) => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

creatUserName(accounts);

function balance(acc) {
  const currentBalance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = currentBalance;
  labelBalance.textContent = `${currentBalance}€`;
}

const calcDisplaySummary = function (accounts) {
  const income = accounts.movements.filter((mov) => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;

  const outcome = accounts.movements.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}€`;

  const interest = accounts.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * accounts.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};

// current account

// update ui

const updateUI = function (acc) {
  // display movement
  displayMovements(acc);

  // display balance
  balance(acc);

  // display summery
  calcDisplaySummary(acc);
};

let currentAccount, timer;
console.log(timer);

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find((user) => user.userName === inputLoginUsername.value);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display ui and message
    labelWelcome.textContent = `Welcome Back ${currentAccount.owner.split(" ")[0]}`;
    containerApp.classList.add("active");

    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    updateUI(currentAccount);
    if (timer) clearInterval(timer);
    timer = logoutTimer();
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const transferAmount = Number(inputTransferAmount.value);
  const reciverAccount = accounts.find((user) => user.userName === inputTransferTo.value);

  if (transferAmount > 0 && reciverAccount && currentAccount.balance >= transferAmount && reciverAccount?.userName !== currentAccount.userName) {
    currentAccount.movements.push(-transferAmount);
    reciverAccount.movements.push(transferAmount);
    currentAccount.movementsDates.push(now.toISOString());
    reciverAccount.movementsDates.push(now.toISOString());
    updateUI(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = "";
});

const now = new Date();

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some((mov) => mov >= amount * 0.1)) {
    setTimeout(() => {
      currentAccount.movements.push(Number(inputLoanAmount.value));
      currentAccount.movementsDates.push(now.toISOString());
      inputLoanAmount.value = "";
      updateUI(currentAccount);
    }, 3000);
  } else {
    setTimeout(() => {
      alert("The Loan Amount Is More Than Your Current Balance");
    }, 3000);
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (currentAccount.userName === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)) {
    const index = accounts.findIndex((user) => user.userName === currentAccount.userName);
    console.log(index);
    accounts.splice(index, 1);
    containerApp.classList.remove("active");
    inputCloseUsername.value = inputClosePin.value = "";
  }
});

let sorted = false;

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
