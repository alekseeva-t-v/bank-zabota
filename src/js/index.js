import DOM from './modules/dom-elements.js';
import { accounts } from './modules/accounts.js';

let transactionsSorted = false;
let currentAccount;
let currentLogoutTimer;

/**
 * Возвращает разницу между двумя датами в сутках.
 *
 * @param {object} date1 Объект начальной даты.
 * @param {object} date2 Объект конечной даты.
 * @return {number} разница между датами в сутках.
 */
function getDaysBeetween2Dates(date1, date2) {
  return Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
}

/**
 * Форматирует дату для корректного отображения в приложении.
 *
 * @param {object} date исходная дата для обработки.
 * @param {string} locale локаль.
 * @return {string} отформатированная дата, которую необходимо отобразить в приложении.
 */
function formatTransactionDate(date, locale) {
  const daysPassed = getDaysBeetween2Dates(new Date(), date);

  if (daysPassed === 0) return 'Сегодня';
  if (daysPassed === 1) return 'Вчера';
  if (daysPassed <= 4) return `${daysPassed} дня назад`;
  if (daysPassed <= 7) return `${daysPassed} дней назад`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
}

/**
 * Форматирует отображение денежных средств, с учетом локали и валюты.
 *
 * @param {number} value исходное количество денежных единиц.
 * @param {string} locale локаль.
 * @param {string} currency валюта.
 * @return {string} отформатированная строка с количеством денежных единиц, которую необходимо отобразить в приложении.
 */
function formatCurrency(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}

/**
 * Формирует и размещает на странице список транзакций.
 *
 * @param {object} account объект аккаунта
 * @param {boolean} sort параметр, который показывает требуется или нет сортировка списка транзакций
 */
function diplayTransactions(account, sort = false) {
  DOM.containerTransactions.innerHTML = '';

  const transacs = sort
    ? account.transactions.slice().sort((x, y) => x - y)
    : account.transactions;

  transacs.forEach((transaction, index) => {
    const transType = transaction > 0 ? 'deposit' : 'withdrawal';
    const transTypeName = transaction > 0 ? 'депозит' : 'вывод средств';

    const date = new Date(account.transactionsDates[index]);
    const transDate = formatTransactionDate(date, account.locale);

    const formatedTrans = formatCurrency(
      transaction,
      account.locale,
      account.currency
    );

    const transactionRow = `
    <div class="transactions__row">
      <div class="transactions__type transactions__type--${transType}">${
      index + 1
    } ${transTypeName}</div>
      <div class="transactions__date">${transDate}</div>
      <div class="transactions__value">${formatedTrans}</div>
    </div>`;

    DOM.containerTransactions.insertAdjacentHTML('afterbegin', transactionRow);
  });
}

/**
 * Добавляет каждому объекту массива дополнительное свойство nickName.
 *
 * @param {array} accList массив объектов акаунтов.
 */
function createNicknames(accList) {
  accList.forEach((acc) => {
    acc.nickName = acc.userName
      .toLowerCase()
      .split(' ')
      .map((value) => value[0])
      .join('');
  });
}

/**
 * Вычисляет и выводит на экран сумму средств после всех транзакций
 *
 * @param {object} account Объект данных конкретного аккаунта.
 */
function displayBalance(account) {
  const balance = account.transactions.reduce(
    (acc, transaction) => acc + transaction,
    0
  );

  account.balance = balance;
  DOM.labelBalance.innerHTML = formatCurrency(
    balance,
    account.locale,
    account.currency
  );
}

/**
 * Вычисляет и отображает на странице суммы, депозитов, списаний и процентов
 *
 * @param {object} account Объект данных конкретного аккаунта.
 */
function displayTotal(account) {
  const depositeTotal = account.transactions
    .filter((transaction) => {
      return transaction > 0;
    })
    .reduce((acc, transaction) => {
      return acc + transaction;
    }, 0);
  DOM.labelSumIn.textContent = formatCurrency(
    depositeTotal,
    account.locale,
    account.currency
  );

  const withdrawalsTotal = account.transactions
    .filter((transaction) => {
      return transaction < 0;
    })
    .reduce((acc, transaction) => {
      return acc + transaction;
    }, 0);
  DOM.labelSumOut.textContent = formatCurrency(
    withdrawalsTotal,
    account.locale,
    account.currency
  );

  const interestTotal = account.transactions
    .filter((transaction) => {
      return transaction > 0;
    })
    .map((deposit) => {
      return (deposit * account.interest) / 100;
    })
    .filter((interes) => {
      return interes >= 5;
    })
    .reduce((acc, interes) => {
      return acc + interes;
    }, 0);

    console.log(interestTotal)
  DOM.labelSumInterest.textContent = formatCurrency(
    interestTotal,
    account.locale,
    account.currency
  );
}

