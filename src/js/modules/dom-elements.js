const DOM = {
  labelWelcome: document.querySelector('.nav__welcome'),
  labelDate: document.querySelector('.date'),
  labelBalance: document.querySelector('.balance__value'),
  labelSumIn: document.querySelector('.total__value--in'),
  labelSumOut: document.querySelector('.total__value--out'),
  labelSumInterest: document.querySelector('.total__value--interest'),
  labelTimer: document.querySelector('.timer'),

  containerMain: document.querySelector('.main__overlay'),
  containerTransactions: document.querySelector('.transactions'),

  btnLogin: document.querySelector('.login__btn'),
  btnTransfer: document.querySelector('.form__btn--transfer'),
  btnLoan: document.querySelector('.form__btn--loan'),
  btnClose: document.querySelector('.form__btn--close'),
  btnSort: document.querySelector('.btn--sort'),

  inputLoginUsername: document.querySelector('.login__input--user'),
  inputLoginPin: document.querySelector('.login__input--pin'),
  inputTransferTo: document.querySelector('.form__input--to'),
  inputTransferAmount: document.querySelector('.form__input--amount'),
  inputLoanAmount: document.querySelector('.form__input--loan-amount'),
  inputCloseUsername: document.querySelector('.form__input--user'),
  inputClosePin: document.querySelector('.form__input--pin'),
};

export default DOM;
