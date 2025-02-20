const { LoanProcessor } = require('./solution');
let loanProcessor;

beforeEach(() => {
  loanProcessor = new LoanProcessor();
  loanProcessor.addCustomer('C001', 5000, 820); // High credit score
  loanProcessor.addCustomer('C002', 3000, 750); // Medium-high credit score
  loanProcessor.addCustomer('C003', 4000, 680); // Medium credit score
  loanProcessor.addCustomer('C004', 2000, 590); // Low credit score (should fail)
  loanProcessor.addCustomer('C006', 1000, 610); // Low but valid credit score
});

test('Loan approval for high credit score', () => {
  expect(loanProcessor.processLoanApplication('C001', 8000, 5)).toBe(true);
});

test('Loan rejection for low credit score', () => {
  expect(loanProcessor.processLoanApplication('C004', 5000, 4)).toBe(false);
});

test('Loan rejection for loan amount too high', () => {
  expect(loanProcessor.processLoanApplication('C002', 7000, 3)).toBe(false);
});

test('Loan approval for medium credit score', () => {
  expect(loanProcessor.processLoanApplication('C003', 6000, 7)).toBe(true);
});

test('Loan rejection for invalid customer', () => {
  expect(() => {
    loanProcessor.processLoanApplication('C999', 4000, 3);
  }).toThrow('Customer not found!');
});

test('Loan approval with zero interest rate', () => {
  loanProcessor.addCustomer('C005', 10000, 850); // Assume 0% interest scenario
  expect(loanProcessor.processLoanApplication('C005', 5000, 10)).toBe(true);
});

test('Loan rejection for exact threshold credit score', () => {
  loanProcessor.addCustomer('C007', 2500, 599);
  expect(loanProcessor.processLoanApplication('C007', 4000, 5)).toBe(false);
});

test('Loan approval for exact threshold loan amount', () => {
  expect(loanProcessor.processLoanApplication('C003', 8000, 5)).toBe(true);
});

test('Loan rejection for negative loan amount', () => {
  expect(loanProcessor.processLoanApplication('C002', -5000, 3)).toBe(false);
});

test('Loan rejection for zero loan amount', () => {
  expect(loanProcessor.processLoanApplication('C002', 0, 3)).toBe(false);
});

test('Loan approval for minimum loan balance', () => {
  expect(loanProcessor.processLoanApplication('C006', 2000, 4)).toBe(true);
});
