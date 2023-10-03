import DOM from './modules/dom-elements.js';
import { account1 } from './modules/accounts.js';
import { account2 } from './modules/accounts.js';
import { account3 } from './modules/accounts.js';
import { account4 } from './modules/accounts.js';
import { account5 } from './modules/accounts.js';
import { accounts } from './modules/accounts.js';

/**
 * Формирует и размещает на странице список транзакций.
 *
 * @param {array} transactions массив транзакций.
 */
function diplayTransactions(transactions) {
  DOM.containerTransactions.innerHTML = '';

  transactions.forEach((transaction, index) => {
    const transType = transaction > 0 ? 'deposit' : 'withdrawal';
    const transTypeName = transaction > 0 ? 'депозит' : 'вывод средств';

    const transactionRow = `
    <div class="transactions__row">
      <div class="transactions__type transactions__type--${transType}">${
      index + 1
    } ${transTypeName}</div>
      <div class="transactions__value">${transaction}</div>
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
  DOM.labelBalance.innerHTML = `${balance}₽`;
}

/**
 * Вычисляет и отображает на странице суммы, депозитов, спмсаний и процентов
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
  DOM.labelSumIn.textContent = `${depositeTotal}₽`;

  const withdrawalsTotal = account.transactions
    .filter((transaction) => {
      return transaction < 0;
    })
    .reduce((acc, transaction) => {
      return acc + transaction;
    }, 0);
  DOM.labelSumOut.textContent = `${withdrawalsTotal}₽`;

  const interestTotal = account.transactions
    .filter((transaction) => {
      return transaction > 0;
    })
    .map((deposit) => {
      return (deposit * account.interest) / 100;
    })
    .filter((interes) => {
      return interes >= 500;
    })
    .reduce((acc, interes) => {
      return acc + interes;
    }, 0);
  DOM.labelSumInterest.textContent = `${interestTotal}₽`;
}

function updateUI(account) {
  diplayTransactions(account.transactions);
  displayBalance(account);
  displayTotal(account);
}

let currentAccount;

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

    updateUI(currentAccount);
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
    recipientAccount.transactions.push(transferAmount);
    updateUI(currentAccount);
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
  const loanAmmount = Number(DOM.inputLoanAmount.value);

  if (
    loanAmmount > 0 &&
    currentAccount.transactions.some(
      (transaction) => transaction >= (loanAmmount * 10) / 100
    )
  ) {
    currentAccount.transactions.push(loanAmmount);
    updateUI(currentAccount);
    DOM.inputLoanAmount.value = '';
  }
});

createNicknames(accounts);