/**
 * Вызывает все функции обновляющие интерфейс
 *
 * @param {object} account Объект данных конкретного аккаунта.
 */
function updateUI(account) {
  diplayTransactions(account);
  displayBalance(account);
  displayTotal(account);
}

/**
 * Запускает таймер обратного отсчета выхода из приложения.
 *
 * @return {number} идентификатор таймера.
 */
function startLogoutTimer() {
  function logOutTimerCallback() {
    const minutes = String(Math.trunc(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    DOM.labelTimer.textContent = `${minutes}:${seconds}`;

    if (time === 0) {
      clearInterval(logOutTimer);
      DOM.containerMain.style.opacity = '0';
      DOM.labelWelcome.textContent = 'Войдите в свой аккаунт';
    }

    time--;
  }

  let time = 300;

  logOutTimerCallback();
  const logOutTimer = setInterval(logOutTimerCallback, 1000);

  return logOutTimer;
}

DOM.btnLogin.addEventListener('click', (event) => {
  event.preventDefault();
  currentAccount = accounts.find((account) => {
    return account.nickName === DOM.inputLoginUsername.value;
  });

  if (currentAccount?.pin === Number(DOM.inputLoginPin.value)) {
    const currentAccountName = currentAccount.userName.split(' ')[0];
    DOM.labelWelcome.textContent = `Рады, что Вы снова с нами, ${currentAccountName}`;
    DOM.containerMain.style.opacity = '1';

    DOM.inputLoginUsername.value = '';
    DOM.inputLoginPin.value = '';
    DOM.inputLoginPin.blur();

    if (currentLogoutTimer) clearInterval(currentLogoutTimer);

    currentLogoutTimer = startLogoutTimer();
    updateUI(currentAccount);

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: '2-digit',
      year: 'numeric',
      weekday: 'long',
    };

    const locale = currentAccount.locale;

    DOM.labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
      now
    );
  }
});

DOM.btnTransfer.addEventListener('click', (event) => {
  event.preventDefault();
  const transferAmount = Number(DOM.inputTransferAmount.value);
  const recipientNickname = DOM.inputTransferTo.value;
  const recipientAccount = accounts.find((account) => {
    return account.nickName === recipientNickname;
  });

  DOM.inputTransferAmount.value = '';
  DOM.inputTransferTo.value = '';
  DOM.inputTransferAmount.blur();

  if (
    transferAmount > 0 &&
    currentAccount.balance >= transferAmount &&
    recipientAccount &&
    currentAccount.nickName !== recipientAccount?.nickName
  ) {
    currentAccount.transactions.push(-transferAmount);
    currentAccount.transactionsDates.push(new Date().toISOString());
    recipientAccount.transactions.push(transferAmount);
    recipientAccount.transactionsDates.push(new Date().toISOString());
    updateUI(currentAccount);

    clearInterval(currentLogoutTimer);
    currentLogoutTimer = startLogoutTimer();
  }
});

DOM.btnClose.addEventListener('click', (event) => {
  event.preventDefault();

  if (
    DOM.inputCloseUsername.value === currentAccount.nickName &&
    Number(DOM.inputClosePin.value) === currentAccount.pin
  ) {
    const indexCloseAccount = accounts.findIndex((account) => {
      return account.pin === currentAccount.pin;
    });
    accounts.splice(indexCloseAccount, 1);
    DOM.containerMain.style.opacity = '0';
    DOM.labelWelcome.textContent = 'Войдите в свой аккаунт';
    DOM.inputClosePin.value = '';
    DOM.inputCloseUsername.value = '';
  }
});

DOM.btnLoan.addEventListener('click', (event) => {
  event.preventDefault();
  const loanAmmount = Math.floor(DOM.inputLoanAmount.value);

  if (
    loanAmmount > 0 &&
    currentAccount.transactions.some(
      (transaction) => transaction >= (loanAmmount * 10) / 100
    )
  ) {
    setTimeout(() => {
      currentAccount.transactions.push(loanAmmount);
      currentAccount.transactionsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 10000);
  }

  DOM.inputLoanAmount.value = '';
  clearInterval(currentLogoutTimer);
  currentLogoutTimer = startLogoutTimer();
});

DOM.btnSort.addEventListener('click', (event) => {
  event.preventDefault();
  diplayTransactions(currentAccount, !transactionsSorted);
  transactionsSorted = !transactionsSorted;
});

createNicknames(accounts);

const bankBalance = accounts
  .flatMap((account) => {
    return account.transactions;
  })
  .reduce((acc, currentAccount) => {
    return acc + currentAccount;
  }, 0);

console.log(bankBalance);

DOM.logoImage.addEventListener('click', () => {
  [...document.querySelectorAll('.transactions__row')].forEach((row, index) => {
    if (index % 2 === 0) {
      row.style.background = 'rgba(68, 68, 68, 0.2)';
    }
  });
});
