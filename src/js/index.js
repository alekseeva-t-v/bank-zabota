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
 * @param {transactions} accList массив транзакций.
 */
function displayBalance(transactions) {
  const balance = transactions.reduce(
    (acc, transaction) => acc + transaction,
    0
  );
  DOM.labelBalance.innerHTML = `${balance}₽`;
}

/**
 * Вычисляет и отображает на странице суммы, депозитов, спмсаний и процентов
 *
 * @param {transactions} accList массив транзакций.
 */
function displayTotal(transactions) {
  const depositeTotal = transactions
    .filter((transaction) => {
      return transaction > 0;
    })
    .reduce((acc, transaction) => {
      return acc + transaction;
    }, 0);
  DOM.labelSumIn.textContent = `${depositeTotal}₽`;

  const withdrawalsTotal = transactions
    .filter((transaction) => {
      return transaction < 0;
    })
    .reduce((acc, transaction) => {
      return acc + transaction;
    }, 0);
  DOM.labelSumOut.textContent = `${withdrawalsTotal}₽`;

  const interestTotal = transactions
    .filter((transaction) => {
      return transaction > 0;
    })
    .map((deposit) => {
      return deposit * 0.1;
    })
    .filter((interes) => {
      return interes >= 500;
    })
    .reduce((acc, interes) => {
      return acc + interes;
    }, 0);
  DOM.labelSumInterest.textContent = `${interestTotal}₽`;
}

diplayTransactions(account1.transactions);
createNicknames(accounts);
displayBalance(account1.transactions);
displayTotal(account1.transactions);
