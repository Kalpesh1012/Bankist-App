"use strict";

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2021-12-01T23:36:17.929Z",
    "2021-12-03T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "en-IN", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-07-22T14:43:26.374Z",
    "2020-07-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

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

// userName and Pin

const displayuname = function (acc) {
  acc.forEach(function (accs) {
    accs.username = accs.owner
      .toLowerCase()
      .split(" ")
      .map((own) => own[0])
      .join("");
  });
};
displayuname(accounts);

const updateUI = function (acc) {
  diplayMovements(acc);
  displayTotal(acc);
  displaySummary(acc);
};

const formatDates = function (date, local) {
  const calcDays = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDays(new Date(), date);

  if (daysPassed === 1) return "Yesterday";
  if (daysPassed === 0) return "Today";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const options = {
      day: "2-digit",
      year: "2-digit",
      month: "2-digit",
    };
    return new Intl.DateTimeFormat(local, options).format(date);
  }
};
const curren = function (value, loc, currency) {
  const optio = {
    style: "currency",
    currency: currency,
  };
  return new Intl.NumberFormat(loc, optio).format(value);
};

const timer = function () {
  const tick = function () {
    const minute = Math.trunc(String(timel / 60).padStart(2, 0));
    const second = String(timel % 60).padStart(2, 0);
    labelTimer.textContent = `${minute}:${second}`;

    if (timel === 0) {
      clearTimeout(setti);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = "Log in to get started";
      inputLoginUsername.value = "";
      inputLoginPin.value = "";
    }
    timel--;
  };
  let timel = 300;
  tick();
  const setti = setInterval(tick, 1000);
  return setti;
};

//deposit & withdrawl

const diplayMovements = function (acc) {
  containerMovements.innerHTML = "";
  acc.movements.forEach(function (accs, i) {
    const type = accs > 0 ? "deposit" : "withdrawal";
    const daysss = new Date(acc.movementsDates[i]);
    const displaydate = formatDates(daysss, acc.locale);
    const curr = curren(accs, acc.locale, acc.currency);

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displaydate}</div>
    <div class="movements__value">${curr}</div>
  </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// total amount

const displayTotal = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  const curr = curren(acc.balance, acc.locale, acc.currency);
  labelBalance.textContent = `${curr}`;
};

//dislay in & out

const displaySummary = function (acc) {
  const ine = acc.movements
    .filter((acc) => acc > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = curren(ine, acc.locale, acc.currency);

  const oute = acc.movements
    .filter((acc) => acc < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = curren(oute, acc.locale, acc.currency);

  const rate = acc.movements
    .filter((acc) => acc > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = curren(
    (rate * acc.interestRate) / 100,
    acc.locale,
    acc.currency
  );
};

//implementing login
let createaccount, setti;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  createaccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (createaccount?.pin === Number(inputLoginPin.value)) {
    console.log("Login");
    labelWelcome.textContent = `Welcome back ,${
      createaccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    /* const dat = new Date();
    const year = dat.getFullYear();
    const month = `${dat.getMonth() + 1}`.padStart(2, 0);
    const day = `${dat.getDate()}`.padStart(2, 0);
    const hour = dat.getHours();
    const minute = dat.getMinutes();
    labelDate.textContent = `${day}/${month}/${year},${hour}:${minute}`;*/
    const options = {
      day: "2-digit",
      year: "2-digit",
      hour: "numeric",
      weekday: "long",
      month: "numeric",
      minute: "numeric",
    };
    const now = new Date();
    labelDate.textContent = new Intl.DateTimeFormat(
      createaccount.locale,
      options
    ).format(now);
    if (setti) clearInterval(setti);
    setti = timer();
    updateUI(createaccount);
  }
});

// transfer the amount

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const tamount = Number(inputTransferAmount.value);
  const reamount = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  console.log(tamount, reamount);
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    tamount > 0 &&
    createaccount.balance >= tamount &&
    reamount?.username !== createaccount.username
  ) {
    reamount.movements.push(tamount);
    createaccount.movements.push(-tamount);
    reamount.movementsDates.push(new Date().toISOString());
    createaccount.movementsDates.push(new Date().toISOString());

    updateUI(createaccount);
  }
});

// close the acccount

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === createaccount.username &&
    Number(inputClosePin.value) === createaccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === createaccount.username
    );
    console.log(index);

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = "";
  }
});

// request the loan

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amounts = Number(inputLoanAmount.value);
  if (
    amounts > 0 &&
    createaccount.movements.some((mov) => mov > amounts * 0.1)
  ) {
    createaccount.movements.push(amounts);
    createaccount.movementsDates.push(new Date().toISOString());
    updateUI(createaccount);
    inputLoanAmount.value = "";
  }
});

let sorte = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  if (sorte !== true) {
    const mov = createaccount.movements;
    createaccount.movements = createaccount.movements.slice().sort((a, b) => {
      return a - b;
    });
    updateUI(createaccount);
    createaccount.movements = mov;
  } else {
    updateUI(createaccount);
  }
  sorte = !sorte;
});
