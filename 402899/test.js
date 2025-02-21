const { DocumentEncryptor } = require('./alternate_responses/model5.js');

describe('DocumentEncryptor', () => {
  let documentEncryptor;

  beforeEach(() => {
    documentEncryptor = new DocumentEncryptor();
  });

  test('encrypts numbers with valid actions', () => {
    const numbers = '123456';
    const actions = 'RLTDRRTRS2S1';
    const result = documentEncryptor.encryptNumbers(numbers, actions);
    expect(result).toBe('244156');
  });

  test('handles nine with increment operations', () => {
    const numbers = '9';
    const actions = 'T';
    const result = documentEncryptor.encryptNumbers(numbers, actions);
    expect(result).toBe('9');
  });

  test('handles zero with decrement operations', () => {
    const numbers = '0';
    const actions = 'D';
    const result = documentEncryptor.encryptNumbers(numbers, actions);
    expect(result).toBe('0');
  });

  test('treats negative numbers as zero before actions', () => {
    const numbers = '-123-45678-9';
    const actions = 'RLTTDRRTDD';
    const result = documentEncryptor.encryptNumbers(numbers, actions);
    expect(result).toBe('122056780');
  });

  test('performs increment and decrement operations', () => {
    const numbers = '987654';
    const actions = 'TDT';
    const result = documentEncryptor.encryptNumbers(numbers, actions);
    expect(result).toBe('987654');
  });

  test('performs swap operations', () => {
    const numbers = '123456';
    const actions = 'S3S4';
    const result = documentEncryptor.encryptNumbers(numbers, actions);
    expect(result).toBe('421356');
  });

  test('handles left and right operations', () => {
    const numbers = '123456';
    const actions = 'RLR';
    const result = documentEncryptor.encryptNumbers(numbers, actions);
    expect(result).toBe('123456');
  });

  test('ignores invalid action characters', () => {
    const numbers = '123456';
    const actions = 'RLTAX';
    const result = documentEncryptor.encryptNumbers(numbers, actions);
    expect(result).toBe('223456');
  });

  test('returns the same string when no actions are given', () => {
    const numbers = '123456';
    const actions = '';
    const result = documentEncryptor.encryptNumbers(numbers, actions);
    expect(result).toBe('123456');
  });

  test('returns the same string when no numbers are given', () => {
    const numbers = '';
    const actions = 'RRLTTD';
    const result = documentEncryptor.encryptNumbers(numbers, actions);
    expect(result).toBe('');
  });

  test('processes long action strings', () => {
    const numbers = '123456';
    const actions = 'RLTDRRTRS2S1RLTDRR';
    const result = documentEncryptor.encryptNumbers(numbers, actions);
    expect(result).toBe('244156');
  });

  test('returns the same string when actions are null', () => {
    const numbers = '123456';
    const actions = null;
    const result = documentEncryptor.encryptNumbers(numbers, actions);
    expect(result).toBe('123456');
  });

  test('returns null when numbers are null', () => {
    const numbers = null;
    const actions = 'RLTD';
    const result = documentEncryptor.encryptNumbers(numbers, actions);
    expect(result).toBeNull();
  });

  test('throws error for invalid numbers', () => {
    const numbers = '@Test-Invalid-123';
    const actions = 'RLTD';
    expect(() => {
      documentEncryptor.encryptNumbers(numbers, actions);
    }).toThrow('Input string must contain only numeric characters');
  });
});